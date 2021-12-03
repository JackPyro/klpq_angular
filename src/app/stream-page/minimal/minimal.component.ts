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

  playerInit = false;
  chatUrl: SafeResourceUrl;
  stopFnc = null;

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

      const [, protocol] = (params.app || '').split('_');

      switch (protocol) {
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
    console.log('ngOnDestroy');

    if (this.stopFnc) {
      this.stopFnc();
    }
  }

  initPlayer() {
    console.log('initPlayer');

    if (this.playerInit) {
      return;
    }

    this.playerInit = true;

    const playerSelector = document.getElementsByClassName('player-section')[0];

    if (this.stopFnc) {
      this.stopFnc();
    }

    const videoPlayer = document.createElement('video');

    videoPlayer.setAttribute('id', 'player');
    videoPlayer.setAttribute('controls', 'true');

    (playerSelector as any).replaceChildren(videoPlayer);

    this.stopFnc = createPlayer(
      this.app.split('_')[0],
      this.stream,
      this.protocol,
      videoPlayer,
    );
  }
}
