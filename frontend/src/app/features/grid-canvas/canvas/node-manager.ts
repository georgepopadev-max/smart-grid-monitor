import { Injectable } from '@angular/core';
import { GridNode } from '../../../core/websocket/websocket.service';

export interface NodePosition {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root'
})
export class NodeManager {
  private nodePositions = new Map<string, NodePosition>();

  updatePositions(nodes: GridNode[]): void {
    this.nodePositions.clear();
    nodes.forEach(node => {
      this.nodePositions.set(node.id.uuid, { x: node.x, y: node.y });
    });
  }

  getPosition(nodeId: string): NodePosition | undefined {
    return this.nodePositions.get(nodeId);
  }

  getNodeRadius(type: string): number {
    switch (type) {
      case 'SUBSTATION': return 20;
      case 'TRANSFORMER': return 16;
      case 'METER': return 8;
      case 'FEEDER': return 10;
      case 'SENSOR': return 10;
      default: return 12;
    }
  }

  clear(): void {
    this.nodePositions.clear();
  }
}