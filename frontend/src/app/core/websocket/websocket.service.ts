import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, BehaviorSubject, timer, empty } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, retry, takeUntil } from 'rxjs/operators';
import { MOCK_GRID_STATE } from '../mock-data';

export interface GridState {
  gridId: { uuid: string };
  gridName: string;
  nodes: GridNode[];
  connections: GridConnection[];
  activeAlerts: Alert[];
  timestamp: string;
}

export interface GridNode {
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

export interface GridConnection {
  id: { uuid: string };
  sourceNodeId: { uuid: string };
  targetNodeId: { uuid: string };
  lineType: string;
  capacityKva: number;
  currentLoad: number;
  active: boolean;
}

export interface Alert {
  id: { uuid: string };
  nodeId: { uuid: string };
  nodeName: string;
  type: string;
  severity: string;
  triggeredAt: string;
  acknowledgedBy: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private socket$: WebSocketSubject<GridState> | null = null;
  private destroy$ = new Subject<void>();
  private reconnectInterval = 5000;
  private maxReconnectAttempts = 10;
  private useMockData = false;

  private gridState$ = new BehaviorSubject<GridState | null>(null);
  private connectionStatus$ = new BehaviorSubject<'connected' | 'disconnected' | 'connecting'>('disconnected');

  get state$(): Observable<GridState | null> {
    return this.gridState$.asObservable();
  }

  get status$(): Observable<'connected' | 'disconnected' | 'connecting'> {
    return this.connectionStatus$.asObservable();
  }

  private getWebSocketUrl(): string {
    // Try Vercel environment variable first
    const vercelEnv = (window as any).__VERCEL_ENV__;
    if (vercelEnv?.API_URL_BACK) {
      // Replace ws:// with wss:// and http with ws
      let url = vercelEnv.API_URL_BACK;
      if (url.startsWith('http://')) {
        url = 'ws://' + url.substring(7);
      } else if (url.startsWith('https://')) {
        url = 'wss://' + url.substring(8);
      }
      return url + '/grid-websocket';
    }
    // Fallback to localhost
    return 'ws://localhost:8080/grid-websocket';
  }

  connect(url?: string): void {
    if (this.socket$) {
      this.socket$.complete();
    }

    this.connectionStatus$.next('connecting');

    const wsUrl = url || this.getWebSocketUrl();

    this.socket$ = webSocket<GridState>({
      url: wsUrl,
      openObserver: {
        next: () => {
          console.log('WebSocket connected');
          this.connectionStatus$.next('connected');
          this.useMockData = false;
        }
      },
      closeObserver: {
        next: () => {
          console.log('WebSocket disconnected');
          this.connectionStatus$.next('disconnected');
        }
      }
    });

    this.socket$.pipe(
      retry({
        delay: (error, retryCount) => {
          console.log(`Reconnecting... attempt ${retryCount}`);
          if (retryCount >= this.maxReconnectAttempts) {
            console.log('Max reconnect attempts reached, using mock data');
            this.useMockDataFallback();
            return empty();
          }
          return timer(Math.min(this.reconnectInterval * Math.pow(1.5, retryCount - 1), 30000));
        }
      }),
      catchError(err => {
        console.error('WebSocket error:', err);
        this.connectionStatus$.next('disconnected');
        this.useMockDataFallback();
        return empty();
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (state) => {
        this.gridState$.next(state);
      },
      error: (err) => {
        console.error('WebSocket subscription error:', err);
      }
    });

    // Set a timeout to fallback to mock data if not connected within 5 seconds
    setTimeout(() => {
      if (this.connectionStatus$.value !== 'connected' && !this.useMockData) {
        console.log('WebSocket connection timeout, using mock data');
        this.useMockDataFallback();
      }
    }, 5000);
  }

  private useMockDataFallback(): void {
    if (this.useMockData) return;
    this.useMockData = true;
    this.connectionStatus$.next('disconnected');
    this.gridState$.next(MOCK_GRID_STATE);
    console.log('Using mock grid data for demo');
  }

  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
    this.connectionStatus$.next('disconnected');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }
}