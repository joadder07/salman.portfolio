import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, ShieldCheck, EyeOff, Lock } from 'lucide-react';
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
    <section id="contact" className="scroll-mt-20 sm:scroll-mt-24 pt-8 pb-3 sm:py-12 px-3 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full overflow-hidden">
      {/* ============================================================== */}
      {/* SECTION HEADER: Clean Minimalist Typography                     */}
      {/* ============================================================== */}
      <div className="scroll-reveal max-w-4xl lg:max-w-5xl mx-auto mb-4 sm:mb-6 text-left">
        {/* Elegant Section Intro / Passion Note */}
        <p className="text-xs sm:text-[13px] md:text-sm text-neutral-400 font-light italic tracking-wide leading-relaxed mb-6 sm:mb-4 md:mb-5 max-w-2xl">
          I don&apos;t consider myself a professional photographer or videographer. I simply pursue photography and videography out of passion and personal interest.
        </p>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 sm:gap-3">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 mb-0.5 sm:mb-1 block">
              Connect &amp; Collaborate
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight font-heading">
              Send a Message
            </h2>
          </div>
          <p className="text-[11px] sm:text-sm text-neutral-400 font-light leading-snug sm:leading-relaxed max-w-md">
            Reach out for collaborations, research inquiries, or drop an anonymous whisper. Whether you have a project idea, an invitation, or simply want to connect, feel free to drop a line below.
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* WIDE RECTANGULAR FORM CONTAINER (Ayatakar)                      */}
      {/* ============================================================== */}
      <div className="scroll-reveal scroll-delay-2 w-full max-w-4xl lg:max-w-5xl mx-auto">
        <div className="w-full rounded-none bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl p-2.5 sm:p-5 lg:p-6">
          {/* Mode Toggle Header: Compact Bar */}
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 sm:pb-3 sm:mb-4 border-b border-white/10">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="p-1 sm:p-2 rounded-none bg-white/5 backdrop-blur-sm text-white border border-white/10 shrink-0">
                {isAnonymous ? <EyeOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white truncate">
                  {isAnonymous ? 'ANONYMOUS MODE' : 'DIRECT CONTACT MODE'}
                </p>
                <p className="text-[9px] sm:text-[11px] text-neutral-400 font-light mt-0.5 leading-tight truncate sm:whitespace-normal">
                  {isAnonymous
                    ? 'Identity will not be collected or logged.'
                    : 'Your name and email will be transmitted.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`w-auto text-center justify-center px-2.5 py-1 sm:px-4 sm:py-2 rounded-none text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer whitespace-nowrap shrink-0 shadow-sm ${
                isAnonymous
                  ? 'bg-white text-black border-white hover:bg-neutral-200'
                  : 'bg-white/5 backdrop-blur-sm text-neutral-200 border-white/15 hover:bg-white hover:text-black hover:border-white'
              }`}
            >
              {isAnonymous ? 'ANON: ON' : 'MAKE ANONYMOUS'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-3">
            {/* Input Row: Side-by-side Name & Email on Mobile, 3 cols on Large screens */}
            {!isAnonymous ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-3">
                <Input
                  label="Name *"
                  placeholder="Your Name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  required={!isAnonymous}
                  containerClassName="space-y-0.5 sm:space-y-1"
                  labelClassName="text-[10px] sm:text-xs font-bold text-neutral-300"
                  className="h-8 sm:h-9.5 text-xs py-1 px-2.5 rounded-none bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder:text-neutral-500 focus:bg-white/10 focus:border-white/20 focus:ring-0 transition-colors"
                />
                <Input
                  label="Email *"
                  type="email"
                  placeholder="you@domain.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  required={!isAnonymous}
                  containerClassName="space-y-0.5 sm:space-y-1"
                  labelClassName="text-[10px] sm:text-xs font-bold text-neutral-300"
                  className="h-8 sm:h-9.5 text-xs py-1 px-2.5 rounded-none bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder:text-neutral-500 focus:bg-white/10 focus:border-white/20 focus:ring-0 transition-colors"
                />
                <div className="col-span-2 lg:col-span-1">
                  <Input
                    label="Subject"
                    placeholder="e.g. Collaboration / Inquiry"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    containerClassName="space-y-0.5 sm:space-y-1"
                    labelClassName="text-[10px] sm:text-xs font-bold text-neutral-300"
                    className="h-8 sm:h-9.5 text-xs py-1 px-2.5 rounded-none bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder:text-neutral-500 focus:bg-white/10 focus:border-white/20 focus:ring-0 transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div className="w-full">
                <Input
                  label="Subject"
                  placeholder="e.g. Anonymous Feedback / Inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  containerClassName="space-y-0.5 sm:space-y-1"
                  labelClassName="text-[10px] sm:text-xs font-bold text-neutral-300"
                  className="h-8 sm:h-9.5 text-xs py-1 px-2.5 rounded-none bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder:text-neutral-500 focus:bg-white/10 focus:border-white/20 focus:ring-0 transition-colors"
                />
              </div>
            )}

            {/* Message Content Textarea */}
            <div className="space-y-0.5 sm:space-y-1 text-left">
              <label className="text-[10px] sm:text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                Message Content *
              </label>
              <textarea
                rows={2}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  isAnonymous
                    ? 'Write your anonymous message freely...'
                    : 'Hi Salman, I would love to connect about...'
                }
                className="w-full h-16 sm:h-24 rounded-none bg-white/5 backdrop-blur-sm border border-white/10 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs text-white placeholder:text-neutral-500 focus:bg-white/10 focus:border-white/20 focus:outline-none transition-colors resize-none leading-relaxed"
                required
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={sendMessage.isPending}
              className="w-full py-2 sm:py-2.5 rounded-none bg-white text-black font-bold uppercase tracking-[0.2em] text-[11px] sm:text-xs hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1 shadow-xl active:scale-[0.99]"
            >
              <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{sendMessage.isPending ? 'Transmitting...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
