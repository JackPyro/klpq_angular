import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProtocolsEnum, StreamstatService } from 'src/app/streamstat.service';
import {
  createPlayer,
  getHlsLink,
  getLink,
  getMpdLink,
} from '../../utils/channels';
import { SafeResourceUrl } from '@angular/platform-browser';

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

    if (this.player) {
      this.player.pause();
      this.player.unload();
    }

    this.playerInit = true;

    this.player = document.getElementById('player') as HTMLMediaElement;

    createPlayer(this.app, this.stream, this.protocol, this.player);
  }
}
