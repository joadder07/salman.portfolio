import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { FadeUpHeading } from '@/components/ui';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="w-full min-h-screen py-20 sm:py-36 px-4 xs:px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto">
      {/* Top Navigation: Back to Home */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 sm:mb-12"
      >
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.22em] text-neutral-400 hover:text-white transition-colors duration-200"
          title="Return to Home"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>
      </motion.div>

      {/* Main Header with tall, bold, condensed typography */}
      <FadeUpHeading className="mb-14 sm:mb-20">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-neutral-400 mb-2 sm:mb-3">
          Biography &amp; Life Story
        </p>
        <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-white leading-none font-heading">
          ABOUT SALMAN
        </h1>
        <div className="hidden sm:block w-20 h-0.5 bg-white/20 mt-6 sm:mt-8" />
      </FadeUpHeading>

      {/* Intro Lead Block & Opening Philosophy */}
      <FadeUpHeading className="mb-16 sm:mb-20">

        <div className="space-y-5 sm:space-y-6 text-base sm:text-lg md:text-xl text-neutral-200 font-light leading-relaxed">
          <p className="text-lg xs:text-xl sm:text-2xl font-normal text-white italic">
            What happens when a curious mind refuses to stay in one box?
          </p>
          <p>
            You might find me building an IoT-based machine one day, researching healthcare or agricultural problems the next, capturing stories through my camera, painting in my free time, or taking care of plants on my rooftop. I&apos;ve never wanted my life to be about just one thing. I want to explore, create, learn, and experience as much of the world as I can.
          </p>
          <p>
            I&apos;m a Public Health student at Daffodil International University, originally from Sherpur, Bangladesh. My interests lie at the intersection of science, technology, research, and creativity. Beyond academic titles and technical skills, I&apos;m simply someone who loves discovering new things and turning ideas into reality.
          </p>
        </div>
      </FadeUpHeading>

      {/* Main Narrative Chapters with Generous Spacing */}
      <div className="space-y-16 sm:space-y-24">
        {/* Chapter 1: My Journey */}
        <FadeUpHeading className="space-y-6 pt-6 border-t-0 sm:border-t border-white/10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
            My Journey
          </h2>
          <div className="space-y-5 text-lg sm:text-xl text-neutral-300 font-light leading-relaxed">
            <p>
              My journey has taken a few unexpected turns, and I think that&apos;s what makes it interesting.
            </p>
            <p>
              I spent two months studying at a madrasa. Later, driven by my curiosity about rural life, I spent a year studying at a school in a remote village far from my hometown. Although I continued living in town, I travelled to the village to attend school because I wanted to experience rural life firsthand and see the world from a different perspective.
            </p>
            <p>
              I was also a fast bowler for the Sherpur cricket team and participated in live drama performances during my school years. These experiences allowed me to explore different sides of myself, from sports and teamwork to creativity and storytelling.
            </p>
            <p>
              After completing my SSC, I moved to Dhaka for higher education.
            </p>
            <p className="text-white font-normal italic">
              I believe life doesn&apos;t always need a fixed plan. Sometimes, the most memorable experiences begin with nothing more than curiosity.
            </p>
          </div>
        </FadeUpHeading>

        {/* Chapter 2: Research, Technology & Innovation */}
        <FadeUpHeading className="space-y-6 pt-6 border-t-0 sm:border-t border-white/10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
            Research, Technology &amp; Innovation
          </h2>
          <div className="space-y-5 text-lg sm:text-xl text-neutral-300 font-light leading-relaxed">
            <p>
              I&apos;m currently pursuing my degree in Public Health at Daffodil International University and working with IntelliNova Research Team (INRT), where I explore research and innovation in the medical and agricultural sectors.
            </p>
            <p>
              My interests include the Internet of Things (IoT), Artificial Intelligence (AI), Machine Learning (ML), and development. I enjoy taking an idea, understanding a problem, experimenting with possible solutions, and gradually turning it into something practical.
            </p>
            <p>
              For me, research isn&apos;t just about finding answers. It&apos;s about asking better questions, exploring possibilities, and creating solutions that can improve people&apos;s lives. I hope to contribute to meaningful research and develop innovative technologies for real-world challenges.
            </p>
          </div>
        </FadeUpHeading>

        {/* Chapter 3: Behind the Camera */}
        <FadeUpHeading className="space-y-6 pt-6 border-t-0 sm:border-t border-white/10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
            Behind the Camera
          </h2>
          <div className="space-y-5 text-lg sm:text-xl text-neutral-300 font-light leading-relaxed">
            <p className="text-white font-normal italic">
              Not everything I love can be explained through research papers or lines of code.
            </p>
            <p>
              I&apos;m passionate about photography and documentary filmmaking because they allow me to see ordinary things differently. A person&apos;s expression, a quiet village, a familiar street, or a small everyday moment can hold a story worth telling.
            </p>
            <p>
              Through photography, I capture moments; through filmmaking, I explore and share stories. I enjoy observing people, places, and experiences and expressing their stories through visuals.
            </p>
            <p>
              I want to create work that people can connect with, learn from, and remember.
            </p>
          </div>
        </FadeUpHeading>

        {/* Chapter 4: The Little Things That Make Life Beautiful */}
        <FadeUpHeading className="space-y-6 pt-6 border-t-0 sm:border-t border-white/10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
            The Little Things That Make Life Beautiful
          </h2>
          <div className="space-y-5 text-lg sm:text-xl text-neutral-300 font-light leading-relaxed">
            <p>
              Away from university and research, I enjoy painting, cooking, listening to music, caring for pets, and gardening on my rooftop at home.
            </p>
            <p>
              I love creating things with my own hands, whether it&apos;s a painting, a meal, a machine, or a small garden full of growing plants. I also enjoy travelling, discovering unfamiliar places, and finding happiness in simple everyday moments.
            </p>
            <p>
              My interests may seem different from one another, but they all give me opportunities to explore, express myself, and learn. I don&apos;t want to spend my entire life doing only what I already know. I want to keep discovering what else I might enjoy and what else I might become.
            </p>
          </div>
        </FadeUpHeading>

        {/* Chapter 5: My Roots, My Family */}
        <FadeUpHeading className="space-y-6 pt-6 border-t-0 sm:border-t border-white/10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
            My Roots, My Family
          </h2>
          <div className="space-y-5 text-lg sm:text-xl text-neutral-300 font-light leading-relaxed">
            <p>
              No matter how far I travel or how much I achieve, my roots will always be an important part of my story.
            </p>
            <p>
              I was born in Sherpur, Bangladesh, and my family has connections to Sirajganj, where my grandparents&apos; homes are. I&apos;m one of three siblings, and my family has always been a major source of strength in my life.
            </p>
            <p>
              My parents have consistently supported my interests and ambitions. My elder brother, Asif Joadder, has been one of my greatest sources of motivation and encouragement. His support means a great deal to me and inspires me to keep learning, dreaming, and moving forward.
            </p>
            <p>
              I have many ambitions, but making my family happy, giving them beautiful experiences, and travelling with them to places we&apos;ve always wanted to visit are among my biggest personal dreams.
            </p>
            <p className="text-white font-normal italic">
              To me, success means much more when the people who supported you can share in your happiness.
            </p>
          </div>
        </FadeUpHeading>

        {/* Chapter 6: Dreams Beyond the Horizon */}
        <FadeUpHeading className="space-y-6 pt-6 border-t-0 sm:border-t border-white/10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
            Dreams Beyond the Horizon
          </h2>
          <div className="space-y-5 text-lg sm:text-xl text-neutral-300 font-light leading-relaxed">
            <p>
              I have a long list of things I want to do in life, and I hope it never becomes shorter.
            </p>
            <p>
              I want to conduct meaningful research, develop new technologies, build innovative machines, and contribute to solutions that improve healthcare and agriculture. I want to collaborate with people who think differently, explore new ideas, and keep challenging myself to grow.
            </p>
            <p>
              Beyond my professional ambitions, I dream of travelling across Bangladesh and around the world with my family. I want to discover new cultures, meet different people, photograph beautiful places, and document experiences that might otherwise go unnoticed.
            </p>
            <p>
              I want to keep creating, learning, exploring, and enjoying the little things that make life worth living. I know I won&apos;t have everything figured out, and I&apos;m perfectly fine with that. There is still so much to learn, so much to explore, and so much to create.
            </p>
          </div>
        </FadeUpHeading>

        {/* Chapter 7: Still Becoming Who I Want to Be */}
        <FadeUpHeading className="space-y-6 pt-6 border-t-0 sm:border-t border-white/10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
            Still Becoming Who I Want to Be
          </h2>
          <div className="space-y-5 text-lg sm:text-xl text-neutral-300 font-light leading-relaxed">
            <p className="text-white font-normal italic">
              I believe we don&apos;t have to be just one thing.
            </p>
            <p>
              I can be a Public Health student who loves technology, a researcher who enjoys photography, a developer who paints, and an explorer who finds happiness in simple moments. These aren&apos;t separate versions of me; they&apos;re all parts of the same person.
            </p>
            <p>
              I&apos;m still learning, experimenting, making mistakes, and discovering where my interests might take me. I don&apos;t know exactly what my future will look like, but I know the kind of life I want to build: one filled with meaningful research, creative freedom, family, adventure, and ideas that leave something good behind.
            </p>
            <p>
              I&apos;m here to learn what I can, create what I imagine, explore what I don&apos;t know, and make the most of the life I get to live.
            </p>
            <div className="pt-4">
              <p className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white font-heading border-l-2 border-white pl-4 py-1">
                And this is only the beginning of my story.
              </p>
            </div>
          </div>
        </FadeUpHeading>
      </div>

      {/* Bottom Navigation & Call to Action */}
      <motion.footer
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-20 sm:mt-28 pt-10 sm:pt-14 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <Link
          to="/"
          className="group inline-flex items-center gap-3 px-6 py-3 border border-white/20 bg-black/40 hover:bg-white hover:text-black hover:border-white text-white text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        <a
          href="/#contact"
          className="text-xs uppercase font-bold tracking-[0.25em] text-neutral-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-2"
        >
          <span>Get in touch</span>
          <span className="text-white">→</span>
        </a>
      </motion.footer>
    </div>
  );
};

export default AboutPage;
