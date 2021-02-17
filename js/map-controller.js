import { mapService } from './services/map-service.js';
import { geoCodeService } from './services/goecode-service.js';
import { weatherService } from './services/weather-service.js';

var gMap;
console.log('Main!');

mapService.getLocs().then((locs) => console.log('locs', locs));

window.onload = () => {
  document.querySelector('.my-location-btn').addEventListener('click', () => {
    getCurrPos();
  });
  document.querySelector('.location-go-btn').addEventListener('click', () => {
    const location = document.querySelector('input[name="location-input"]')
      .value;
    geoCodeService.getLatLng(location)
    .then(addLocation);
  });
    mapService.initialData()
    .then(renderTable)

    weatherService.getWeather(32.08, 34.78)
    .then(renderWeather);

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
        addMarker(event.latLng);
        let lat = event.latLng.lat();
        let lng = event.latLng.lng();

        onClickMap(lat, lng);
      });
    });
}

function onClickMap(lat, lng) {
    
  console.log('map was clicked!');
//   todo: add an adress
  mapService.createLocation('Popo', lat, lng)
  .then(renderTable);
}

function addMarker(loc) {
  let marker = new google.maps.Marker({
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
  const API_KEY = 'AIzaSyATvXgiBOmv7oHOuec8yoUdOx_4cxw-PYo'; //TODO: Enter your API Key
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
        console.log('curr pos', pos);
        addMarker(pos);
        mapService.createLocation('Current Location', pos.lat, pos.lng)
        .then(renderTable);
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

function addLocation(location) {
  console.log(location);
  mapService.createLocation(location.adress, location.lat, location.lng)
  .then(renderTable);
  //render location to table
}

function renderTable(locations) {
    console.log('Rendering the table');
        let strHtml = Object.values(locations).map( location => {
            return `<tr>
                        <td>${location.adress}</td>
                        <td>
                            <button class="table-go-btn btn" onclick="renderPageFromLocation(location)">Go</button>
                            <button class="table-delete-btn btn" onclick="removeLocation(${location.adress})">Delete</button>
                        </td>
                     </tr>`
        }).join('');
    document.querySelector('.table-item').innerHTML = strHtml;
}

function renderPageFromLocation(location) {
    panTo(location.lat, location.lng);
}

function removeLocation(adress) {
 console.log('adress',adress);
}

function renderWeather(weatherData) {
  console.log(weatherData);
  var strHtml = `<h2>Weather Data</h2>
                    <p>Mood: ${weatherData.desc}</p>
                    <p>Temp: ${weatherData.temp}</p>
                    <p>feels like: ${weatherData.feelsLike}</p>`;
  document.querySelector('.weather-container').innerHTML = strHtml;
}
