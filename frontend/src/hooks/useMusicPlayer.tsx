import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Howl } from 'howler';
import { useSiteSettings } from '@/api/settings.api';

export interface Track {
  title: string;
  artist: string;
  src: string;
  cover?: string;
}

interface MusicContextType {
  playlist: Track[];
  currentTrackIndex: number;
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  seek: number;
  duration: number;
  isMuted: boolean;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  playTrackIndex: (index: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setSeek: (seek: number) => void;
  setPlaylist: (tracks: Track[]) => void;
}

export const DEFAULT_PLAYLIST: Track[] = [
  {
    title: 'Pink Floyd - Breathe (In The Air) (2023 Remaster) [jcz0YxYl6Ac]',
    artist: 'Pink Floyd',
    src: 'https://res.cloudinary.com/jmgpicxr/video/upload/v1791739303/portfolio/music/vfqvo5qixfu75t27j77w.mp3',
  },
  {
    title: 'Mild Orange - One (Official Video)',
    artist: 'Mild Orange',
    src: 'https://res.cloudinary.com/jmgpicxr/video/upload/v1791726532/portfolio/music/wfhegdpoawm4tzrozpkh.mp3',
  },
  {
    title: 'Bob Moses - Heaven Only Knows (Official Audio)',
    artist: 'Bob Moses',
    src: 'https://res.cloudinary.com/jmgpicxr/video/upload/v1791726745/portfolio/music/oj21qxduz7fbouhxo6aw.mp3',
  },
  {
    title: 'Harry Styles - Sign of the Times (Official Video)',
    artist: 'Harry Styles',
    src: 'https://res.cloudinary.com/jmgpicxr/video/upload/v1791739328/portfolio/music/lbdncygjw8s7cae97znu.mp3',
  },
  {
    title: 'Tears For Fears - Head Over Heels [CsHiG-43Fzg]',
    artist: 'Tears For Fears',
    src: 'https://res.cloudinary.com/jmgpicxr/video/upload/v1791739345/portfolio/music/sedspavfpeea2q25b8hw.mp3',
  },
];

/**
 * Selects a random track index on initial load or reload.
 * Uses sessionStorage to prevent consecutively repeating the same song across reloads.
 */
const getRandomTrackIndex = (tracks: Track[]): number => {
  if (!tracks || tracks.length <= 1) return 0;

  try {
    const lastTitle = sessionStorage.getItem('salman_last_track_title');
    const available = tracks
      .map((t, idx) => ({ title: t.title, idx }))
      .filter((item) => item.title !== lastTitle);

    if (available.length > 0) {
      const chosen = available[Math.floor(Math.random() * available.length)];
      sessionStorage.setItem('salman_last_track_title', chosen.title);
      return chosen.idx;
    }
  } catch (_) {
    // Fallback if sessionStorage is unavailable in current context
  }

  const randomIdx = Math.floor(Math.random() * tracks.length);
  try {
    sessionStorage.setItem('salman_last_track_title', tracks[randomIdx].title);
  } catch (_) {}
  return randomIdx;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{
  children: React.ReactNode;
  initialPlaylist?: Track[];
}> = ({ children, initialPlaylist }) => {
  const { data: settings } = useSiteSettings();

  const initialTracks =
    initialPlaylist && initialPlaylist.length > 0 ? initialPlaylist : DEFAULT_PLAYLIST;

  const [playlist, setPlaylist] = useState<Track[]>(initialTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(() =>
    getRandomTrackIndex(initialTracks)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [seek, setSeekState] = useState(0);
  const [duration, setDuration] = useState(0);

  const soundRef = useRef<Howl | null>(null);
  const userInteractedRef = useRef<boolean>(false);
  const hasInitializedSettingsTrack = useRef<boolean>(false);

  // Synchronize playlist with site settings fetched from the database/Admin panel
  useEffect(() => {
    if (settings?.musicPlaylist && Array.isArray(settings.musicPlaylist) && settings.musicPlaylist.length > 0) {
      const newPlaylist = settings.musicPlaylist;
      setPlaylist(newPlaylist);

      // On initial settings hydration (if user hasn't manually selected/played a song), randomize from database tracks
      if (!hasInitializedSettingsTrack.current && !userInteractedRef.current && !isPlaying) {
        hasInitializedSettingsTrack.current = true;
        setCurrentTrackIndex(getRandomTrackIndex(newPlaylist));
      } else {
        setCurrentTrackIndex((prev) => (prev < newPlaylist.length ? prev : 0));
      }
    } else if (settings && (!settings.musicPlaylist || settings.musicPlaylist.length === 0)) {
      setPlaylist(DEFAULT_PLAYLIST);
      if (!hasInitializedSettingsTrack.current && !userInteractedRef.current && !isPlaying) {
        hasInitializedSettingsTrack.current = true;
        setCurrentTrackIndex(getRandomTrackIndex(DEFAULT_PLAYLIST));
      } else {
        setCurrentTrackIndex((prev) => (prev < DEFAULT_PLAYLIST.length ? prev : 0));
      }
    }
  }, [settings?.musicPlaylist, isPlaying]);

  const currentTrack =
    playlist.length > 0 && currentTrackIndex < playlist.length
      ? playlist[currentTrackIndex]
      : null;

  // Initialize or change track
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.unload();
      soundRef.current = null;
    }

    if (!currentTrack || !currentTrack.src) {
      setIsPlaying(false);
      setDuration(0);
      setSeekState(0);
      return;
    }

    const sound = new Howl({
      src: [currentTrack.src],
      html5: true,
      volume: isMuted ? 0 : volume,
      onplay: () => {
        setIsPlaying(true);
        setDuration(sound.duration());
      },
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => {
        nextTrack();
      },
      onload: () => {
        setDuration(sound.duration());
      },
      onloaderror: () => {
        setIsPlaying(false);
      },
    });

    soundRef.current = sound;

    if (isPlaying) {
      sound.play();
    }

    return () => {
      sound.unload();
      soundRef.current = null;
    };
  }, [currentTrackIndex, currentTrack?.src]);

  // Volume updates
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  // Seek timer update
  useEffect(() => {
    const interval = setInterval(() => {
      if (soundRef.current && isPlaying) {
        setSeekState(soundRef.current.seek() as number);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Track changes update last played track in sessionStorage
  useEffect(() => {
    if (currentTrack?.title) {
      try {
        sessionStorage.setItem('salman_last_track_title', currentTrack.title);
      } catch (_) {}
    }
  }, [currentTrack?.title]);

  const togglePlay = () => {
    userInteractedRef.current = true;
    if (!soundRef.current || !currentTrack) return;
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const nextTrack = () => {
    userInteractedRef.current = true;
    if (playlist.length === 0) return;
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const prevTrack = () => {
    userInteractedRef.current = true;
    if (playlist.length === 0) return;
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const playTrackIndex = (index: number) => {
    userInteractedRef.current = true;
    if (index >= 0 && index < playlist.length) {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (val > 0 && isMuted) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const setSeek = (pos: number) => {
    if (soundRef.current) {
      soundRef.current.seek(pos);
      setSeekState(pos);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        playlist,
        currentTrackIndex,
        currentTrack,
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
        setPlaylist,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicProvider');
  }
  return context;
};
