export const getLink = (name, app) => {
  return `wss://mediaserver.klpq.men/${app}/${name}.flv`;
};

export const getMpdLink = (name, app) => {
  return `https://encode.klpq.men/mpd/${app}_${name}/index.mpd`;
};
