export const getLink = (name, app) => {
  return `wss://mediaserver.klpq.men/${app}/${name}.flv`;
};

export const getMpdLink = (name) => {
  return `https://encode.klpq.men/mpd/${name}/index.mpd`;
};
