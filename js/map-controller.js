import { mapService } from './services/map-service.js';
import { geoCodeService } from './services/goecode-service.js';
import { weatherService } from './services/weather-service.js';

var gMap;

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
  
  weatherService.getWeather(32.0852999, 34.78176759999999)
  .then((weather) => {
      renderWeather(weather)
      mapService.initialData(weather)
    .then(renderTable)
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
  return _connectGoogleApi()
    .then(() => {
      gMap = new google.maps.Map(document.querySelector('#map'), {
        center: { lat, lng },
        zoom: 15,
      });
    })
    .then(() => {
      gMap.addListener('click', (event) => {
        addMarker(event.latLng);
        let lat = event.latLng.lat();
        let lng = event.latLng.lng();

        onClickMap(lat, lng);
      });
    });
}

function onClickMap(lat, lng) {
//   todo: add an adress
weatherService.getWeather(lat, lng)
  .then((weather) => {
      renderWeather(weather)
      mapService.createLocation('popo', lat, lng, weather)
    .then(renderTable)
    });
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
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        addMarker(pos);
        mapService.createLocation('Current Location', pos.lat, pos.lng)
        .then(renderTable);
        panTo(pos.lat, pos.lng);
      });
    }
}

function addLocation(location) {
    weatherService.getWeather(location.lat, location.lng)
    .then((weather) => {
        renderWeather(weather)
        mapService.createLocation(location.adress, location.lat, location.lng, weather)
      .then(renderTable)
      });
  //render location to table
}

// function renderLocationName(location) {
//     document.querySelector('.location-name').innerText = location.adress;
// }


function renderTable(locations) {
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
