import { Injectable } from '@angular/core';
import { GridNode, GridConnection, Alert } from '../../../core/websocket/websocket.service';
import { NodeManager, NodePosition } from './node-manager';
import { AnimationEngine } from './animation-engine';

@Injectable({
  providedIn: 'root'
})
export class GridRenderer {
  constructor(
    private nodeManager: NodeManager,
    private animationEngine: AnimationEngine
  ) {}

  renderGrid(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.fillStyle = '#0a0e14';
    ctx.fillRect(0, 0, width, height);

    this.drawGridBackground(ctx, width, height);
  }

  private drawGridBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.strokeStyle = 'rgba(30, 60, 90, 0.3)';
    ctx.lineWidth = 1;

    const gridSize = 50;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  drawConnections(
    ctx: CanvasRenderingContext2D,
    connections: GridConnection[],
    activeAlerts: Alert[]
  ): void {
    connections.forEach(conn => {
      const sourcePos = this.nodeManager.getPosition(conn.sourceNodeId.uuid);
      const targetPos = this.nodeManager.getPosition(conn.targetNodeId.uuid);
      if (sourcePos && targetPos) {
        this.drawConnection(ctx, conn, sourcePos, targetPos, activeAlerts);
      }
    });
  }

  private drawConnection(
    ctx: CanvasRenderingContext2D,
    conn: GridConnection,
    source: NodePosition,
    target: NodePosition,
    activeAlerts: Alert[]
  ): void {
    const isActive = conn.active && !this.hasFault(conn, activeAlerts);

    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);

    if (!isActive) {
      ctx.strokeStyle = 'rgba(80, 80, 80, 0.5)';
      ctx.setLineDash([10, 10]);
    } else {
      const loadRatio = conn.currentLoad / conn.capacityKva;
      ctx.strokeStyle = this.getLoadColor(loadRatio);
      ctx.setLineDash([]);
    }

    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  private hasFault(conn: GridConnection, activeAlerts: Alert[]): boolean {
    return activeAlerts.some(alert =>
      (alert.nodeId.uuid === conn.sourceNodeId.uuid || alert.nodeId.uuid === conn.targetNodeId.uuid) &&
      (alert.severity === 'CRITICAL' || alert.type === 'LINE_FAULT')
    );
  }

  private getLoadColor(loadRatio: number): string {
    if (loadRatio > 0.9) return '#ff4444';
    if (loadRatio > 0.7) return '#ffaa00';
    return 'rgba(70, 130, 180, 0.8)';
  }

  drawEnergyPulses(
    ctx: CanvasRenderingContext2D,
    connections: GridConnection[],
    activeAlerts: Alert[]
  ): void {
    connections.forEach(conn => {
      const sourcePos = this.nodeManager.getPosition(conn.sourceNodeId.uuid);
      const targetPos = this.nodeManager.getPosition(conn.targetNodeId.uuid);
      if (sourcePos && targetPos) {
        this.drawConnectionEnergy(ctx, conn, sourcePos, targetPos, activeAlerts);
      }
    });
  }

  private drawConnectionEnergy(
    ctx: CanvasRenderingContext2D,
    conn: GridConnection,
    source: NodePosition,
    target: NodePosition,
    activeAlerts: Alert[]
  ): void {
    const pulses = this.animationEngine.getPulses(conn.id.uuid);
    const isActive = conn.active && !this.hasFault(conn, activeAlerts);
    if (!isActive) return;

    pulses.forEach(pulse => {
      const x = source.x + (target.x - source.x) * pulse.progress;
      const y = source.y + (target.y - source.y) * pulse.progress;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
      gradient.addColorStop(0, 'rgba(255, 220, 100, 0.9)');
      gradient.addColorStop(0.5, 'rgba(255, 180, 50, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 150, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff8e0';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawNodes(
    ctx: CanvasRenderingContext2D,
    nodes: GridNode[],
    selectedNodeId: string | null,
    hoverNodeId: string | null
  ): void {
    nodes.forEach(node => {
      const pos = this.nodeManager.getPosition(node.id.uuid);
      if (pos) {
        this.drawNode(ctx, node, pos, selectedNodeId, hoverNodeId);
      }
    });
  }

  private drawNode(
    ctx: CanvasRenderingContext2D,
    node: GridNode,
    pos: NodePosition,
    selectedNodeId: string | null,
    hoverNodeId: string | null
  ): void {
    const isSelected = selectedNodeId === node.id.uuid;
    const isHovered = hoverNodeId === node.id.uuid;
    const isFault = node.status === 'FAULT';
    const isWarning = node.status === 'WARNING';

    const radius = this.nodeManager.getNodeRadius(node.type);

    // Draw glow
    const powerRatio = Math.min(node.activePower / 10000, 1);
    const glowRadius = radius + 10 + powerRatio * 15;

    const glowGradient = ctx.createRadialGradient(pos.x, pos.y, radius, pos.x, pos.y, glowRadius);

    if (isFault) {
      glowGradient.addColorStop(0, 'rgba(255, 50, 50, 0.8)');
      glowGradient.addColorStop(0.5, 'rgba(255, 50, 50, 0.3)');
      glowGradient.addColorStop(1, 'rgba(255, 50, 50, 0)');
    } else if (isWarning) {
      glowGradient.addColorStop(0, 'rgba(255, 170, 0, 0.7)');
      glowGradient.addColorStop(0.5, 'rgba(255, 170, 0, 0.3)');
      glowGradient.addColorStop(1, 'rgba(255, 170, 0, 0)');
    } else {
      const hue = 200 + powerRatio * 40;
      glowGradient.addColorStop(0, `hsla(${hue}, 80%, 60%, ${0.3 + powerRatio * 0.4})`);
      glowGradient.addColorStop(1, `hsla(${hue}, 80%, 60%, 0)`);
    }

    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw node circle
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);

    if (isFault) {
      ctx.fillStyle = '#ff3333';
    } else if (isWarning) {
      ctx.fillStyle = '#ffaa00';
    } else {
      ctx.fillStyle = this.getNodeColor(node.type);
    }
    ctx.fill();

    // Draw border
    ctx.strokeStyle = isSelected ? '#00ffff' : (isHovered ? '#ffffff' : 'rgba(255,255,255,0.5)');
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.stroke();

    // Draw selection ring
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius + 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw label
    ctx.fillStyle = '#e0e6ed';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(node.name, pos.x, pos.y + radius + 16);
  }

  private getNodeColor(type: string): string {
    switch (type) {
      case 'SUBSTATION': return '#4488ff';
      case 'TRANSFORMER': return '#44aa88';
      case 'FEEDER': return '#88aa44';
      case 'METER': return '#aa8844';
      case 'SENSOR': return '#8844aa';
      default: return '#6688aa';
    }
  }
}