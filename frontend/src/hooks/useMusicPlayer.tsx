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

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{
  children: React.ReactNode;
  initialPlaylist?: Track[];
}> = ({ children, initialPlaylist }) => {
  const { data: settings } = useSiteSettings();

  const [playlist, setPlaylist] = useState<Track[]>(
    initialPlaylist && initialPlaylist.length > 0 ? initialPlaylist : DEFAULT_PLAYLIST
  );
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [seek, setSeekState] = useState(0);
  const [duration, setDuration] = useState(0);

  const soundRef = useRef<Howl | null>(null);

  // Synchronize playlist with site settings fetched from the database/Admin panel
  useEffect(() => {
    if (settings?.musicPlaylist && Array.isArray(settings.musicPlaylist) && settings.musicPlaylist.length > 0) {
      setPlaylist(settings.musicPlaylist);
      setCurrentTrackIndex((prev) => {
        return prev < settings.musicPlaylist!.length ? prev : 0;
      });
    } else if (settings && (!settings.musicPlaylist || settings.musicPlaylist.length === 0)) {
      setPlaylist(DEFAULT_PLAYLIST);
      setCurrentTrackIndex(0);
    }
  }, [settings?.musicPlaylist]);

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

  const togglePlay = () => {
    if (!soundRef.current || !currentTrack) return;
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const nextTrack = () => {
    if (playlist.length === 0) return;
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const prevTrack = () => {
    if (playlist.length === 0) return;
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const playTrackIndex = (index: number) => {
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
