import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { reduce, map } from "rxjs/operators";
import { interval, BehaviorSubject, of, merge, forkJoin } from "rxjs";
const url = name => `https://stats.klpq.men/api/channels/nms/live/${name}`;
const channels = ["main", "kino", "dev"];
import humanizeDuration from "humanize-duration";

const fixTime = duration =>
  humanizeDuration(duration * 1000, {
    round: true,
    largest: 2,
    language: "shortEn",
    spacer: "",
    delimiter: ":",
    languages: {
      shortEn: {
        y: "y",
        mo: "mo",
        w: "w",
        d: "d",
        h: "",
        m: "",
        s: "sec",
        ms: "ms"
      }
    }
  });

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
            return {
              ...acc,
              [channel.name]: {
                ...channel,
                duration: fixTime(channel.duration)
              }
            };
          }, {});
        })
      )
      .subscribe(data => {
        this.stats = data;
        this.statsSubject.next(data);
      });
  }
}
