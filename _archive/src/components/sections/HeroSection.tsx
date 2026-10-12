"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Cpu, ShieldCheck, Database } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-sky-400/10 blur-[130px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 blur-[100px] -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text / Info Column */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6"
          >
            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-card/80 backdrop-blur-md text-xs font-medium text-foreground shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Researcher & Tech Innovator</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-semibold">INRT Team</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Engineering Intelligent{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent">
                IoT & AI Systems
              </span>{" "}
              for Tomorrow
            </h1>

            {/* Short Bio emphasizing research and tech skills */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Hi, I’m a Computer Science researcher and software engineer affiliated with the{" "}
              <strong className="text-foreground font-semibold">IntelliNova Research Team (INRT)</strong> at{" "}
              <strong className="text-foreground font-semibold">Daffodil International University (DIU)</strong>.
              I architect intelligent edge devices, data privacy frameworks, and AI solutions addressing real-world challenges.
            </p>

            {/* Quick Tech Highlights Pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground border border-border">
                <Cpu className="w-3.5 h-3.5 text-blue-500" />
                IoT & Smart Sensors
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground border border-border">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                AI & Machine Learning
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground border border-border">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Data Privacy Frameworks
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground border border-border">
                <Database className="w-3.5 h-3.5 text-purple-500" />
                Full-Stack Next.js
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card/80 text-foreground font-semibold text-sm hover:bg-muted hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Get in Touch</span>
              </a>

              {/* Social Icons */}
              <div className="flex items-center gap-2 pl-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Visual / Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-sm">
              {/* Outer decorative ring */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 opacity-30 blur-lg transition duration-500 group-hover:opacity-100" />
              
              <div className="relative rounded-3xl border border-border bg-card/90 backdrop-blur-xl p-6 shadow-2xl space-y-6">
                
                {/* Profile Avatar / Photo Simulation */}
                <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 flex items-center justify-center border border-border/50">
                  {/* High-tech stylized research avatar graphic */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/30 via-transparent to-transparent" />
                  
                  <div className="relative flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-500 to-sky-400 p-1 shadow-xl">
                      <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-blue-400">
                        <Cpu className="w-12 h-12 stroke-[1.5] animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        IoT & AI Researcher
                      </h3>
                      <p className="text-xs text-blue-200/80 font-mono">
                        Daffodil International University
                      </p>
                    </div>
                  </div>

                  {/* Corner Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-white/90 font-mono">
                    DIU • INRT
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-muted/60 border border-border/60">
                    <p className="text-[11px] text-muted-foreground uppercase font-mono">Affiliation</p>
                    <p className="text-xs font-semibold text-foreground mt-0.5">INRT Research</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/60 border border-border/60">
                    <p className="text-[11px] text-muted-foreground uppercase font-mono">Focus Area</p>
                    <p className="text-xs font-semibold text-foreground mt-0.5">IoT & Applied AI</p>
                  </div>
                </div>

                {/* Key Projects Pill */}
                <div className="space-y-1.5">
                  <p className="text-[11px] text-muted-foreground uppercase font-mono tracking-wider">
                    Featured Innovations
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      SHEMAS (IoT)
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      FieldShift (NASA Apps)
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                      AMANAT (Privacy)
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;
