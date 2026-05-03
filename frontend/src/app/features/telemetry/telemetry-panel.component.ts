import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Node {
  id: { uuid: string };
  name: string;
  type: string;
  x: number;
  y: number;
  status: string;
  voltage: number;
  current: number;
  frequency: number;
  powerFactor: number;
  activePower: number;
  reactivePower: number;
}

@Component({
  selector: 'app-telemetry-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="telemetry-panel">
      <div class="panel-header">
        <h3>{{node.name}}</h3>
        <span class="node-type">{{node.type}}</span>
        <button class="close-btn" (click)="onClose()">×</button>
      </div>

      <div class="gauges-grid">
        <div class="gauge">
          <div class="gauge-label">Voltage</div>
          <div class="gauge-value" [class.warning]="node.voltage < 220 || node.voltage > 240">
            {{formatVoltage(node.voltage)}}
          </div>
          <div class="gauge-unit">V</div>
        </div>

        <div class="gauge">
          <div class="gauge-label">Current</div>
          <div class="gauge-value">{{node.current.toFixed(1)}}</div>
          <div class="gauge-unit">A</div>
        </div>

        <div class="gauge">
          <div class="gauge-label">Frequency</div>
          <div class="gauge-value" [class.warning]="node.frequency < 49.9 || node.frequency > 50.1">
            {{node.frequency.toFixed(2)}}
          </div>
          <div class="gauge-unit">Hz</div>
        </div>

        <div class="gauge">
          <div class="gauge-label">Power Factor</div>
          <div class="gauge-value" [class.warning]="node.powerFactor < 0.9">
            {{node.powerFactor.toFixed(3)}}
          </div>
          <div class="gauge-unit">PF</div>
        </div>

        <div class="gauge">
          <div class="gauge-label">Active Power</div>
          <div class="gauge-value">{{formatPower(node.activePower)}}</div>
          <div class="gauge-unit">kW</div>
        </div>

        <div class="gauge">
          <div class="gauge-label">Reactive Power</div>
          <div class="gauge-value">{{formatPower(node.reactivePower)}}</div>
          <div class="gauge-unit">kVAr</div>
        </div>
      </div>

      <div class="sparkline-container">
        <div class="sparkline-header">Voltage History (5 min)</div>
        <canvas #sparklineCanvas class="sparkline"></canvas>
      </div>

      <div class="actions">
        <button class="action-btn" *ngIf="node.status === 'FAULT'">Isolate</button>
        <button class="action-btn secondary">View Details</button>
      </div>
    </div>
  `,
  styles: [`
    .telemetry-panel {
      position: absolute;
      right: 0;
      top: 0;
      width: 320px;
      height: 100%;
      background: rgba(15, 20, 30, 0.98);
      border-left: 1px solid rgba(70, 130, 180, 0.3);
      padding: 20px;
      overflow-y: auto;
      animation: slideIn 0.3s ease;
      z-index: 50;
    }
    .panel-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid rgba(70, 130, 180, 0.2);
    }
    .panel-header h3 {
      flex: 1;
      margin: 0;
      font-size: 16px;
      color: #e0e6ed;
    }
    .node-type {
      font-size: 11px;
      padding: 4px 8px;
      background: rgba(70, 130, 180, 0.3);
      border-radius: 4px;
      color: #88bbdd;
    }
    .close-btn {
      width: 28px;
      height: 28px;
      background: rgba(255,255,255,0.1);
      border: none;
      border-radius: 50%;
      color: #8899aa;
      font-size: 20px;
      cursor: pointer;
      line-height: 1;
    }
    .close-btn:hover {
      background: rgba(255,255,255,0.2);
      color: #fff;
    }
    .gauges-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }
    .gauge {
      background: rgba(30, 40, 55, 0.6);
      padding: 12px;
      border-radius: 8px;
      text-align: center;
    }
    .gauge-label {
      font-size: 11px;
      color: #667788;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    .gauge-value {
      font-size: 22px;
      font-weight: 600;
      color: #00ff88;
      font-family: 'SF Mono', 'Monaco', monospace;
    }
    .gauge-value.warning {
      color: #ffaa00;
    }
    .gauge-unit {
      font-size: 11px;
      color: #556677;
      margin-top: 2px;
    }
    .sparkline-container {
      background: rgba(30, 40, 55, 0.6);
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .sparkline-header {
      font-size: 11px;
      color: #667788;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    .sparkline {
      width: 100%;
      height: 80px;
    }
    .actions {
      display: flex;
      gap: 10px;
    }
    .action-btn {
      flex: 1;
      padding: 10px;
      background: linear-gradient(135deg, #4488ff, #3366cc);
      border: none;
      border-radius: 6px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(68, 136, 255, 0.4);
    }
    .action-btn.secondary {
      background: rgba(70, 130, 180, 0.3);
    }
    .action-btn.secondary:hover {
      background: rgba(70, 130, 180, 0.5);
    }
    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
  `]
})
export class TelemetryPanelComponent implements OnInit, OnChanges {
  @ViewChild('sparklineCanvas') sparklineCanvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() node!: Node;
  @Output() close = new EventEmitter<void>();

  private voltageHistory: number[] = [];
  private maxHistoryPoints = 60;

  ngOnInit(): void {
    this.initVoltageHistory();
    this.startSparklineUpdates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['node'] && !changes['node'].firstChange) {
      this.addVoltageReading(this.node.voltage);
    }
  }

  private initVoltageHistory(): void {
    for (let i = 0; i < this.maxHistoryPoints; i++) {
      this.voltageHistory.push(230 + (Math.random() - 0.5) * 10);
    }
  }

  private addVoltageReading(voltage: number): void {
    this.voltageHistory.push(voltage);
    if (this.voltageHistory.length > this.maxHistoryPoints) {
      this.voltageHistory.shift();
    }
    this.drawSparkline();
  }

  private startSparklineUpdates(): void {
    setInterval(() => {
      if (this.node) {
        this.addVoltageReading(this.node.voltage);
      }
    }, 5000);
  }

  private drawSparkline(): void {
    const canvas = this.sparklineCanvasRef?.nativeElement;
    if (!canvas || this.voltageHistory.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = canvas.offsetWidth * 2;
    const height = canvas.height = 80 * 2;
    ctx.scale(2, 2);

    const w = canvas.offsetWidth;
    const h = 80;

    ctx.clearRect(0, 0, w, h);

    const min = Math.min(...this.voltageHistory) - 5;
    const max = Math.max(...this.voltageHistory) + 5;
    const range = max - min || 1;

    const getY = (v: number) => h - ((v - min) / range) * (h - 10) - 5;

    // Draw gradient fill
    ctx.beginPath();
    ctx.moveTo(0, h);
    this.voltageHistory.forEach((v, i) => {
      const x = (i / (this.voltageHistory.length - 1)) * w;
      ctx.lineTo(x, getY(v));
    });
    ctx.lineTo(w, h);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, 'rgba(0, 255, 136, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 255, 136, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    this.voltageHistory.forEach((v, i) => {
      const x = (i / (this.voltageHistory.length - 1)) * w;
      if (i === 0) ctx.moveTo(x, getY(v));
      else ctx.lineTo(x, getY(v));
    });
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  formatVoltage(v: number): string {
    if (v > 1000) return (v / 1000).toFixed(1);
    return v.toFixed(1);
  }

  formatPower(p: number): string {
    if (Math.abs(p) >= 1000) return (p / 1000).toFixed(2);
    return p.toFixed(2);
  }

  onClose(): void {
    this.close.emit();
  }
}