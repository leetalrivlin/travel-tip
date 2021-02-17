
export const geoCodeService = {
    getLatLng,
  };


function getLatLng(location) {
    console.log(location);
    return axios
      .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyATvXgiBOmv7oHOuec8yoUdOx_4cxw-PYo`
      )
      .then((res) => {
        console.log('Service Got Res:', res);
        const locationFromUser ={
            adress: res.data.results[0].formatted_address,
            lat: res.data.results[0].geometry.location.lat,
            lng: res.data.results[0].geometry.location.lng,
        }  
        console.log(locationFromUser);
        return locationFromUser;
      })
      .catch((err) => {
        console.log('Service got Error:', err);
      });
  }