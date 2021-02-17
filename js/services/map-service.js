import { utilService } from './util-service.js';

export const mapService = {
  getLocs,
  createLocation,
};

var locs = [{ lat: 11.22, lng: 22.11 }];
const KEY = 'locationsDB';
var locations = utilService.loadFromStorage(KEY) || {};

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs);
    }, 2000);
  });
}

function createLocation(locationName, lat, lng) {
  if (locations && locations[locationName]) {
    return locations[locationName];
  }
  let location = {
    id: utilService.getRandomId(),
    locationName,
    lat,
    lng,
    weather:1,
    createdAt: Date.now(),
    updatedAt:2,
  };
  locations[locationName] = location;
  utilService.saveToStorage(KEY, locations);
  console.log(locations);
  //   renderPlaces();
  //   return gPlaces;
}
