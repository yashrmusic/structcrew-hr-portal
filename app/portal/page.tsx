"use client";
import { useState } from "react";
import { Sparkles, Send, FileText, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PortalPage() {
    const [prompt, setPrompt] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [candidateData, setCandidateData] = useState<Record<string, string> | null>(null);

    const handleMagicParse = async () => {
        if (!prompt.trim()) return;
        setIsParsing(true);
        setCandidateData(null);
        // Simulated AI parsing — will be wired to Gemini API
        setTimeout(() => {
            setCandidateData({
                name: "Adil Khan",
                position: "Senior Site Engineer",
                salary: "45,000",
                start_date: "March 1, 2026",
                email: "adil.khan@gmail.com",
                company: "StructCrew",
            });
            setIsParsing(false);
        }, 2500);
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Top Bar */}
            <div className="sticky top-0 z-50 bg-[#0a0f1e]/80 backdrop-blur-2xl border-b border-white/[0.06]">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to StructCrew</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Portal Active</span>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 pt-12">
                {/* Header */}
                <header className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">AI-Powered</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        Agentic <span className="text-blue-400">Command</span> Center
                    </h1>
                    <p className="text-slate-500 text-lg max-w-lg">Paste any text — interview notes, WhatsApp messages — and let the agent draft the offer letter.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left Column: Magic Box (3 cols) */}
                    <div className="lg:col-span-3">
                        <div className="glass-card border-gradient p-1">
                            <div className="bg-[#0a0f1e] rounded-[21px] p-6 sm:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <Sparkles className="w-4 h-4" />
                                        <h2 className="font-semibold text-sm uppercase tracking-wider">Magic Box</h2>
                                    </div>
                                    <span className="text-[10px] text-slate-600 uppercase tracking-wider">Gemini Agent</span>
                                </div>

                                <textarea
                                    className="w-full h-56 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-300 placeholder:text-slate-700 resize-none text-sm leading-relaxed"
                                    placeholder={`Paste anything here...\n\n"Hey, we interviewed Adil Khan today for the Site Engineer role. He was great! Offer him 45k, starting March 1st. His email is adil.khan@gmail.com"`}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />

                                <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                                    <span className="text-xs text-slate-700">{prompt.length} characters</span>
                                    <button
                                        onClick={handleMagicParse}
                                        disabled={!prompt.trim() || isParsing}
                                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 disabled:hover:from-blue-600 disabled:hover:to-blue-500 transition-all duration-300 font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20"
                                    >
                                        {isParsing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Agent Working...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4" />
                                                Extract &amp; Generate
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Result (2 cols) */}
                    <div className="lg:col-span-2">
                        {candidateData ? (
                            <div className="glass-card p-8 animate-fade-in-up">
                                <h3 className="font-bold mb-6 flex items-center gap-2 text-emerald-400 text-sm uppercase tracking-wider">
                                    <CheckCircle2 className="w-4 h-4" /> Extracted Profile
                                </h3>

                                <div className="space-y-4 mb-8">
                                    {Object.entries(candidateData).map(([key, value], i) => (
                                        <div key={i} className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                                            <span className="text-slate-600 text-xs uppercase tracking-wider font-medium">{key.replace(/_/g, " ")}</span>
                                            <span className="text-white text-sm font-semibold">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    <button className="w-full py-3 rounded-xl bg-white text-[#0a0f1e] font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                                        <FileText className="w-4 h-4" /> Generate DOCX
                                    </button>
                                    <button className="w-full py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-bold text-sm hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2">
                                        <Send className="w-4 h-4" /> Email to Candidate
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="glass-card h-full min-h-[420px] flex flex-col items-center justify-center p-10 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-slate-900/60 flex items-center justify-center mb-6">
                                    <Sparkles className="w-7 h-7 text-slate-700" />
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed max-w-[200px]">
                                    Fill the Magic Box and click <strong className="text-slate-400">Extract</strong> to see parsed data here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
