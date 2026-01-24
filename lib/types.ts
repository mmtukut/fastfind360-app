// FastFind360 Type Definitions

export interface BuildingGeometry {
  type: "Polygon"
  coordinates: number[][][]
}

export interface BuildingProperties {
  id: string
  classification: "Residential" | "Commercial" | "Industrial"
  area_in_meters: number
  confidence: number
  estimated_tax: number
  estimatedValue: number
  detectedAt: string
}

export interface Building {
  id: string
  latitude: number
  longitude: number
  area_in_meters: number
  geometry: BuildingGeometry
  confidence: number
  classification: "Residential" | "Commercial" | "Industrial"
  perimeter?: number
  compactness?: number
  estimated_tax: number
  properties: BuildingProperties
}

export interface BuildingStats {
  total: number
  residential: number
  commercial: number
  industrial: number
  totalArea: number
  revenuePotential: number
  largeCommercial: number
}

export interface FilterState {
  classifications: string[]
  minArea: number
  maxArea: number
  minConfidence: number
  searchLocation: string
}

export interface ReportConfig {
  type: "executive" | "technical" | "revenue" | "lga"
  includeCharts: boolean
  includePropertyList: boolean
  includeMaps: boolean
  lgaFilter?: string
}
