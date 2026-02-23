import { ArrowUpRight, Building2, HardHat, Compass } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-950">
            {/* Decorative Orbs */}
            <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Pioneering Architectural Recruitment</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
                        Building the <span className="text-blue-500">Infrastructure</span> of Human Capital.
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
                        StructCrew connects elite architects, engineers, and construction professionals with the world's most ambitious projects.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5">
                        <button className="px-8 py-4 rounded-xl bg-white text-slate-950 font-bold text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2 group">
                            Post a Position <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 rounded-xl bg-slate-800 text-white font-bold text-lg border border-white/10 hover:bg-slate-700 transition-all">
                            Apply for Roles
                        </button>
                    </div>
                </div>

                {/* Floating Icons */}
                <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {[
                        { icon: Compass, label: "Architecture", color: "text-blue-400" },
                        { icon: Building2, label: "Construction", color: "text-emerald-400" },
                        { icon: HardHat, label: "Engineering", color: "text-amber-400" },
                        { icon: Building2, label: "Interior Design", color: "text-purple-400" },
                    ].map((item, i) => (
                        <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm flex items-center gap-4 group hover:border-white/10 hover:bg-white/[0.05] transition-all">
                            <div className={`p-3 rounded-lg bg-slate-900 ${item.color}`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-white/80 group-hover:text-white transition-colors">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
