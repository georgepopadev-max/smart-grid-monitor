import { GridState } from './websocket/websocket.service';

/**
 * Mock data for demo/offline mode when WebSocket backend is unavailable.
 * Represents a realistic suburban distribution network.
 */
export const MOCK_GRID_STATE: GridState = {
  gridId: { uuid: 'suburban-grid-001' },
  gridName: 'Suburban Distribution Network',
  timestamp: new Date().toISOString(),
  nodes: [
    // Primary Substation (132kV)
    {
      id: { uuid: 'node-001' },
      name: '132kV Main Substation',
      type: 'SUBSTATION',
      x: 400,
      y: 50,
      status: 'NORMAL',
      voltage: 132000,
      current: 245,
      frequency: 50.02,
      powerFactor: 0.97,
      activePower: 52000,
      reactivePower: 17500
    },
    // Secondary Transformers
    {
      id: { uuid: 'node-002' },
      name: 'Transformer T1',
      type: 'TRANSFORMER',
      x: 180,
      y: 160,
      status: 'NORMAL',
      voltage: 11000,
      current: 180,
      frequency: 50.01,
      powerFactor: 0.95,
      activePower: 9500,
      reactivePower: 3000
    },
    {
      id: { uuid: 'node-003' },
      name: 'Transformer T2',
      type: 'TRANSFORMER',
      x: 380,
      y: 160,
      status: 'NORMAL',
      voltage: 11000,
      current: 195,
      frequency: 50.00,
      powerFactor: 0.96,
      activePower: 10200,
      reactivePower: 3200
    },
    {
      id: { uuid: 'node-004' },
      name: 'Transformer T3',
      type: 'TRANSFORMER',
      x: 580,
      y: 160,
      status: 'WARNING',
      voltage: 10700,
      current: 215,
      frequency: 49.98,
      powerFactor: 0.94,
      activePower: 10500,
      reactivePower: 3500
    },
    {
      id: { uuid: 'node-005' },
      name: 'Transformer T4',
      type: 'TRANSFORMER',
      x: 780,
      y: 160,
      status: 'NORMAL',
      voltage: 11000,
      current: 165,
      frequency: 50.02,
      powerFactor: 0.95,
      activePower: 8700,
      reactivePower: 2800
    },
    // Distribution Feeders from T1
    {
      id: { uuid: 'node-006' },
      name: 'T1-F1 (North)',
      type: 'FEEDER',
      x: 100,
      y: 260,
      status: 'NORMAL',
      voltage: 231,
      current: 52,
      frequency: 50.01,
      powerFactor: 0.92,
      activePower: 620,
      reactivePower: 250
    },
    {
      id: { uuid: 'node-007' },
      name: 'T1-F2 (South)',
      type: 'FEEDER',
      x: 140,
      y: 380,
      status: 'NORMAL',
      voltage: 229,
      current: 44,
      frequency: 50.00,
      powerFactor: 0.91,
      activePower: 520,
      reactivePower: 210
    },
    // Distribution Feeders from T2
    {
      id: { uuid: 'node-008' },
      name: 'T2-F1 (North)',
      type: 'FEEDER',
      x: 300,
      y: 260,
      status: 'NORMAL',
      voltage: 232,
      current: 58,
      frequency: 50.02,
      powerFactor: 0.93,
      activePower: 720,
      reactivePower: 290
    },
    {
      id: {uuid: 'node-009'},
      name: 'T2-F2 (South)',
      type: 'FEEDER',
      x: 340,
      y: 380,
      status: 'NORMAL',
      voltage: 228,
      current: 48,
      frequency: 49.99,
      powerFactor: 0.90,
      activePower: 560,
      reactivePower: 230
    },
    // Distribution Feeders from T3 (has warning status)
    {
      id: { uuid: 'node-010' },
      name: 'T3-F1 (North)',
      type: 'FEEDER',
      x: 500,
      y: 260,
      status: 'NORMAL',
      voltage: 231,
      current: 65,
      frequency: 50.01,
      powerFactor: 0.92,
      activePower: 780,
      reactivePower: 310
    },
    {
      id: { uuid: 'node-011' },
      name: 'T3-F2 (South)',
      type: 'FEEDER',
      x: 540,
      y: 380,
      status: 'FAULT',
      voltage: 185,
      current: 95,
      frequency: 48.5,
      powerFactor: 0.78,
      activePower: 820,
      reactivePower: 520
    },
    // Distribution Feeders from T4
    {
      id: { uuid: 'node-012' },
      name: 'T4-F1 (North)',
      type: 'FEEDER',
      x: 700,
      y: 260,
      status: 'NORMAL',
      voltage: 230,
      current: 42,
      frequency: 50.02,
      powerFactor: 0.94,
      activePower: 500,
      reactivePower: 190
    },
    // Customer Meters
    {
      id: { uuid: 'node-013' },
      name: 'Residential M1',
      type: 'METER',
      x: 80,
      y: 500,
      status: 'NORMAL',
      voltage: 229,
      current: 28,
      frequency: 50.00,
      powerFactor: 0.95,
      activePower: 320,
      reactivePower: 115
    },
    {
      id: { uuid: 'node-014' },
      name: 'Commercial M2',
      type: 'METER',
      x: 200,
      y: 500,
      status: 'NORMAL',
      voltage: 231,
      current: 45,
      frequency: 50.01,
      powerFactor: 0.93,
      activePower: 540,
      reactivePower: 200
    },
    {
      id: { uuid: 'node-015' },
      name: 'Industrial M3',
      type: 'METER',
      x: 400,
      y: 500,
      status: 'NORMAL',
      voltage: 232,
      current: 72,
      frequency: 50.02,
      powerFactor: 0.94,
      activePower: 880,
      reactivePower: 330
    },
    {
      id: { uuid: 'node-016' },
      name: 'Residential M4',
      type: 'METER',
      x: 560,
      y: 500,
      status: 'NORMAL',
      voltage: 228,
      current: 32,
      frequency: 49.99,
      powerFactor: 0.96,
      activePower: 380,
      reactivePower: 130
    },
    {
      id: { uuid: 'node-017' },
      name: 'Commercial M5',
      type: 'METER',
      x: 720,
      y: 500,
      status: 'WARNING',
      voltage: 225,
      current: 85,
      frequency: 49.95,
      powerFactor: 0.88,
      activePower: 920,
      reactivePower: 420
    }
  ],
  connections: [
    // Substation to Transformers (132kV)
    { id: { uuid: 'conn-001' }, sourceNodeId: { uuid: 'node-001' }, targetNodeId: { uuid: 'node-002' }, lineType: '132kV', capacityKva: 50000, currentLoad: 9500, active: true },
    { id: { uuid: 'conn-002' }, sourceNodeId: { uuid: 'node-001' }, targetNodeId: { uuid: 'node-003' }, lineType: '132kV', capacityKva: 50000, currentLoad: 10200, active: true },
    { id: { uuid: 'conn-003' }, sourceNodeId: { uuid: 'node-001' }, targetNodeId: { uuid: 'node-004' }, lineType: '132kV', capacityKva: 50000, currentLoad: 10500, active: true },
    { id: { uuid: 'conn-004' }, sourceNodeId: { uuid: 'node-001' }, targetNodeId: { uuid: 'node-005' }, lineType: '132kV', capacityKva: 50000, currentLoad: 8700, active: true },
    // Transformers to Feeders (11kV)
    { id: { uuid: 'conn-005' }, sourceNodeId: { uuid: 'node-002' }, targetNodeId: { uuid: 'node-006' }, lineType: '11kV', capacityKva: 5000, currentLoad: 620, active: true },
    { id: { uuid: 'conn-006' }, sourceNodeId: { uuid: 'node-002' }, targetNodeId: { uuid: 'node-007' }, lineType: '11kV', capacityKva: 5000, currentLoad: 520, active: true },
    { id: { uuid: 'conn-007' }, sourceNodeId: { uuid: 'node-003' }, targetNodeId: { uuid: 'node-008' }, lineType: '11kV', capacityKva: 5000, currentLoad: 720, active: true },
    { id: { uuid: 'conn-008' }, sourceNodeId: { uuid: 'node-003' }, targetNodeId: { uuid: 'node-009' }, lineType: '11kV', capacityKva: 5000, currentLoad: 560, active: true },
    { id: { uuid: 'conn-009' }, sourceNodeId: { uuid: 'node-004' }, targetNodeId: { uuid: 'node-010' }, lineType: '11kV', capacityKva: 5000, currentLoad: 780, active: true },
    { id: { uuid: 'conn-010' }, sourceNodeId: { uuid: 'node-004' }, targetNodeId: { uuid: 'node-011' }, lineType: '11kV', capacityKva: 5000, currentLoad: 820, active: false },
    { id: { uuid: 'conn-011' }, sourceNodeId: { uuid: 'node-005' }, targetNodeId: { uuid: 'node-012' }, lineType: '11kV', capacityKva: 5000, currentLoad: 500, active: true },
    // Feeders to Meters (400V)
    { id: { uuid: 'conn-012' }, sourceNodeId: { uuid: 'node-006' }, targetNodeId: { uuid: 'node-013' }, lineType: '400V', capacityKva: 1000, currentLoad: 320, active: true },
    { id: { uuid: 'conn-013' }, sourceNodeId: { uuid: 'node-006' }, targetNodeId: { uuid: 'node-014' }, lineType: '400V', capacityKva: 1000, currentLoad: 540, active: true },
    { id: { uuid: 'conn-014' }, sourceNodeId: { uuid: 'node-008' }, targetNodeId: { uuid: 'node-015' }, lineType: '400V', capacityKva: 1000, currentLoad: 880, active: true },
    { id: { uuid: 'conn-015' }, sourceNodeId: { uuid: 'node-010' }, targetNodeId: { uuid: 'node-016' }, lineType: '400V', capacityKva: 1000, currentLoad: 380, active: true },
    { id: { uuid: 'conn-016' }, sourceNodeId: { uuid: 'node-012' }, targetNodeId: { uuid: 'node-017' }, lineType: '400V', capacityKva: 1000, currentLoad: 920, active: true }
  ],
  activeAlerts: [
    {
      id: { uuid: 'alert-001' },
      nodeId: { uuid: 'node-011' },
      nodeName: 'T3-F2 (South)',
      type: 'LINE_FAULT',
      severity: 'CRITICAL',
      triggeredAt: new Date().toISOString(),
      acknowledgedBy: null
    },
    {
      id: { uuid: 'alert-002' },
      nodeId: { uuid: 'node-004' },
      nodeName: 'Transformer T3',
      type: 'OVERLOAD',
      severity: 'WARNING',
      triggeredAt: new Date(Date.now() - 600000).toISOString(),
      acknowledgedBy: 'Operator1'
    },
    {
      id: { uuid: 'alert-003' },
      nodeId: { uuid: 'node-017' },
      nodeName: 'Commercial M5',
      type: 'VOLTAGE_DROP',
      severity: 'WARNING',
      triggeredAt: new Date(Date.now() - 300000).toISOString(),
      acknowledgedBy: null
    }
  ]
};