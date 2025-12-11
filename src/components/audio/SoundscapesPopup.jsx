import { useState } from "react";
import { useSoundscapesStore } from "../../store/useSoundscapesStore";
import {
  CloudRain,
  Coffee,
  Trees,
  Flame,
  Play,
  Pause,
  Volume2,
  X,
  Music,
} from "lucide-react";
import clsx from "clsx";

const iconMap = {
  CloudRain,
  Coffee,
  Trees,
  Flame,
};

/**
 * Floating Soundscapes Popup - Toggle control panel in top-right
 * Persists audio control across all pages
 */
export const SoundscapesPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    tracks,
    isPlaying,
    togglePlay,
    toggleTrack,
    setTrackVolume,
    showPopup,
  } = useSoundscapesStore();

  const activeCount = tracks.filter((t) => t.isActive).length;

  // Hide popup if disabled in settings
  if (!showPopup) return null;

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "fixed top-20 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
          isPlaying
            ? "bg-(--accent) text-(--bg-color) animate-pulse"
            : "bg-(--card-color) text-(--text-muted) border border-(--border-color) hover:border-(--accent)"
        )}
        title="Soundscapes"
      >
        <Music size={18} />
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-(--text-main) text-(--bg-color) text-[10px] font-mono flex items-center justify-center rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {/* Popup Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed top-32 right-4 z-50 w-72 bg-(--card-color) border border-(--border-color) shadow-xl p-4 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-dashed border-(--border-color) pb-3">
              <div className="flex items-center gap-2">
                <Volume2 size={16} className="text-(--accent)" />
                <span className="font-mono text-xs uppercase tracking-wider text-(--text-main)">
                  Soundscapes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    isPlaying
                      ? "bg-(--accent) text-(--bg-color)"
                      : "bg-(--bg-color) text-(--text-muted) border border-(--border-color) hover:border-(--accent)"
                  )}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-(--text-muted) hover:text-(--text-main) transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Tracks */}
            <div className="space-y-3">
              {tracks.map((track) => {
                const Icon = iconMap[track.icon] || Volume2;

                return (
                  <div key={track.id} className="flex items-center gap-3">
                    {/* Track Toggle */}
                    <button
                      onClick={() => toggleTrack(track.id)}
                      className={clsx(
                        "p-2 rounded-lg transition-all duration-300 border",
                        track.isActive
                          ? "bg-(--accent)/10 border-(--accent) text-(--accent)"
                          : "bg-transparent border-transparent text-(--text-muted) hover:bg-(--bg-color)"
                      )}
                    >
                      <Icon size={16} />
                    </button>

                    {/* Controls */}
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <span
                          className={clsx(
                            "font-mono text-xs transition-colors",
                            track.isActive
                              ? "text-(--text-main)"
                              : "text-(--text-muted)"
                          )}
                        >
                          {track.name}
                        </span>
                        <span className="font-mono text-[10px] text-(--text-muted)">
                          {Math.round(track.volume * 100)}%
                        </span>
                      </div>

                      {/* Volume Slider */}
                      <div className="relative h-1.5 w-full bg-(--bg-color) rounded-full overflow-hidden">
                        <div
                          className={clsx(
                            "absolute top-0 left-0 h-full transition-all duration-300",
                            track.isActive
                              ? "bg-(--accent)"
                              : "bg-(--text-muted)/30"
                          )}
                          style={{ width: `${track.volume * 100}%` }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={track.volume}
                          onChange={(e) =>
                            setTrackVolume(track.id, parseFloat(e.target.value))
                          }
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-dashed border-(--border-color)">
              <p className="font-mono text-[10px] text-(--text-muted) text-center">
                audio tetap jalan saat pindah halaman
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};
