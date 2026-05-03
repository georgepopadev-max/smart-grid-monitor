import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="app-header">
      <div class="logo">
        <span class="logo-icon">⚡</span>
        <span class="logo-text">Smart Grid Monitor</span>
      </div>
      
      <div class="grid-selector">
        <select [(ngModel)]="selectedGrid" (change)="onGridChange()">
          <option value="suburban">Suburban Distribution</option>
          <option value="industrial">Industrial Park Grid</option>
          <option value="renewable">Renewable Integration Demo</option>
        </select>
      </div>
      
      <div class="status-indicators">
        <div class="indicator" [class.connected]="wsConnected">
          <span class="dot"></span>
          <span class="label">{{wsConnected ? 'Live' : 'Connecting'}}</span>
        </div>
        <div class="indicator">
          <span class="dot power"></span>
          <span class="label">Grid Online</span>
        </div>
      </div>
      
      <div class="time-display">
        {{currentTime}}
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      height: 60px;
      background: rgba(15, 20, 30, 0.98);
      border-bottom: 1px solid rgba(70, 130, 180, 0.3);
      display: flex;
      align-items: center;
      padding: 0 20px;
      gap: 30px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-icon {
      font-size: 24px;
    }
    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: #e0e6ed;
    }
    .grid-selector select {
      background: rgba(40, 50, 65, 0.8);
      border: 1px solid rgba(70, 130, 180, 0.4);
      border-radius: 6px;
      color: #e0e6ed;
      padding: 8px 12px;
      font-size: 13px;
      cursor: pointer;
      min-width: 200px;
    }
    .grid-selector select:focus {
      outline: none;
      border-color: #4488ff;
    }
    .status-indicators {
      display: flex;
      gap: 20px;
      margin-left: auto;
    }
    .indicator {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ff4444;
    }
    .indicator.connected .dot {
      background: #00ff88;
      box-shadow: 0 0 8px rgba(0, 255, 136, 0.6);
    }
    .dot.power {
      background: #00ff88;
    }
    .label {
      font-size: 12px;
      color: #8899aa;
    }
    .time-display {
      font-family: 'SF Mono', 'Monaco', monospace;
      font-size: 14px;
      color: #aaccee;
    }
  `]
})
export class HeaderComponent {
  @Input() gridName = 'Suburban Distribution';
  @Output() gridChange = new EventEmitter<string>();

  selectedGrid = 'suburban';
  wsConnected = true;
  currentTime = '';

  constructor() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  private updateTime(): void {
    this.currentTime = new Date().toLocaleTimeString();
  }

  onGridChange(): void {
    this.gridChange.emit(this.selectedGrid);
  }
}