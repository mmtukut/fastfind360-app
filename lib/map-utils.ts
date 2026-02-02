/**
 * Map Optimization Utilities
 * 
 * This module provides utility functions for optimizing map rendering:
 * - Viewport filtering to only render visible polygons
 * - Polygon simplification using Douglas-Peucker algorithm
 * - Distance calculations for clustering
 * - Bounds checking and geometry validation
 */

export interface LatLng {
    lat: number
    lng: number
}

export interface Bounds {
    north: number
    south: number
    east: number
    west: number
}

export interface SimplifiedPolygon {
    id: string
    paths: LatLng[]
    simplified: boolean
    originalPointCount: number
}

/**
 * Calculate distance between two points using Haversine formula
 */
export function calculateDistance(p1: LatLng, p2: LatLng): number {
    const R = 6371 // Earth's radius in km
    const dLat = toRad(p2.lat - p1.lat)
    const dLon = toRad(p2.lng - p1.lng)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

function toRad(deg: number): number {
    return deg * (Math.PI / 180)
}

/**
 * Check if a point is within bounds
 */
export function isPointInBounds(point: LatLng, bounds: Bounds): boolean {
    return (
        point.lat >= bounds.south &&
        point.lat <= bounds.north &&
        point.lng >= bounds.west &&
        point.lng <= bounds.east
    )
}

/**
 * Check if any part of a polygon intersects with bounds
 */
export function isPolygonInBounds(points: LatLng[], bounds: Bounds): boolean {
    // Quick check: if any point is in bounds, the polygon is visible
    for (const point of points) {
        if (isPointInBounds(point, bounds)) {
            return true
        }
    }

    // Check if polygon center is in bounds
    const center = getPolygonCenter(points)
    if (isPointInBounds(center, bounds)) {
        return true
    }

    // For edge cases, check if bounds corners are inside polygon (expensive, skip for performance)
    return false
}

/**
 * Get the center point of a polygon
 */
export function getPolygonCenter(points: LatLng[]): LatLng {
    if (points.length === 0) return { lat: 0, lng: 0 }

    let latSum = 0
    let lngSum = 0

    for (const point of points) {
        latSum += point.lat
        lngSum += point.lng
    }

    return {
        lat: latSum / points.length,
        lng: lngSum / points.length,
    }
}

/**
 * Perpendicular distance from a point to a line segment
 */
function perpendicularDistance(point: LatLng, lineStart: LatLng, lineEnd: LatLng): number {
    const dx = lineEnd.lng - lineStart.lng
    const dy = lineEnd.lat - lineStart.lat

    // Normalize
    const mag = Math.sqrt(dx * dx + dy * dy)
    if (mag > 0) {
        const u = ((point.lng - lineStart.lng) * dx + (point.lat - lineStart.lat) * dy) / (mag * mag)
        const intersectionX = lineStart.lng + u * dx
        const intersectionY = lineStart.lat + u * dy
        const dx2 = point.lng - intersectionX
        const dy2 = point.lat - intersectionY
        return Math.sqrt(dx2 * dx2 + dy2 * dy2)
    } else {
        const dx3 = point.lng - lineStart.lng
        const dy3 = point.lat - lineStart.lat
        return Math.sqrt(dx3 * dx3 + dy3 * dy3)
    }
}

/**
 * Simplify polygon using Douglas-Peucker algorithm
 * @param points - Array of polygon points
 * @param epsilon - Tolerance (higher = more simplification)
 */
export function simplifyPolygon(points: LatLng[], epsilon: number): LatLng[] {
    if (points.length <= 3) return points

    // Find the point with maximum distance
    let maxDistance = 0
    let index = 0
    const end = points.length - 1

    for (let i = 1; i < end; i++) {
        const distance = perpendicularDistance(points[i], points[0], points[end])
        if (distance > maxDistance) {
            index = i
            maxDistance = distance
        }
    }

    // If max distance is greater than epsilon, recursively simplify
    if (maxDistance > epsilon) {
        const left = points.slice(0, index + 1)
        const right = points.slice(index)

        const leftSimplified = simplifyPolygon(left, epsilon)
        const rightSimplified = simplifyPolygon(right, epsilon)

        // Concatenate results, removing duplicate point at junction
        return [...leftSimplified.slice(0, -1), ...rightSimplified]
    } else {
        // All points between start and end can be removed
        return [points[0], points[end]]
    }
}

/**
 * Get epsilon value based on zoom level
 * Higher zoom = less simplification (smaller epsilon)
 */
export function getEpsilonForZoom(zoom: number): number {
    // Zoom ranges from ~1 (world) to 20 (building level)
    if (zoom >= 18) return 0.00001 // Very detailed
    if (zoom >= 15) return 0.00005 // Detailed
    if (zoom >= 12) return 0.0001 // Medium detail
    if (zoom >= 10) return 0.0005 // Low detail
    return 0.001 // Very low detail
}

/**
 * Batch process polygons for rendering
 * Splits into chunks to prevent UI blocking
 */
export function* batchPolygons<T>(items: T[], batchSize: number = 100): Generator<T[]> {
    for (let i = 0; i < items.length; i += batchSize) {
        yield items.slice(i, i + batchSize)
    }
}

/**
 * Calculate optimal batch size based on zoom level and polygon count
 */
export function getOptimalBatchSize(zoom: number, totalPolygons: number): number {
    // At lower zoom levels, render fewer polygons per batch to prevent blocking
    if (zoom < 12) return 50
    if (zoom < 15) return 100
    if (totalPolygons > 1000) return 150
    return 200
}

/**
 * Filter buildings by viewport with buffer
 * Adds a buffer zone to prevent pop-in during pan
 */
export function filterByViewport<T extends { paths: LatLng[] }>(
    items: T[],
    bounds: Bounds,
    bufferPercent: number = 0.1
): T[] {
    // Add buffer to bounds
    const latBuffer = (bounds.north - bounds.south) * bufferPercent
    const lngBuffer = (bounds.east - bounds.west) * bufferPercent

    const bufferedBounds: Bounds = {
        north: bounds.north + latBuffer,
        south: bounds.south - latBuffer,
        east: bounds.east + lngBuffer,
        west: bounds.west - lngBuffer,
    }

    return items.filter((item) => isPolygonInBounds(item.paths, bufferedBounds))
}

/**
 * Debounce function for map events
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null
            func(...args)
        }

        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(later, wait)
    }
}

/**
 * Throttle function for frequent events like zoom/pan
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => {
                inThrottle = false
            }, limit)
        }
    }
}
