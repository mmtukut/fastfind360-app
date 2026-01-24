"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Loader2 } from "lucide-react"
import type { BuildingStats } from "@/lib/types"
import { formatCurrency } from "@/lib/buildings-data"

interface ReportGeneratorProps {
  stats: BuildingStats
  onGenerate: (config: ReportConfig) => void
}

interface ReportConfig {
  template: string
  lga?: string
  includeCount: boolean
  includeSizeDistribution: boolean
  includeRevenue: boolean
  includeHighPriority: boolean
  includeMaps: boolean
  includeMethodology: boolean
  format: "pdf" | "excel" | "both"
}

const lgas = [
  "Gombe",
  "Billiri",
  "Kaltungo",
  "Funakaye",
  "Yamaltu/Deba",
  "Balanga",
  "Akko",
  "Nafada",
  "Kwami",
  "Shongom",
  "Dukku",
]

export function ReportGenerator({ stats, onGenerate }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [config, setConfig] = useState<ReportConfig>({
    template: "executive",
    includeCount: true,
    includeSizeDistribution: true,
    includeRevenue: true,
    includeHighPriority: true,
    includeMaps: true,
    includeMethodology: false,
    format: "pdf",
  })

  const handleGenerate = async () => {
    setIsGenerating(true)

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate report content
    const reportContent = generateReportContent(config, stats)

    // Create and download file
    const blob = new Blob([reportContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `FastFind360-${config.template}-Report-${new Date().toISOString().split("T")[0]}.html`
    a.click()

    setIsGenerating(false)
    onGenerate(config)
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Generate Custom Report</h3>
          <p className="text-sm text-muted-foreground">Create professional reports for stakeholders</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Report Template */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Report Template</Label>
          <RadioGroup
            value={config.template}
            onValueChange={(value) => setConfig({ ...config, template: value })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="executive" id="executive" />
              <Label htmlFor="executive" className="cursor-pointer">
                <div className="font-medium">Executive Summary</div>
                <div className="text-xs text-muted-foreground">For Governor/Commissioner</div>
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="technical" id="technical" />
              <Label htmlFor="technical" className="cursor-pointer">
                <div className="font-medium">Technical Report</div>
                <div className="text-xs text-muted-foreground">For GOGIS/Planning</div>
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="revenue" id="revenue" />
              <Label htmlFor="revenue" className="cursor-pointer">
                <div className="font-medium">Revenue Report</div>
                <div className="text-xs text-muted-foreground">For Board of Internal Revenue</div>
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="lga" id="lga" />
              <Label htmlFor="lga" className="cursor-pointer">
                <div className="font-medium">LGA-Specific Report</div>
                <div className="text-xs text-muted-foreground">Focused on single Local Government Area</div>
              </Label>
            </div>
          </RadioGroup>

          {config.template === "lga" && (
            <div className="mt-4">
              <Label className="text-sm mb-2 block">Select LGA</Label>
              <Select value={config.lga} onValueChange={(value) => setConfig({ ...config, lga: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose LGA" />
                </SelectTrigger>
                <SelectContent>
                  {lgas.map((lga) => (
                    <SelectItem key={lga} value={lga.toLowerCase()}>
                      {lga}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Include Sections */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Include Sections</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="count"
                checked={config.includeCount}
                onCheckedChange={(checked) => setConfig({ ...config, includeCount: !!checked })}
              />
              <Label htmlFor="count" className="text-sm cursor-pointer">
                Building count by type
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="size"
                checked={config.includeSizeDistribution}
                onCheckedChange={(checked) => setConfig({ ...config, includeSizeDistribution: !!checked })}
              />
              <Label htmlFor="size" className="text-sm cursor-pointer">
                Size distribution charts
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="revenue"
                checked={config.includeRevenue}
                onCheckedChange={(checked) => setConfig({ ...config, includeRevenue: !!checked })}
              />
              <Label htmlFor="revenue" className="text-sm cursor-pointer">
                Revenue potential calculation
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="priority"
                checked={config.includeHighPriority}
                onCheckedChange={(checked) => setConfig({ ...config, includeHighPriority: !!checked })}
              />
              <Label htmlFor="priority" className="text-sm cursor-pointer">
                High-priority properties list
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="maps"
                checked={config.includeMaps}
                onCheckedChange={(checked) => setConfig({ ...config, includeMaps: !!checked })}
              />
              <Label htmlFor="maps" className="text-sm cursor-pointer">
                Maps (full state or filtered view)
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="methodology"
                checked={config.includeMethodology}
                onCheckedChange={(checked) => setConfig({ ...config, includeMethodology: !!checked })}
              />
              <Label htmlFor="methodology" className="text-sm cursor-pointer">
                Methodology explanation
              </Label>
            </div>
          </div>
        </div>

        {/* Export Format */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Export Format</Label>
          <RadioGroup
            value={config.format}
            onValueChange={(value) => setConfig({ ...config, format: value as "pdf" | "excel" | "both" })}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf" className="cursor-pointer">
                PDF
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="excel" id="excel" />
              <Label htmlFor="excel" className="cursor-pointer">
                Excel
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="both" />
              <Label htmlFor="both" className="cursor-pointer">
                Both
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || (config.template === "lga" && !config.lga)}
          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function generateReportContent(config: ReportConfig, stats: BuildingStats): string {
  const templateTitles: Record<string, string> = {
    executive: "Executive Summary Report",
    technical: "Technical Analysis Report",
    revenue: "Revenue Recovery Report",
    lga: `${config.lga?.charAt(0).toUpperCase()}${config.lga?.slice(1)} LGA Report`,
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <title>FastFind360 - ${templateTitles[config.template]}</title>
  <style>
    body { font-family: 'Inter', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1F2937; }
    h1 { color: #1E3A5F; border-bottom: 3px solid #2563EB; padding-bottom: 16px; }
    h2 { color: #1E3A5F; margin-top: 32px; }
    .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 24px 0; }
    .stat-card { background: #F3F4F6; padding: 20px; border-radius: 8px; }
    .stat-value { font-size: 28px; font-weight: bold; color: #1E3A5F; }
    .stat-label { color: #6B7280; font-size: 14px; }
    .highlight { background: #ECFDF5; border-left: 4px solid #059669; padding: 16px; margin: 16px 0; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #E5E7EB; }
    th { background: #F3F4F6; font-weight: 600; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 12px; }
  </style>
</head>
<body>
  <h1>FastFind360 - ${templateTitles[config.template]}</h1>
  <p><strong>Generated:</strong> ${new Date().toLocaleDateString("en-NG", { dateStyle: "full" })}</p>
  <p><strong>State:</strong> Gombe State, Nigeria</p>

  ${
    config.includeCount
      ? `
  <h2>Building Detection Summary</h2>
  <div class="stat-grid">
    <div class="stat-card">
      <div class="stat-value">${stats.total.toLocaleString()}</div>
      <div class="stat-label">Total Buildings Detected</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${stats.residential.toLocaleString()}</div>
      <div class="stat-label">Residential Properties (${((stats.residential / stats.total) * 100).toFixed(1)}%)</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${stats.commercial.toLocaleString()}</div>
      <div class="stat-label">Commercial Properties (${((stats.commercial / stats.total) * 100).toFixed(1)}%)</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${stats.industrial.toLocaleString()}</div>
      <div class="stat-label">Industrial Properties (${((stats.industrial / stats.total) * 100).toFixed(1)}%)</div>
    </div>
  </div>
  `
      : ""
  }

  ${
    config.includeRevenue
      ? `
  <h2>Revenue Potential Analysis</h2>
  <div class="highlight">
    <strong>Total Estimated Annual Revenue Potential:</strong> ${formatCurrency(stats.revenuePotential)}
    <br><br>
    <small>Based on FastFind360 detection of ${stats.total.toLocaleString()} properties with automated classification and tax estimation.</small>
  </div>
  
  <table>
    <tr>
      <th>Classification</th>
      <th>Properties</th>
      <th>Tax Rate (per m²)</th>
      <th>Est. Revenue</th>
    </tr>
    <tr>
      <td>Residential</td>
      <td>${stats.residential.toLocaleString()}</td>
      <td>₦100</td>
      <td>${formatCurrency(stats.residential * 100 * 80)}</td>
    </tr>
    <tr>
      <td>Commercial</td>
      <td>${stats.commercial.toLocaleString()}</td>
      <td>₦350</td>
      <td>${formatCurrency(stats.commercial * 350 * 300)}</td>
    </tr>
    <tr>
      <td>Industrial</td>
      <td>${stats.industrial.toLocaleString()}</td>
      <td>₦500</td>
      <td>${formatCurrency(stats.industrial * 500 * 1000)}</td>
    </tr>
  </table>
  `
      : ""
  }

  ${
    config.includeHighPriority
      ? `
  <h2>High-Priority Enforcement Targets</h2>
  <p>${stats.largeCommercial.toLocaleString()} large commercial properties identified with estimated annual tax potential exceeding ₦500,000.</p>
  <p>These properties are concentrated along major roads and commercial districts.</p>
  `
      : ""
  }

  ${
    config.includeMethodology
      ? `
  <h2>Methodology</h2>
  <p><strong>Satellite Imagery:</strong> High-resolution satellite data acquired covering entire state.</p>
  <p><strong>AI Detection:</strong> Machine learning model trained to identify building footprints with 99.998% accuracy.</p>
  <p><strong>Classification:</strong> Buildings classified based on area thresholds: Residential (&lt;150m²), Commercial (150-600m²), Industrial (&gt;600m²).</p>
  <p><strong>Revenue Estimation:</strong> Tax potential calculated using standard Gombe State property tax rates by classification.</p>
  `
      : ""
  }

  <div class="footer">
    <p>Report generated by FastFind360 - Government Property Intelligence Platform</p>
    <p>Zippatek Digital Ltd | RC: 8527315 | Abuja, Nigeria</p>
    <p>For questions or support, contact: support@fastfind360.com</p>
  </div>
</body>
</html>
  `
}
