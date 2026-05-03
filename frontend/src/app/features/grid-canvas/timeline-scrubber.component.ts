import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline-scrubber',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timeline-scrubber">
      <div class="timeline-info">
        <span class="time-label">{{currentTimeDisplay}}</span>
        <span class="time-range">{{timeRangeDisplay}}</span>
      </div>
      <div class="scrubber-track" (click)="onScrubClick($event)">
        <div class="scrubber-progress" [style.width.%]="progressPercent"></div>
        <div class="scrubber-handle" [style.left.%]="progressPercent"></div>
      </div>
      <div class="controls">
        <button class="control-btn" (click)="togglePlayback()">
          {{isPlaying ? '⏸' : '▶'}}
        </button>
        <button class="control-btn" (click)="jumpToLive()">LIVE</button>
      </div>
    </div>
  `,
  styles: [`
    .timeline-scrubber {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50px;
      background: rgba(15, 20, 30, 0.95);
      border-top: 1px solid rgba(70, 130, 180, 0.3);
      display: flex;
      align-items: center;
      padding: 0 20px;
      gap: 20px;
    }
    .timeline-info {
      min-width: 150px;
    }
    .time-label {
      font-size: 14px;
      font-weight: 600;
      color: #00ff88;
      font-family: 'SF Mono', 'Monaco', monospace;
    }
    .time-range {
      font-size: 10px;
      color: #667788;
      display: block;
      margin-top: 2px;
    }
    .scrubber-track {
      flex: 1;
      height: 6px;
      background: rgba(40, 50, 65, 0.8);
      border-radius: 3px;
      position: relative;
      cursor: pointer;
    }
    .scrubber-progress {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: linear-gradient(90deg, #3366cc, #4488ff);
      border-radius: 3px;
      pointer-events: none;
    }
    .scrubber-handle {
      position: absolute;
      top: 50%;
      width: 14px;
      height: 14px;
      background: #4488ff;
      border: 2px solid #fff;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      cursor: grab;
      box-shadow: 0 2px 8px rgba(68, 136, 255, 0.5);
    }
    .scrubber-handle:active {
      cursor: grabbing;
    }
    .controls {
      display: flex;
      gap: 10px;
    }
    .control-btn {
      padding: 6px 12px;
      background: rgba(70, 130, 180, 0.3);
      border: none;
      border-radius: 4px;
      color: #aaccee;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .control-btn:hover {
      background: rgba(70, 130, 180, 0.5);
    }
  `]
})
export class TimelineScrubberComponent implements OnInit, OnDestroy {
  @Output() scrub = new EventEmitter<number>();

  isPlaying = true;
  progressPercent = 100;
  currentTimeDisplay = '--:--:--';
  timeRangeDisplay = '-30 min to now';
  
  private intervalId: any;
  private startTime = Date.now() - 30 * 60 * 1000; // 30 minutes ago
  private currentTimestamp = Date.now();

  ngOnInit(): void {
    this.updateTime();
    this.intervalId = setInterval(() => {
      if (this.isPlaying) {
        this.currentTimestamp = Date.now();
        this.updateTime();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateTime(): void {
    const now = new Date(this.currentTimestamp);
    this.currentTimeDisplay = now.toLocaleTimeString();
    this.progressPercent = 100;
    this.timeRangeDisplay = '-30 min to now';
  }

  onScrubClick(event: MouseEvent): void {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    this.progressPercent = percent * 100;
    
    const range = 30 * 60 * 1000; // 30 minutes
    const targetTime = this.startTime + range * percent;
    
    if (percent > 0.95) {
      this.currentTimestamp = Date.now();
    } else {
      this.currentTimestamp = targetTime;
    }
    
    this.updateTime();
    this.scrub.emit(targetTime);
  }

  togglePlayback(): void {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.currentTimestamp = Date.now();
      this.updateTime();
    }
  }

  jumpToLive(): void {
    this.isPlaying = true;
    this.progressPercent = 100;
    this.currentTimestamp = Date.now();
    this.updateTime();
  }
}