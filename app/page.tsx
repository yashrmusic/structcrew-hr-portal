import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
    return (
        <>
            <Navbar />
            <Hero />

            {/* Featured Roles Section */}
            <section id="services" className="py-24 bg-slate-950 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Expertise in Specialized <span className="text-blue-500">Staffing.</span></h2>
                            <p className="text-lg text-slate-400">From concept to completion, we provide the talent that drives the built environment.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.05] to-transparent hover:border-blue-500/30 transition-all group">
                            <h3 className="text-xl font-bold mb-4 text-white">Full-Cycle Recruitment</h3>
                            <p className="text-slate-400 leading-relaxed mb-6">Deep market intelligence and a robust network of passive architecture and design candidates.</p>
                            <div className="w-12 h-1 bg-blue-600 rounded-full group-hover:w-24 transition-all" />
                        </div>

                        <div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.05] to-transparent hover:border-emerald-500/30 transition-all group">
                            <h3 className="text-xl font-bold mb-4 text-white">Construction Leadership</h3>
                            <p className="text-slate-400 leading-relaxed mb-6">Connecting projects with Project Managers, Site Superintendents, and VDC professionals.</p>
                            <div className="w-12 h-1 bg-emerald-600 rounded-full group-hover:w-24 transition-all" />
                        </div>

                        <div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.05] to-transparent hover:border-amber-500/30 transition-all group">
                            <h3 className="text-xl font-bold mb-4 text-white">Technical Consulting</h3>
                            <p className="text-slate-400 leading-relaxed mb-6">Strategic advice on team scaling and specialized talent acquisition for modern AEC firms.</p>
                            <div className="w-12 h-1 bg-amber-600 rounded-full group-hover:w-24 transition-all" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Branding */}
            <footer className="py-20 bg-slate-950 border-t border-white/5 text-center">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-2xl text-white mb-6">S</div>
                    <p className="text-slate-500 max-w-xs mb-8">Specialized recruitment for the architecture, engineering, and construction world.</p>
                    <div className="flex gap-8 text-sm font-medium text-slate-400">
                        <span>© 2026 StructCrew</span>
                        <span>Terms</span>
                        <span>Privacy</span>
                    </div>
                </div>
            </footer>
        </>
    );
}
