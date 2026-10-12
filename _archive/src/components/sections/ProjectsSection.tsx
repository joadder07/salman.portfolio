"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Layers, Sparkles, Cpu, ShieldCheck } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { IProject } from "@/types";

// Default pre-filled projects matching agent.md guidelines
const INITIAL_PROJECTS: IProject[] = [
  {
    _id: "p1",
    title: "SHEMAS: Smart Hall Energy Monitoring & Alert System",
    description:
      "An end-to-end IoT platform engineered for institutional energy monitoring. Incorporates real-time current/voltage telemetry, anomalous surge detection, automated relay controls, and SMS/push threshold alerts.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    techStack: ["IoT (ESP32)", "MQTT", "Node.js", "MongoDB", "Tailwind CSS", "Next.js"],
    githubLink: "https://github.com",
    liveLink: "https://shemas-demo.example.com",
  },
  {
    _id: "p2",
    title: "FieldShift: CropWise AI / NASA Space Apps",
    description:
      "Developed for the NASA Space Apps Challenge to empower sustainable agriculture. Leverages satellite multispectral imagery and computer vision models to diagnose crop stressors, analyze soil moisture, and forecast yield potential.",
    imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80",
    techStack: ["Python", "PyTorch", "NASA EarthData", "Next.js", "FastAPI", "Computer Vision"],
    githubLink: "https://github.com",
    liveLink: "https://cropwise-fieldshift.example.com",
  },
  {
    _id: "p3",
    title: "AMANAT: Data Privacy & Security Framework",
    description:
      "A privacy-preserving data exchange architecture designed for sensitive enterprise and academic records. Implements client-side asymmetric encryption, role-based cryptographic access control, and tamper-evident audit logs.",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    techStack: ["Cryptography", "TypeScript", "Next.js", "Zero-Knowledge Proofs", "MongoDB"],
    githubLink: "https://github.com",
    liveLink: "https://amanat-framework.example.com",
  },
];

export function ProjectsSection() {
  const [projects, setProjects] = useState<IProject[]>(INITIAL_PROJECTS);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    // Attempt to load dynamic projects from API if available
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            setProjects(data.data);
          }
        }
      } catch {
        // Fallback to pre-fill data on error or offline
      }
    };
    fetchProjects();
  }, []);

  const categories = ["All", "IoT", "AI", "Security"];

  const filteredProjects = projects.filter((project) => {
    if (filter === "All") return true;
    if (filter === "IoT") {
      return (
        project.title.toLowerCase().includes("iot") ||
        project.techStack.some((t) => t.toLowerCase().includes("iot") || t.toLowerCase().includes("esp32"))
      );
    }
    if (filter === "AI") {
      return (
        project.title.toLowerCase().includes("ai") ||
        project.techStack.some((t) => t.toLowerCase().includes("ai") || t.toLowerCase().includes("pytorch") || t.toLowerCase().includes("vision"))
      );
    }
    if (filter === "Security") {
      return (
        project.title.toLowerCase().includes("privacy") ||
        project.techStack.some((t) => t.toLowerCase().includes("cryptography") || t.toLowerCase().includes("privacy") || t.toLowerCase().includes("security"))
      );
    }
    return true;
  });

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-semibold uppercase tracking-wider text-primary">
              <Layers className="w-3.5 h-3.5" />
              Featured Research & Engineering
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Selected Projects & Prototypes
            </h2>
            <p className="text-muted-foreground text-base">
              A curated selection of dynamic innovations ranging from connected hardware telemetries to machine learning pipelines.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  filter === cat
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project._id || project.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="group rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Project Image Banner */}
                <div className="relative h-52 w-full overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Tech stack badge overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-black/70 backdrop-blur-md text-white border border-white/10">
                      {project.techStack[0]}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="p-6 pt-0 mt-4 flex items-center justify-between border-t border-border/50">
                <div className="flex items-center gap-3 pt-4">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <GithubIcon className="w-4 h-4" />
                      <span>Code</span>
                    </a>
                  )}
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
                
                <span className="text-[11px] text-muted-foreground font-mono pt-4">
                  Verified
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ProjectsSection;
