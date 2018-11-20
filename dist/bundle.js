(function () {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function score(total, correct, time) {
    var calculatedScore = Math.round((correct / total ^ 2 + correct) * total / time) * 100; // eslint-disable-line

    console.log('calculatedScore====', calculatedScore);
    return calculatedScore;
  }
  function empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
  function el(name) {
    var element = document.createElement(name);

    for (var _len = arguments.length, children = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      children[_key - 1] = arguments[_key];
    }

    if (Array.isArray(children)) {
      children.forEach(function (child) {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else if (child) {
          element.appendChild(child);
        }
      });
    }

    return element;
  }

  var LOCALSTORAGE_KEY = 'calc_game_scores';
  var Store = window.localStorage;
  function load() {
    var scores = Store.getItem(LOCALSTORAGE_KEY);
    console.log('LOAD SAVED SCORES', scores);
    return JSON.parse(scores);
  }
  function save(name, points) {
    var data = {
      name: name,
      score: points
    };
    console.log('DATA==', data);
    var playerScores = load();

    if (playerScores && playerScores.length > 0) {
      playerScores.push(data);
      console.log('SAVING SCORE - ADD', playerScores);
    } else {
      playerScores = [data];
      console.log('SAVING SCORE - NEW', playerScores);
    }

    Store.setItem(LOCALSTORAGE_KEY, JSON.stringify(playerScores));
  }
  function clear() {
    Store.removeItem(LOCALSTORAGE_KEY);
  }

  var operators = ['+', '-', '*', '/'];

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function question() {
    var operator = operators[randomNumber(0, operators.length - 1)];
    var a = null;
    var b = null;
    var answer = null;

    switch (operator) {
      case '+':
        a = randomNumber(10, 100);
        b = randomNumber(10, 100);
        answer = a + b;
        break;

      case '-':
        a = randomNumber(10, 100);
        b = randomNumber(10, a);
        answer = a - b;
        break;

      case '*':
        a = randomNumber(1, 10);
        b = randomNumber(1, 10);
        answer = a * b;
        break;

      case '/':
        b = randomNumber(2, 10);
        a = randomNumber(2, 10) * b;
        answer = a / b;
        break;

      default:
        break;
    }

    console.log("problem: ".concat(a, " ").concat(operator, " ").concat(b, " answer: ").concat(answer));
    return {
      problem: "".concat(a, " ").concat(operator, " ").concat(b),
      answer: answer
    };
  }

  var Highscore =
  /*#__PURE__*/
  function () {
    function Highscore() {
      _classCallCheck(this, Highscore);

      this.scores = document.querySelector('.highscore__scores');
      this.button = document.querySelector('.highscore__button');
      this.button.addEventListener('click', this.clear.bind(this));
    }

    _createClass(Highscore, [{
      key: "load",
      value: function load$$1() {
        var savedScores = this.highscore(load());

        if (typeof savedScores !== 'undefined' && savedScores) {
          var ul = el('ol');
          empty(this.scores);
          this.button.classList.remove('highscore__button--hidden');

          for (var i = 0; i < savedScores.length; i += 1) {
            var li = el('li');
            var text = "<span class='highscore__number'>".concat(savedScores[i].score, " stig</span><span class='highscore__name'>").concat(savedScores[i].name, "</span>");
            ul.appendChild(li);
            li.innerHTML = text;
            this.scores.appendChild(ul);
          }
        } else {
          empty(this.scores);
          this.scores.innerHTML = '<p>Engin stig skráð</p>';
        }
      }
    }, {
      key: "clear",
      value: function clear$$1() {
        clear();
        empty(this.scores);
        this.scores.innerHTML = '<p>Engin stig skráð</p>';
        this.button.classList.add('highscore__button--hidden');
      }
      /* eslint-disable */

    }, {
      key: "highscore",
      value: function highscore(data) {
        console.log('highscore---', data);
        return data.sort(function (a, b) {
          return b.score - a.score;
        });
      }
      /* eslint-enable */

    }]);

    return Highscore;
  }();

  var startButton;
  var problem;
  var result;
  var playTime;
  var total = 0;
  var correct = 0;
  var currentProblem;
  var finalScore = 0;

  function finish() {
    var points = score(total, correct, playTime);
    var text = "\xDE\xFA svara\xF0ir ".concat(correct, " r\xE9tt af ").concat(total, " spurningum og f\xE9kkst ").concat(points, " stig fyrir. Skr\xE1\xF0u \xFEig \xE1 stigat\xF6fluna!");
    finalScore = points;
    result.querySelector('.result__text').innerHTML = text;
    empty(problem.querySelector('.problem__timer'));
    empty(problem.querySelector('.problem__question'));
    result.classList.remove('result--hidden');
    problem.classList.add('problem--hidden');
    result.querySelector('.result__input').focus();
  }

  function tick(current) {
    problem.querySelector('.problem__timer').innerHTML = current;

    if (current <= 0) {
      return finish();
    }

    return setTimeout(function () {
      tick(current - 1);
    }, 1000);
  }

  function showQuestion() {
    console.log('SHOW QUESTION');
    var q = question();
    currentProblem = q;
    total += 1;
    problem.querySelector('.problem__question').innerHTML = q.problem; // ensure the input is empty each time we start a new question

    problem.querySelector('.problem__input').value = '';
    problem.querySelector('.problem__input').focus();
  }

  function start() {
    console.log('START GAME');
    startButton.classList.add('button--hidden');
    problem.classList.remove('problem--hidden');
    tick(playTime);
    showQuestion();
  }

  function onSubmit(e) {
    e.preventDefault();
    var answer = parseInt(currentProblem.answer, 10);
    var userAnswer = parseInt(problem.querySelector('.problem__input').value, 10);
    var isCorrect = answer === userAnswer;
    var isProblem = _typeof(currentProblem) === 'object';

    if (isProblem && isCorrect) {
      console.log('---ANSWER:', isCorrect, answer, userAnswer);
      correct += 1;
    } else if (isProblem && !isCorrect) {
      console.log('SUBMIT-ANSWER:', isCorrect, answer, userAnswer);
    }

    showQuestion();
    problem.querySelector('.problem__input').focus();
  }

  function onSubmitScore(e) {
    e.preventDefault();
    var playerName = document.querySelector('.result__input').value;
    var highscore = new Highscore();
    save(playerName, finalScore);
    highscore.load();
    console.log("SUBMIT SCORE: Player=".concat(playerName.value, ", Correct=").concat(finalScore));
    total = 0;
    correct = 0;
    currentProblem = undefined;
    empty(result.querySelector('.result__text'));
    result.classList.add('result--hidden');
    problem.classList.add('problem--hidden');
    startButton.classList.remove('button--hidden');
  }

  function init(_playTime) {
    playTime = _playTime;
    startButton = document.querySelector('.start.button');
    problem = document.querySelector('.problem');
    result = document.querySelector('.result');
    startButton.addEventListener('click', start);
    problem.querySelector('.problem__answer').addEventListener('submit', onSubmit);
    result.querySelector('.result__form').addEventListener('submit', onSubmitScore);
  }

  var PLAY_TIME = 10;
  document.addEventListener('DOMContentLoaded', function () {
    init(PLAY_TIME);
    var highscore = new Highscore();
    highscore.load();
  });

}());
//# sourceMappingURL=bundle.js.map
