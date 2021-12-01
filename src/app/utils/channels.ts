import flv from 'flv.js';
import * as dashjs from 'dashjs';
import Hls from 'hls.js';

import { environment } from 'src/environments/environment';

export const getLink = (name, app) => {
  return `${environment.WSS_URL}/${app}/${name}.flv`;
};

export const getMpdLink = (name, app) => {
  return `${environment.MPD_URL}/mpd/${app}_${name}/index.mpd`;
};

export const getHlsLink = (name, app) => {
  return `${environment.MPD_URL}/hls/${app}_${name}/index.m3u8`;
};

function iOS() {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
}

export function createPlayer(
  app: string,
  stream: string,
  protocol: string,
  videoElement: HTMLMediaElement,
) {
  switch (protocol) {
    case 'wss': {
      const url = getLink(stream, app);

      const player = flv.createPlayer({
        type: 'flv',
        url,
        cors: true,
      });
      player.attachMediaElement(videoElement);
      player.load();
      player.play();

      break;
    }
    case 'mpd': {
      const url = getMpdLink(stream, app);

      const player = dashjs.MediaPlayer().create();
      player.initialize(videoElement, url, true);
      player.play();

      break;
    }
    case 'hls': {
      const url = getHlsLink(stream, app);

      if (iOS()) {
        videoElement.src = url;
        videoElement.play();

        break;
      }

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
