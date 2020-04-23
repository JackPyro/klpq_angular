import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {interval, BehaviorSubject} from 'rxjs';

const url = name => `https://stats.klpq.men/api/channels/nms/live/${name}`;
import humanizeDuration from 'humanize-duration';

const fixTime = duration =>
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
        h: '',
        m: '',
        s: '',
        ms: 'ms',
      },
    },
  });

interface Stats {
  duration: any;
  viewers: any;
  isLive: boolean;
  startTime: any;
  name: any;
}

@Injectable({
  providedIn: 'root',
})
export class StreamstatService {
  stats = {};

  channels = {online: [], offline: []};
  currentChannel = '';

  statsSubject = new BehaviorSubject(this.stats);
  onlineChannels = new BehaviorSubject(this.channels);

  constructor(private http: HttpClient) {
    this.initService();
    this.initOnlineChannelSearch();
  }

  initService() {
    const intevalSource = interval(2000);
    intevalSource.subscribe(() => this.fetchStats(this.currentChannel));
  }

  setChannel(channel) {
    this.stats = {};
    this.currentChannel = channel;
  }

  initOnlineChannelSearch() {
    const invervalSource = interval(2000);
    invervalSource.subscribe(() => this.fetchChannels());
    return;
  }

  fetchChannels() {
    const listUrl = 'https://stats.klpq.men/api/channels/list';
    const source = this.http.get(listUrl);

    source.subscribe((data: unknown) => {
      this.channels.online = (data as { live: [] }).live.filter(item => !item && item !== null);
      this.channels.offline = (data as { channels: [] }).channels.filter(item => !this.channels.online.includes(item));
      this.onlineChannels.next(this.channels);
    });
  }

  fetchStats(channel) {
    if (!channel) {
      this.stats = {};
      return;
    }

    const source = this.http.get(url(channel)).pipe(map(resp => ({...resp, name: channel, duration: fixTime((resp as Stats).duration)})));

    source.subscribe(data => {
      this.stats = data;
      this.statsSubject.next(data);
    });
  }
}
