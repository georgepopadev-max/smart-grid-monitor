import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Alert {
  id: { uuid: string };
  nodeId: { uuid: string };
  nodeName: string;
  type: string;
  severity: string;
  triggeredAt: string;
  acknowledgedBy: string | null;
}

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert-banner" *ngIf="alerts.length > 0">
      <div class="alerts-container">
        <div class="alert-item" *ngFor="let alert of alerts"
             [class.critical]="alert.severity === 'CRITICAL'"
             [class.warning]="alert.severity === 'WARNING'"
             [class.acknowledged]="alert.acknowledgedBy">
          <div class="alert-icon">
            <span *ngIf="alert.severity === 'CRITICAL'">⚠</span>
            <span *ngIf="alert.severity === 'WARNING'">⚡</span>
          </div>
          <div class="alert-content">
            <span class="alert-type">{{formatAlertType(alert.type)}}</span>
            <span class="alert-node">{{alert.nodeName}}</span>
            <span class="alert-time">{{formatTime(alert.triggeredAt)}}</span>
          </div>
          <button class="ack-btn" *ngIf="!alert.acknowledgedBy" (click)="onAcknowledge(alert.id.uuid)">
            ACK
          </button>
          <span class="ack-status" *ngIf="alert.acknowledgedBy">
            ✓ {{alert.acknowledgedBy}}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .alert-banner {
      position: fixed;
      top: 70px;
      right: 20px;
      z-index: 100;
      max-width: 400px;
    }
    .alerts-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .alert-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(20, 30, 45, 0.95);
      border-radius: 8px;
      border-left: 4px solid;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      animation: slideIn 0.3s ease;
    }
    .alert-item.critical {
      border-left-color: #ff4444;
      background: linear-gradient(90deg, rgba(255,50,50,0.15), rgba(20,30,45,0.95));
    }
    .alert-item.warning {
      border-left-color: #ffaa00;
      background: linear-gradient(90deg, rgba(255,170,0,0.15), rgba(20,30,45,0.95));
    }
    .alert-item.acknowledged {
      opacity: 0.7;
    }
    .alert-icon {
      font-size: 20px;
    }
    .alert-item.critical .alert-icon { color: #ff4444; }
    .alert-item.warning .alert-icon { color: #ffaa00; }
    .alert-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .alert-type {
      font-weight: 600;
      color: #fff;
    }
    .alert-node {
      font-size: 12px;
      color: #a0aec0;
    }
    .alert-time {
      font-size: 11px;
      color: #667788;
    }
    .ack-btn {
      padding: 6px 12px;
      background: #ff6644;
      border: none;
      border-radius: 4px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .ack-btn:hover {
      background: #ff8866;
    }
    .ack-status {
      font-size: 11px;
      color: #44aa88;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class AlertBannerComponent {
  @Input() alerts: Alert[] = [];
  @Output() acknowledge = new EventEmitter<string>();

  formatAlertType(type: string): string {
    return type.replace(/_/g, ' ');
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  }

  onAcknowledge(alertId: string): void {
    this.acknowledge.emit(alertId);
  }
}