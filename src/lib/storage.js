const LOCALSTORAGE_KEY = 'calc_game_scores';
const Store = window.localStorage;

export function load() {
  const scores = Store.getItem(LOCALSTORAGE_KEY);
  console.log('LOAD SAVED SCORES', scores);
  return JSON.parse(scores);
}

export function save(name, points) {
  const data = { name, score: points };
  console.log('DATA==', data);
  let playerScores = load();
  if (playerScores && playerScores.length > 0) {
    playerScores.push(data);
    console.log('SAVING SCORE - ADD', playerScores);
  } else {
    playerScores = [data];
    console.log('SAVING SCORE - NEW', playerScores);
  }
  Store.setItem(LOCALSTORAGE_KEY, JSON.stringify(playerScores));
}

export function clear() {
  Store.removeItem(LOCALSTORAGE_KEY);
}
