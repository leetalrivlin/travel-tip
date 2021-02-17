import { utilService } from './services/storage-service.js';

export const mapService = {
    getLocs,
    createLocation
}
var locs = [{ lat: 11.22, lng: 22.11 }];
const KEY = 'locationsDB';
var locations = utilService.loadFromStorage(KEY) || {};

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function createLocation(placeName, lat, lng) {
if (locations && locations[placeName]) {
    return locations[placeName]
}
    let location = {
      id: utilService.getRandomId(),
      placeName,
      lat,
      lng,
    };
    places.push(place);
    gPlaces = places;
    utilService.saveToStorage();
    renderPlaces();
    return gPlaces;
  }


