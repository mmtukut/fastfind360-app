"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Server, Database, Key, Users, Bell, Download, Upload, RefreshCw, Shield, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type TabType = "system" | "data" | "api" | "users" | "notifications"

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabType>("system")
    const [autoSync, setAutoSync] = useState(true)
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [dataBackup, setDataBackup] = useState(true)

    const tabs = [
        { id: "system" as const, label: "System Config", icon: Server },
        { id: "data" as const, label: "Data Sync", icon: Database },
        { id: "api" as const, label: "API Access", icon: Key },
        { id: "users" as const, label: "User Management", icon: Users },
        { id: "notifications" as const, label: "Notifications", icon: Bell },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <h1 className="text-sm font-bold text-blue-400 uppercase tracking-widest">System Configuration</h1>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Settings & Administration</h2>
                </div>
                <div className="text-xs font-mono text-slate-500 bg-[#112240] px-3 py-1.5 rounded-sm border border-slate-800">
                    ADMIN_ACCESS: GRANTED | SESSION: ACTIVE
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-sm transition-all whitespace-nowrap border",
                                activeTab === tab.id
                                    ? "bg-blue-600/10 text-blue-400 border-blue-600/20"
                                    : "bg-[#112240]/50 text-slate-400 hover:text-white hover:bg-slate-800/50 border-slate-700/50"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Content Area */}
            <div className="bg-[#112240]/50 border border-slate-700/50 rounded-sm p-6">
                {activeTab === "system" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Server className="w-5 h-5 text-blue-400" />
                                System Configuration
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">System Name</Label>
                                        <Input defaultValue="FastFind360 - Gombe State" className="bg-slate-900 border-slate-700 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Deployment Region</Label>
                                        <Input defaultValue="Nigeria - North East" className="bg-slate-900 border-slate-700 text-white" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-sm border border-slate-800">
                                    <div>
                                        <div className="text-sm font-medium text-white">Automatic System Updates</div>
                                        <div className="text-xs text-slate-400">Apply security patches automatically</div>
                                    </div>
                                    <Switch checked={autoSync} onCheckedChange={setAutoSync} />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-sm border border-slate-800">
                                    <div>
                                        <div className="text-sm font-medium text-white">Automated Backups</div>
                                        <div className="text-xs text-slate-400">Daily incremental backups at 02:00 UTC</div>
                                    </div>
                                    <Switch checked={dataBackup} onCheckedChange={setDataBackup} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "data" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Database className="w-5 h-5 text-blue-400" />
                                Data Synchronization
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-900/20 border border-blue-700/30 rounded-sm">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium text-blue-300">Last Sync: 2026-02-04 06:00 UTC</div>
                                            <div className="text-xs text-blue-400/70 mt-1">245,264 buildings synchronized from Firebase Storage</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Firebase Storage URL</Label>
                                    <Input
                                        defaultValue="gs://studio-8745024075-1f679.firebasestorage.app"
                                        className="bg-slate-900 border-slate-700 text-white font-mono text-xs"
                                        readOnly
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Sync Now
                                    </Button>
                                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Data
                                    </Button>
                                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Import Data
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "api" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Key className="w-5 h-5 text-blue-400" />
                                API Access & Security
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Backend API Endpoint</Label>
                                    <Input
                                        defaultValue="http://localhost:4000"
                                        className="bg-slate-900 border-slate-700 text-white font-mono text-xs"
                                    />
                                    <div className="text-xs text-slate-500">Production: Will be updated after deployment</div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Google Maps API Key</Label>
                                    <Input
                                        type="password"
                                        defaultValue="AIzaSyD..."
                                        className="bg-slate-900 border-slate-700 text-white font-mono text-xs"
                                    />
                                </div>
                                <div className="p-4 bg-slate-900/50 rounded-sm border border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-white">API Rate Limiting</div>
                                            <div className="text-xs text-slate-400">Current: 1000 requests/hour</div>
                                        </div>
                                        <Shield className="w-5 h-5 text-green-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "users" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-400" />
                                User Management
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-900/50 rounded-sm border border-slate-800">
                                    <div className="text-sm font-medium text-white mb-2">Current Admin User</div>
                                    <div className="text-xs text-slate-400">admin@gombe.gov.ng</div>
                                    <div className="text-xs text-emerald-400 mt-1">Role: System Administrator</div>
                                </div>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Users className="w-4 h-4 mr-2" />
                                    Add New User
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "notifications" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-blue-400" />
                                Notification Preferences
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-sm border border-slate-800">
                                    <div>
                                        <div className="text-sm font-medium text-white">Email Notifications</div>
                                        <div className="text-xs text-slate-400">Receive system alerts via email</div>
                                    </div>
                                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-sm border border-slate-800">
                                    <div>
                                        <div className="text-sm font-medium text-white">Data Sync Notifications</div>
                                        <div className="text-xs text-slate-400">Alert on successful data synchronization</div>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-sm border border-slate-800">
                                    <div>
                                        <div className="text-sm font-medium text-white">Security Alerts</div>
                                        <div className="text-xs text-slate-400">Notify on unauthorized access attempts</div>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                    Save Configuration
                </Button>
            </div>
        </div>
    )
}
