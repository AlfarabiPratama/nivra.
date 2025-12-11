import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useSoundscapesStore } from "../../store/useSoundscapesStore";
import {
  CloudRain,
  Coffee,
  Trees,
  Flame,
  Play,
  Pause,
  Volume2,
} from "lucide-react";
import clsx from "clsx";

const iconMap = {
  CloudRain,
  Coffee,
  Trees,
  Flame,
};

import { AudioVisualizer } from "../ui/AudioVisualizer";

export const SoundscapesWidget = () => {
  const { tracks, isPlaying, togglePlay, toggleTrack, setTrackVolume } =
    useSoundscapesStore();

  return (
    <Card variant="solid" className="overflow-hidden relative">
      <AudioVisualizer isPlaying={isPlaying} />
      
      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-center border-b border-dashed border-(--border-color) pb-3">
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-(--accent)" />
            <span className="type-label">Soundscapes</span>
          </div>
          <Button
            variant={isPlaying ? "accent" : "ghost"}
            size="sm"
            onClick={togglePlay}
            className="w-8 h-8 p-0 rounded-full"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </Button>
        </div>

        <div className="space-y-3">
          {tracks.map((track) => {
            const Icon = iconMap[track.icon] || Volume2;

            return (
              <div key={track.id} className="flex items-center gap-3 group">
                {/* Track Toggle */}
                <button
                  onClick={() => toggleTrack(track.id)}
                  className={clsx(
                    "p-2 rounded-lg transition-all duration-300 border",
                    track.isActive
                      ? "bg-(--accent)/10 border-(--accent) text-(--accent)"
                      : "bg-transparent border-transparent text-(--text-muted) hover:bg-(--bg-color-hover)"
                  )}
                >
                  <Icon size={18} />
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
                  </div>

                  {/* Custom Range Slider */}
                  <div className="relative h-1.5 w-full bg-(--bg-color-hover) rounded-full overflow-hidden">
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
                      disabled={!track.isActive}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Background Visualizer (Subtle Animation) */}
      {isPlaying && (
        <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none">
          <div className="flex items-end gap-1 h-8">
            <div className="w-1 bg-(--text-main) animate-bounce" />
            <div className="w-1 bg-(--text-main) animate-[bounce_1.5s_infinite]" />
            <div className="w-1 bg-(--text-main) animate-[bounce_1.2s_infinite]" />
            <div className="w-1 bg-(--text-main) animate-[bounce_0.8s_infinite]" />
          </div>
        </div>
      )}
    </Card>
  );
};
