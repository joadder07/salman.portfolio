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
    <section id="contact" className="py-8 sm:py-12 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full overflow-hidden">
      {/* ============================================================== */}
      {/* SECTION HEADER: Clean Minimalist Typography                     */}
      {/* ============================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl lg:max-w-5xl mx-auto mb-4 sm:mb-6 flex flex-col md:flex-row md:items-end justify-between gap-3 text-left"
      >
        <div>
          <span className="text-[11px] uppercase font-bold tracking-[0.25em] text-neutral-400 mb-1 block">
            Connect &amp; Collaborate
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight font-heading">
            Send a Message
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 font-light leading-snug sm:leading-relaxed max-w-md">
          Reach out for collaborations, research inquiries, or drop an anonymous whisper. Whether you have a project idea, an invitation, or simply want to connect, feel free to drop a line below.
        </p>
      </motion.div>

      {/* ============================================================== */}
      {/* WIDE RECTANGULAR FORM CONTAINER (Ayatakar)                      */}
      {/* ============================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl lg:max-w-5xl mx-auto"
      >
        <div className="w-full rounded-none bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl p-3.5 sm:p-5 lg:p-6">
          {/* Mode Toggle Header: Full-width Horizontal Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 mb-3.5 sm:mb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 sm:p-2 rounded-none bg-white/5 backdrop-blur-sm text-white border border-white/10 shrink-0">
                {isAnonymous ? <EyeOff className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">
                  {isAnonymous ? 'ANONYMOUS MODE' : 'DIRECT CONTACT MODE'}
                </p>
                <p className="text-[10px] sm:text-[11px] text-neutral-400 font-light mt-0.5 leading-tight">
                  {isAnonymous
                    ? 'Identity will not be collected or logged.'
                    : 'Your name and email will be transmitted.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`w-full sm:w-auto text-center justify-center px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-none text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer whitespace-nowrap shrink-0 shadow-sm ${
                isAnonymous
                  ? 'bg-white text-black border-white hover:bg-neutral-200'
                  : 'bg-white/5 backdrop-blur-sm text-neutral-200 border-white/15 hover:bg-white hover:text-black hover:border-white'
              }`}
            >
              {isAnonymous ? 'ANONYMOUS: ON' : 'MAKE ANONYMOUS'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
            {/* Horizontal Input Row */}
            {!isAnonymous ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                <Input
                  label="Name *"
                  placeholder="Your Name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  required={!isAnonymous}
                  className="h-9 sm:h-9.5 text-xs py-1.5 px-3 rounded-none bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder:text-neutral-500 focus:bg-white/10 focus:border-white/20 focus:ring-0 transition-colors"
                />
                <Input
                  label="Email *"
                  type="email"
                  placeholder="you@domain.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  required={!isAnonymous}
                  className="h-9 sm:h-9.5 text-xs py-1.5 px-3 rounded-none bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder:text-neutral-500 focus:bg-white/10 focus:border-white/20 focus:ring-0 transition-colors"
                />
                <div className="sm:col-span-2 lg:col-span-1">
                  <Input
                    label="Subject"
                    placeholder="e.g. Collaboration / Inquiry"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-9 sm:h-9.5 text-xs py-1.5 px-3 rounded-none bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder:text-neutral-500 focus:bg-white/10 focus:border-white/20 focus:ring-0 transition-colors"
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
                  className="h-9 sm:h-9.5 text-xs py-1.5 px-3 rounded-none bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder:text-neutral-500 focus:bg-white/10 focus:border-white/20 focus:ring-0 transition-colors"
                />
              </div>
            )}

            {/* Message Content Textarea */}
            <div className="space-y-1 text-left">
              <label className="text-[11px] sm:text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                Message Content *
              </label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  isAnonymous
                    ? 'Write your anonymous message freely...'
                    : 'Hi Salman, I would love to connect about...'
                }
                className="w-full h-20 sm:h-24 rounded-none bg-white/5 backdrop-blur-sm border border-white/10 px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:bg-white/10 focus:border-white/20 focus:outline-none transition-colors resize-none leading-relaxed"
                required
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={sendMessage.isPending}
              className="w-full py-2.5 sm:py-3 rounded-none bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1 shadow-xl"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sendMessage.isPending ? 'Transmitting...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
