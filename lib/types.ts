// FastFind360 Type Definitions

export interface Building {
  id: string
  latitude: number
  longitude: number
  area_in_meters: number
  geometry?: string
  confidence: number
  classification: "Residential" | "Commercial" | "Industrial"
  perimeter?: number
  compactness?: number
  estimated_tax?: number
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
