import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Settings, RotateCcw, FastForward, Check, Sparkles,
  Activity, Monitor
} from 'lucide-react';
import { VideoRendition } from '@movie/shared';
import { useAuth } from '../../context/AuthContext';

interface VideoPlayerShellProps {
  movieId: string;
  movieTitle: string;
  durationSeconds: number;
  initialPositionSeconds?: number;
  posterUrl: string;
}

export const VideoPlayerShell: React.FC<VideoPlayerShellProps> = ({
  movieId,
  movieTitle,
  durationSeconds,
  initialPositionSeconds = 0,
  posterUrl
}) => {
  const { updateHistory } = useAuth();
  const playerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialPositionSeconds);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<'Auto' | VideoRendition>('720p');
  const [showSettings, setShowSettings] = useState(false);
  const [showHud, setShowHud] = useState(false);
  const [ambilightEnabled, setAmbilightEnabled] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Playback timer simulation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= durationSeconds) {
            setIsPlaying(false);
            return durationSeconds;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, durationSeconds, playbackSpeed]);

  // Throttled watch progress sync (Rule 8 & playback skill)
  useEffect(() => {
    if (isPlaying && Math.floor(currentTime) % 10 === 0) {
      updateHistory(movieId, currentTime);
    }
  }, [currentTime, isPlaying, movieId, updateHistory]);

  // Auto-hide controls after inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [lastActivity, isPlaying]);

  const handleMouseMove = () => {
    setControlsVisible(true);
    setLastActivity(Date.now());
  };

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const skipSeconds = useCallback((seconds: number) => {
    setCurrentTime(prev => {
      const nextTime = prev + seconds;
      return Math.max(0, Math.min(durationSeconds, nextTime));
    });
  }, [durationSeconds]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    updateHistory(movieId, val);
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(err => {
        console.warn('Error attempting to enable fullscreen:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        skipSeconds(-10);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        skipSeconds(10);
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted(prev => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'h' || e.key === 'H') {
        setShowHud(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, skipSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`player-outer-wrapper ${isTheaterMode ? 'theater-mode' : ''}`}>
      {/* Dynamic Cinema Ambilight Halo */}
      {ambilightEnabled && (
        <div 
          className={`player-ambilight-glow ${isPlaying ? 'active-pulse' : ''}`}
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
      )}

      <div 
        ref={playerRef}
        className={`video-player-root ${isFullscreen ? 'fullscreen' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setControlsVisible(false)}
      >
        {/* Poster / Video simulation backdrop */}
        <div 
          className="player-viewport"
          style={{ backgroundImage: `url(${posterUrl})` }}
          onClick={togglePlay}
        >
          <div className="viewport-gradient-overlay" />
          
          {!isPlaying && (
            <div className="player-big-center-play">
              <div className="center-play-ripple" />
              <Play size={44} fill="#fff" />
            </div>
          )}

          {/* Top Info Bar */}
          <div className={`player-top-hud ${controlsVisible ? 'visible' : ''}`}>
            <div className="player-title-info">
              <span className="live-hls-pill">● HLS 720p / 480p STREAM</span>
              <span className="player-movie-heading">{movieTitle}</span>
            </div>

            <div className="player-hud-toggles">
              <button 
                onClick={(e) => { e.stopPropagation(); setAmbilightEnabled(!ambilightEnabled); }}
                className={`btn-hud-action ${ambilightEnabled ? 'active' : ''}`}
                title="Toggle Cinema Ambilight Glow"
              >
                <Sparkles size={16} />
                <span>Ambilight</span>
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); setShowHud(!showHud); }}
                className={`btn-hud-action ${showHud ? 'active' : ''}`}
                title="Toggle Real-Time Stream Telemetry HUD (H)"
              >
                <Activity size={16} />
                <span>Stats HUD</span>
              </button>
            </div>
          </div>

          {/* Real-Time Telemetry HUD Overlay */}
          {showHud && (
            <div className="stream-telemetry-panel" onClick={(e) => e.stopPropagation()}>
              <div className="hud-header">
                <Activity size={14} color="#38bdf8" />
                <span>HLS STREAM TELEMETRY (LIVE)</span>
              </div>
              <div className="hud-rows">
                <div className="hud-row"><span>Rendition:</span> <strong>{selectedQuality} (Adaptive)</strong></div>
                <div className="hud-row"><span>Resolution:</span> <strong>{selectedQuality === '480p' ? '854x480' : '1280x720'}</strong></div>
                <div className="hud-row"><span>Video Codec:</span> <strong>H.264 / AVC Main@L3.1</strong></div>
                <div className="hud-row"><span>Audio Codec:</span> <strong>AAC 48kHz Stereo</strong></div>
                <div className="hud-row"><span>Target Bitrate:</span> <strong>{selectedQuality === '480p' ? '1,200 kbps' : '2,400 kbps'}</strong></div>
                <div className="hud-row"><span>Storage Origin:</span> <strong>Cloudflare R2 (Free Tier)</strong></div>
                <div className="hud-row"><span>Egress Cost:</span> <strong className="green-highlight">$0.0000 USD</strong></div>
                <div className="hud-row"><span>Buffer Health:</span> <strong>28.4s cached</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Custom Video Controls Bar */}
        <div className={`player-controls-bar ${controlsVisible ? 'visible' : ''}`}>
          {/* Scrubber Progress Bar */}
          <div className="timeline-scrubber">
            <input
              type="range"
              min={0}
              max={durationSeconds}
              value={currentTime}
              onChange={handleSeek}
              className="timeline-slider"
            />
            <div 
              className="timeline-progress-fill"
              style={{ width: `${(currentTime / durationSeconds) * 100}%` }}
            />
          </div>

          <div className="controls-row">
            <div className="controls-left">
              <button onClick={togglePlay} className="control-btn" title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}>
                {isPlaying ? <Pause size={20} fill="#fff" /> : <Play size={20} fill="#fff" />}
              </button>

              <button onClick={() => skipSeconds(-10)} className="control-btn" title="Back 10s (←)">
                <RotateCcw size={18} />
              </button>

              <button onClick={() => skipSeconds(10)} className="control-btn" title="Forward 10s (→)">
                <FastForward size={18} />
              </button>

              <div className="volume-control-group">
                <button onClick={() => setIsMuted(!isMuted)} className="control-btn" title="Mute (M)">
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="volume-slider"
                />
              </div>

              <div className="time-display">
                <span>{formatTime(currentTime)}</span>
                <span className="time-sep">/</span>
                <span>{formatTime(durationSeconds)}</span>
              </div>
            </div>

            <div className="controls-right">
              {/* Theater Mode Toggle */}
              <button
                onClick={() => setIsTheaterMode(!isTheaterMode)}
                className={`control-btn ${isTheaterMode ? 'active' : ''}`}
                title="Theater Wide Mode"
              >
                <Monitor size={18} />
              </button>

              <div className="settings-wrapper">
                <button 
                  onClick={() => setShowSettings(!showSettings)} 
                  className={`control-btn ${showSettings ? 'active' : ''}`}
                  title="Stream Settings"
                >
                  <Settings size={20} />
                </button>

                {showSettings && (
                  <div className="player-settings-popup">
                    <div className="setting-section">
                      <span className="setting-title">Quality (HLS Rendition)</span>
                      {(['Auto', '720p', '480p'] as const).map(q => (
                        <button
                          key={q}
                          className={`setting-option ${selectedQuality === q ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedQuality(q);
                            setShowSettings(false);
                          }}
                        >
                          <span>{q === 'Auto' ? 'Auto (Adaptive Bitrate)' : `${q} HD`}</span>
                          {selectedQuality === q && <Check size={14} />}
                        </button>
                      ))}
                    </div>

                    <div className="setting-section">
                      <span className="setting-title">Playback Speed</span>
                      {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                        <button
                          key={speed}
                          className={`setting-option ${playbackSpeed === speed ? 'selected' : ''}`}
                          onClick={() => {
                            setPlaybackSpeed(speed);
                            setShowSettings(false);
                          }}
                        >
                          <span>{speed}x</span>
                          {playbackSpeed === speed && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button onClick={toggleFullscreen} className="control-btn" title="Fullscreen (F)">
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
