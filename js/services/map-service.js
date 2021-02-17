import { utilService } from './util-service.js';
import { weatherService } from './weather-service.js';

export const mapService = {
  getLocs,
  createLocation,
  initialData
};

var locs = [{ lat: 11.22, lng: 22.11 }];
const KEY = 'locationsDB';
var locations;

function initialData(weather) {
  if (!utilService.loadFromStorage(KEY)) {
    locations = {
      telAviv: {
        createdAt: Date.now(),
        id: '0egt',
        lat: 32.0852999,
        lng: 34.78176759999999,
        adress: 'Tel Aviv-Yafo, Israel',
        updatedAt: 2,
        weather,
      },
    };
    utilService.saveToStorage(KEY, locations);
}
return Promise.resolve(utilService.loadFromStorage(KEY));
}

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs);
    }, 2000);
  });
}

function createLocation(adress, lat, lng, weather) {
  if (locations && locations[adress]) {
    return Promise.resolve(locations);
  }
  let location = {
    id: utilService.getRandomId(),
    adress,
    lat,
    lng,
    weather,
    createdAt: Date.now(),
    updatedAt: 2,
  };
  locations[adress] = location;
  utilService.saveToStorage(KEY, locations);
  console.log(locations);
  return Promise.resolve(locations);
}
