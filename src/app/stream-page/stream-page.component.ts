import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  MPD_STATS_SERVER,
  ProtocolsEnum,
  STATS_SERVER,
  StreamstatService,
} from 'src/app/streamstat.service';
import { createPlayer } from '../utils/channels';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-stream-page',
  templateUrl: './stream-page.component.html',
  styleUrls: ['./stream-page.component.scss'],
})
export class StreamPageComponent implements OnInit, OnDestroy {
  app = 'live';
  stream = 'main';
  protocol;
  server = null;

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
  stopFnc: () => void = null;

  paramsSubscription = null;
  subscription = null;

  constructor(
    private route: ActivatedRoute,
    private streamStats: StreamstatService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.app = params.app || 'live';
      this.stream = params.stream || 'main';

      const [, protocol] = (params.app || '').split('_');

      switch (protocol) {
        case 'mpd': {
          this.protocol = ProtocolsEnum.MPD;
          this.server = MPD_STATS_SERVER;

          break;
        }
        case 'hls': {
          this.protocol = ProtocolsEnum.HLS;
          this.server = MPD_STATS_SERVER;

          break;
        }
        case 'wss': {
          this.protocol = ProtocolsEnum.WSS;
          this.server = STATS_SERVER;

          break;
        }
        default: {
          this.server = STATS_SERVER;

          break;
        }
      }

      this.playerInit = false;

      this.initPlayer();
      this.getChatUrl();

      this.streamStats.setChannel(this.stream, this.app, this.server);
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

  redirectHome() {
    console.log(environment.MAIN_PAGE_URL);

    window.location.href = `${environment.MAIN_PAGE_URL}`;
  }

  getChatUrl() {
    // const url = `${URL}podkolpakom_${this.stream}`;
    const url = environment.CHAT_URL;
    this.chatUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  async initPlayer() {
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

    this.stopFnc = await createPlayer(
      this.app.split('_')[0],
      this.stream,
      this.protocol,
      videoPlayer,
    );
  }

  populateDropdown() {}
}
