'use client';

import { useCallback, type SyntheticEvent } from 'react';

type DialogAudioPlayerProps = {
  className?: string;
  groupId: string;
  src: string;
};

const DialogAudioPlayer = ({
  className,
  groupId,
  src,
}: DialogAudioPlayerProps) => {
  const handlePlay = useCallback(
    (event: SyntheticEvent<HTMLAudioElement>) => {
      const currentAudio = event.currentTarget;
      const selector = `audio[data-audio-group="${groupId}"]`;
      const audios = document.querySelectorAll<HTMLAudioElement>(selector);

      audios.forEach((audio) => {
        if (audio !== currentAudio && !audio.paused) {
          audio.pause();
        }
      });
    },
    [groupId]
  );

  return (
    <audio
      className={className}
      controls
      preload="none"
      src={src}
      data-audio-group={groupId}
      onPlay={handlePlay}
    />
  );
};

export default DialogAudioPlayer;
