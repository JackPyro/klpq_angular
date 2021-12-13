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

function isIOS() {
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

function isAndroid() {
  return navigator.userAgent.includes('Android');
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

      stopPlaybackFnc = createWssPlayer(videoElement, url);

      break;
    }
    case 'mpd': {
      const url = await getMpdLink(stream, app);

      if (isAndroid()) {
        stopPlaybackFnc = createNativePlayer(videoElement, url);

        break;
      }

      stopPlaybackFnc = createMpdPlayer(videoElement, url);

      break;
    }
    case 'hls': {
      const url = await getHlsLink(stream, app);

      if (isIOS()) {
        stopPlaybackFnc = createNativePlayer(videoElement, url);

        break;
      }

      stopPlaybackFnc = createHlsPlayer(videoElement, url);

      break;
    }
    default: {
      if (isIOS()) {
        const url = await getHlsLink(stream, app);

        stopPlaybackFnc = createNativePlayer(videoElement, url);

        break;
      }

      if (isAndroid()) {
        const url = await getMpdLink(stream, app);

        stopPlaybackFnc = createNativePlayer(videoElement, url);

        break;
      }

      const url = getLink(stream, app);

      stopPlaybackFnc = createWssPlayer(videoElement, url);

      break;
    }
  }

  return stopPlaybackFnc;
}

function createWssPlayer(videoElement: HTMLMediaElement, url: string) {
  const player = flv.createPlayer({
    type: 'flv',
    url,
    cors: true,
    isLive: true,
  });
  player.attachMediaElement(videoElement);
  player.load();
  player.play();

  return () => {
    player.pause();
    player.unload();
  };
}

function createMpdPlayer(videoElement: HTMLMediaElement, url: string) {
  const player = dashjs.MediaPlayer().create();
  player.initialize(videoElement, url, true);
  player.play();

  return () => {
    player.pause();
    player.destroy();
  };
}

function createHlsPlayer(videoElement: HTMLMediaElement, url: string) {
  const player = new Hls();

  player.loadSource(url);
  player.attachMedia(videoElement);

  player.on(Hls.Events.MEDIA_ATTACHED, function () {
    videoElement.muted = false;
    videoElement.play();
  });

  return () => {
    player.stopLoad();
    player.destroy();
  };
}

function createNativePlayer(videoElement: HTMLMediaElement, url: string) {
  videoElement.src = url;
  videoElement.play();

  return () => {
    videoElement.pause();
    videoElement.remove();
  };
}
