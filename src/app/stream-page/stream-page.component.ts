import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StreamstatService } from 'src/app/streamstat.service';
import { getLink } from '../utils/channels';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import flv from 'flv.js';

const URL =
  'https://widget.mibbit.com/?settings=38d6da09df7f92010527c3537e00d2e8&server=irc.mibbit.net%3A%2B6697&channel=%23';

@Component({
  selector: 'app-stream-page',
  templateUrl: './stream-page.component.html',
  styleUrls: ['./stream-page.component.scss'],
})
export class StreamPageComponent implements OnInit, OnDestroy {
  stream = 'main';
  stats = { isLive: false, viewers: 0, bitrate: 0, duration: 0, startTime: 0 };

  player = null;
  playerInit = false;
  chatUrl: SafeResourceUrl;

  paramsSubscription = null;
  subscription = null;

  constructor(private route: ActivatedRoute, private streamStats: StreamstatService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.stream = params.stream || 'main';
      this.playerInit = false;
      this.initPlayer();
      this.getChatUrl();

      this.streamStats.setChannel(this.stream);
    });

    this.subscription = this.streamStats.statsSubject.subscribe((stats) => {
      this.stats = stats as any;
    });
  }

  ngOnDestroy() {
    if (this.player) {
      this.chatUrl = '';
      this.player.pause();
      this.player.unload();
    }
  }

  getChatUrl() {
    const url = `${URL}podkolpakom_${this.stream}`;
    this.chatUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
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

      const url = getLink(this.stream);

      const videoElement = document.getElementById('player') as HTMLMediaElement;
      const player = flv.createPlayer({
        type: 'flv',
        url,
        cors: true,
      });
      player.attachMediaElement(videoElement);
      player.load();
      player.play();

      this.player = player;
    }
  }
}
