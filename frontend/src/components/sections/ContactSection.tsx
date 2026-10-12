import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare, ShieldCheck, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useSendMessage } from '@/api/interactions.api';
import toast from 'react-hot-toast';

export const ContactSection: React.FC = () => {
  const sendMessage = useSendMessage();

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!isAnonymous && (!senderName.trim() || !senderEmail.trim())) {
      toast.error('Please enter your name and email or switch to Anonymous mode');
      return;
    }

    try {
      await sendMessage.mutateAsync({
        senderName: isAnonymous ? undefined : senderName,
        senderEmail: isAnonymous ? undefined : senderEmail,
        subject: subject || undefined,
        content,
        isAnonymous,
      });

      toast.success(
        isAnonymous
          ? 'Anonymous message sent successfully!'
          : 'Message sent! Thank you for reaching out.'
      );

      // Reset form
      setSenderName('');
      setSenderEmail('');
      setSubject('');
      setContent('');
      setIsAnonymous(false);
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 border-t border-neutral-900 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-neutral-400 mb-2">
          Connect &amp; Collaborate
        </h2>
        <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          Send a Message
        </h3>
        <p className="mt-3 text-sm text-neutral-400 font-light tracking-wide">
          Reach out for collaborations, research inquiries, or drop an anonymous whisper.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="rounded-none border border-neutral-850 bg-neutral-950 p-6 sm:p-8">
          {/* Anonymous Mode Toggle Header */}
          <div className="flex items-center justify-between pb-5 mb-6 border-b border-neutral-850">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-none bg-neutral-900 text-white border border-neutral-800">
                {isAnonymous ? <EyeOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">
                  {isAnonymous ? 'Anonymous Mode' : 'Direct Contact Mode'}
                </p>
                <p className="text-[11px] text-neutral-400 font-light">
                  {isAnonymous
                    ? "Identity will not be collected or logged."
                    : 'Your name and email will be transmitted.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`px-3 py-1.5 rounded-none text-[10px] font-bold uppercase tracking-widest transition-all border cursor-pointer ${
                isAnonymous
                  ? 'bg-white text-black border-white'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              {isAnonymous ? 'Anonymous: ON' : 'Make Anonymous'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Name *"
                  placeholder="Your Name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  required={!isAnonymous}
                />
                <Input
                  label="Email *"
                  type="email"
                  placeholder="you@domain.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  required={!isAnonymous}
                />
              </div>
            )}

            <Input
              label="Subject"
              placeholder="e.g. Research Collaboration / Inquiry"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                Message Content *
              </label>
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  isAnonymous
                    ? 'Write your anonymous message freely...'
                    : 'Hi Salman, I would love to connect about...'
                }
                className="w-full rounded-none border border-neutral-800 bg-black/80 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={sendMessage.isPending}
              className="w-full py-4 rounded-none bg-white text-black font-bold uppercase tracking-[0.22em] text-xs hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sendMessage.isPending ? 'Transmitting...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
