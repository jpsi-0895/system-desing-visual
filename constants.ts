import { NodeType, NodePosition, Link, SystemConcept } from './types';

export const SYSTEM_NODES: NodePosition[] = [
  { id: 'client', type: NodeType.CLIENT, x: 100, y: 300, label: 'Client', active: true },
  { id: 'lb', type: NodeType.LOAD_BALANCER, x: 300, y: 300, label: 'Load Balancer', active: true },
  { id: 'cache', type: NodeType.CACHE, x: 450, y: 150, label: 'Redis Cache', active: true },
  { id: 'server1', type: NodeType.SERVER, x: 500, y: 260, label: 'Web Server 1', active: true },
  { id: 'server2', type: NodeType.SERVER, x: 500, y: 380, label: 'Web Server 2', active: true },
  { id: 'server3', type: NodeType.SERVER, x: 500, y: 500, label: 'Web Server 3 (Auto)', active: true, opacity: 0 },
  { id: 'db_primary', type: NodeType.DATABASE, x: 750, y: 260, label: 'DB Primary', active: true },
  { id: 'db_replica', type: NodeType.DATABASE, x: 750, y: 450, label: 'DB Replica', active: true },
  { id: 'db_shard', type: NodeType.DATABASE, x: 750, y: 100, label: 'DB Shard 2', active: true },
];

export const SYSTEM_LINKS: Link[] = [
  { id: 'l1', source: 'client', target: 'lb', bidirectional: true },
  { id: 'l2', source: 'lb', target: 'server1', bidirectional: true },
  { id: 'l3', source: 'lb', target: 'server2', bidirectional: true },
  { id: 'l_server3', source: 'lb', target: 'server3', bidirectional: true }, // Auto-scale link
  { id: 'l4', source: 'server1', target: 'db_primary', bidirectional: true },
  { id: 'l5', source: 'server2', target: 'db_primary', bidirectional: true },
  { id: 'l6', source: 'server3', target: 'db_primary', bidirectional: true }, // Auto-scale DB link
  // Optional paths logic handled in simulation, these are visual lines
  { id: 'l_cache', source: 'lb', target: 'cache', bidirectional: true, type: 'cache' },
  { id: 'l_rep', source: 'db_primary', target: 'db_replica', bidirectional: false, type: 'replication' },
  { id: 'l_shard1', source: 'server1', target: 'db_shard', bidirectional: true },
  { id: 'l_shard2', source: 'server2', target: 'db_shard', bidirectional: true },
  { id: 'l_shard3', source: 'server3', target: 'db_shard', bidirectional: true }, // Auto-scale Shard link
];

export const CONCEPTS: SystemConcept[] = [
  { key: 'latency', title: 'Latency', shortDesc: 'Time taken for a packet to travel.' },
  { key: 'throughput', title: 'Throughput', shortDesc: 'Rate of successful requests.' },
  { key: 'bandwidth', title: 'Bandwidth', shortDesc: 'Maximum data transfer capacity.' },
  { key: 'availability', title: 'Availability', shortDesc: 'System uptime guarantee.' },
  { key: 'consistency', title: 'Consistency', shortDesc: 'Uniformity of data across nodes.' },
  { key: 'caching', title: 'Caching', shortDesc: 'Storing data for faster retrieval.' },
  { key: 'replication', title: 'Replication', shortDesc: 'Copying data for redundancy.' },
  { key: 'partitioning', title: 'Partitioning', shortDesc: 'Splitting data across databases.' },
  { key: 'load_balancing', title: 'Load Balancing', shortDesc: 'Distributing traffic evenly.' },
  { key: 'auto_scaling', title: 'Auto Scaling', shortDesc: 'Dynamically adding nodes under load.' },
];