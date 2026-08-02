import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import storyBible from '../../story/story-bible.json';

type DialogueEntry = {
  characterId: string;
  line: string;
  startFrame: number;
  durationFrames: number;
};

const characterNames = new Map(storyBible.characters.map((character) => [character.id, character.name]));

export const Captions: React.FC<{dialogue: DialogueEntry[]}> = ({dialogue}) => {
  const frame = useCurrentFrame();

  return (
    <>
      {dialogue.map((entry, index) => {
        const localFrame = frame - entry.startFrame;
        if (localFrame < 0 || localFrame >= entry.durationFrames) {
          return null;
        }
        const opacity = interpolate(
          localFrame,
          [0, 6, entry.durationFrames - 6, entry.durationFrames],
          [0, 1, 1, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
        );
        return (
          <div
            key={`${entry.characterId}-${index}`}
            style={{
              position: 'absolute',
              bottom: 64,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              opacity,
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: '10px 20px',
                borderRadius: 8,
                background: 'rgba(0, 0, 0, 0.6)',
                color: '#ffffff',
                fontFamily: 'sans-serif',
                fontSize: 32,
                textAlign: 'center',
              }}
            >
              <strong>{characterNames.get(entry.characterId) ?? entry.characterId}: </strong>
              {entry.line}
            </div>
          </div>
        );
      })}
    </>
  );
};
