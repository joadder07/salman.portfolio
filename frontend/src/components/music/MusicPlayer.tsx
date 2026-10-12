import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  ChevronUp,
  ChevronDown,
  ListMusic,
} from 'lucide-react';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';

export const MusicPlayer: React.FC = () => {
  const {
    currentTrack,
    currentTrackIndex,
    playlist,
    isPlaying,
    volume,
    seek,
    duration,
    isMuted,
    togglePlay,
    nextTrack,
    prevTrack,
    playTrackIndex,
    setVolume,
    toggleMute,
    setSeek,
  } = useMusicPlayer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  // If there are no tracks saved in Admin panel, do not render player
  if (!currentTrack || playlist.length === 0) {
    return null;
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (seek / duration) * 100 : 0;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none">
      {/* Playlist Drawer */}
      <AnimatePresence>
        {showPlaylist && isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="pointer-events-auto mb-3 w-80 max-h-60 overflow-y-auto rounded-2xl glass p-3 shadow-2xl border border-white/10"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ListMusic className="w-3.5 h-3.5" /> Playlist ({playlist.length})
              </span>
              <button
                onClick={() => setShowPlaylist(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <div className="space-y-1">
              {playlist.map((track, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (idx !== currentTrackIndex) {
                      playTrackIndex(idx);
                    }
                  }}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                    idx === currentTrackIndex
                      ? 'bg-primary/20 text-primary font-medium'
                      : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="truncate font-medium">{track.title}</p>
                    {track.artist && <p className="text-[10px] opacity-70">{track.artist}</p>}
                  </div>
                  {idx === currentTrackIndex && isPlaying && (
                    <span className="flex space-x-0.5 items-end h-3">
                      <span className="w-0.5 h-3 bg-primary animate-pulse" />
                      <span className="w-0.5 h-2 bg-primary animate-pulse delay-75" />
                      <span className="w-0.5 h-3 bg-primary animate-pulse delay-150" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Player Pill */}
      <motion.div
        layout
        className="pointer-events-auto glass rounded-2xl p-3 shadow-2xl border border-white/15 backdrop-blur-xl transition-all"
        style={{ width: isExpanded ? '340px' : 'auto' }}
      >
        <div className="flex items-center gap-3">
          {/* Animated Vinyl Icon */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className={`relative w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center cursor-pointer shadow-lg shrink-0 ${
              isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
            }`}
          >
            <Music className="w-5 h-5 text-white" />
            <div className="absolute w-2.5 h-2.5 rounded-full bg-background border border-white/20" />
          </div>

          {/* Compact View Details / Expand Trigger */}
          {!isExpanded ? (
            <div className="flex items-center gap-2 pr-1">
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button
                onClick={() => setIsExpanded(true)}
                className="text-muted-foreground hover:text-foreground p-1"
                title="Expand Music Player"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Expanded Player View */
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="truncate pr-2">
                  <p className="text-xs font-semibold truncate text-foreground">
                    {currentTrack.title || 'Untitled Track'}
                  </p>
                  {currentTrack.artist ? (
                    <p className="text-[10px] text-muted-foreground truncate">
                      {currentTrack.artist}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                    title="Playlist"
                  >
                    <ListMusic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                    title="Collapse"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-0.5 my-1.5">
                <div
                  className="w-full bg-muted/40 h-1.5 rounded-full overflow-hidden cursor-pointer relative"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percent = clickX / rect.width;
                    setSeek(percent * duration);
                  }}
                >
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-150"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                  <span>{formatTime(seek)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-1">
                {/* Volume control */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={toggleMute}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-3.5 h-3.5 text-destructive" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-14 h-1 accent-primary cursor-pointer"
                  />
                </div>

                {/* Playback Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={prevTrack}
                    className="p-1 text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95 transition-all"
                    title="Previous"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                  <button
                    onClick={nextTrack}
                    className="p-1 text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95 transition-all"
                    title="Next"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
