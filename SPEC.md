# Smart Grid Monitor — Project Specification

## 1. Project Overview

**Project Name:** Smart Grid Monitor  
**Type:** Real-time monitoring and visualization platform  
**Core Functionality:** Live grid monitoring system with WebSocket-driven updates and Canvas-based animations for visualizing energy flow, grid topology, and real-time telemetry. Designed for grid operators to maintain situational awareness across distributed energy networks.  
**Target Users:** Grid operators, dispatch centers, energy traders, and utility operations teams.

---

## 2. Description

Smart Grid Monitor is a high-performance real-time monitoring platform that visualizes the state of an electrical distribution grid at any moment. Unlike traditional SCADA systems with static displays, this application renders a dynamic, animated representation of energy flow through power lines, substations, and distribution nodes using HTML5 Canvas with 60fps rendering.

The system connects to grid data sources via WebSocket streams, processing telemetry from smart meters, grid sensors, and SCADA integrations. As data arrives, the canvas visualization updates in real time — energy pulses travel along transmission lines, substations glow based on load, and potential faults trigger warning animations. Operators can click on any grid element to see live telemetry, historical trends, and connection topology.

The Angular frontend consumes a Spring Boot WebSocket endpoint that pushes incremental state changes, minimizing bandwidth while ensuring real-time responsiveness. The Canvas renderer implements a force-directed layout for grid topology and uses WebGL acceleration for large grids.

---

## 3. Technology Stack

### Frontend
- **Framework:** Angular 17 (standalone components)
- **Rendering:** HTML5 Canvas 2D + WebGL (via PixiJS for complex scenes)
- **Charts:** D3.js for auxiliary telemetry charts
- **Real-time:** RxJS WebSocket subject with exponential backoff reconnection
- **UI Components:** Custom Canvas-based UI (grid nodes, controls) + Angular Material for dialogs/forms
- **Build Tool:** Angular CLI with Vite

### Backend
- **Framework:** Spring Boot 3.2 (Java 17+)
- **Real-time:** Spring WebSocket with STOMP + SockJS fallback
- **State Management:** In-memory grid state with periodic PostgreSQL snapshots
- **Grid Simulation:** Custom event-driven simulation engine for realistic grid behavior
- **Database:** PostgreSQL 15 for persistent data, Redis Pub/Sub for multi-instance coordination
- **Authentication:** JWT with refresh tokens

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Load Testing:** k6 for WebSocket stress tests

---

## 4. Feature List

### Core Features
1. **Real-time Grid Visualization** — Animated Canvas rendering of grid topology with energy flow visualization
2. **Live Telemetry Dashboard** — Voltage, current, frequency, power factor per node with 1-second refresh
3. **Grid Topology Editor** — Interactive node placement, connection drawing, and attribute configuration
4. **Substation Monitor** — Detailed view per substation showing all connected feeders and transformers
5. **Alert Overlay System** — Non-intrusive alert annotations on the grid canvas (fault indicators, overload warnings)
6. **Historical Playback** — Replay past grid states with timeline scrubber (30-day window)
7. **Geographic View** — Toggle between schematic and geographic grid views
8. **Real-time Communication Hub** — Operator-to-operator messaging with grid context sharing
9. **Shift Handoff** — Generate and review shift reports with grid status summary
10. **Multi-grid Support** — Manage and switch between multiple grid configurations

### Canvas Visualization Features
- Animated energy pulses traveling along power lines
- Node glow intensity based on current load percentage
- Pulsing red indicators for fault locations
- Smooth pan and zoom with momentum scrolling
- Minimap for large grid overview
- Layer toggles (transmission lines, substations, consumers, sensors)

### Grid Simulation Features
- Event-driven simulation producing realistic telemetry
- Configurable failure scenarios (line outage, transformer overload, voltage sag)
- Automatic fault propagation through connected nodes
- Weather overlay integration (affects solar/wind generation)

---

## 5. Architecture

### High-Level Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                     Angular Frontend (Browser)                        │
│   Canvas Renderer │ UI Overlay │ Telemetry Charts │ Operator Chat    │
└───────────────────────────────┬───────────────────────────────────────┘
                                │ WebSocket (STOMP)
