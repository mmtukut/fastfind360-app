"use client"

import { Globe, TrendingUp, Building2, MapPin, ExternalLink } from "lucide-react"

const globalCases = [
    {
        country: "India",
        city: "Mumbai & Bangalore",
        impact: "15M+ properties mapped",
        revenue: "$2.3B annual property tax",
        description: "AI-powered property assessment increased municipal revenue by 23%",
        icon: "🇮🇳",
    },
    {
        country: "Kenya",
        city: "Nairobi County",
        impact: "350K+ new properties",
        revenue: "KSh 4.2B additional revenue",
        description: "Satellite imagery detected informal settlements and commercial zones",
        icon: "🇰🇪",
    },
    {
        country: "Philippines",
        city: "Metro Manila",
        impact: "2.8M properties digitized",
        revenue: "₱12B revenue optimization",
        description: "GIS integration reduced assessment time from 8 months to 6 weeks",
        icon: "🇵🇭",
    },
    {
        country: "Indonesia",
        city: "Jakarta",
        impact: "1.2M property updates",
        revenue: "Rp 8.5T tax base expansion",
        description: "Machine learning classified mixed-use properties with 94% accuracy",
        icon: "🇮🇩",
    },
    {
        country: "South Africa",
        city: "Cape Town",
        impact: "480K+ assessments",
        revenue: "R1.8B valuation roll",
        description: "Drone + satellite combination improved coverage in informal settlements",
        icon: "🇿🇦",
    },
    {
        country: "Brazil",
        city: "São Paulo",
        impact: "5M+ properties tracked",
        revenue: "R$9.2B property tax",
        description: "Real-time change detection identifies new construction within 72 hours",
        icon: "🇧🇷",
    },
]

export function GlobalUseCases() {
    return (
        <section className="py-20 md:py-32 bg-gradient-to-br from-muted/30 via-background to-muted/30 scroll-mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                        <Globe className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">Proven Worldwide</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                        Global Success Stories in{" "}
                        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            Property Intelligence
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        Cities and states worldwide are leveraging satellite imagery and AI to transform property tax revenue.
                        Nigeria is next.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {globalCases.map((caseStudy, index) => (
                        <div
                            key={index}
                            className="group glass rounded-2xl p-6 border border-border/50 shadow-ios hover-lift cursor-pointer transition-all duration-300"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="text-4xl">{caseStudy.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground">{caseStudy.country}</h3>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {caseStudy.city}
                                        </p>
                                    </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Description */}
                            <p className="text-sm text-foreground/80 leading-relaxed mb-4 min-h-[3rem]">
                                {caseStudy.description}
                            </p>

                            {/* Stats */}
                            <div className="space-y-3 pt-4 border-t border-border/50">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-semibold text-foreground">{caseStudy.impact}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-accent" />
                                    <span className="text-sm font-semibold text-accent">{caseStudy.revenue}</span>
                                </div>
                            </div>

                            {/* Hover effect border */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-secondary/0 to-accent/0 group-hover:from-primary/10 group-hover:via-secondary/10 group-hover:to-accent/10 transition-all duration-300 pointer-events-none" />
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground text-sm mb-4">
                        Sources: World Bank Property Tax Reports, UN-Habitat Urban Data, Municipal Government Publications
                    </p>
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-accent/30 shadow-ios">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        <span className="font-semibold text-foreground">
                            Join governments worldwide optimizing property tax revenue with AI
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
