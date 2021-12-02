import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import humanizeDuration from 'humanize-duration';
import { BehaviorSubject, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { find } from 'lodash';
import { environment } from 'src/environments/environment';

const STATS_SERVER = environment.STATS_SERVER;

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
  currentProtocol = ProtocolsEnum.WSS;

  statsSubject = new BehaviorSubject(this.stats);
  onlineChannels = new BehaviorSubject(this.channels);

  constructor(private http: HttpClient) {
    this.initService();
    this.initOnlineChannelSearch();
  }

  initService() {
    const intevalSource = interval(5000);
    intevalSource.subscribe(() =>
      this.fetchStats(this.currentChannel, this.currentApp),
    );
  }

  setChannel(channel, app, protocol: ProtocolsEnum) {
    this.stats = {};

    this.currentChannel = channel;
    this.currentApp = app;
    this.currentProtocol = protocol;

    this.fetchStats(this.currentChannel, this.currentApp);
  }

  initOnlineChannelSearch() {
    this.fetchChannels();

    const invervalSource = interval(5000);
    invervalSource.subscribe(() => this.fetchChannels());
    return;
  }

  fetchChannels() {
    const listUrl = `${environment.STATS_URL}/channels/list`;
    const source = this.http.get(listUrl);

    source.subscribe((data: IListResponse) => {
      this.channels.online = [];

      data.live.map((item) => {
        this.channels.online.push(`${item.app}/${item.channel}`);
        this.channels.online.push(`${item.app}/${item.channel}/mpd`);
        this.channels.online.push(`${item.app}/${item.channel}/hls`);
      });
      this.channels.offline = data.channels.filter((item) => {
        const liveChannel = find(this.channels.online, (channel) =>
          channel.includes(`/${item}`),
        );

        return !liveChannel;
      });

      this.onlineChannels.next(this.channels);
    });
  }

  fetchStats(channel, app) {
    if (!channel || !app) {
      this.stats = {};
      return;
    }

    const source = this.http.get(url(channel, app, STATS_SERVER)).pipe(
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
