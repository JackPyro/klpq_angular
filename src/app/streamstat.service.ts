import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { reduce, map } from "rxjs/operators";
import { interval, BehaviorSubject, of, merge, forkJoin } from "rxjs";
const url = name => `https://stats.vps.klpq.men/channel/${name}`;
const channels = ["main", "kino", "dev"];

@Injectable({
  providedIn: "root"
})
export class StreamstatService {
  stats = {
    main: {},
    kino: {},
    dev: {}
  };

  statsSubject = new BehaviorSubject(this.stats);

  constructor(private http: HttpClient) {
    this.initService();
  }

  getStats() {}

  initService() {
    const intevalSource = interval(2000);
    intevalSource.subscribe(n => this.fetchStats());
  }

  fetchStats() {
    const sources = channels.map(channel => {
      return this.http
        .get(url(channel))
        .pipe(map(resp => ({ ...resp, name: channel })));
    });

    forkJoin(...sources)
      .pipe(
        map(channelsArray => {
          return channelsArray.reduce((acc, channel) => {
            return { ...acc, [channel.name]: channel };
          }, {});
        })
      )
      .subscribe(data => {
        this.stats = data;
        this.statsSubject.next(data);
      });
  }
}
