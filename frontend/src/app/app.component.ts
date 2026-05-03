import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridCanvasComponent } from './features/grid-canvas/grid-canvas.component';
import { TelemetryPanelComponent } from './features/telemetry/telemetry-panel.component';
import { AlertBannerComponent } from './features/alerts/alert-banner.component';
import { TimelineScrubberComponent } from './features/grid-canvas/timeline-scrubber.component';
import { HeaderComponent } from './shared/components/header.component';
import { WebSocketService, GridState } from './core/websocket/websocket.service';
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
  nodes: any[] = [];
  connections: any[] = [];
  activeAlerts: any[] = [];
  selectedNode: any = null;

  constructor(private wsService: WebSocketService) {}

  ngOnInit(): void {
    // For demo purposes, we'll simulate data since backend might not be running
    this.initializeSimulatedData();
    
    // Try to connect to WebSocket
    try {
      this.wsService.connect('ws://localhost:8080/grid-websocket');
      
      this.wsService.state$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(state => {
        if (state) {
          this.updateFromState(state);
        }
      });
    } catch (e) {
      console.log('WebSocket connection not available, using simulated data');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.wsService.disconnect();
  }

  private initializeSimulatedData(): void {
    // Create simulated grid nodes
    const gridNodes = [
      { id: { uuid: '1' }, name: '132kV Substation', type: 'SUBSTATION', x: 400, y: 50, status: 'NORMAL', voltage: 132000, current: 200, frequency: 50.02, powerFactor: 0.97, activePower: 45000, reactivePower: 15000 },
      { id: { uuid: '2' }, name: 'Transformer T1', type: 'TRANSFORMER', x: 200, y: 150, status: 'NORMAL', voltage: 11000, current: 150, frequency: 50.01, powerFactor: 0.95, activePower: 8000, reactivePower: 2500 },
      { id: { uuid: '3' }, name: 'Transformer T2', type: 'TRANSFORMER', x: 400, y: 150, status: 'NORMAL', voltage: 11000, current: 180, frequency: 50.02, powerFactor: 0.96, activePower: 9500, reactivePower: 2800 },
      { id: { uuid: '4' }, name: 'Transformer T3', type: 'TRANSFORMER', x: 600, y: 150, status: 'NORMAL', voltage: 11000, current: 160, frequency: 49.99, powerFactor: 0.94, activePower: 8500, reactivePower: 2600 },
      { id: { uuid: '5' }, name: 'Transformer T4', type: 'TRANSFORMER', x: 800, y: 150, status: 'WARNING', voltage: 10500, current: 220, frequency: 50.03, powerFactor: 0.93, activePower: 9800, reactivePower: 3000 },
      // Feeders
      { id: { uuid: '6' }, name: 'T1-F1', type: 'FEEDER', x: 100, y: 250, status: 'NORMAL', voltage: 231, current: 45, frequency: 50.01, powerFactor: 0.92, activePower: 520, reactivePower: 210 },
      { id: { uuid: '7' }, name: 'T1-F2', type: 'FEEDER', x: 80, y: 350, status: 'NORMAL', voltage: 229, current: 38, frequency: 50.00, powerFactor: 0.91, activePower: 450, reactivePower: 180 },
      { id: { uuid: '8' }, name: 'T2-F1', type: 'FEEDER', x: 320, y: 250, status: 'NORMAL', voltage: 232, current: 55, frequency: 50.02, powerFactor: 0.93, activePower: 680, reactivePower: 270 },
      { id: { uuid: '9' }, name: 'T2-F2', type: 'FEEDER', x: 340, y: 350, status: 'NORMAL', voltage: 228, current: 42, frequency: 49.98, powerFactor: 0.90, activePower: 490, reactivePower: 200 },
      { id: { uuid: '10' }, name: 'T3-F1', type: 'FEEDER', x: 520, y: 250, status: 'NORMAL', voltage: 231, current: 48, frequency: 50.01, powerFactor: 0.92, activePower: 580, reactivePower: 230 },
      { id: { uuid: '11' }, name: 'T4-F1', type: 'FEEDER', x: 720, y: 250, status: 'FAULT', voltage: 195, current: 85, frequency: 49.5, powerFactor: 0.85, activePower: 750, reactivePower: 400 },
      // Meters
      { id: { uuid: '12' }, name: 'Meter M1', type: 'METER', x: 100, y: 550, status: 'NORMAL', voltage: 229, current: 25, frequency: 50.00, powerFactor: 0.95, activePower: 280, reactivePower: 100 },
      { id: { uuid: '13' }, name: 'Meter M2', type: 'METER', x: 360, y: 550, status: 'NORMAL', voltage: 230, current: 32, frequency: 50.01, powerFactor: 0.94, activePower: 360, reactivePower: 130 },
      { id: { uuid: '14' }, name: 'Meter M3', type: 'METER', x: 540, y: 550, status: 'NORMAL', voltage: 231, current: 28, frequency: 49.99, powerFactor: 0.96, activePower: 320, reactivePower: 110 },
      { id: { uuid: '15' }, name: 'Meter M4', type: 'METER', x: 760, y: 550, status: 'NORMAL', voltage: 228, current: 22, frequency: 50.02, powerFactor: 0.93, activePower: 250, reactivePower: 95 },
    ];

    this.nodes = gridNodes;

    // Create connections
    this.connections = [
      { id: { uuid: 'c1' }, sourceNodeId: { uuid: '1' }, targetNodeId: { uuid: '2' }, lineType: '132kV', capacityKva: 50000, currentLoad: 8000, active: true },
      { id: { uuid: 'c2' }, sourceNodeId: { uuid: '1' }, targetNodeId: { uuid: '3' }, lineType: '132kV', capacityKva: 50000, currentLoad: 9500, active: true },
      { id: { uuid: 'c3' }, sourceNodeId: { uuid: '1' }, targetNodeId: { uuid: '4' }, lineType: '132kV', capacityKva: 50000, currentLoad: 8500, active: true },
      { id: { uuid: 'c4' }, sourceNodeId: { uuid: '1' }, targetNodeId: { uuid: '5' }, lineType: '132kV', capacityKva: 50000, currentLoad: 9800, active: true },
      { id: { uuid: 'c5' }, sourceNodeId: { uuid: '2' }, targetNodeId: { uuid: '6' }, lineType: '11kV', capacityKva: 5000, currentLoad: 520, active: true },
      { id: { uuid: 'c6' }, sourceNodeId: { uuid: '6' }, targetNodeId: { uuid: '7' }, lineType: '11kV', capacityKva: 5000, currentLoad: 450, active: true },
      { id: { uuid: 'c7' }, sourceNodeId: { uuid: '3' }, targetNodeId: { uuid: '8' }, lineType: '11kV', capacityKva: 5000, currentLoad: 680, active: true },
      { id: { uuid: 'c8' }, sourceNodeId: { uuid: '8' }, targetNodeId: { uuid: '9' }, lineType: '11kV', capacityKva: 5000, currentLoad: 490, active: true },
      { id: { uuid: 'c9' }, sourceNodeId: { uuid: '4' }, targetNodeId: { uuid: '10' }, lineType: '11kV', capacityKva: 5000, currentLoad: 580, active: true },
      { id: { uuid: 'c10' }, sourceNodeId: { uuid: '5' }, targetNodeId: { uuid: '11' }, lineType: '11kV', capacityKva: 5000, currentLoad: 750, active: false },
      { id: { uuid: 'c11' }, sourceNodeId: { uuid: '7' }, targetNodeId: { uuid: '12' }, lineType: '400V', capacityKva: 1000, currentLoad: 280, active: true },
      { id: { uuid: 'c12' }, sourceNodeId: { uuid: '9' }, targetNodeId: { uuid: '13' }, lineType: '400V', capacityKva: 1000, currentLoad: 360, active: true },
      { id: { uuid: 'c13' }, sourceNodeId: { uuid: '10' }, targetNodeId: { uuid: '14' }, lineType: '400V', capacityKva: 1000, currentLoad: 320, active: true },
      { id: { uuid: 'c14' }, sourceNodeId: { uuid: '11' }, targetNodeId: { uuid: '15' }, lineType: '400V', capacityKva: 1000, currentLoad: 250, active: true },
    ];

    // Create alerts
    this.activeAlerts = [
      { id: { uuid: 'a1' }, nodeId: { uuid: '11' }, nodeName: 'T4-F1', type: 'LINE_FAULT', severity: 'CRITICAL', triggeredAt: new Date().toISOString(), acknowledgedBy: null },
      { id: { uuid: 'a2' }, nodeId: { uuid: '5' }, nodeName: 'Transformer T4', type: 'OVERLOAD', severity: 'WARNING', triggeredAt: new Date(Date.now() - 300000).toISOString(), acknowledgedBy: 'Operator1' },
    ];
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

  onNodeSelected(node: any): void {
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