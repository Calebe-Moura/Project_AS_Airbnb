var map = L.map("map").setView([-22.411029, -42.802734], 5);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap",
}).addTo(map);

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);

loadGeoJSON(33);

async function loadGeoJSON(id) {
    try {
        const request = await fetch(`https://servicodados.ibge.gov.br/api/v4/malhas/estados/${id}?formato=application/vnd.geo+json`);
        const response = await request.json();
        L.geoJSON(response).addTo(map);
        
    } catch (error) {
        console.error("Error loading GeoJSON:", error);
    }
}