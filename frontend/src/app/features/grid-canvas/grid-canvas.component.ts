import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridNode, GridConnection, Alert } from '../../core/websocket/websocket.service';
import { NodeManager } from './canvas/node-manager';
import { AnimationEngine } from './canvas/animation-engine';
import { GridRenderer } from './canvas/grid-renderer';
import { InteractionHandler } from './canvas/interaction-handler';

@Component({
  selector: 'app-grid-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="canvas-container" #canvasContainer>
      <canvas #gridCanvas (click)="onCanvasClick($event)" (mousemove)="onCanvasMouseMove($event)"></canvas>
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
export class GridCanvasComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('gridCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasContainer') containerRef!: ElementRef<HTMLDivElement>;

  @Input() nodes: GridNode[] = [];
  @Input() connections: GridConnection[] = [];
  @Input() activeAlerts: Alert[] = [];

  @Output() nodeSelected = new EventEmitter<GridNode | null>();

  private ctx!: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private lastTime = 0;
  private selectedNodeId: string | null = null;
  private hoverNodeId: string | null = null;

  // Canvas services
  private nodeManager = new NodeManager();
  private animationEngine = new AnimationEngine();
  private gridRenderer!: GridRenderer;
  private interactionHandler!: InteractionHandler;

  ngOnInit(): void {
    this.gridRenderer = new GridRenderer(this.nodeManager, this.animationEngine);
    this.interactionHandler = new InteractionHandler(this.nodeManager);
    this.initEnergyPulses();
  }

  ngAfterViewInit(): void {
    this.initCanvas();
    this.startAnimationLoop();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['connections'] && !changes['connections'].firstChange) {
      const ids = this.connections.map(c => c.id.uuid);
      this.animationEngine.initPulses(ids);
    }
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
    const ids = this.connections.map(c => c.id.uuid);
    this.animationEngine.initPulses(ids);
  }

  private startAnimationLoop(): void {
    const animate = (timestamp: number) => {
      const deltaTime = (timestamp - this.lastTime) / 1000;
      this.lastTime = timestamp;

      this.animationEngine.update(deltaTime);
      this.render();

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  private render(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;

    // Update node positions
    this.nodeManager.updatePositions(this.nodes);

    // Render layers
    this.gridRenderer.renderGrid(ctx, width, height);
    this.gridRenderer.drawConnections(ctx, this.connections, this.activeAlerts);
    this.gridRenderer.drawEnergyPulses(ctx, this.connections, this.activeAlerts);
    this.gridRenderer.drawNodes(ctx, this.nodes, this.selectedNodeId, this.hoverNodeId);
  }

  private onResize(): void {
    this.initCanvas();
  }

  onCanvasClick(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const result = this.interactionHandler.handleClick(x, y, this.nodes);
    this.selectedNodeId = result.nodeId;
    this.nodeSelected.emit(result.node);
  }

  onCanvasMouseMove(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.hoverNodeId = this.interactionHandler.detectHover(x, y, this.nodes);
  }
}