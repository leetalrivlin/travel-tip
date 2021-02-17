import { mapService } from './services/map-service.js';

var gMap;
console.log('Main!');

mapService.getLocs().then((locs) => console.log('locs', locs));

window.onload = () => {
  document.querySelector('.my-location-btn').addEventListener('click', () => {
    console.log('Aha!');
    getCurrPos();
    // panTo(35.6895, 139.6917);
  });

  initMap()
    .then(() => {
      addMarker({ lat: 32.0749831, lng: 34.9120554 });
    })
    .catch(() => console.log('INIT MAP ERROR'));

  getPosition()
    .then((pos) => {
      console.log('User position is:', pos.coords);
    })
    .catch((err) => {
      console.log('err!!!', err);
    });
};

function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log('InitMap');
  return _connectGoogleApi()
    .then(() => {
      console.log('google available');
      gMap = new google.maps.Map(document.querySelector('#map'), {
        center: { lat, lng },
        zoom: 15,
      });
      console.log('Map!', gMap);
    })
    .then(() => {
      console.log('creating event listener');
      gMap.addListener('click', (event) => {
        let lat = event.latLng.lat();
        let lng = event.latLng.lng();

        onClickMap(lat, lng);
      });
    });
}

function onClickMap(lat, lng) {
  console.log('map was clicked!');
  var locationName = prompt('Enter place name');
  mapService.createLocation(locationName, lat, lng);
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  });
  return marker;
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng);
  gMap.panTo(laLatLng);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  const API_KEY = 'AIzaSyArPfnniO-fbEgEPLFtiwE1CUP3C8-Dml4'; //TODO: Enter your API Key
  var elGoogleApi = document.createElement('script');
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject('Google script failed to load');
  });
}

function getCurrPos() {
//   let infoWindow = new google.maps.InfoWindow();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // infoWindow.setPosition(pos);
        // infoWindow.setContent('Location found.');
        // infoWindow.open(map);
        panTo(pos.lat, pos.lng);
      },
      () => {
        // handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    // handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
