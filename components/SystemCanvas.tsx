import React, { useRef, useEffect, useState } from 'react';
import { NodePosition, Link as LinkType, Pulse, SimulationConfig, NodeType } from '../types';
import { SYSTEM_NODES, SYSTEM_LINKS } from '../constants';

interface SystemCanvasProps {
  config: SimulationConfig;
}

export const SystemCanvas: React.FC<SystemCanvasProps> = ({ config }) => {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [nodes, setNodes] = useState<NodePosition[]>(SYSTEM_NODES);
  const requestRef = useRef<number>(0);
  const lastSpawnTime = useRef<number>(0);
  const pulseIdCounter = useRef<number>(0);

  // Auto-scaling timers and state tracking
  const highLoadTimer = useRef<number>(0);
  const lowLoadTimer = useRef<number>(0);
  const isServer3Active = useRef<boolean>(false);

  // Helper to find node by ID
  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  // Toggle node availability (simple click handler)
  const toggleNodeHealth = (id: string) => {
    if (id === 'client') return; // Client always active
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, active: !n.active } : n))
    );
  };

  // Determine path logic based on config
  const createPulsePath = (): string[] => {
    // START: Client
    const path = ['client'];

    // LB or Direct?
    if (config.showLoadBalancer) {
      path.push('lb');
    }

    // CACHE?
    let hitCache = false;
    if (config.showCaching && config.showLoadBalancer) {
      // 50% hit rate for visual effect
      if (Math.random() > 0.5) {
        path.push('cache');
        hitCache = true;
      }
    }

    if (hitCache) {
      // Return journey immediately from cache
      if (config.showLoadBalancer) path.push('lb');
      path.push('client');
      return path;
    }

    // SERVER SELECTION
    // If LB is active, round robin or random. If not, only server1 (bottleneck).
    let targetServer = 'server1';
    if (config.showLoadBalancer) {
      const servers = ['server1', 'server2'];
      // Include server3 if it's currently active/visible
      if (isServer3Active.current) {
        servers.push('server3');
      }
      targetServer = servers[Math.floor(Math.random() * servers.length)];
    }
    path.push(targetServer);

    // DB SELECTION
    // Partitioning?
    let targetDB = 'db_primary';
    if (config.showPartitioning) {
       // Randomly go to primary (shard 1) or shard 2
       targetDB = Math.random() > 0.5 ? 'db_primary' : 'db_shard';
    }
    path.push(targetDB);

    // RETURN TRIP
    path.push(targetServer);
    if (config.showLoadBalancer) path.push('lb');
    path.push('client');

    return path;
  };

  const spawnReplicationPulse = (sourceDb: string) => {
    if (!config.showReplication || sourceDb !== 'db_primary') return null;
    return {
      id: `rep-${pulseIdCounter.current++}`,
      path: ['db_primary', 'db_replica'],
      currentStep: 0,
      progress: 0,
      type: 'replication',
      color: '#4ade80', // Green for replication
    } as Pulse;
  };

  // Animation Loop
  const animate = (time: number) => {
    if (!config.isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    // --- AUTO-SCALING LOGIC ---
    // If throughput > 8 for 5 seconds -> Scale UP (Server 3)
    // If throughput < 5 for 5 seconds -> Scale DOWN (Remove Server 3)
    if (config.throughput >= 8) {
       if (highLoadTimer.current === 0) highLoadTimer.current = time;
       
       if (time - highLoadTimer.current > 5000 && !isServer3Active.current) {
         // Trigger Scale UP
         isServer3Active.current = true;
         setNodes(prev => prev.map(n => n.id === 'server3' ? { ...n, opacity: 1 } : n));
         highLoadTimer.current = 0; // Reset
       }
       lowLoadTimer.current = 0;
    } else if (config.throughput <= 5) {
       if (lowLoadTimer.current === 0) lowLoadTimer.current = time;

       if (time - lowLoadTimer.current > 5000 && isServer3Active.current) {
         // Trigger Scale DOWN
         isServer3Active.current = false;
         setNodes(prev => prev.map(n => n.id === 'server3' ? { ...n, opacity: 0 } : n));
         lowLoadTimer.current = 0; // Reset
       }
       highLoadTimer.current = 0;
    } else {
       // Reset timers if in neutral zone
       highLoadTimer.current = 0;
       lowLoadTimer.current = 0;
    }

    // --- SPAWNING LOGIC ---
    // Throughput 1-10. 10 = spawn every 100ms. 1 = spawn every 2000ms.
    const spawnInterval = 2100 - (config.throughput * 200); 
    if (time - lastSpawnTime.current > spawnInterval) {
      const newPath = createPulsePath();
      const newPulse: Pulse = {
        id: `p-${pulseIdCounter.current++}`,
        path: newPath,
        currentStep: 0,
        progress: 0,
        type: 'request',
        color: '#22d3ee', // Cyan
      };
      setPulses((prev) => [...prev, newPulse]);
      lastSpawnTime.current = time;
    }

    // --- UPDATE PULSES ---
    setPulses((prevPulses) => {
      const nextPulses: Pulse[] = [];
      const newSpawns: Pulse[] = [];

      prevPulses.forEach((p) => {
        // Speed calculation based on latency config.
        const speed = 0.035 - (config.latency * 0.003); 
        
        let newProgress = p.progress + (speed > 0.001 ? speed : 0.001);

        // Check if segment complete
        if (newProgress >= 1) {
          // Reached a node
          const currentParams = { ...p, currentStep: p.currentStep + 1, progress: 0 };
          const currentNodeId = p.path[p.currentStep + 1]; // Node just arrived at
          
          // Check Node Availability
          const nodeObj = getNode(currentNodeId);
          if (nodeObj && !nodeObj.active) {
            // Drop packet if node is dead
            return; 
          }

          // Special Trigger: Replication
          if (currentNodeId === 'db_primary' && config.showReplication && p.type !== 'replication') {
             const rep = spawnReplicationPulse('db_primary');
             if (rep) newSpawns.push(rep);
          }

          // Check if path complete
          if (currentParams.currentStep >= p.path.length - 1) {
            // Pulse finished
            return;
          }
          
          nextPulses.push(currentParams);
        } else {
          nextPulses.push({ ...p, progress: newProgress });
        }
      });

      return [...nextPulses, ...newSpawns];
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, nodes]); // Re-bind animate when config changes


  // RENDER HELPERS
  
  // Calculate position of a pulse based on source/target nodes and progress
  const getPulsePosition = (p: Pulse) => {
    const sourceId = p.path[p.currentStep];
    const targetId = p.path[p.currentStep + 1];
    const source = getNode(sourceId);
    const target = getNode(targetId);

    if (!source || !target) return { x: 0, y: 0 };

    const dx = target.x - source.x;
    const dy = target.y - source.y;
    
    return {
      x: source.x + dx * p.progress,
      y: source.y + dy * p.progress,
    };
  };

  // Determine which links to draw based on config
  const visibleLinks = SYSTEM_LINKS.filter(l => {
     if (l.type === 'cache' && (!config.showCaching || !config.showLoadBalancer)) return false;
     if (l.type === 'replication' && !config.showReplication) return false;
     if (l.target === 'db_shard' && !config.showPartitioning) return false;
     if (l.target === 'server2' && !config.showLoadBalancer) return false;
     
     // Auto-scaling visibility
     const targetNode = getNode(l.target);
     const sourceNode = getNode(l.source);
     if (targetNode?.opacity === 0 || sourceNode?.opacity === 0) return false;

     return true;
  });
  
  // Also filter nodes visibility (but keep them in DOM for opacity transition)
  const visibleNodes = nodes.filter(n => {
    if (n.type === NodeType.CACHE && (!config.showCaching || !config.showLoadBalancer)) return false;
    if (n.id === 'db_replica' && !config.showReplication) return false;
    if (n.id === 'db_shard' && !config.showPartitioning) return false;
    // Don't filter auto-scaled nodes here, we use opacity for them
    return true;
  });

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden relative shadow-2xl border border-slate-700">
      <div className="absolute top-4 left-4 z-10 bg-black/40 px-3 py-1 rounded text-xs text-slate-400 backdrop-blur-sm pointer-events-none">
        Interactive Canvas • Click nodes to toggle availability
      </div>
      
      {/* Auto-scale indicator */}
      {config.throughput >= 8 && !isServer3Active.current && (
         <div className="absolute bottom-4 right-4 z-10 bg-orange-900/80 text-orange-200 px-3 py-1 rounded text-xs animate-pulse border border-orange-500/30">
           High Load Detected... Provisioning Server
         </div>
      )}
      {config.throughput <= 5 && isServer3Active.current && (
         <div className="absolute bottom-4 right-4 z-10 bg-blue-900/80 text-blue-200 px-3 py-1 rounded text-xs animate-pulse border border-blue-500/30">
           Low Load Detected... Deprovisioning Server
         </div>
      )}

      <svg className="w-full h-full" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>

        {/* Links */}
        {visibleLinks.map((link) => {
          const s = getNode(link.source);
          const t = getNode(link.target);
          return (
            <line
              key={link.id}
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              stroke={link.type === 'replication' ? '#22c55e' : '#475569'}
              strokeWidth={config.bandwidth} 
              strokeDasharray={link.type === 'replication' ? '5,5' : ''}
              markerEnd="url(#arrowhead)"
              className="transition-all duration-300"
            />
          );
        })}

        {/* Nodes */}
        {visibleNodes.map((node) => (
          <g 
            key={node.id} 
            transform={`translate(${node.x}, ${node.y})`}
            className="cursor-pointer hover:opacity-90 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: node.opacity !== undefined ? node.opacity : 1 }}
            onClick={() => toggleNodeHealth(node.id)}
          >
            {/* Status Glow */}
            <circle 
              r="28" 
              fill={node.active ? (node.type === NodeType.DATABASE ? '#f59e0b' : node.type === NodeType.CACHE ? '#a855f7' : '#3b82f6') : '#ef4444'} 
              className="transition-colors duration-300"
              opacity="0.2"
            />
            {/* Node Body */}
            <circle 
              r="20" 
              fill={node.active ? '#1e293b' : '#450a0a'} 
              stroke={node.active ? (node.type === NodeType.DATABASE ? '#fbbf24' : node.type === NodeType.CACHE ? '#c084fc' : '#60a5fa') : '#ef4444'} 
              strokeWidth="2"
            />
            
            {/* Icons */}
            <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" className="pointer-events-none font-bold">
              {node.type === NodeType.CLIENT ? 'C' : 
               node.type === NodeType.LOAD_BALANCER ? 'LB' : 
               node.type === NodeType.DATABASE ? 'DB' : 
               node.type === NodeType.CACHE ? '$' : 'S'}
            </text>

            {/* Label */}
            <text x="0" y="35" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">
              {node.label}
            </text>
            
            {!node.active && (
              <text x="0" y="-30" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">OFFLINE</text>
            )}
          </g>
        ))}

        {/* Pulses */}
        {pulses.map((p) => {
          const pos = getPulsePosition(p);
          if (!pos.x) return null;
          return (
            <circle
              key={p.id}
              cx={pos.x}
              cy={pos.y}
              r={4 + (config.bandwidth / 2)} 
              fill={p.type === 'replication' ? '#4ade80' : '#22d3ee'}
              className="pointer-events-none drop-shadow-md"
            />
          );
        })}
      </svg>
    </div>
  );
};