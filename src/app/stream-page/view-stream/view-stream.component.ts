import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { StreamstatService } from "src/app/streamstat.service";
import { html5 } from "../../utils/channels";
import flv from "flv.js";
@Component({
  selector: "app-view-stream",
  templateUrl: "./view-stream.component.html",
  styleUrls: ["./view-stream.component.scss"]
})
export class ViewStreamComponent implements OnInit {
  stream = "main";
  stats = {
    main: {},
    kino: {},
    dev: {}
  };

  player = null;

  subscription = null;
  constructor(
    private route: ActivatedRoute,
    private streamStats: StreamstatService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.stream = params.stream;
      this.initPlayer();
    });
    this.subscription = this.streamStats.statsSubject.subscribe(stats => {
      this.stats = stats;
      console.log(stats);
    });
  }

  initPlayer() {
    if (flv.isSupported) {
      const videoElement = <HTMLMediaElement>document.getElementById("player");
      this.player = flv.createPlayer(
        {
          type: "flv",
          url: html5[this.stream].link,
          cors: true,
          isLive: true
        },
        {
          isLive: true,
          enableWorker: false,
          enableStashBuffer: false,
          fixAudioTimestampGap: false
        }
      );
      this.player.attachMediaElement(videoElement);
      this.player.load();
      this.player.play();
    }
  }
}
