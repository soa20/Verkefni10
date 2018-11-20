import * as Storage from './storage';
import * as Helper from './helpers';

export default class Highscore {
  constructor() {
    this.scores = document.querySelector('.highscore__scores');
    this.button = document.querySelector('.highscore__button');
    this.button.addEventListener('click', this.clear.bind(this));
  }

  load() {
    let savedScores = Storage.load();
    if (typeof savedScores !== 'undefined' && savedScores) {
      const ul = Helper.el('ol');
      savedScores = this.highscore(savedScores);
      Helper.empty(this.scores);
      this.button.classList.remove('highscore__button--hidden');
      for (let i = 0; i < savedScores.length; i += 1) {
        const li = Helper.el('li');
        const text =<span class='highscorenumber'>${savedScores[i].score} stig</span><span class='highscorename'>${savedScores[i].name}</span>;
        ul.appendChild(li);
        li.innerHTML = text;
        this.scores.appendChild(ul);
      }
    } else {
      Helper.empty(this.scores);
      this.scores.innerHTML = '<p>Engin stig skráð</p>';
    }
  }

  clear() {
    Storage.clear();
    Helper.empty(this.scores);
    this.scores.innerHTML = '<p>Engin stig skráð</p>';
    this.button.classList.add('highscore__button--hidden');
  }

/* eslint-disable */
  highscore(data) {
    console.log('highscore---', data);
    return data.sort((a, b) => {
      return b.score - a.score;
    });
  }
/* eslint-enable */
}
