const html5 = {
  main: {
    name: 'main',
    appName: 'main',
    link: 'wss://mediaserver.klpq.men/live/main.flv',
    restream: 'wss://mediaserver.klpq.men/restream/main.flv',
  },
  kino: {
    name: 'kino',
    appName: 'kino',
    link: 'wss://mediaserver.klpq.men/live/kino.flv',
    restream: 'wss://mediaserver.klpq.men/restream/kino.flv',
  },
  dev: {
    name: 'dev',
    appName: 'dev',
    link: 'wss://mediaserver.klpq.men/live/dev.flv',
    restream: 'wss://mediaserver.klpq.men/restream/dev.flv',
  },
};

const generateChannelConfig = (name) => {
  return {
    name,
    appName: name,
    link: `wss://mediaserver.klpq.men/live/${name}.flv`,
    restream: `wss://mediaserver.klpq.men/restream/${name}.flv`,
  };
};

const getLink = (name) => {
  const config = generateChannelConfig(name);
  return config.link;
};

export {html5, generateChannelConfig, getLink};
