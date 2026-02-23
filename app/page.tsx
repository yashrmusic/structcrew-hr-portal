export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-950 text-white">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-8">
                    StructCrew <span className="text-blue-500">HR Portal</span>
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-400">Magic Paste</h2>
                    <p className="text-slate-400 mb-6">Paste interview notes or chat history to generate an offer letter instantly using AI.</p>
                    <button className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all font-medium">
                        Open Magic Box
                    </button>
                </div>

                <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                    <h2 className="text-2xl font-semibold mb-4 text-emerald-400">Offer Tracking</h2>
                    <p className="text-slate-400 mb-6">Monitor pending signatures and download signed PDF records.</p>
                    <button className="w-full py-3 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-all font-medium">
                        View Analytics
                    </button>
                </div>
            </div>

            <footer className="mt-24 text-slate-500 text-sm">
                Powered by Antigravity Agentic Systems
            </footer>
        </main>
    );
}
