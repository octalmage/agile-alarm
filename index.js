#! /usr/bin/env node
const path = require('path');
const blessed = require('blessed');
const moment = require('moment');
const player = require('play-sound')();

const screen = blessed.screen();
const soundTrack = path.join(__dirname, '/sounds/airhorn.mp3');

// Set default alarm to 5 minutes.
let alarmTime = moment().add('5', 'minutes');
let timer;

// Build the UI.
const time = blessed.BigText({
  parent: screen,
  align: 'center',
  name: 'alarm',
  width: '100%',
  content: '0:00:00',
  style: {
    bg: 'blue',
  },
});

const add = blessed.button({
  parent: screen,
  mouse: true,
  keys: true,
  shrink: true,
  padding: {
    left: 1,
    right: 1,
  },
  left: 0,
  top: 15,
  name: 'add',
  content: 'Add',
  style: {
    bg: 'blue',
    focus: {
      bg: 'red',
    },
    hover: {
      bg: 'red',
    },
  },
});

const next = blessed.button({
  parent: screen,
  mouse: true,
  keys: true,
  shrink: true,
  padding: {
    left: 1,
    right: 1,
  },
  left: add.left + 10,
  top: 15,
  name: 'next',
  content: 'Next',
  style: {
    bg: 'blue',
    focus: {
      bg: 'red',
    },
    hover: {
      bg: 'red',
    },
  },
});

function padLeadingZeros(textToPad, finalLengthOfText = 2) {
  let result = textToPad.toString();
  while (result.length < finalLengthOfText) {
    result = `0${result}`;
  }
  return result;
}

function formattedTimeFromNow(futureTime) {
  const timeLeft = moment.duration(futureTime.diff(moment()));
  const hours = padLeadingZeros(timeLeft.get('hours'), 1);
  const minutes = padLeadingZeros(timeLeft.get('minutes'));
  const seconds = padLeadingZeros(timeLeft.get('seconds'));
  return `${hours}:${minutes}:${seconds}`;
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    time.setContent(formattedTimeFromNow(alarmTime));
    screen.render();

    if (moment() >= alarmTime) {
      clearInterval(timer);
      player.play(soundTrack);
    }
  }, 500);
}

add.on('press', () => {
  alarmTime = moment().add('2', 'minutes');
  startTimer();
});

next.on('press', () => {
  alarmTime = moment().add('5', 'minutes');
  startTimer();
});

screen.key(['escape', 'q', 'C-c'], () => {
  process.exit(0);
});

screen.render();

startTimer();