┌───────────────────────────────▼───────────────────────────────────────┐
│                  Spring Boot WebSocket Gateway                        │
│   Grid State Manager │ Telemetry Processor │ Alert Engine │ Auth      │
└───────────┬───────────────────┬───────────────────┬───────────────────┘
            │                   │                   │
   ┌────────▼────────┐ ┌───────▼────────┐ ┌────────▼────────┐
   │ Grid Simulation  │ │ State Store    │ │ Alert Service   │
   │ Engine           │ │ (PostgreSQL)   │ │ (Notifications) │
   └──────────────────┘ └────────────────┘ └────────────────┘
            │
   ┌────────▼────────┐
   │ Redis Pub/Sub   │ ← Multi-instance coordination
   └─────────────────┘
```

### Frontend Modules

**`app/core/websocket/`** — WebSocket service with reconnection logic, message multiplexing by grid region  
**`app/features/grid-canvas/`** — Canvas renderer using PixiJS, handles pan/zoom, node interaction, animation loop  
**`app/features/telemetry/`** — Real-time telemetry panel with gauge visualizations  
**`app/features/topology/`** — Grid topology editor for node/connection management  
**`app/features/alerts/`** — Alert overlay system with acknowledgment workflow  
**`app/shared/pipes/`** — Unit conversion pipes (kW→MW, V→kV), formatting utilities

### Backend Modules

**`grid.simulation/`** — Event-driven simulation producing telemetry at configurable frequency  
**`grid.state/`** — In-memory grid state with lock-free updates, PostgreSQL persistence every 30s  
**`websocket.broker/`** — STOMP broker for real-time message distribution to grid regions  
**`telemetry.aggregation/`** — Aggregates telemetry into 1s/1m/5m buckets for different use cases  
**`alert.propagation/`** — Detects fault conditions and triggers appropriate alert levels

### Data Model

**GridNode**
- id (UUID), name, type (SUBSTATION/FEEDER/METER/SENSOR), x, y, status, metadata (JSON)

**GridConnection**
- id (UUID), sourceNodeId, targetNodeId, lineType, capacityKva, currentLoad

**TelemetrySnapshot**
- nodeId, timestamp, voltage, current, frequency, powerFactor, activePower, reactivePower

**GridAlert**
- id (UUID), nodeId, type, severity, triggeredAt, acknowledgedBy, resolvedAt, notes

---

## 6. Deliverables

1. **Source Code** — Complete Angular frontend with Canvas renderer, Spring Boot backend with simulation engine
2. **Docker Compose** — Local environment with PostgreSQL, Redis, and simulated grid data
3. **Grid Simulator** — Configurable simulation producing realistic grid telemetry with failure scenarios
4. **API Documentation** — WebSocket message format spec + REST endpoints for configuration
5. **Test Suite** — Load tests for WebSocket connections, unit tests for simulation logic
6. **Canvas Performance Guide** — Documentation on rendering optimizations for large grids (500+ nodes)
7. **README** — Setup, configuration, and operator quick-start guide

---

## 7. Demo Description

The demo launches a browser window with a full-screen Canvas grid visualization representing a medium-voltage distribution network.

**Initial Load:** The grid appears with animated energy pulses (small bright dots) traveling from a 132kV substation through 4 transformer stations down to residential and commercial distribution nodes. Each node pulses with a glow intensity proportional to its current load (brighter = higher load). The view is centered on a suburban distribution area with approximately 60 nodes.

**Real-time Updates:** Every second, telemetry updates arrive via WebSocket. Visible effects:
- Energy pulses continuously flow along power lines (yellow dots traveling from upstream to downstream)
- Substation node glow intensifies as solar generation drops in the late afternoon
- A fault is simulated on one distribution line — the affected nodes turn red, a pulsing alert icon appears, and a notification banner slides in from the right

**Node Interaction:** Clicking any node opens a detail panel:
- Node name and type
- Live gauges: Voltage (231V), Current (142A), Frequency (50.02Hz), Power Factor (0.97)
- 5-minute sparkline chart of voltage readings
- Connection list with load percentages
- "Acknowledge" and "Isolate" action buttons

**Alert Workflow:** The fault alert requires acknowledgment. Clicking "Acknowledge" adds your operator ID to the alert and changes the alert from red to orange. The line can be "Isolated" which visually disconnects it from the rest of the grid (gray dashed line) and the downstream nodes lose power (faded appearance).

**Timeline Scrubber:** Below the canvas, a timeline shows the last 2 hours with a draggable scrubber. Dragging back 30 minutes shows the grid state before the fault — no red nodes, normal flow animation.

**Multi-grid Selector:** A dropdown in the header switches between "Suburban Distribution," "Industrial Park Grid," and "Renewable Integration Demo" — each with different topology and simulation behavior.