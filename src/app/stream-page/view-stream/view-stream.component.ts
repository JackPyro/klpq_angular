import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StreamstatService} from 'src/app/streamstat.service';
import {html5} from '../../utils/channels';
import {DomSanitizer} from '@angular/platform-browser';
import flv from 'flv.js';

const URL = 'https://widget.mibbit.com/?settings=38d6da09df7f92010527c3537e00d2e8&server=irc.mibbit.net%3A%2B6697&channel=%23';

@Component({
  selector: 'app-view-stream',
  templateUrl: './view-stream.component.html',
  styleUrls: ['./view-stream.component.scss'],
})
export class ViewStreamComponent implements OnInit {
  stream = 'main';
  stats = {
    main: {},
    kino: {},
    dev: {},
  };

  player = null;
  playerInit = false;

  subscription = null;

  constructor(
    private route: ActivatedRoute,
    private streamStats: StreamstatService,
    private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.stream = params.stream;
      this.initPlayer();
    });
    this.subscription = this.streamStats.statsSubject.subscribe((stats) => {
      this.stats = stats;
    });
  }

  chat() {
    const url = `${URL}podkolpakom_${this.stream}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  initPlayer() {
    if (this.playerInit) {
      return;
    }
    if (flv.isSupported) {
      this.playerInit = true;
      const videoElement = document.getElementById('player') as HTMLMediaElement;
      this.player = flv.createPlayer(
        {
          type: 'flv',
          url: html5[this.stream].link,
          cors: true,
          isLive: true,
        },
        {
          isLive: true,
          enableWorker: false,
          enableStashBuffer: false,
          fixAudioTimestampGap: false,
        },
      );
      this.player.attachMediaElement(videoElement);
      this.player.load();
      this.player.play();
    }
  }
}
