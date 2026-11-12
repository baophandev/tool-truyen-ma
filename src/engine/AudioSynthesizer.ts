/**
 * PROCEDURAL WEB AUDIO SYNTHESIZER FOR HORROR AMBIENCE
 * 100% Pure Code - Zero external MP3/WAV files!
 * Synthesizes:
 * - Low frequency binaural drone (Eerie sub-bass)
 * - Howling wind generator (Filtered pink/white noise)
 * - Tension heartbeat pulse
 * - Thunder strike rumble
 */

class HorrorAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;

  // Sound nodes
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private windNode: AudioNode | null = null;
  private heartbeatInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.initContext();

    if (!this.masterGain || !this.ctx) return;

    if (this.isMuted) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
      this.stopHeartbeat();
    } else {
      this.startAmbience();
      this.masterGain.gain.setTargetAtTime(0.5, this.ctx.currentTime, 0.3);
      this.startHeartbeat();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  private startAmbience() {
    if (!this.ctx || !this.masterGain) return;

    // 1. Eerie Low Drone (Oscillators beating at slight detune: 55Hz & 56.5Hz)
    if (!this.droneOsc1) {
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = "sawtooth";
      this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime);

      const filter1 = this.ctx.createBiquadFilter();
      filter1.type = "lowpass";
      filter1.frequency.setValueAtTime(140, this.ctx.currentTime);

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      this.droneOsc1.connect(filter1);
      filter1.connect(droneGain);
      droneGain.connect(this.masterGain);
      this.droneOsc1.start();
    }

    if (!this.droneOsc2) {
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = "sine";
      this.droneOsc2.frequency.setValueAtTime(56.8, this.ctx.currentTime);

      const droneGain2 = this.ctx.createGain();
      droneGain2.gain.setValueAtTime(0.25, this.ctx.currentTime);

      this.droneOsc2.connect(droneGain2);
      droneGain2.connect(this.masterGain);
      this.droneOsc2.start();
    }

    // 2. Howling Wind Generator (Filtered Noise)
    if (!this.windNode) {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(320, this.ctx.currentTime);
      bandpass.Q.setValueAtTime(3.0, this.ctx.currentTime);

      // Modulate wind frequency for howling effect
      const windLFO = this.ctx.createOscillator();
      windLFO.frequency.setValueAtTime(0.15, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
      windLFO.connect(lfoGain);
      lfoGain.connect(bandpass.frequency);
      windLFO.start();

      const windGain = this.ctx.createGain();
      windGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

      whiteNoise.connect(bandpass);
      bandpass.connect(windGain);
      windGain.connect(this.masterGain);
      whiteNoise.start();
      this.windNode = whiteNoise;
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = window.setInterval(() => {
      this.playHeartbeatThud();
    }, 1400);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private playHeartbeatThud() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    // First thud (Lub)
    this.triggerThud(0, 70, 40, 0.12, 0.18);
    // Second thud (Dub)
    this.triggerThud(0.18, 60, 35, 0.09, 0.14);
  }

  private triggerThud(delaySec: number, startFreq: number, endFreq: number, duration: number, gainVol: number) {
    if (!this.ctx || !this.masterGain) return;

    const startTime = this.ctx.currentTime + delaySec;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(gainVol, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  public triggerSnapClick() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const startTime = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(820, startTime);
      osc.frequency.exponentialRampToValueAtTime(440, startTime + 0.05);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.06);
    } catch {
      // Ignore if audio context not permitted yet
    }
  }

  public triggerThunder() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const startTime = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 2.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(180, startTime);
    filter.frequency.exponentialRampToValueAtTime(60, startTime + 2.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(startTime);
    noise.stop(startTime + 2.6);
  }
}

export const soundEngine = new HorrorAudioEngine();

