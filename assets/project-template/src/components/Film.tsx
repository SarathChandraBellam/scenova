import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import shots from '../../story/shot-list.json';
import {Shot} from '../scenes/Shot';

export const Film: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#0c1020'}}>
    {shots.shots.map((shot) => (
      <Sequence
        key={shot.id}
        from={shot.startFrame}
        durationInFrames={shot.durationFrames}
      >
        <Shot shot={shot} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
