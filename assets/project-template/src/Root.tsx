import React from 'react';
import {Composition} from 'remotion';
import shots from '../story/shot-list.json';
import {Film} from './components/Film';

const durationInFrames = shots.shots.reduce(
  (total, shot) => Math.max(total, shot.startFrame + shot.durationFrames),
  1,
);

export const FilmRoot: React.FC = () => (
  <Composition
    id="Film"
    component={Film}
    durationInFrames={durationInFrames}
    fps={shots.fps}
    width={shots.width}
    height={shots.height}
  />
);
