const parseWktRing = (ring) =>
    ring
        .split(",")
        .map(pair => {
            const [lng, lat] = pair.trim().split(/\s+/).map(Number)
            if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null
            return [lng, lat]
        })
        .filter((coord) => Boolean(coord))

const parseWktPolygon = (value) => {
    const body = value.replace(/^POLYGON\s*\(\(/i, "").replace(/\)\)\s*$/i, "")
    if (!body) return null
    return parseWktRing(body)
}

const parseGeometry = (geometry) => {
    if (!geometry) return null
    const trimmed = geometry.trim()
    if (!trimmed) return null

    if (trimmed.toUpperCase().startsWith("POLYGON")) {
        return parseWktPolygon(trimmed)
    }

    return null
}

console.log(parseGeometry("POLYGON((11.1633111620351 10.2881568957139, 11.1633168602623 10.2881021484179))"))
