import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

type ShotSpec = (typeof import('../../story/shot-list.json'))['shots'][number];

export const Shot: React.FC<{shot: ShotSpec}> = ({shot}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const x = interpolate(frame, [0, shot.durationFrames - 1], [-2.5, 2.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <ThreeCanvas width={width} height={height} camera={{position: [0, 2, 7], fov: 45}}>
      <color attach="background" args={['#15203a']} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 8, 5]} intensity={2.5} color="#ffd5a1" />
      <mesh position={[x, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.45, 1.2, 8, 16]} />
        <meshStandardMaterial color="#6d5ef7" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#27324f" />
      </mesh>
    </ThreeCanvas>
  );
};
