import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProtocolsEnum, StreamstatService } from 'src/app/streamstat.service';
import { getHlsLink, getLink, getMpdLink } from '../../utils/channels';
import { SafeResourceUrl } from '@angular/platform-browser';
import flv from 'flv.js';
import * as dashjs from 'dashjs';
import Hls from 'hls.js';

@Component({
  selector: 'app-minimal',
  templateUrl: './minimal.component.html',
  styleUrls: ['./minimal.component.scss'],
})
export class MinimalComponent implements OnInit, OnDestroy {
  app = 'live';
  stream = 'main';
  protocol = ProtocolsEnum.WSS;

  stats = {
    isLive: false,
    viewers: 0,
    bitrate: 0,
    lastBitrate: 0,
    duration: 0,
    startTime: 0,
  };

  player = null;
  playerInit = false;
  chatUrl: SafeResourceUrl;

  paramsSubscription = null;
  subscription = null;

  constructor(
    private route: ActivatedRoute,
    private streamStats: StreamstatService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.app = params.app || 'live';
      this.stream = params.stream || 'main';

      switch (params.protocol) {
        case 'wss': {
          this.protocol = ProtocolsEnum.WSS;

          break;
        }
        case 'mpd': {
          this.protocol = ProtocolsEnum.MPD;

          break;
        }
        case 'hls': {
          this.protocol = ProtocolsEnum.HLS;

          break;
        }
        default: {
          this.protocol = ProtocolsEnum.WSS;

          break;
        }
      }

      this.playerInit = false;
      this.initPlayer();

      this.streamStats.setChannel(this.stream, this.app, this.protocol);
    });

    this.subscription = this.streamStats.statsSubject.subscribe((stats) => {
      this.stats = stats as any;
    });
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.pause();
      this.player.unload();
    }
  }

  initPlayer() {
    if (this.playerInit) {
      return;
    }
    if (flv.isSupported) {
      if (this.player) {
        this.player.pause();
        this.player.unload();
      }
      this.playerInit = true;

      let url: string;

      switch (this.protocol) {
        case 'wss': {
          url = getLink(this.stream, this.app);

          const videoElement = document.getElementById(
            'player',
          ) as HTMLMediaElement;

          const player = flv.createPlayer({
            type: 'flv',
            url,
            cors: true,
          });
          player.attachMediaElement(videoElement);
          player.load();
          player.play();

          this.player = player;

          break;
        }
        case 'mpd': {
          url = getMpdLink(this.stream, this.app);

          const videoElement = document.getElementById(
            'player',
          ) as HTMLMediaElement;

          const player = dashjs.MediaPlayer().create();
          player.initialize(videoElement, url, true);
          player.play();

          break;
        }
        case 'hls': {
          url = getHlsLink(this.stream, this.app);

          const videoElement = document.getElementById(
            'player',
          ) as HTMLMediaElement;

          const player = new Hls();

          player.loadSource(url);
          player.attachMedia(videoElement);

          player.on(Hls.Events.MEDIA_ATTACHED, function () {
            videoElement.muted = false;
            videoElement.play();
          });
          break;
        }
        default: {
          break;
        }
      }
    }
  }
}
