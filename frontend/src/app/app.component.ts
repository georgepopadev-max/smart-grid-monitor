import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridCanvasComponent } from './features/grid-canvas/grid-canvas.component';
import { TelemetryPanelComponent } from './features/telemetry/telemetry-panel.component';
import { AlertBannerComponent } from './features/alerts/alert-banner.component';
import { TimelineScrubberComponent } from './features/grid-canvas/timeline-scrubber.component';
import { HeaderComponent } from './shared/components/header.component';
import { WebSocketService, GridState, GridNode, GridConnection, Alert } from './core/websocket/websocket.service';
import { MOCK_GRID_STATE } from './core/mock-data';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    GridCanvasComponent,
    TelemetryPanelComponent,
    AlertBannerComponent,
    TimelineScrubberComponent,
    HeaderComponent
  ],
  template: `
    <div class="app-container">
      <app-header [gridName]="currentGridName" (gridChange)="onGridChange($event)"></app-header>
      
      <div class="main-content">
        <app-grid-canvas
          [nodes]="nodes"
          [connections]="connections"
          [activeAlerts]="activeAlerts"
          (nodeSelected)="onNodeSelected($event)">
        </app-grid-canvas>
        
        <app-telemetry-panel
          *ngIf="selectedNode"
          [node]="selectedNode"
          (close)="onClosePanel()">
        </app-telemetry-panel>
      </div>
      
      <app-alert-banner
        [alerts]="activeAlerts"
        (acknowledge)="onAcknowledgeAlert($event)">
      </app-alert-banner>
      
      <app-timeline-scrubber
        (scrub)="onTimeScrub($event)">
      </app-timeline-scrubber>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: linear-gradient(135deg, #0a0e14 0%, #1a1f2e 100%);
    }
    .main-content {
      flex: 1;
      display: flex;
      position: relative;
      overflow: hidden;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentGridName = 'Suburban Distribution';
  nodes: GridNode[] = [];
  connections: GridConnection[] = [];
  activeAlerts: Alert[] = [];
  selectedNode: GridNode | null = null;
  isUsingMockData = false;

  constructor(private wsService: WebSocketService) {}

  ngOnInit(): void {
    // Subscribe to connection status to track if we're using mock data
    this.wsService.status$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => {
      this.isUsingMockData = status === 'disconnected' && this.nodes.length === 0;
    });

    // Connect to WebSocket (will fallback to mock data if unavailable)
    this.wsService.connect();

    // Subscribe to grid state updates
    this.wsService.state$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(state => {
      if (state) {
        this.updateFromState(state);
        this.currentGridName = state.gridName;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.wsService.disconnect();
  }

  private updateFromState(state: GridState): void {
    this.nodes = state.nodes || [];
    this.connections = state.connections || [];
    this.activeAlerts = state.activeAlerts || [];
  }

  onGridChange(gridName: string): void {
    this.currentGridName = gridName;
    // In a real app, would switch grid configurations
  }

  onNodeSelected(node: GridNode | null): void {
    this.selectedNode = node;
  }

  onClosePanel(): void {
    this.selectedNode = null;
  }

  onAcknowledgeAlert(alertId: string): void {
    const alert = this.activeAlerts.find(a => a.id.uuid === alertId);
    if (alert) {
      alert.acknowledgedBy = 'Operator';
    }
  }

  onTimeScrub(timestamp: number): void {
    console.log('Scrubbing to:', timestamp);
  }
}