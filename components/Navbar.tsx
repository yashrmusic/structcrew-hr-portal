"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"}`}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl text-white">S</div>
                    <span className="text-2xl font-bold tracking-tight text-white">Struct<span className="text-blue-500">Crew</span></span>
                </Link>

                <div className="hidden md:flex items-center gap-10">
                    <Link href="#services" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Specialties</Link>
                    <Link href="#employers" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">For Employers</Link>
                    <Link href="#candidates" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Find a Job</Link>
                    <Link href="/portal" className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all flex items-center gap-2">
                        HR Portal <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <button className="md:hidden text-white p-2">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </nav>
    );
}
