import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Settings, RotateCcw, FastForward, Check,
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

  // Throttled watch progress sync
  useEffect(() => {
    if (isPlaying && Math.floor(currentTime) % 10 === 0) {
      updateHistory(movieId, currentTime);
    }
  }, [currentTime, isPlaying, movieId, updateHistory]);

  // Auto-hide controls after 3 seconds of inactivity
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
        console.warn('Error enabling fullscreen:', err);
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
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`theater-player-container ${isTheaterMode ? 'theater-wide' : ''}`}>
      <div 
        ref={playerRef}
        className={`cinema-player-viewport ${isFullscreen ? 'fullscreen-active' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setControlsVisible(false)}
      >
        {/* Poster / Video presentation stage */}
        <div 
          className="player-canvas-stage"
          style={{ backgroundImage: `url(${posterUrl})` }}
          onClick={togglePlay}
        >
          <div className="player-stage-vignette" />

          {/* Central Play Indicator when paused */}
          {!isPlaying && (
            <div className="player-play-prompter">
              <Play size={44} fill="#fff" />
            </div>
          )}

          {/* Top HUD title bar */}
          <div className={`player-top-header ${controlsVisible ? 'visible' : ''}`}>
            <div className="top-title-group">
              <span className="live-hls-badge">● HLS 720p / 480p STREAM</span>
              <span className="player-film-title">{movieTitle}</span>
            </div>

            <div className="top-actions-group">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowHud(!showHud); }}
                className={`btn-stats-toggle ${showHud ? 'active' : ''}`}
                title="Toggle Stream Telemetry HUD (H)"
                aria-label="Toggle Stream Telemetry"
              >
                <Activity size={14} />
                <span>Stream Stats (H)</span>
              </button>
            </div>
          </div>

          {/* Precision Telemetry HUD Overlay */}
          {showHud && (
            <div className="telemetry-hud-overlay" onClick={(e) => e.stopPropagation()}>
              <div className="hud-panel-title">
                <Activity size={13} color="#38bdf8" />
                <span>HLS TELEMETRY CONSOLE</span>
              </div>
              <div className="hud-datapoints">
                <div className="hud-datapoint"><span>Rendition:</span> <strong>{selectedQuality} (Adaptive)</strong></div>
                <div className="hud-datapoint"><span>Resolution:</span> <strong>{selectedQuality === '480p' ? '854x480' : '1280x720'}</strong></div>
                <div className="hud-datapoint"><span>Video Codec:</span> <strong>H.264 High@L3.1</strong></div>
                <div className="hud-datapoint"><span>Audio Codec:</span> <strong>AAC-LC 48kHz Stereo</strong></div>
                <div className="hud-datapoint"><span>Bitrate:</span> <strong>{selectedQuality === '480p' ? '1,200 kbps' : '2,400 kbps'}</strong></div>
                <div className="hud-datapoint"><span>Origin:</span> <strong>Cloudflare R2</strong></div>
                <div className="hud-datapoint"><span>Egress Cost:</span> <strong className="val-free">$0.0000 USD</strong></div>
                <div className="hud-datapoint"><span>Buffer:</span> <strong>28.4s ahead</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Video Controls Bar */}
        <div className={`player-dock-bar ${controlsVisible ? 'visible' : ''}`}>
          {/* Timecode Scrubber */}
          <div className="player-timeline-track">
            <input
              type="range"
              min={0}
              max={durationSeconds}
              value={currentTime}
              onChange={handleSeek}
              className="player-timeline-input"
              aria-label="Timeline Scrubber"
            />
            <div 
              className="player-timeline-fill"
              style={{ width: `${(currentTime / durationSeconds) * 100}%` }}
            />
          </div>

          <div className="player-controls-row">
            <div className="controls-group-left">
              <button 
                onClick={togglePlay} 
                className="btn-player-glyph" 
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={18} fill="#fff" /> : <Play size={18} fill="#fff" />}
              </button>

              <button 
                onClick={() => skipSeconds(-10)} 
                className="btn-player-glyph" 
                title="Back 10s (←)"
                aria-label="Back 10 seconds"
              >
                <RotateCcw size={16} />
              </button>

              <button 
                onClick={() => skipSeconds(10)} 
                className="btn-player-glyph" 
                title="Forward 10s (→)"
                aria-label="Forward 10 seconds"
              >
                <FastForward size={16} />
              </button>

              <div className="player-volume-cluster">
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className="btn-player-glyph" 
                  title="Mute (M)"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
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
                  className="player-volume-slider"
                  aria-label="Volume Slider"
                />
              </div>

              <div className="player-time-readout">
                <span className="current-time-code">{formatTime(currentTime)}</span>
                <span className="time-divider">/</span>
                <span className="total-time-code">{formatTime(durationSeconds)}</span>
              </div>
            </div>

            <div className="controls-group-right">
              {/* Theater Mode Toggle */}
              <button
                onClick={() => setIsTheaterMode(!isTheaterMode)}
                className={`btn-player-glyph ${isTheaterMode ? 'active' : ''}`}
                title="Theater View"
                aria-label="Toggle Theater Mode"
              >
                <Monitor size={17} />
              </button>

              {/* Settings Menu (Quality & Speed) */}
              <div className="settings-anchor">
                <button 
                  onClick={() => setShowSettings(!showSettings)} 
                  className={`btn-player-glyph ${showSettings ? 'active' : ''}`}
                  title="Playback Settings"
                  aria-label="Open Stream Settings"
                >
                  <Settings size={18} />
                </button>

                {showSettings && (
                  <div className="player-settings-popover">
                    <div className="popover-section">
                      <span className="popover-heading">Rendition Quality</span>
                      {(['Auto', '720p', '480p'] as const).map(q => (
                        <button
                          key={q}
                          className={`popover-item ${selectedQuality === q ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedQuality(q);
                            setShowSettings(false);
                          }}
                        >
                          <span>{q === 'Auto' ? 'Auto (Adaptive HLS)' : `${q} Stream`}</span>
                          {selectedQuality === q && <Check size={14} />}
                        </button>
                      ))}
                    </div>

                    <div className="popover-section">
                      <span className="popover-heading">Playback Speed</span>
                      {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                        <button
                          key={speed}
                          className={`popover-item ${playbackSpeed === speed ? 'active' : ''}`}
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

              <button 
                onClick={toggleFullscreen} 
                className="btn-player-glyph" 
                title="Fullscreen (F)"
                aria-label="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
