const { simplifyPolygon, getEpsilonForZoom, filterByViewport } = require('./lib/map-utils.ts')

async function run() {
    const res = await fetch("http://localhost:3000/api/buildings/bbox?north=10.29&south=10.28&east=11.17&west=11.16&limit=10");
    const data = await res.json();
    console.log("Buildings received:", data.buildings.length);
    if (data.buildings.length > 0) {
        const b = data.buildings[0];
        console.log("First building:", b.geometry);
    }
}
run();
