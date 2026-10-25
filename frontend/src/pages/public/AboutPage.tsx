import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { FadeUpHeading } from '@/components/ui';
import { useSiteSettings } from '@/api/settings.api';

// Default moody cinematic portrait fallback (matches Rory Kramer aesthetic)
export const DEFAULT_ABOUT_STORY_HERO =
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2000&auto=format&fit=crop';

// Reusable Quote/Callout Block with elegant dark card and left border accent styling
const QuoteBlock: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`my-7 sm:my-9 p-5 sm:p-6 md:p-7 bg-[#121212]/90 bg-dark-grunge border border-white/10 border-l-2 sm:border-l-[3px] border-l-white rounded-r-xl shadow-lg shadow-black/40 ${className}`}
  >
    <p className="text-base sm:text-lg md:text-xl text-neutral-100 font-light italic leading-relaxed">
      {children}
    </p>
  </div>
);

export const AboutPage: React.FC = () => {
  const { data: settings } = useSiteSettings();
  const heroImage = settings?.aboutHeroImage || DEFAULT_ABOUT_STORY_HERO;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = "Salman's Story | Biography & Life Story";
  }, []);

  return (
    <div className="w-full min-h-screen bg-dark-grunge bg-[#0a0a0a] text-white">
      {/* ============================================================== */}
      {/* TOP HERO BANNER: Cinematic Moody Portrait in Rory Kramer Style */}
      {/* ============================================================== */}
      <section className="relative w-full overflow-hidden select-none bg-[#0a0a0a]">
        {/* Curved / Arc-Shaped Hero Image Container */}
        <div
          className="relative w-full h-[320px] xs:h-[360px] sm:h-[420px] md:h-[460px] lg:h-[500px] overflow-hidden bg-black"
          style={{
            clipPath: 'ellipse(80% 100% at 50% 0%)',
            WebkitClipPath: 'ellipse(80% 100% at 50% 0%)',
          }}
        >
          {/* Full-bleed Portrait in Vibrant Original Colors */}
          <img
            src={heroImage}
            alt="Salman's Story"
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
          />

          {/* Top Vignette Overlay for Natural Image Display & Flawless Navbar Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-transparent pointer-events-none" />

          {/* Right Shadow & Edge Vignette to make typography pop */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/85 pointer-events-none" />

          {/* Floating Back to Home Shortcut Button - Compact & Neatly Styled */}
          <div className="absolute top-20 sm:top-24 left-4 xs:left-6 sm:left-12 lg:left-20 z-20">
            <Link
              to="/"
              className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/15 text-[10px] sm:text-[11px] font-medium tracking-widest uppercase text-white/70 hover:text-white hover:border-white/40 hover:bg-black/60 transition-all duration-200"
              title="Return to Home"
            >
              <ArrowLeft className="w-3 h-3 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Sleek, Noticeably Smaller, Well-Proportioned Title Overlaid on the Right */}
          <div className="absolute inset-0 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 flex items-center justify-end z-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-right pointer-events-auto pr-2 sm:pr-6 md:pr-12 space-y-1"
            >
              <h1
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold uppercase tracking-wider text-white leading-none font-heading"
                style={{
                  fontFamily: "'Bebas Neue', 'Oswald', sans-serif",
                }}
              >
                SALMAN&apos;S STORY
              </h1>
              <p className="text-[10px] sm:text-xs text-neutral-300/80 font-light tracking-widest uppercase">
                A Curious Mind &bull; A Creative Soul
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MAIN NARRATIVE ARTICLE CONTENT                                  */}
      {/* ============================================================== */}
      <div className="w-full py-12 sm:py-20 px-4 xs:px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto">
        {/* Intro Lead Block & Opening Philosophy */}
        <FadeUpHeading className="mb-20 sm:mb-28 space-y-6">
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
            <span>00</span>
            <span className="w-8 h-px bg-white/20" />
            <span>PROLOGUE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
            A CURIOUS MIND &bull; A CREATIVE SOUL
          </h2>

          <div className="space-y-5 sm:space-y-6 text-base sm:text-lg md:text-xl text-neutral-300 font-light leading-relaxed">
            <QuoteBlock>
              What happens when a curious mind refuses to stay in one box?
            </QuoteBlock>

            <p>
              You might find me exploring a quiet village with my camera, researching a healthcare problem, editing a documentary, painting something in my free time, listening to music late at night, or taking care of plants on my rooftop. Sometimes, you&apos;ll find me working on a new idea; other times, I&apos;ll simply be enjoying the little things that make life beautiful.
            </p>

            <p>
              I&apos;ve never wanted to limit myself to just one identity. I want to explore different worlds, experience different perspectives, learn things I&apos;ve never known, and collect stories worth remembering.
            </p>

            <p>
              I&apos;m a Public Health student at Daffodil International University, originally from Sherpur, Bangladesh. My interests span research, photography, filmmaking, music, travelling, and creative exploration. I enjoy understanding how things work, observing the world around me, and finding meaningful ways to express what I experience.
            </p>

            <p className="text-white font-normal">
              But beyond my academic background, interests, and ambitions, I&apos;m simply someone who wants to experience life fully, stay curious, and make the most of the time I have.
            </p>
          </div>
        </FadeUpHeading>

        {/* Main Narrative Chapters with Generous Spacing */}
        <div className="space-y-20 sm:space-y-28">
          {/* Chapter 1: My Journey: A Life Beyond the Ordinary */}
          <FadeUpHeading className="space-y-6 pt-10 border-t border-white/10">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
              <span>01</span>
              <span className="w-8 h-px bg-white/20" />
              <span>Chapter</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
              My Journey: A Life Beyond the Ordinary
            </h2>

            <div className="space-y-5 sm:space-y-6 text-base sm:text-lg md:text-xl text-neutral-300 font-light leading-relaxed">
              <p>
                My journey hasn&apos;t followed a perfectly planned path, and honestly, I like it that way.
              </p>

              <p>
                I spent two months studying at a madrasa, an experience that became a small but unique part of my early life. Later, driven by my curiosity about rural life, I spent a year attending school in a remote village far from my hometown. I continued living in town and travelled to the village for school because I wanted to experience a different environment and understand a way of life beyond what I was familiar with.
              </p>

              <p>
                That experience gave me a different perspective on everyday life. It allowed me to observe people, places, and experiences that I might not otherwise have encountered.
              </p>

              <p>
                During my school years, I also played as a fast bowler for the Sherpur cricket team and participated in live drama performances. Cricket taught me about teamwork and discipline, while drama gave me an opportunity to explore expression, performance, and storytelling.
              </p>

              <p>
                After completing my SSC, I moved to Dhaka to continue my education and pursue new opportunities.
              </p>

              <p>
                Looking back, I realise that many of the experiences that shaped me weren&apos;t necessarily part of a grand plan. Some came from curiosity, some from unexpected opportunities, and others simply from wanting to try something different.
              </p>

            <QuoteBlock>
              I&apos;ve learned that sometimes, the most interesting journeys begin when you dare to step outside your familiar world.
            </QuoteBlock>
            </div>
          </FadeUpHeading>

          {/* Chapter 2: Research, Curiosity & Meaningful Ideas */}
          <FadeUpHeading className="space-y-6 pt-10 border-t border-white/10">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
              <span>02</span>
              <span className="w-8 h-px bg-white/20" />
              <span>Chapter</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
              Research, Curiosity &amp; Meaningful Ideas
            </h2>

            <div className="space-y-5 sm:space-y-6 text-base sm:text-lg md:text-xl text-neutral-300 font-light leading-relaxed">
              <p>
                I&apos;m currently pursuing my degree in Public Health at Daffodil International University and working with IntelliNova Research Team (INRT), where I explore research and innovation related to healthcare and agriculture.
              </p>

              <p>
                What interests me most about Public Health is its connection to everyday life. Health isn&apos;t just about hospitals, medicines, or medical reports. It&apos;s also about people, communities, their environments, their living conditions, and the challenges they face.
              </p>

              <p>
                I enjoy exploring questions, understanding problems, and learning how research can contribute to meaningful change. I&apos;m particularly interested in healthcare research, agricultural challenges, and the possibilities of using technology to address real-world problems.
              </p>

              <p>
                Beyond academics, I enjoy experimenting with ideas and collaborating with people who bring different perspectives to the table. I believe some of the most interesting solutions emerge when people from different backgrounds work together.
              </p>

              <p>
                For me, research is not simply about publishing papers or finding answers. It&apos;s about asking better questions, remaining open to new possibilities, and contributing something useful to the world.
              </p>

            <QuoteBlock>
              I&apos;m still learning, and I have a long way to go. But I hope to build a future where my curiosity translates into meaningful work that can make a difference in people&apos;s lives.
            </QuoteBlock>
            </div>
          </FadeUpHeading>

          {/* Chapter 3: Behind the Camera: Stories Worth Telling */}
          <FadeUpHeading className="space-y-6 pt-10 border-t border-white/10">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
              <span>03</span>
              <span className="w-8 h-px bg-white/20" />
              <span>Chapter</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
              Behind the Camera: Stories Worth Telling
            </h2>

            <div className="space-y-5 sm:space-y-6 text-base sm:text-lg md:text-xl text-neutral-300 font-light leading-relaxed">
              <p>
                Photography and documentary filmmaking hold a special place in my life.
              </p>

              <p>
                I&apos;ve always enjoyed observing things that people might overlook: a stranger&apos;s expression, a quiet village road, the atmosphere of an unfamiliar place, or a small moment that would otherwise disappear into the routine of everyday life.
              </p>

              <p>
                To me, a camera is more than a device for taking pictures. It&apos;s a way of observing the world, preserving memories, and telling stories without always needing words.
              </p>

              <p>
                Photography allows me to capture a moment, while filmmaking gives me the opportunity to explore the story behind it.
              </p>

              <p>
                I enjoy the entire creative process, from observing and planning to recording footage, editing, and bringing different pieces together to create something meaningful.
              </p>

              <p>
                I&apos;m particularly drawn to documentary-style storytelling because real people and real experiences often carry stories that deserve to be seen and heard.
              </p>

              <p>
                I want to create visual work that makes people pause for a moment, feel something, discover a new perspective, or see something familiar in a different way.
              </p>

            <QuoteBlock>
              I may not have every story figured out yet, but I know I want to keep telling them.
            </QuoteBlock>
            </div>
          </FadeUpHeading>

          {/* Chapter 4: Music, Memories & A Community of 250K+ */}
          <FadeUpHeading className="space-y-6 pt-10 border-t border-white/10">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
              <span>04</span>
              <span className="w-8 h-px bg-white/20" />
              <span>Chapter</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
              Music, Memories &amp; A Community of 250K+
            </h2>

            <div className="space-y-5 sm:space-y-6 text-base sm:text-lg md:text-xl text-neutral-300 font-light leading-relaxed">
              <p>
                Music has been another meaningful part of my journey.
              </p>

              <p>
                During my school years, I managed a Facebook and Instagram music page called <span className="text-white font-normal">Bangla Music We Relate To</span>, which grew to more than 250,000 followers.
              </p>

              <p>
                What began as an interest in music became an opportunity to connect with a large community of people who shared similar emotions, experiences, and musical tastes.
              </p>

              <p>
                Managing the page was more than simply posting songs or sharing content. It allowed me to explore my creative side, understand what resonates with an audience, and see how music can bring together people who have never met but somehow relate to the same lyrics.
              </p>

              <p>
                Sometimes, a song expresses something we struggle to explain ourselves. A few lines can remind us of a person, a memory, a difficult phase, or a feeling we thought nobody else understood.
              </p>

              <p>
                I found that connection between music and human emotions fascinating.
              </p>

              <p>
                Looking back, managing a community of more than 250K followers remains one of the most memorable experiences of my school life. It taught me valuable lessons about consistency, creativity, audience engagement, and the power of shared experiences.
              </p>

              <p>
                More importantly, it reminded me that even something as simple as music can create a sense of connection among thousands of strangers.
              </p>

            <QuoteBlock>
              And perhaps that&apos;s one of the reasons I continue to love music: it gives people a way to feel understood, even without knowing one another.
            </QuoteBlock>
            </div>
          </FadeUpHeading>

          {/* Chapter 5: The Little Things That Make Life Beautiful */}
          <FadeUpHeading className="space-y-6 pt-10 border-t border-white/10">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
              <span>05</span>
              <span className="w-8 h-px bg-white/20" />
              <span>Chapter</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
              The Little Things That Make Life Beautiful
            </h2>

            <div className="space-y-5 sm:space-y-6 text-base sm:text-lg md:text-xl text-neutral-300 font-light leading-relaxed">
              <p>
                Not every part of my life revolves around university, research, or future ambitions.
              </p>

              <p>
                Some of my happiest moments come from the simplest things.
              </p>

              <p>
                I enjoy painting, cooking, listening to music, caring for pets, and gardening on my rooftop at home. I love the feeling of creating something with my own hands, whether it&apos;s a painting, a meal, or a small garden filled with growing plants.
              </p>

              <p>
                I&apos;ve also had a special connection with animals since childhood. Taking care of pets has been one of the experiences that brought happiness into my life, and I&apos;ve always enjoyed the responsibility and companionship that come with it.
              </p>

              <p>
                I find something peaceful about gardening, too. Watching a small plant grow reminds me that meaningful things often require patience, consistency, and care.
              </p>

              <p>
                Travelling is another thing I love. I&apos;m drawn to unfamiliar places, different cultures, local lifestyles, and the unexpected experiences that come with exploring somewhere new.
              </p>

              <p>
                Sometimes, I want an adventure. Sometimes, I want a camera, a quiet place, and a few hours to myself. And sometimes, a good song and a peaceful evening are more than enough.
              </p>

              <p>
                My interests may seem unrelated, but I don&apos;t think every part of life needs to fit into one category.
              </p>

              <p>
                Some things teach me. Some challenge me. Some help me express myself. And some simply make me happy.
              </p>

            <QuoteBlock>
              I want to leave room in my life for all of them.
            </QuoteBlock>
            </div>
          </FadeUpHeading>

          {/* Chapter 6: My Roots, My Family */}
          <FadeUpHeading className="space-y-6 pt-10 border-t border-white/10">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
              <span>06</span>
              <span className="w-8 h-px bg-white/20" />
              <span>Chapter</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
              My Roots, My Family
            </h2>

            <div className="space-y-5 sm:space-y-6 text-base sm:text-lg md:text-xl text-neutral-300 font-light leading-relaxed">
              <p>
                No matter how far I travel or how much I accomplish, my roots will always be an important part of my story.
              </p>

              <p>
                I was born in Sherpur, Bangladesh, and my family also has connections to Sirajganj, where my grandparents&apos; homes are. These places are part of my personal history and the memories that have shaped who I am.
              </p>

              <p>
                I&apos;m one of three siblings, and my family has always played an important role in my life.
              </p>

              <p>
                My parents have consistently supported my interests, encouraged my ambitions, and given me the freedom to explore different paths. Their support means more to me than I can fully express.
              </p>

              <p>
                My elder brother, Asif Joadder, has also been one of my greatest sources of motivation and encouragement. His support has helped me keep moving forward, even when the path ahead hasn&apos;t always been clear.
              </p>

              <p>
                I have many dreams for my future, but some of my most meaningful ambitions have little to do with professional success.
              </p>

              <p>
                I want to make my family happy. I want to give them beautiful experiences, take them to places they&apos;ve always wanted to visit, and create memories with them that we&apos;ll look back on with smiles years later.
              </p>

              <p>
                I want them to experience the happiness of seeing the world beyond the places they&apos;ve always known.
              </p>

              <p>
                To me, success isn&apos;t just about reaching a destination. It&apos;s also about remembering the people who supported you along the way and making sure they can share in the happiness you&apos;ve worked so hard to achieve.
              </p>

            <QuoteBlock>
              Because life becomes more meaningful when the people you love are part of the journey.
            </QuoteBlock>
            </div>
          </FadeUpHeading>

          {/* Chapter 7: A Little About My Personal Life */}
          <FadeUpHeading className="space-y-6 pt-10 border-t border-white/10">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
              <span>07</span>
              <span className="w-8 h-px bg-white/20" />
              <span>Chapter</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
              A Little About My Personal Life
            </h2>

            <div className="space-y-5 sm:space-y-6 text-base sm:text-lg md:text-xl text-neutral-300 font-light leading-relaxed">
              <p>
                I&apos;m single, and perhaps one reason is that I haven&apos;t yet met someone whose mindset truly aligns with mine.
              </p>

              <p>
                I&apos;ve always believed that a meaningful connection is about more than attraction or simply having someone beside you. It&apos;s about understanding each other, sharing values, respecting differences, and being able to talk openly about life, dreams, ideas, and even the smallest things.
              </p>

              <p>
                I&apos;m drawn to genuine conversations, thoughtful perspectives, and people who have their own way of seeing the world.
              </p>

              <p>
                I don&apos;t believe two people need to be identical to understand one another. Sometimes, different perspectives make a connection even more interesting. What matters most is mutual understanding, respect, honesty, and the willingness to grow together.
              </p>

              <p>
                I&apos;m not in a hurry to find a relationship just because everyone else seems to be in one. I&apos;d rather let life unfold naturally and, if the right person comes along, build something genuine rather than force a connection that doesn&apos;t feel right.
              </p>

              <p>
                Until then, I&apos;m happy exploring my interests, working towards my goals, spending time with my family, and discovering more about myself.
              </p>

              <p>
                I believe there&apos;s something beautiful about meeting someone who doesn&apos;t just like who you are today but also understands the person you&apos;re trying to become.
              </p>

              <p>
                Perhaps I&apos;ll find that kind of connection someday. Perhaps life has its own timing.
              </p>

            <QuoteBlock>
              For now, I&apos;m simply living my life, keeping an open mind, and letting the story unfold.
            </QuoteBlock>
            </div>
          </FadeUpHeading>

          {/* Chapter 8: Dreams Beyond the Horizon */}
          <FadeUpHeading className="space-y-6 pt-10 border-t border-white/10">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
              <span>08</span>
              <span className="w-8 h-px bg-white/20" />
              <span>Chapter</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
              Dreams Beyond the Horizon
            </h2>

            <div className="space-y-5 sm:space-y-6 text-base sm:text-lg md:text-xl text-neutral-300 font-light leading-relaxed">
              <p>
                I have a long list of things I want to do in life, and I hope that list never becomes shorter.
              </p>

              <p>
                Professionally, I want to contribute to meaningful public health research, explore new ideas, collaborate with talented people, and work on projects that can make a real difference in healthcare and agriculture.
              </p>

              <p>
                Creatively, I want to become better at photography and documentary filmmaking, tell stories worth sharing, and create work that reflects the way I see the world.
              </p>

              <p>
                Personally, I want to travel as much as I can.
              </p>

              <p>
                I dream of exploring different parts of Bangladesh, discovering unfamiliar landscapes, walking through streets I&apos;ve never seen before, learning about different cultures, and meeting people whose lives and experiences are different from mine.
              </p>

              <p>
                I want to travel beyond my own country, too. There are so many places to see, so many stories to discover, and so many perspectives that I haven&apos;t encountered yet.
              </p>

              <p>
                But one of my biggest dreams is to share those experiences with my family.
              </p>

              <p>
                I want to take them to beautiful places, explore new destinations together, capture photographs of our journeys, and create memories that become part of our family story.
              </p>

              <p>
                I also want to keep trying new things, even if they don&apos;t always lead to something extraordinary. I want to learn skills I never thought I&apos;d need, explore interests I haven&apos;t discovered yet, and give myself the freedom to change my mind as I grow.
              </p>

              <p>
                I don&apos;t expect life to follow a perfect plan.
              </p>

              <p>
                There will be unexpected turns, difficult days, missed opportunities, and moments when I&apos;ll need to start again. But I hope to approach them with curiosity, patience, and the willingness to keep moving forward.
              </p>

            <QuoteBlock>
              I want a life filled with meaningful work, creative freedom, family, adventure, and experiences that remind me how much there is to appreciate.
            </QuoteBlock>
            </div>
          </FadeUpHeading>

          {/* Chapter 9: Still Becoming Who I Want to Be */}
          <FadeUpHeading className="space-y-6 pt-10 border-t border-white/10">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
              <span>09</span>
              <span className="w-8 h-px bg-white/20" />
              <span>Chapter</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
              Still Becoming Who I Want to Be
            </h2>

            <div className="space-y-5 sm:space-y-6 text-base sm:text-lg md:text-xl text-neutral-300 font-light leading-relaxed">
            <QuoteBlock>
              I believe we don&apos;t have to be just one thing.
            </QuoteBlock>

              <p>
                I can be a Public Health student who loves photography, a researcher who enjoys filmmaking, a creative person who finds peace in gardening, and an explorer who dreams of seeing the world with his family.
              </p>

              <p>
                I can spend one day thinking about a research problem and another remembering a beautiful moment through an old photograph. I can enjoy a meaningful conversation, get lost in music, or spend an afternoon doing something that has no purpose beyond making me happy.
              </p>

              <p>
                These aren&apos;t different versions of me. They&apos;re simply different parts of the same person.
              </p>

              <p>
                I&apos;m still learning, experimenting, making mistakes, and discovering where my interests might take me. I don&apos;t have all the answers, and I don&apos;t think I need to have them yet.
              </p>

              <p>
                There is still so much I want to learn, so many places I want to visit, so many people I want to meet, and so many experiences waiting to become memories.
              </p>

              <p>
                I want to keep growing without losing the curiosity that brought me this far. I want to become more knowledgeable without forgetting to enjoy the little things. I want to pursue my ambitions without becoming so focused on the destination that I forget to appreciate the journey.
              </p>

              <p>
                Most of all, I want to build a life that feels meaningful to me, not simply one that looks impressive to others.
              </p>

              <p>
                A life where I can do work that matters, create things I&apos;m proud of, spend time with the people I love, explore the world, and remain open to whatever comes next.
              </p>

              <p>
                Perhaps I&apos;ll become someone very different from the person I am today. Perhaps some of my dreams will change, while others will stay with me forever.
              </p>

              <p>
                Either way, I hope I&apos;ll always have the courage to explore, the patience to learn, and the imagination to dream beyond what I already know.
              </p>

              <p>
                Because I don&apos;t believe life is about becoming one final, finished version of yourself.
              </p>

              <p>
                I think it&apos;s about discovering who you can become, one experience at a time.
              </p>

              <p>
                And if there&apos;s one thing I know for certain, it&apos;s this:
              </p>

              <p className="text-white font-medium">
                I&apos;m still becoming who I want to be.
              </p>

              <p className="text-white font-medium">
                I&apos;m still learning, still exploring, still creating, and still collecting stories.
              </p>

              <div className="pt-6 sm:pt-8">
                <div className="p-6 sm:p-8 bg-[#121212]/90 bg-dark-grunge border border-white/10 border-l-2 sm:border-l-[3px] border-l-white rounded-r-xl shadow-lg shadow-black/40">
                  <p className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wider text-white font-heading leading-tight">
                    And this is only the beginning of mine
                  </p>
                </div>
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
    </div>
  );
};

export default AboutPage;
