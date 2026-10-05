import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Settings, RotateCcw, FastForward, Check
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
  const [selectedQuality, setSelectedQuality] = useState<'Auto' | VideoRendition>('720p');
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [controlsVisible, setControlsVisible] = useState(true);

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
    if (isPlaying && currentTime % 10 === 0) {
      updateHistory(movieId, currentTime);
    }
  }, [currentTime, isPlaying, movieId, updateHistory]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    updateHistory(movieId, newTime);
  };

  const skipSeconds = (seconds: number) => {
    setCurrentTime(prev => Math.min(Math.max(0, prev + seconds), durationSeconds));
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div 
      ref={playerRef} 
      className={`video-player-container ${isFullscreen ? 'fullscreen' : ''}`}
      onMouseMove={() => setControlsVisible(true)}
      onMouseLeave={() => isPlaying && setControlsVisible(false)}
    >
      {/* Visual Canvas / Stream Preview */}
      <div className="player-canvas" onClick={togglePlay}>
        <div 
          className="player-poster-backdrop"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
        
        {!isPlaying && (
          <div className="center-play-button">
            <Play size={44} fill="#fff" color="#fff" />
          </div>
        )}

        <div className="stream-badge-overlay">
          <span className="live-hls-indicator">● HLS SIMULATION: {movieTitle}</span>
          <span className="rendition-pill">{selectedQuality}</span>
        </div>
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
            <button onClick={togglePlay} className="control-btn" title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause size={20} fill="#fff" /> : <Play size={20} fill="#fff" />}
            </button>

            <button onClick={() => skipSeconds(-10)} className="control-btn" title="Back 10s">
              <RotateCcw size={18} />
            </button>

            <button onClick={() => skipSeconds(10)} className="control-btn" title="Forward 10s">
              <FastForward size={18} />
            </button>

            <div className="volume-control-group">
              <button onClick={() => setIsMuted(!isMuted)} className="control-btn">
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
            <div className="settings-wrapper">
              <button 
                onClick={() => setShowSettings(!showSettings)} 
                className={`control-btn ${showSettings ? 'active' : ''}`}
                title="Settings & Quality"
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
                        onClick={() => { setSelectedQuality(q); setShowSettings(false); }}
                      >
                        <span>{q} {q === '720p' && '(HD)'}</span>
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
                        onClick={() => { setPlaybackSpeed(speed); setShowSettings(false); }}
                      >
                        <span>{speed}x</span>
                        {playbackSpeed === speed && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={toggleFullscreen} className="control-btn" title="Fullscreen">
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
