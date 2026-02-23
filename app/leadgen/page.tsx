"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Instagram, MapPin, Users, Mail, Phone, Database, Play, Loader2, ArrowLeft, RefreshCw, Send, MessageCircle, FileSpreadsheet, BarChart3, Plus, Trash2, Check, X, Download } from "lucide-react";
import Link from "next/link";

interface Lead {
    name: string;
    details: {
        address?: string;
        phones?: string[];
        emails?: string[];
        instagram?: string;
        source?: string;
    };
    status: string;
    discoveredAt: string;
}

interface QueueItem {
    id: string;
    query: string;
    status: string;
}

export default function LeadGenPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [activeView, setActiveView] = useState("dashboard");
    const [leads, setLeads] = useState<Lead[]>([]);
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [analytics, setAnalytics] = useState<Record<string, unknown>>({});
    const [logs, setLogs] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchLimit, setSearchLimit] = useState(20);
    const [igUrl, setIgUrl] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [igUsername, setIgUsername] = useState("");
    const [isBulkScanning, setIsBulkScanning] = useState(false);
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const logEndRef = useRef<HTMLDivElement>(null);

    const API_URL = process.env.NEXT_PUBLIC_LEADGEN_API_URL || "http://localhost:4000";

    const fetchData = async () => {
        try {
            const [leadsRes, queueRes, analyticsRes] = await Promise.all([
                fetch(`${API_URL}/api/leads`),
                fetch(`${API_URL}/api/queue`),
                fetch(`${API_URL}/api/analytics`),
            ]);
            const leadsData = await leadsRes.json();
            const queueData = await queueRes.json();
            const analyticsData = await analyticsRes.json();
            setLeads(leadsData.data || []);
            setQueue(queueData.data || []);
            setAnalytics(analyticsData.data || {});
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
            const interval = setInterval(fetchData, 30000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const handleLogin = () => {
        if (password) setIsAuthenticated(true);
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        setIsSearching(true);
        setLogs(prev => [...prev, `Starting discovery for: "${searchQuery}"`]);
        try {
            const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(searchQuery)}&limit=${searchLimit}`);
            const data = await res.json();
            if (data.success) {
                setLogs(prev => [...prev, `Found ${data.count} leads`, "Discovery complete"]);
                fetchData();
            } else {
                setLogs(prev => [...prev, `Error: ${data.error}`]);
            }
        } catch (e) {
            setLogs(prev => [...prev, `Error: ${e}`]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleInstagramScan = async () => {
        if (!igUrl) return;
        setIsScanning(true);
        setLogs(prev => [...prev, `Starting OCR scan for: ${igUrl}`]);
        try {
            const res = await fetch(`${API_URL}/api/instagram/scan`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: igUrl, limit: 9 }),
            });
            const data = await res.json();
            if (data.success) {
                setLogs(prev => [...prev, `Found ${data.data.extractedEmails?.length || 0} emails, ${data.data.extractedPhones?.length || 0} phones`]);
                fetchData();
            } else {
                setLogs(prev => [...prev, `Error: ${data.error}`]);
            }
        } catch (e) {
            setLogs(prev => [...prev, `Error: ${e}`]);
        } finally {
            setIsScanning(false);
        }
    };

    const handleBulkDownload = async () => {
        if (!igUsername) return;
        setIsBulkScanning(true);
        setLogs(prev => [...prev, `Starting bulk download for: @${igUsername}`]);
        try {
            const res = await fetch(`${API_URL}/api/instagram/bulk`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: igUsername, limit: 50 }),
            });
            const data = await res.json();
            if (data.success) {
                setLogs(prev => [...prev, `Bulk scan complete. Emails: ${data.data.extractedEmails?.length || 0}`]);
                fetchData();
            } else {
                setLogs(prev => [...prev, `Error: ${data.error}`]);
            }
        } catch (e) {
            setLogs(prev => [...prev, `Error: ${e}`]);
        } finally {
            setIsBulkScanning(false);
        }
    };

    const addToQueue = async () => {
        if (!searchQuery) return;
        try {
            await fetch(`${API_URL}/api/queue`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: searchQuery }),
            });
            fetchData();
        } catch (e) { console.error(e); }
    };

    const removeFromQueue = async (id: string) => {
        try {
            await fetch(`${API_URL}/api/queue/${id}`, { method: "DELETE" });
            fetchData();
        } catch (e) { console.error(e); }
    };

    const toggleLeadSelection = (name: string) => {
        setSelectedLeads(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        );
    };

    const updateLeadStatus = async (name: string, status: string) => {
        try {
            await fetch(`${API_URL}/api/leads/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, status }),
            });
            fetchData();
        } catch (e) { console.error(e); }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="glass-card p-10 rounded-3xl max-w-md w-full mx-4 border border-white/10">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                            <Database className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white text-center mb-2">Lead Generation Hub</h2>
                    <p className="text-slate-500 text-center mb-6">Access your discovery engine</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Access Key"
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 mb-4"
                    />
                    <button
                        onClick={handleLogin}
                        className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all"
                    >
                        Connect
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            <div className="sticky top-0 z-50 bg-[#0a0f1e]/80 backdrop-blur-2xl border-b border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to StructCrew</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 pulse-dot" />
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">LeadGen Active</span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 pt-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <aside className="w-64 shrink-0">
                        <div className="sticky top-24">
                            <div className="flex items-center gap-2 text-purple-500 mb-8">
                                <Database className="w-5 h-5" />
                                <span className="font-bold">LeadGen</span>
                            </div>
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveView("dashboard")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeView === "dashboard" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "text-slate-400 hover:bg-white/5"}`}
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Dashboard</span>
                                </button>
                                <button
                                    onClick={() => setActiveView("discovery")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeView === "discovery" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "text-slate-400 hover:bg-white/5"}`}
                                >
                                    <Search className="w-4 h-4" />
                                    <span className="text-sm font-medium">Discovery</span>
                                </button>
                                <button
                                    onClick={() => setActiveView("instagram")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeView === "instagram" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "text-slate-400 hover:bg-white/5"}`}
                                >
                                    <Instagram className="w-4 h-4" />
                                    <span className="text-sm font-medium">Instagram</span>
                                </button>
                                <button
                                    onClick={() => setActiveView("leads")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeView === "leads" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "text-slate-400 hover:bg-white/5"}`}
                                >
                                    <Users className="w-4 h-4" />
                                    <span className="text-sm font-medium">Leads ({leads.length})</span>
                                </button>
                                <button
                                    onClick={() => setActiveView("campaigns")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeView === "campaigns" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "text-slate-400 hover:bg-white/5"}`}
                                >
                                    <Send className="w-4 h-4" />
                                    <span className="text-sm font-medium">Campaigns</span>
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeView === "dashboard" && (
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Discovery Dashboard</h1>
                                <p className="text-slate-500 mb-8">Overview of your lead generation engine</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="glass-card p-5 rounded-2xl border border-white/5">
                                        <div className="text-3xl font-bold text-white">{analytics.totalLeads || 0}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">Total Leads</div>
                                    </div>
                                    <div className="glass-card p-5 rounded-2xl border border-white/5">
                                        <div className="text-3xl font-bold text-emerald-400">{analytics.contactInfo?.withEmail || 0}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">With Email</div>
                                    </div>
                                    <div className="glass-card p-5 rounded-2xl border border-white/5">
                                        <div className="text-3xl font-bold text-blue-400">{analytics.contactInfo?.withPhone || 0}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">With Phone</div>
                                    </div>
                                    <div className="glass-card p-5 rounded-2xl border border-white/5">
                                        <div className="text-3xl font-bold text-pink-400">{analytics.contactInfo?.withInstagram || 0}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">With Instagram</div>
                                    </div>
                                </div>
                                <div className="glass-card p-6 rounded-2xl border border-white/5">
                                    <h3 className="text-lg font-bold text-white mb-4">Status Breakdown</h3>
                                    <div className="space-y-3">
                                        {analytics.statusBreakdown && Object.entries(analytics.statusBreakdown as Record<string, number>).map(([status, count]) => (
                                            <div key={status} className="flex justify-between items-center">
                                                <span className="text-slate-400 text-sm">{status}</span>
                                                <span className="text-white font-bold">{count as number}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeView === "discovery" && (
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Lead Discovery</h1>
                                <p className="text-slate-500 mb-8">Find businesses on Google Maps</p>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="glass-card p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-4">Google Maps Search</h3>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search query (e.g., architects in Mumbai)"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600"
                                            />
                                            <div className="flex gap-4">
                                                <input
                                                    type="number"
                                                    value={searchLimit}
                                                    onChange={(e) => setSearchLimit(Number(e.target.value))}
                                                    placeholder="Limit"
                                                    className="w-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                                />
                                                <button
                                                    onClick={handleSearch}
                                                    disabled={isSearching || !searchQuery}
                                                    className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                                    {isSearching ? "Searching..." : "Start Discovery"}
                                                </button>
                                                <button
                                                    onClick={addToQueue}
                                                    disabled={!searchQuery}
                                                    className="px-4 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white disabled:opacity-50"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="glass-card p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-4">Queue</h3>
                                        {queue.length > 0 ? (
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {queue.map((item) => (
                                                    <div key={item.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                                        <span className="text-slate-300 text-sm">{item.query}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[10px] px-2 py-1 rounded-full ${item.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                                                                {item.status}
                                                            </span>
                                                            <button onClick={() => removeFromQueue(item.id)} className="text-slate-500 hover:text-red-400">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-slate-600 text-sm">No queued searches</p>
                                        )}
                                    </div>
                                </div>
                                {logs.length > 0 && (
                                    <div className="mt-6">
                                        <div className="bg-black rounded-xl p-4 h-48 overflow-y-auto font-mono text-xs text-purple-400 border border-white/10">
                                            {logs.map((log, i) => <div key={i} className="mb-1 opacity-80">{log}</div>)}
                                            <div ref={logEndRef} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeView === "instagram" && (
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Instagram Scanner</h1>
                                <p className="text-slate-500 mb-8">Extract emails & phones from Instagram</p>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="glass-card p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-4">Quick OCR Scan</h3>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={igUrl}
                                                onChange={(e) => setIgUrl(e.target.value)}
                                                placeholder="Instagram post URL"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600"
                                            />
                                            <button
                                                onClick={handleInstagramScan}
                                                disabled={isScanning || !igUrl}
                                                className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Instagram className="w-4 h-4" />}
                                                {isScanning ? "Scanning..." : "Scan Profile"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="glass-card p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-4">Bulk Download + OCR</h3>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={igUsername}
                                                onChange={(e) => setIgUsername(e.target.value)}
                                                placeholder="Instagram username (without @)"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600"
                                            />
                                            <button
                                                onClick={handleBulkDownload}
                                                disabled={isBulkScanning || !igUsername}
                                                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {isBulkScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                                {isBulkScanning ? "Downloading..." : "Bulk Scan (50 posts)"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeView === "leads" && (
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Lead Database</h1>
                                <p className="text-slate-500 mb-8">{leads.length} leads stored</p>
                                <div className="space-y-3">
                                    {leads.map((lead, i) => (
                                        <div key={i} className="glass-card p-4 rounded-xl border border-white/5 flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedLeads.includes(lead.name)}
                                                onChange={() => toggleLeadSelection(lead.name)}
                                                className="w-4 h-4 accent-purple-500"
                                            />
                                            <div className="flex-1">
                                                <div className="font-bold text-white">{lead.name}</div>
                                                <div className="text-xs text-slate-500 flex gap-4 mt-1">
                                                    {lead.details?.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {lead.details.address}</span>}
                                                    {lead.details?.emails?.[0] && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.details.emails[0]}</span>}
                                                    {lead.details?.phones?.[0] && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.details.phones[0]}</span>}
                                                    {lead.details?.instagram && <span className="flex items-center gap-1"><Instagram className="w-3 h-3" /> {lead.details.instagram}</span>}
                                                </div>
                                            </div>
                                            <select
                                                value={lead.status}
                                                onChange={(e) => updateLeadStatus(lead.name, e.target.value)}
                                                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300"
                                            >
                                                <option value="New">New</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Interested">Interested</option>
                                                <option value="Not Interested">Not Interested</option>
                                                <option value="Converted">Converted</option>
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeView === "campaigns" && (
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
                                <p className="text-slate-500 mb-8">Email, WhatsApp & SMS campaigns</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="glass-card p-6 rounded-2xl border border-white/5">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                                            <Mail className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">Email Campaign</h3>
                                        <p className="text-sm text-slate-500 mb-4">Send bulk emails via Resend/Brevo/Mailgun</p>
                                        <button className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm">
                                            Compose Email
                                        </button>
                                    </div>
                                    <div className="glass-card p-6 rounded-2xl border border-white/5">
                                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
                                            <MessageCircle className="w-6 h-6 text-green-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">WhatsApp Campaign</h3>
                                        <p className="text-sm text-slate-500 mb-4">Send bulk WhatsApp messages</p>
                                        <button className="w-full py-2.5 rounded-xl bg-green-600 text-white font-medium text-sm">
                                            Start Campaign
                                        </button>
                                    </div>
                                    <div className="glass-card p-6 rounded-2xl border border-white/5">
                                        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
                                            <Phone className="w-6 h-6 text-orange-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">SMS Campaign</h3>
                                        <p className="text-sm text-slate-500 mb-4">Send bulk SMS via Twilio</p>
                                        <button className="w-full py-2.5 rounded-xl bg-orange-600 text-white font-medium text-sm">
                                            Send SMS
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
