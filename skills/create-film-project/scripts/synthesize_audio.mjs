#!/usr/bin/env node
// Dependency-free procedural WAV synthesizer: tones or filtered noise, no external service or API key.

import {writeFileSync} from 'node:fs';

function parseArgs(argv) {
  const [output, ...rest] = argv;
  if (!output) {
    console.error(
      'usage: synthesize_audio.mjs <output.wav> [--duration 2] [--freq 440] ' +
        '[--wave sine|triangle|sawtooth|noise] [--gain 0.6] [--fade 0.05] [--lowpass 0-1] [--seed 1]',
    );
    process.exit(1);
  }
  const opts = {duration: 2, freq: 440, wave: 'sine', gain: 0.6, fade: 0.05, lowpass: 0, seed: 1, sampleRate: 44100};
  for (let i = 0; i < rest.length; i += 2) {
    const key = rest[i].replace(/^--/, '');
    const raw = rest[i + 1];
    opts[key] = key === 'wave' ? raw : Number(raw);
  }
  return {output, opts};
}

function mulberry32(seed) {
  let state = seed | 0;
  return function random() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function oscillatorSample(wave, phase, random) {
  const cycle = phase - Math.floor(phase);
  switch (wave) {
    case 'triangle':
      return 4 * Math.abs(cycle - 0.5) - 1;
    case 'sawtooth':
      return 2 * cycle - 1;
    case 'noise':
      return random() * 2 - 1;
    case 'sine':
    default:
      return Math.sin(2 * Math.PI * cycle);
  }
}

function synthesize({duration, freq, wave, gain, fade, lowpass, seed, sampleRate}) {
  const total = Math.round(duration * sampleRate);
  const samples = new Float32Array(total);
  const random = mulberry32(seed);
  let filtered = 0;
  for (let i = 0; i < total; i++) {
    const phase = (freq * i) / sampleRate;
    const raw = oscillatorSample(wave, phase, random);
    filtered = lowpass > 0 ? filtered + lowpass * (raw - filtered) : raw;
    samples[i] = filtered * gain;
  }
  const fadeSamples = Math.max(1, Math.round(fade * sampleRate));
  for (let i = 0; i < total; i++) {
    const envelope = Math.min(i / fadeSamples, (total - 1 - i) / fadeSamples, 1);
    samples[i] *= Math.max(0, envelope);
  }
  return samples;
}

function toWav(samples, sampleRate) {
  const bytesPerSample = 2;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * bytesPerSample, 28);
  buffer.writeUInt16LE(bytesPerSample, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * bytesPerSample);
  }
  return buffer;
}

const {output, opts} = parseArgs(process.argv.slice(2));
const samples = synthesize(opts);
writeFileSync(output, toWav(samples, opts.sampleRate));
console.log(`${output}: ${opts.wave} ${opts.freq}Hz x ${opts.duration}s`);
