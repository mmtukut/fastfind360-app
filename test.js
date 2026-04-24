function isPointInBounds(point, bounds) {
    return (
        point.lat >= bounds.south &&
        point.lat <= bounds.north &&
        point.lng >= bounds.west &&
        point.lng <= bounds.east
    )
}
console.log(isPointInBounds({lat: 10.2881, lng: 11.1633}, { north: 10.29, south: 10.28, east: 11.17, west: 11.16 }))
