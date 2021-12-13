import flv from 'flv.js';
import * as dashjs from 'dashjs';
import Hls from 'hls.js';
import axios from 'axios';

import { environment } from 'src/environments/environment';

export const getLink = (name, app) => {
  return `${environment.WSS_URL}/${app}/${name}.flv`;
};

export const getMpdLink = async (name, app) => {
  const {
    data: { id },
  } = await axios.get<{ id: string }>(
    `${environment.MPD_URL}/generate/mpd/${app}_${name}`,
  );

  return `${environment.MPD_URL}/watch/${id}/index.mpd`;
};

export const getHlsLink = async (name, app) => {
  const {
    data: { id },
  } = await axios.get<{ id: string }>(
    `${environment.MPD_URL}/generate/hls/${app}_${name}`,
  );

  return `${environment.MPD_URL}/watch/${id}/index.m3u8`;
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

export async function createPlayer(
  app: string,
  stream: string,
  protocol: string,
  videoElement: HTMLMediaElement,
): Promise<() => void> {
  let stopPlaybackFnc = () => {};

  switch (protocol) {
    case 'wss': {
      const url = getLink(stream, app);

      const player = flv.createPlayer({
        type: 'flv',
        url,
        cors: true,
        isLive: true,
      });
      player.attachMediaElement(videoElement);
      player.load();
      player.play();

      stopPlaybackFnc = () => {
        player.pause();
        player.unload();
      };

      break;
    }
    case 'mpd': {
      const url = await getMpdLink(stream, app);

      const player = dashjs.MediaPlayer().create();
      player.initialize(videoElement, url, true);
      player.play();

      stopPlaybackFnc = () => {
        player.pause();
        player.destroy();
      };

      break;
    }
    case 'hls': {
      const url = await getHlsLink(stream, app);

      if (iOS()) {
        videoElement.src = url;
        videoElement.play();

        stopPlaybackFnc = () => {
          videoElement.pause();
          videoElement.remove();
        };

        break;
      }

      const player = new Hls();

      player.loadSource(url);
      player.attachMedia(videoElement);

      player.on(Hls.Events.MEDIA_ATTACHED, function () {
        videoElement.muted = false;
        videoElement.play();
      });

      stopPlaybackFnc = () => {
        player.stopLoad();
        player.destroy();
      };

      break;
    }
    default: {
      break;
    }
  }

  return stopPlaybackFnc;
}
