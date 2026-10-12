"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MessageSquare,
  Trash2,
  Mail,
  Check,
  Clock,
  Search,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Reply,
} from "lucide-react";
import { IMessage } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AdminMessagesPage() {
  const { status } = useSession();
  const router = useRouter();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.data || []);
      }
    } catch {
      setNotification({ type: "error", text: "Failed to load messages." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadMessages();
    }
  }, [status]);

  const handleToggleRead = async (message: IMessage) => {
    try {
      const res = await fetch(`/api/messages/${message._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !message.isRead }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === message._id ? { ...m, isRead: !message.isRead } : m
          )
        );
        if (selectedMessage && selectedMessage._id === message._id) {
          setSelectedMessage({ ...selectedMessage, isRead: !message.isRead });
        }
      }
    } catch {
      setNotification({ type: "error", text: "Failed to update read status." });
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotification({ type: "success", text: "Message deleted successfully!" });
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
        loadMessages();
      }
    } catch {
      setNotification({ type: "error", text: "Failed to delete message." });
    }
  };

  const handleOpenMessage = (msg: IMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      handleToggleRead(msg);
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            <span>Contact Messages</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            View inquiries, research collaborations, and messages submitted via the public contact form
          </p>
        </div>

        <div className="text-xs text-muted-foreground font-mono">
          Total: {messages.length} | Unread: {messages.filter((m) => !m.isRead).length}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold ${
            notification.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{notification.text}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="hover:opacity-75 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search inquiries by sender name, email, or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
        />
        <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Messages List */}
      {isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-mono">Loading inbox...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card space-y-3">
          <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto stroke-1" />
          <p className="text-sm font-semibold text-foreground">No messages found</p>
          <p className="text-xs text-muted-foreground">
            Messages sent from the public website contact form will be delivered here in real-time.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card overflow-hidden divide-y divide-border/60 shadow-sm">
          {filteredMessages.map((msg) => (
            <div
              key={msg._id}
              onClick={() => handleOpenMessage(msg)}
              className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/40 transition-colors cursor-pointer ${
                !msg.isRead ? "bg-primary/5" : ""
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    !msg.isRead
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Mail className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">
                      {msg.name}
                    </span>
                    {!msg.isRead && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        Unread
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    {msg.email}
                  </p>
                  <p className="text-xs text-foreground/80 line-clamp-1 max-w-xl pt-0.5">
                    {msg.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(msg.createdAt)}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleRead(msg);
                  }}
                  className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-xs"
                  title={msg.isRead ? "Mark as unread" : "Mark as read"}
                >
                  <Check className={`w-3.5 h-3.5 ${msg.isRead ? "text-emerald-500" : ""}`} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(msg._id);
                  }}
                  className="p-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs"
                  title="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative max-w-xl w-full rounded-3xl border border-border bg-card shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {selectedMessage.name}
                  </h3>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-xs text-primary hover:underline font-mono"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Date info */}
            <div className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Received on: {formatDate(selectedMessage.createdAt)}</span>
            </div>

            {/* Message Body */}
            <div className="p-5 rounded-2xl bg-muted/40 border border-border text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {selectedMessage.message}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => handleDelete(selectedMessage._id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleRead(selectedMessage)}
                  className="px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground"
                >
                  Mark as {selectedMessage.isRead ? "Unread" : "Read"}
                </button>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: Inquiry from Portfolio Website`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md shadow-primary/20 hover:opacity-95"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
