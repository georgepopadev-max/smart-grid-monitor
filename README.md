# 🦈 Smart Grid Monitor

**Monitorización en tiempo real de redes eléctricas con visualización Canvas**

[![Java](https://img.shields.io/badge/Java-21-blue.svg)](https://adoptium.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-17-red.svg)](https://angular.io/)

---

## 📖 Descripción

Plataforma de monitoreo que simula y visualiza una red eléctrica en tiempo real. Cada nodo de la red (subestaciones, transformadores, puntos de consumo) transmite su estado mediante WebSocket, y el frontend renderiza el flujo de energía mediante Canvas 2D a 60fps.

**Problema que resuelve:** Los operadores de red necesitan una vista global instantánea del estado de una red eléctrica sin depender de SCADA legacy. Este proyecto demuestra cómo una interfaz web moderna puede representar el flujo energético con latencia mínima y alta fidelidad visual.

---

## 🧰 Tech Stack

| Capa | Tecnología |
|---|---|
| **Frontend** | Angular 17 · TypeScript · Canvas 2D · RxJS |
| **Backend** | Spring Boot 3.2 · Java 21 |
| **Comunicación** | WebSocket · STOMP · SockJS |
| **Renderizado** | requestAnimationFrame · Canvas 2D |
| **Datos** | Flux reactivo · Series temporales simuladas |

---

## ✨ Features

- **Visualización 60fps:** Renderizado de la red eléctrica en Canvas con pulsos de energía animados y actualización fluida.
- **Simulación de red:** Generador de eventos que simula nodos activos, caídas, sobrecargas y fluctuaciones de tensión.
- **Interacción con nodos:** Click en cualquier nodo para ver métricas detalladas (tensión, intensidad, estado operativo).
- **Sistema de alertas:** Notificaciones visuales (nodos en rojo) cuando un parámetro supera umbrales predefinidos.
- **Timeline scrubber:** Control deslizante temporal para reproducir el estado de la red en un rango de minutos/horas.

---

## 🎨 Demo

La interfaz muestra:

1. **Grid animado** — Canvas con nodos (círculos) y conexiones (líneas). Los pulsos de energía viajan por las líneas con animación fluida.
2. **Sidebar de métricas** — Al hacer click en un nodo, panel lateral con gráficos de tensión/intensidad en tiempo real.
3. **Barra de alertas** — Cola de alertas en la parte inferior con notificación de eventos críticos.
4. **Control de reproducción** — Play/pause, velocidad 1x-10x, scrubber temporal.

---

## 🏗️ Arquitectura

```
┌──────────────────────────────────────────────────────────┐
│              Frontend (Angular 17 + RxJS)                │
│    CanvasRenderer · GridComponent · WebSocketService     │
└────────────────────────┬────────────────────────────────┘
                         │ WebSocket + STOMP
┌────────────────────────▼────────────────────────────────┐
│              Backend (Spring Boot WebSocket)              │
│     GridSimulationService · NodeEventEmitter              │
│     STOMP over SockJS · Scheduled event generator        │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 Setup

### Requisitos

- **Java 21**
- **Node.js 18+** y **npm**
- **Angular CLI 17**

### Backend

```bash
cd smart-grid-monitor/backend
./mvnw spring-boot:run
# WebSocket endpoint: ws://localhost:8080/ws
# STOMP connect: http://localhost:8080/ws
```

### Frontend

```bash
cd smart-grid-monitor/frontend
npm install
ng serve
# App disponible en http://localhost:4200
```

---

## 📂 Estructura del proyecto

```
smart-grid-monitor/
├── backend/
│   ├── src/main/java/.../
│   │   ├── config/          # WebSocket/STOMP config
│   │   ├── service/         # GridSimulationService
│   │   ├── model/           # Node, Edge, EnergyPulse
│   │   └── controller/      # REST endpoints (estado actual)
│   └── src/main/resources/
└── frontend/
    ├── src/app/
    │   ├── grid/            # Componente Canvas principal
    │   ├── node-detail/     # Panel de métricas por nodo
    │   ├── alert-bar/       # Barra de alertas
    │   └── timeline/        # Scrubber temporal
    └── src/assets/
```

---

## 📬 Contacto

- ✉️ **Email:** [georgepopadev@gmail.com](mailto:georgepopadev@gmail.com)
- 💻 **GitHub:** [github.com/georgepopadev/smart-grid-monitor](https://github.com/georgepopadev/smart-grid-monitor)
