const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 8080; // Cloud Run uses PORT env var

// Hardcoded for now as in original file, but could be env var
const FIREBASE_CSV_URL =
    "https://firebasestorage.googleapis.com/v0/b/studio-8745024075-1f679.firebasestorage.app/o/gombe_buildings.csv?alt=media&token=b0db8a15-91a7-48db-952e-57b5b6bfe347";

const TAX_RATES = {
    Residential: 100,
    Commercial: 350,
    Industrial: 500,
};

// In-memory store
let buildingsData = {
    buildings: [],
    stats: {
        total: 0,
        residential: 0,
        commercial: 0,
        industrial: 0,
        totalArea: 0,
        revenuePotential: 0,
        largeCommercial: 0,
    },
    ready: false,
    lastUpdated: null
};

app.use(cors());

function classifyBuilding(area) {
    if (area < 150) return "Residential";
    if (area < 600) return "Commercial";
    return "Industrial";
}

function parseCSVLine(line) {
    const values = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
            values.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }
    values.push(current.trim());
    return values;
}

function getHeaders(csvText) {
    const firstLine = csvText.split("\n")[0];
    return firstLine.split(",").map((h) => h.trim().toLowerCase());
}

async function loadData() {
    console.log("Fetching buildings from Firebase...");
    try {
        const response = await fetch(FIREBASE_CSV_URL);
        if (!response.ok) throw new Error(`Firebase responded with status: ${response.status}`);

        const csvText = await response.text();
        console.log("CSV fetched, parsing...");
        console.time("CSV Parse");

        const lines = csvText.split("\n");
        if (lines.length <= 1) {
            console.warn("CSV Empty");
            return;
        }

        const headers = getHeaders(csvText);
        const latIdx = headers.findIndex((h) => h.includes("lat") || h === "y");
        const lonIdx = headers.findIndex((h) => h.includes("lon") || h.includes("lng") || h === "x");
        const areaIdx = headers.findIndex((h) => h.includes("area"));
        const confIdx = headers.findIndex((h) => h.includes("confidence") || h.includes("conf"));
        const geomIdx = headers.findIndex((h) => h.includes("geometry") || h.includes("geom"));

        const buildings = [];
        const stats = {
            total: 0,
            residential: 0,
            commercial: 0,
            industrial: 0,
            totalArea: 0,
            revenuePotential: 0,
            largeCommercial: 0,
        };

        // Skip header
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = parseCSVLine(line);

            const lat = parseFloat(values[latIdx] || "0");
            const lng = parseFloat(values[lonIdx] || "0");
            const area = parseFloat(values[areaIdx] || "0");
            const confidence = parseFloat(values[confIdx] || "0.95");

            if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) continue;

            const classification = classifyBuilding(area);
            const estimatedTax = area * TAX_RATES[classification];

            buildings.push({
                id: `building-${i}`,
                latitude: lat,
                longitude: lng,
                area_in_meters: area,
                confidence,
                geometry: values[geomIdx] || undefined,
                classification,
                estimated_tax: estimatedTax,
            });

            stats.total++;
            stats.totalArea += area;
            stats.revenuePotential += estimatedTax;

            if (classification === "Residential") stats.residential++;
            else if (classification === "Commercial") {
                stats.commercial++;
                if (area > 500) stats.largeCommercial++;
            } else if (classification === "Industrial") stats.industrial++;
        }

        console.timeEnd("CSV Parse");
        console.log(`Parsed ${buildings.length} buildings`);

        buildingsData = {
            buildings,
            stats,
            ready: true,
            lastUpdated: Date.now()
        };

    } catch (err) {
        console.error("Failed to load data:", err);
    }
}

// Initial Load
loadData();

app.get('/health', (req, res) => {
    res.json({ status: 'ok', ready: buildingsData.ready });
});

app.get('/buildings', (req, res) => {
    if (!buildingsData.ready) {
        return res.status(503).json({ error: "Data loading" });
    }

    const statsOnly = req.query.statsOnly === '1';

    if (statsOnly) {
        return res.json({ stats: buildingsData.stats });
    }

    res.json({
        buildings: buildingsData.buildings,
        stats: buildingsData.stats
    });
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
