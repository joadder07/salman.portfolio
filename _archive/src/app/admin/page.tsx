"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers,
  Image as ImageIcon,
  MessageSquare,
  ArrowRight,
  Plus,
  Clock,
  ExternalLink,
  Shield,
  Loader2,
} from "lucide-react";
import { IProject, IGalleryItem, IMessage } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [projectsCount, setProjectsCount] = useState<number>(0);
  const [galleryCount, setGalleryCount] = useState<number>(0);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      const loadStats = async () => {
        setIsLoading(true);
        try {
          const [pRes, gRes, mRes] = await Promise.all([
            fetch("/api/projects"),
            fetch("/api/gallery"),
            fetch("/api/messages"),
          ]);

          if (pRes.ok) {
            const pData = await pRes.json();
            setProjectsCount(pData.data?.length || 0);
          }

          if (gRes.ok) {
            const gData = await gRes.json();
            setGalleryCount(gData.data?.length || 0);
          }

          if (mRes.ok) {
            const mData = await mRes.json();
            const msgs: IMessage[] = mData.data || [];
            setMessages(msgs);
            setUnreadCount(msgs.filter((m) => !m.isRead).length);
          }
        } catch (error) {
          console.error("Failed to load dashboard stats:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadStats();
    }
  }, [status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-mono">Loading dashboard metrics...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Featured Projects",
      value: projectsCount,
      description: "Active IoT & AI projects in showcase",
      href: "/admin/projects",
      icon: Layers,
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "Gallery Media",
      value: galleryCount,
      description: "Photos & event videos archived",
      href: "/admin/gallery",
      icon: ImageIcon,
      color: "from-indigo-600 to-sky-600",
    },
    {
      title: "Inquiries & Messages",
      value: messages.length,
      badge: unreadCount > 0 ? `${unreadCount} unread` : undefined,
      description: "Contact inquiries received",
      href: "/admin/messages",
      icon: MessageSquare,
      color: "from-sky-600 to-emerald-600",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      
      {/* Welcome Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-border bg-gradient-to-r from-blue-900/10 via-card to-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back, {session?.user?.name || "Admin"}
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono border border-emerald-500/20">
              Authenticated
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage your research portfolio, media highlights, and visitor communications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md shadow-primary/20 hover:opacity-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs font-semibold hover:bg-muted transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Media</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group p-6 rounded-3xl border border-border bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-md shadow-blue-500/20`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {card.badge && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {card.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                  {card.title}
                </p>
                <h3 className="text-3xl font-extrabold text-foreground mt-1 mb-2">
                  {card.value}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary group-hover:underline">
                <span>Manage</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Contact Submissions */}
      <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Recent Visitor Inquiries
            </h3>
            <p className="text-xs text-muted-foreground">
              Messages received through your public contact form
            </p>
          </div>
          <Link
            href="/admin/messages"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {messages.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs rounded-2xl border border-dashed border-border">
            No contact messages yet. Inquiries will appear here when visitors reach out.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {messages.slice(0, 4).map((msg) => (
              <div
                key={msg._id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">
                      {msg.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({msg.email})
                    </span>
                    {!msg.isRead && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 max-w-xl">
                    {msg.message}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(msg.createdAt)}
                  </span>
                  <Link
                    href="/admin/messages"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-muted/60 text-foreground hover:bg-muted"
                  >
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
