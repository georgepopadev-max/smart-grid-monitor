import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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

interface Connection {
  id: { uuid: string };
  sourceNodeId: { uuid: string };
  targetNodeId: { uuid: string };
  lineType: string;
  capacityKva: number;
  currentLoad: number;
  active: boolean;
}

interface Alert {
  id: { uuid: string };
  nodeId: { uuid: string };
  nodeName: string;
  type: string;
  severity: string;
  triggeredAt: string;
  acknowledgedBy: string | null;
}

interface EnergyPulse {
  connectionId: string;
  progress: number;
  speed: number;
}

@Component({
  selector: 'app-grid-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="canvas-container" #canvasContainer>
      <canvas #gridCanvas></canvas>
    </div>
  `,
  styles: [`
    .canvas-container {
      flex: 1;
      position: relative;
      overflow: hidden;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class GridCanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('gridCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasContainer') containerRef!: ElementRef<HTMLDivElement>;

  @Input() nodes: Node[] = [];
  @Input() connections: Connection[] = [];
  @Input() activeAlerts: Alert[] = [];

  @Output() nodeSelected = new EventEmitter<Node>();

  private ctx!: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private energyPulses: EnergyPulse[] = [];
  private lastTime = 0;
  private nodePositions = new Map<string, { x: number; y: number }>();
  private selectedNodeId: string | null = null;
  private hoverNodeId: string | null = null;

  ngOnInit(): void {
    this.initEnergyPulses();
  }

  ngAfterViewInit(): void {
    this.initCanvas();
    this.startAnimationLoop();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const container = this.containerRef.nativeElement;
    const rect = container.getBoundingClientRect();
    
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    this.ctx = canvas.getContext('2d')!;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  private initEnergyPulses(): void {
    this.energyPulses = [];
    this.connections.forEach(conn => {
      for (let i = 0; i < 3; i++) {
        this.energyPulses.push({
          connectionId: conn.id.uuid,
          progress: Math.random(),
          speed: 0.3 + Math.random() * 0.2
        });
      }
    });
  }

  private startAnimationLoop(): void {
    const animate = (timestamp: number) => {
      const deltaTime = (timestamp - this.lastTime) / 1000;
      this.lastTime = timestamp;

      this.update(deltaTime);
      this.render();

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  private update(deltaTime: number): void {
    // Update energy pulses
    this.energyPulses.forEach(pulse => {
      pulse.progress += pulse.speed * deltaTime;
      if (pulse.progress > 1) {
        pulse.progress = 0;
      }
    });
  }

  private render(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;

    // Clear canvas
    ctx.fillStyle = '#0a0e14';
    ctx.fillRect(0, 0, width, height);

    // Draw grid background
    this.drawGridBackground(ctx, width, height);

    // Store node positions
    this.nodePositions.clear();
    this.nodes.forEach(node => {
      this.nodePositions.set(node.id.uuid, { x: node.x, y: node.y });
    });

    // Draw connections
    this.connections.forEach(conn => {
      const sourcePos = this.nodePositions.get(conn.sourceNodeId.uuid);
      const targetPos = this.nodePositions.get(conn.targetNodeId.uuid);
      if (sourcePos && targetPos) {
        this.drawConnection(ctx, conn, sourcePos, targetPos);
      }
    });

    // Draw energy pulses
    this.connections.forEach(conn => {
      const sourcePos = this.nodePositions.get(conn.sourceNodeId.uuid);
      const targetPos = this.nodePositions.get(conn.targetNodeId.uuid);
      if (sourcePos && targetPos) {
        this.drawEnergyPulses(ctx, conn, sourcePos, targetPos);
      }
    });

    // Draw nodes
    this.nodes.forEach(node => {
      const pos = this.nodePositions.get(node.id.uuid);
      if (pos) {
        this.drawNode(ctx, node, pos);
      }
    });
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

  private drawConnection(ctx: CanvasRenderingContext2D, conn: Connection, source: { x: number; y: number }, target: { x: number; y: number }): void {
    const isActive = conn.active && !this.hasFaultOnConnection(conn);

    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);

    if (!isActive) {
      ctx.strokeStyle = 'rgba(80, 80, 80, 0.5)';
      ctx.setLineDash([10, 10]);
    } else {
      const loadRatio = conn.currentLoad / conn.capacityKva;
      const color = this.getLoadColor(loadRatio);
      ctx.strokeStyle = color;
      ctx.setLineDash([]);
    }

    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  private hasFaultOnConnection(conn: Connection): boolean {
    return this.activeAlerts.some(alert => {
      return (alert.nodeId.uuid === conn.sourceNodeId.uuid || alert.nodeId.uuid === conn.targetNodeId.uuid) &&
             (alert.severity === 'CRITICAL' || alert.type === 'LINE_FAULT');
    });
  }

  private getLoadColor(loadRatio: number): string {
    if (loadRatio > 0.9) return '#ff4444';
    if (loadRatio > 0.7) return '#ffaa00';
    return 'rgba(70, 130, 180, 0.8)';
  }

  private drawEnergyPulses(ctx: CanvasRenderingContext2D, conn: Connection, source: { x: number; y: number }, target: { x: number; y: number }): void {
    const pulses = this.energyPulses.filter(p => p.connectionId === conn.id.uuid);
    const isActive = conn.active && !this.hasFaultOnConnection(conn);

    if (!isActive) return;

    pulses.forEach(pulse => {
      const x = source.x + (target.x - source.x) * pulse.progress;
      const y = source.y + (target.y - source.y) * pulse.progress;

      // Draw glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
      gradient.addColorStop(0, 'rgba(255, 220, 100, 0.9)');
      gradient.addColorStop(0.5, 'rgba(255, 180, 50, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 150, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw core
      ctx.fillStyle = '#fff8e0';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  private drawNode(ctx: CanvasRenderingContext2D, node: Node, pos: { x: number; y: number }): void {
    const isSelected = this.selectedNodeId === node.id.uuid;
    const isHovered = this.hoverNodeId === node.id.uuid;
    const isFault = node.status === 'FAULT';
    const isWarning = node.status === 'WARNING';

    let radius = 12;
    if (node.type === 'SUBSTATION') radius = 20;
    else if (node.type === 'TRANSFORMER') radius = 16;
    else if (node.type === 'METER') radius = 8;
    else radius = 10;

    // Draw glow based on power/load
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

    // Draw node label
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

  private onResize(): void {
    this.initCanvas();
  }

  onCanvasClick(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked node
    for (const node of this.nodes) {
      const pos = this.nodePositions.get(node.id.uuid);
      if (pos) {
        const dx = x - pos.x;
        const dy = y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let radius = 12;
        if (node.type === 'SUBSTATION') radius = 20;
        else if (node.type === 'TRANSFORMER') radius = 16;
        else radius = 10;

        if (distance <= radius + 5) {
          this.selectedNodeId = node.id.uuid;
          this.nodeSelected.emit(node);
          return;
        }
      }
    }

    // Clicked on empty space
    this.selectedNodeId = null;
    this.nodeSelected.emit(null as any);
  }
}