let maptoken = mapToken;
console.log(maptoken);
maptilersdk.config.apiKey = maptoken;
const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    style: maptilersdk.MapStyle.STREETS,
    center: [16.62662018, 49.2125578], // starting position [lng, lat]
    zoom: 14, // starting zoom
});

