import { useSoundscapesStore } from "../../store/useSoundscapesStore";

/**
 * Global Audio Player - Hidden component that persists across page navigation
 * Only renders <audio> elements, no visible UI
 */
export const GlobalAudioPlayer = () => {
  const { tracks, registerAudio } = useSoundscapesStore();

  return (
    <div className="hidden" aria-hidden="true">
      {tracks.map((track) => (
        <audio
          key={track.id}
          ref={(el) => registerAudio(track.id, el)}
          src={track.src}
          preload="none"
        />
      ))}
    </div>
  );
};
