export enum NodeType {
  CLIENT = 'CLIENT',
  LOAD_BALANCER = 'LOAD_BALANCER',
  SERVER = 'SERVER',
  CACHE = 'CACHE',
  DATABASE = 'DATABASE',
}

export interface NodePosition {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  label: string;
  active: boolean; // For availability simulation
  opacity?: number; // For auto-scaling visibility (0 to 1)
}

export interface Link {
  id: string;
  source: string;
  target: string;
  bidirectional: boolean;
  type?: 'replication' | 'standard' | 'cache';
}

export interface Pulse {
  id: string;
  path: string[]; // Array of Node IDs
  currentStep: number; // Index in path
  progress: number; // 0 to 1 along the current segment
  type: 'request' | 'response' | 'replication' | 'error' | 'cache-hit';
  dataPayload?: string;
  color?: string;
}

export interface SimulationConfig {
  latency: number; // 1 (fast) to 10 (slow)
  throughput: number; // 1 (low) to 10 (high)
  bandwidth: number; // 1 (thin) to 5 (thick)
  showCaching: boolean;
  showReplication: boolean;
  showPartitioning: boolean;
  showLoadBalancer: boolean;
  isPlaying: boolean;
}

export interface SystemConcept {
  key: string;
  title: string;
  shortDesc: string;
}