'use strict';

export const utilService = {
  saveToStorage,
  loadFromStorage,
  getRandomId,
};

function saveToStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function loadFromStorage(key) {
  var val = localStorage.getItem(key);
  return JSON.parse(val);
}

function getRandomId() {
  return Math.random().toString(36).substr(2, 4);
}
