import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { bookApi } from '@/api/content.api';
import { Skeleton } from '@/components/shared';

export const BooksSection: React.FC = () => {
  const { data: books, isLoading } = bookApi.useGetAll();

  return (
    <section id="books" className="py-24 border-t border-neutral-900 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-neutral-400 mb-2">
          Reading &amp; Influences
        </h2>
        <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          Bookshelf &amp; Reviews
        </h3>
        <p className="mt-3 text-sm text-neutral-400 font-light tracking-wide">
          Key books in software engineering, architecture, science, and leadership.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-none overflow-hidden border border-neutral-850 bg-neutral-950 p-4 flex gap-4">
              <Skeleton className="w-20 h-28 rounded-none bg-neutral-900 shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4 rounded-none bg-neutral-850" />
                <Skeleton className="h-3 w-1/2 rounded-none bg-neutral-850" />
                <Skeleton className="h-3 w-full rounded-none bg-neutral-850 mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : !books || books.length === 0 ? (
        <div className="text-center py-16 rounded-sm border border-neutral-900 bg-neutral-950/70 max-w-lg mx-auto">
          <BookOpen className="w-8 h-8 text-neutral-500 mx-auto mb-3 opacity-60" />
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Books will appear here once added in the Admin panel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, idx) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="h-full flex gap-5 rounded-none border border-neutral-850 bg-neutral-950 p-5 hover:border-neutral-600 transition-colors">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-none border border-neutral-800 grayscale contrast-125 hover:grayscale-0 transition-all duration-500 shrink-0 bg-neutral-900"
                  />
                ) : (
                  <div className="w-20 h-28 rounded-none bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-neutral-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold uppercase tracking-wider text-white truncate">{book.title}</h4>
                  <p className="text-xs text-neutral-400 font-medium mt-0.5">{book.author}</p>
                  {book.genre && (
                    <span className="inline-block mt-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded-none bg-neutral-900 border border-neutral-800 text-neutral-400 tracking-wider">
                      {book.genre}
                    </span>
                  )}
                  {book.rating && (
                    <div className="flex items-center gap-0.5 mt-2.5 text-white">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < book.rating! ? 'fill-current' : 'opacity-20'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  {book.review && (
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-3 leading-relaxed font-light">
                      "{book.review}"
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};
