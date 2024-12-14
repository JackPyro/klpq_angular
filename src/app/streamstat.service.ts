import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import humanizeDuration from 'humanize-duration';
import { BehaviorSubject, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { find } from 'lodash';
import environment from 'src/environments/environment';
import * as _ from 'lodash';

export const STATS_SERVER = new URL(environment.WSS_URL).host;
export const MPD_STATS_SERVER = new URL(environment.MPD_URL).host;

const url = (name, app, host) =>
  `${environment.STATS_URL}/channels/${host}/${app}/${name}`;

const fixTime = (duration) =>
  humanizeDuration(duration * 1000, {
    round: true,
    largest: 2,
    language: 'shortEn',
    spacer: '',
    delimiter: ':',
    languages: {
      shortEn: {
        y: 'y',
        mo: 'mo',
        w: 'w',
        d: 'd',
        h: 'h',
        m: 'm',
        s: 's',
        ms: 'ms',
      },
    },
  });

export enum ProtocolsEnum {
  WSS = 'wss',
  MPD = 'mpd',
  HLS = 'hls',
}

interface Stats {
  duration: any;
  viewers: any;
  isLive: boolean;
  startTime: any;
  name: any;
}

interface IListResponse {
  channels: string[];
  live: {
    app: string;
    channel: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class StreamstatService {
  stats = {};

  channels: { online: string[]; offline: string[] } = {
    online: [],
    offline: [],
  };
  currentChannel = '';
  currentApp = '';
  currentServer;

  statsSubject = new BehaviorSubject(this.stats);
  onlineChannels = new BehaviorSubject(this.channels);

  constructor(private http: HttpClient) {
    this.initService();
    this.initOnlineChannelSearch();
  }

  initService() {
    const intevalSource = interval(5000);
    intevalSource.subscribe(() =>
      this.fetchStats(this.currentChannel, this.currentApp, this.currentServer),
    );
  }

  setChannel(channel, app, server: string) {
    this.stats = {};

    this.currentChannel = channel;
    this.currentApp = app;
    this.currentServer = server;

    this.fetchStats(this.currentChannel, this.currentApp, this.currentServer);
  }

  initOnlineChannelSearch() {
    this.fetchChannels();

    const invervalSource = interval(5000);

    invervalSource.subscribe(() => this.fetchChannels());

    return;
  }

  fetchChannels() {
    let openedChannelsJson = localStorage.getItem('channels');

    let openedChannels = [];

    if (!openedChannelsJson) {
      localStorage.setItem('channels', '[]');
    } else {
      openedChannels = JSON.parse(openedChannelsJson);
    }

    this.channels.online = [];

    this.channels.offline = openedChannels.filter((item) => {
      const liveChannel = find(this.channels.online, (channel) =>
        channel.includes(`/${item}`),
      );

      return !liveChannel;
    });

    this.onlineChannels.next(this.channels);
  }

  fetchStats(channel, app, server: string) {
    if (!channel || !app) {
      this.stats = {};
      return;
    }

    const source = this.http
      .get(url(channel, app, server), {
        headers: {
          'jwt-token': window.localStorage.getItem('token') ?? '',
        },
      })
      .pipe(
        map((resp) => ({
          ...resp,
          name: channel,
          duration: fixTime((resp as Stats).duration),
        })),
      );

    source.subscribe((data) => {
      this.stats = data;
      this.statsSubject.next(data);
    });
  }
}
