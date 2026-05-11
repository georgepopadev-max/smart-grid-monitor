import { Injectable } from '@angular/core';
import { GridNode } from '../../../core/websocket/websocket.service';
import { NodeManager } from './node-manager';

export interface NodeClickResult {
  node: GridNode | null;
  nodeId: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class InteractionHandler {
  constructor(private nodeManager: NodeManager) {}

  handleClick(
    x: number,
    y: number,
    nodes: GridNode[]
  ): NodeClickResult {
    for (const node of nodes) {
      const pos = this.nodeManager.getPosition(node.id.uuid);
      if (!pos) continue;

      const dx = x - pos.x;
      const dy = y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const radius = this.nodeManager.getNodeRadius(node.type);
      if (distance <= radius + 5) {
        return { node, nodeId: node.id.uuid };
      }
    }

    return { node: null, nodeId: null };
  }

  detectHover(
    x: number,
    y: number,
    nodes: GridNode[]
  ): string | null {
    for (const node of nodes) {
      const pos = this.nodeManager.getPosition(node.id.uuid);
      if (!pos) continue;

      const dx = x - pos.x;
      const dy = y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const radius = this.nodeManager.getNodeRadius(node.type);
      if (distance <= radius + 5) {
        return node.id.uuid;
      }
    }
    return null;
  }
}