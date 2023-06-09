import { defineStore } from "pinia";

export const useGameStore = defineStore("game", {
  state: () => ({
    score: 0,
    bestScore: 0,
    speed: 1,
    timeRemainingOption: 60,
    timeRemainingCurrent: 60,
    countdownIntervalId: null,
    wordsIntervalId: null,
    gameTimeOptions: [150, 120, 90, 60, 30],
    gameSpeedOptions: [1, 2, 3, 4, 5, 6, 7],
  }),

  getters: {},

  actions: {
    newGame(initPage, newUserClbc, resetGameClbc, addWordClbc, loadWordsClbc) {
      if (initPage === "GamePage") {
        this.router.push({ name: "InitialPage" });
      } else {
        newUserClbc();
        this.router.push({ name: "GamePage" });
        this.startGame(resetGameClbc, addWordClbc, loadWordsClbc);
      }
    },

    async startGame(resetGameClbc, addWordClbc, loadWordsClbc) {
      if (!!loadWordsClbc) await loadWordsClbc();
      this.activateStartCountDown(1000, () => this.gameFinished(resetGameClbc));
      this.startGeneratingWords(addWordClbc);
    },

    activateStartCountDown(interval, finishGameClbc) {
      this.countdownIntervalId = setInterval(() => {
        if (this.timeRemainingCurrent > 0) this.timeRemainingCurrent -= 1;
        else finishGameClbc();
      }, interval);
    },

    startGeneratingWords(addWordClbc) {
      this.wordsIntervalId = setInterval(addWordClbc, 1300 - 100 * this.speed);
    },

    onSelectGameDuration(duration, resetGameClbc, addWordClbc) {
      this.timeRemainingOption = duration;
      this.gameFinished(resetGameClbc);
      this.startGame(resetGameClbc, addWordClbc);
    },

    onSelectSpeed(speedVal, resetGameClbc, addWordClbc) {
      this.gameFinished(resetGameClbc);
      this.speed = speedVal;
      this.startGame(resetGameClbc, addWordClbc);
    },

    gameFinished(resetGameClbc) {
      resetGameClbc();
      clearInterval(this.countdownIntervalId);
      clearInterval(this.wordsIntervalId);
      this.timeRemainingCurrent = new Number(this.timeRemainingOption);
      this.updateBestScoreIfBeaten();
      this.score = 0;
    },

    updateBestScoreIfBeaten() {
      if (this.bestScore < this.score) this.bestScore = this.score;
    },

    increaseScore(word) {
      this.score += word.length;
    },
  },
});
