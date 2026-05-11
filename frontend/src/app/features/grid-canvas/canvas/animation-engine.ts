import { Injectable } from '@angular/core';

export interface EnergyPulse {
  connectionId: string;
  progress: number;
  speed: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnimationEngine {
  private pulses: EnergyPulse[] = [];

  initPulses(connectionIds: string[]): void {
    this.pulses = [];
    connectionIds.forEach(id => {
      for (let i = 0; i < 3; i++) {
        this.pulses.push({
          connectionId: id,
          progress: Math.random(),
          speed: 0.3 + Math.random() * 0.2
        });
      }
    });
  }

  update(deltaTime: number): void {
    this.pulses.forEach(pulse => {
      pulse.progress += pulse.speed * deltaTime;
      if (pulse.progress > 1) {
        pulse.progress = 0;
      }
    });
  }

  getPulses(connectionId: string): EnergyPulse[] {
    return this.pulses.filter(p => p.connectionId === connectionId);
  }

  clear(): void {
    this.pulses = [];
  }
}