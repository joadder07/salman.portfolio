"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users, Cpu, Code2, Award, BookOpen, Layers, Terminal } from "lucide-react";

export function AboutSection() {
  const highlights = [
    {
      icon: GraduationCap,
      title: "Education",
      subtitle: "Daffodil International University (DIU)",
      description: "Department of Computer Science & Engineering. Rigorous coursework in algorithms, distributed systems, embedded architectures, and data intelligence.",
      badge: "DIU Alum / Student",
      color: "from-blue-600 to-indigo-600",
    },
    {
      icon: Users,
      title: "Research Affiliation",
      subtitle: "IntelliNova Research Team (INRT)",
      description: "Active researcher collaborating on applied machine learning, IoT telemetry platforms, and privacy-preserving distributed frameworks.",
      badge: "INRT Core Member",
      color: "from-indigo-600 to-sky-600",
    },
    {
      icon: Award,
      title: "Innovations & Hackathons",
      subtitle: "NASA Space Apps & Tech Competitions",
      description: "Recognized for FieldShift (CropWise AI) in NASA Space Apps Challenge, and developed SHEMAS for smart campus energy optimization.",
      badge: "Hackathon Finalist",
      color: "from-sky-600 to-cyan-600",
    },
  ];

  const skillCategories = [
    {
      title: "IoT & Hardware Engineering",
      icon: Cpu,
      skills: ["ESP32 / NodeMCU", "Sensor Integration", "MQTT & WebSocket Telemetry", "Edge Analytics", "Arduino / C++"],
    },
    {
      title: "AI & Machine Learning",
      icon: Layers,
      skills: ["Computer Vision", "Predictive Modeling", "Python / PyTorch / Scikit-learn", "Satellite Data Processing", "NLP"],
    },
    {
      title: "Full-Stack & Cloud",
      icon: Code2,
      skills: ["Next.js (App Router)", "TypeScript / React", "Node.js & Route Handlers", "MongoDB & Mongoose", "Tailwind CSS v4"],
    },
    {
      title: "Security & Frameworks",
      icon: Terminal,
      skills: ["Data Privacy Architecture", "API Security & NextAuth", "Cloudinary Media Pipelines", "Git / GitHub Actions"],
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-semibold uppercase tracking-wider text-primary">
            <BookOpen className="w-3.5 h-3.5" />
            Background & Expertise
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Bridging Academic Research with Real-World Engineering
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Dedicated to solving complex socio-technological problems through rigorous research, embedded systems, and scalable full-stack software.
          </p>
        </div>

        {/* Education & Affiliation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md shadow-blue-500/10`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-muted border border-border text-foreground">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold text-primary mb-3">
                    {item.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center text-xs text-muted-foreground">
                  <span>Verified credentials</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bengali font tribute banner */}
        <div className="mb-16 p-6 rounded-2xl border border-border/80 bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-sky-900/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-foreground flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি ও ইন্টেলিনোভা রিসার্চ টিম
            </h4>
            <p className="text-xs text-muted-foreground font-bengali">
              প্রযুক্তিগত উদ্ভাবন, আইওটি ভিত্তিক স্মার্ট সল্যুশন এবং গবেষণায় আমরা অঙ্গীকারবদ্ধ।
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-card border border-border text-[11px] font-mono text-muted-foreground">
            Bangla Font Support: Active
          </div>
        </div>

        {/* Technical Skills Matrix */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-foreground text-center sm:text-left">
            Core Competencies & Tooling
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillCategories.map((cat, idx) => {
              const CatIcon = cat.icon;
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-5 space-y-3"
                >
                  <div className="flex items-center gap-2.5 text-foreground font-semibold text-sm">
                    <CatIcon className="w-4 h-4 text-primary" />
                    <span>{cat.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border/70 hover:text-foreground transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

export default AboutSection;
