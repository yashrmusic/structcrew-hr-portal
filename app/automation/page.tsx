"use client";
import { useState, useEffect, useRef } from "react";
import { Zap, LayoutGrid, FileText, Bot, Download, LogOut, Play, Activity, Shield, ArrowLeft, Loader2, Server, Users, Briefcase, MessageSquare, Check, X } from "lucide-react";
import Link from "next/link";

interface Account {
    email: string;
    platform: string;
    company: string;
    has_session: boolean;
}

interface Company {
    name: string;
    accounts: Account[];
}

export default function AutomationPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [companies, setCompanies] = useState<Company[]>([]);
    const [activeView, setActiveView] = useState("dashboard");
    const [activeEmail, setActiveEmail] = useState("");
    const [logs, setLogs] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [isExtracting, setIsExtracting] = useState(false);
    const [parsedData, setParsedData] = useState<Record<string, string>>({});
    const logEndRef = useRef<HTMLDivElement>(null);

    const API_URL = process.env.NEXT_PUBLIC_AUTOMATION_API_URL || "http://localhost:8001";

    const pollLogs = async (email: string) => {
        try {
            const res = await fetch(`${API_URL}/api/logs/${email}?password=${password}`);
            const data = await res.json();
            setLogs(data.logs || []);
            if (!data.active) setIsRunning(false);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        if (isRunning && activeEmail) {
            const interval = setInterval(() => pollLogs(activeEmail), 2000);
            return () => clearInterval(interval);
        }
    }, [isRunning, activeEmail]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const handleLogin = async () => {
        try {
            const res = await fetch(`${API_URL}/api/auth`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            if (res.ok) {
                setIsAuthenticated(true);
                loadConfig();
            } else {
                alert("Access Denied");
            }
        } catch (e) {
            alert("Cannot connect to automation server. Make sure Python backend is running.");
        }
    };

    const loadConfig = async () => {
        try {
            const res = await fetch(`${API_URL}/api/config?password=${password}`);
            const data = await res.json();
            setCompanies(data.companies || []);
        } catch (e) {
            console.error(e);
        }
    };

    const startAction = async (email: string, action: string, platform: string) => {
        try {
            setIsRunning(true);
            setActiveEmail(email);
            setLogs([]);
            await fetch(`${API_URL}/api/run`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${password}` },
                body: JSON.stringify({ email, action, platform, headless: true }),
            });
        } catch (e) {
            console.error(e);
        }
    };

    const extractAI = async () => {
        if (!aiPrompt) return;
        setIsExtracting(true);
        try {
            const res = await fetch(`${API_URL}/api/offer/ai-parse?password=${password}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: aiPrompt }),
            });
            const data = await res.json();
            if (data.success) setParsedData(data.data);
        } catch (e) {
            alert("AI extraction failed");
        } finally {
            setIsExtracting(false);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setPassword("");
        setCompanies([]);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="glass-card p-10 rounded-3xl max-w-md w-full mx-4 border border-white/10">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white text-center mb-2">Job Automation Hub</h2>
                    <p className="text-slate-500 text-center mb-6">Access your automation core</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Control Key"
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 mb-4"
                    />
                    <button
                        onClick={handleLogin}
                        className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all"
                    >
                        Establish Link
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
                        <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Automation Active</span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 pt-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <aside className="w-64 shrink-0">
                        <div className="sticky top-24">
                            <div className="flex items-center gap-2 text-emerald-500 mb-8">
                                <Zap className="w-5 h-5" />
                                <span className="font-bold">Job Hub</span>
                            </div>
                            <nav className="space-y-6">
                                <div>
                                    <span className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-3 block">Main</span>
                                    <button
                                        onClick={() => setActiveView("dashboard")}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeView === "dashboard" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-400 hover:bg-white/5"}`}
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                        <span className="text-sm font-medium">Dashboard</span>
                                    </button>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-3 block">Recruitment</span>
                                    <button
                                        onClick={() => setActiveView("offers")}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeView === "offers" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-400 hover:bg-white/5"}`}
                                    >
                                        <FileText className="w-4 h-4" />
                                        <span className="text-sm font-medium">Offer Letters</span>
                                    </button>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-3 block">System</span>
                                    <button
                                        onClick={() => setActiveView("remote")}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeView === "remote" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-400 hover:bg-white/5"}`}
                                    >
                                        <Bot className="w-4 h-4" />
                                        <span className="text-sm font-medium">Moltbot Ready</span>
                                    </button>
                                </div>
                            </nav>
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-3 mt-8 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Shutdown</span>
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeView === "dashboard" && (
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Automation Base</h1>
                                <p className="text-slate-500 mb-8">Control & monitor your job engines</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {companies.map((company, ci) =>
                                        company.accounts.map((acc, ai) => (
                                            <div key={`${ci}-${ai}`} className="glass-card p-6 rounded-2xl border border-white/5">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-[10px] px-3 py-1 rounded-full bg-white/5 text-slate-400 font-semibold uppercase tracking-wider">
                                                        {acc.platform || "linkedin"}
                                                    </span>
                                                    <div className={`w-2 h-2 rounded-full ${acc.has_session ? "bg-emerald-500 shadow-lg shadow-emerald-500/30" : "bg-red-500"}`} />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-1">{company.name}</h3>
                                                <p className="text-sm text-slate-500 mb-4">{acc.email}</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() => startAction(acc.email, "maintain_active_job", acc.platform || "linkedin")}
                                                        disabled={isRunning && activeEmail === acc.email}
                                                        className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        {isRunning && activeEmail === acc.email ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                                        Maintain
                                                    </button>
                                                    <button
                                                        onClick={() => { setActiveEmail(acc.email); setIsRunning(true); }}
                                                        className="py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 flex items-center justify-center gap-2"
                                                    >
                                                        <Activity className="w-4 h-4" />
                                                        Monitor
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {activeEmail && (
                                    <div className="mt-8">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xs uppercase tracking-wider text-slate-500">
                                                Engine Logs: <span className="text-emerald-400">{activeEmail}</span>
                                            </span>
                                            <button onClick={() => { setActiveEmail(""); setLogs([]); }} className="text-xs text-slate-500 hover:text-white">Close</button>
                                        </div>
                                        <div className="bg-black rounded-2xl p-4 h-64 overflow-y-auto font-mono text-xs text-emerald-500 border border-white/10">
                                            {logs.map((log, i) => <div key={i} className="mb-1 opacity-80">{log}</div>)}
                                            <div ref={logEndRef} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeView === "offers" && (
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Offer Letters</h1>
                                <p className="text-slate-500 mb-8">AI-powered candidate data extraction</p>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="glass-card p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-2">AI Assistant</h3>
                                        <p className="text-sm text-slate-500 mb-4">Paste candidate notes to auto-fill</p>
                                        <textarea
                                            value={aiPrompt}
                                            onChange={(e) => setAiPrompt(e.target.value)}
                                            className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 text-sm resize-none"
                                            placeholder="Example: Rahul, architect, starts Monday, 50k salary..."
                                        />
                                        <button
                                            onClick={extractAI}
                                            disabled={isExtracting || !aiPrompt}
                                            className="mt-4 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isExtracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                                            Extract Logic
                                        </button>
                                    </div>
                                    <div className="glass-card p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-4">Extracted Data</h3>
                                        {Object.keys(parsedData).length > 0 ? (
                                            <div className="space-y-4">
                                                {Object.entries(parsedData).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between border-b border-white/5 pb-3">
                                                        <span className="text-slate-500 text-xs uppercase tracking-wider">{key}</span>
                                                        <span className="text-white text-sm font-medium">{String(value)}</span>
                                                    </div>
                                                ))}
                                                <button className="w-full py-3 mt-4 rounded-xl bg-white text-[#0a0f1e] font-bold text-sm">
                                                    Generate Letter
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-slate-600 text-sm">Extracted data will appear here</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeView === "remote" && (
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Moltbot Ready</h1>
                                <p className="text-slate-500 mb-8">Control your hub remotely via webhooks</p>
                                <div className="glass-card p-8 rounded-2xl border border-white/5 max-w-2xl">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                            <Bot className="w-6 h-6 text-emerald-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">Webhook Endpoint</h3>
                                            <p className="text-sm text-slate-500">Control your hub remotely</p>
                                        </div>
                                    </div>
                                    <div className="bg-black rounded-xl p-4 font-mono text-sm text-emerald-400 border border-dashed border-emerald-500/30 mb-4">
                                        POST /webhook/invite?email={"{email}"}&password={"{pwd}"}
                                    </div>
                                    <p className="text-xs text-slate-500">Status: <span className="text-emerald-400">Waiting for signal...</span></p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
