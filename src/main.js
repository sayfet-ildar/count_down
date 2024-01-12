
import {
  intervalToDuration, formatDuration, differenceInSeconds,
} from 'date-fns';

import { ru } from 'date-fns/locale';

const elements = {
  button: document.querySelector('.calc'),
  inputDate: document.querySelector('.input__date'),
  timeLeft: document.querySelector('.time__left'),
};

const messages = {
  errorDate: 'Введите дату больше текущей',
  leftTime: 'Осталось времени:',
};

function calculateTimeLeft() {
  const currentDate = Date.now();
  const duration = intervalToDuration({
    start: currentDate,
    end: new Date(elements.inputDate.value),
  });

  const formattedDuration = formatDuration(duration, {
    format: ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'],
    locale: ru,
  });

  return formattedDuration;
}

function hasNegativeSeconds() {
  const negativeSecondsRegex = /-\d+\sсекунд/;
  return negativeSecondsRegex.test(calculateTimeLeft());
}

function updateTimeLeftText(text) {
  elements.timeLeft.textContent = messages.leftTime + text;
}

function startCountdown() {
  const timeLeft = differenceInSeconds(new Date(elements.inputDate.value), new Date());

  try {
    if (timeLeft < 0) {
      throw new Error(messages.errorDate);
    }

    const interval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(interval);
        updateTimeLeftText('');
        return;
      }

      const timeLeftText = calculateTimeLeft();
      if (hasNegativeSeconds(timeLeftText)) {
        clearInterval(interval);
        return;
      }

      updateTimeLeftText(timeLeftText);
    }, 1000);
  } catch (error) {
    elements.timeLeft.textContent = error.message;
  }
}


function localStorageDate() {
  const dateString = JSON.stringify([elements.inputDate.value]);
  localStorage.setItem('currentDate', dateString);
}
function getdateFromStorage() {
  return JSON.parse(localStorage.getItem('currentDate')) || [];
}

function loadPageListener() {
  const lastDate = getdateFromStorage();
  if (lastDate) {
    elements.inputDate.value = lastDate;
    startCountdown();
  }
}

window.addEventListener('load', loadPageListener());
window.removeEventListener('load', loadPageListener);

function handleButtonClick(event) {
  event.preventDefault();
  startCountdown();
  localStorageDate();
}

elements.button.addEventListener('click', handleButtonClick);
