import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Network, 
  Trophy, 
  Cpu, 
  Lock, 
  Unlock, 
  FileCode, 
  Terminal, 
  Send, 
  Upload, 
  Database, 
  Plus, 
  Play, 
  CheckCircle, 
  Server, 
  User, 
  RefreshCw,
  ExternalLink,
  Info,
  Clock,
  Zap,
  Sparkles
} from 'lucide-react';

// Interfaces
interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  attestation?: string;
  chatHash?: string;
}

interface FileNode {
  id: string;
  name: string;
  size: string;
  address: string;
  integrity: string;
  speed: string;
  replication: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'root' | 'chunk';
  rootId?: string;
}

interface Agent {
  name: string;
  role: 'Hacker' | 'Trader' | 'Philosopher';
  strategy: string;
  aggression: number;
  logic: number;
  speed: number;
}

interface MatchLog {
  round: number;
  action: string;
  effect: string;
  initiator: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'vault' | 'graph' | 'arena'>('vault');
  const [blockHeight, setBlockHeight] = useState<string>('39,665,672');
  const [isLoadingBlock, setIsLoadingBlock] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Confidential Vault States
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Welcome to the Confidential Agent Vault. I am your secure AI advisor, operating within a hardware-isolated TEE environment. All computations are cryptographically verified on 0G Chain. My responses are generated using a deterministic response engine with cryptographic attestation. How may I assist you today?',
      timestamp: new Date().toLocaleTimeString(),
      chatHash: '0x88a88f3c2394f849e782be3bc30f9a2d3c90e8f812cd394fa8b2a3d3c8c6a2e8',
      attestation: 'Intel TDX Attestation Proven on-chain.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessingTEE, setIsProcessingTEE] = useState(false);
  const [selectedProof, setSelectedProof] = useState<Message | null>(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [storageTx, setStorageTx] = useState<string | null>(null);
  const [isSealing, setIsSealing] = useState(false);

  // Knowledge Graph States
  const [files, setFiles] = useState<FileNode[]>([
    { id: 'f1', name: 'Agent_Core_v2.bin', size: '2.4 MB', address: '0x0gstorage_883f...a239', integrity: 'Verified (Keccak256)', speed: '1.2 GB/s', replication: 5, x: 200, y: 150, vx: 0.1, vy: -0.1, radius: 24, type: 'root' },
    { id: 'f2', name: 'Knowledge_Base.db', size: '18.1 MB', address: '0x0gstorage_a9df...bc45', integrity: 'Verified (Keccak256)', speed: '850 MB/s', replication: 7, x: 450, y: 300, vx: -0.2, vy: 0.2, radius: 28, type: 'root' },
    { id: 'f3', name: 'Model_Weights_FP16.bin', size: '4.8 GB', address: '0x0gstorage_5bc1...77d8', integrity: 'Verified (Keccak256)', speed: '2.1 GB/s', replication: 12, x: 600, y: 180, vx: 0.15, vy: 0.1, radius: 35, type: 'root' }
  ]);
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [draggingNode, setDraggingNode] = useState<FileNode | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  // Tournament Arena States
  const [userAgent, setUserAgent] = useState<Agent>({
    name: 'Neo-Sovereign',
    role: 'Hacker',
    strategy: 'Algorithmic Exploits & Evasion',
    aggression: 75,
    logic: 85,
    speed: 80
  });
  const [opponentAgent, setOpponentAgent] = useState<Agent>({
    name: 'Giga-Trader-0G',
    role: 'Trader',
    strategy: 'High-frequency Arbitrage & Liquidation',
    aggression: 90,
    logic: 70,
    speed: 95
  });
  const [battleLogs, setBattleLogs] = useState<MatchLog[]>([]);
  const [isFighting, setIsFighting] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [txReceipt, setTxReceipt] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([
    { rank: 1, name: 'Satoshi-GPT', winRate: '94.2%', ratio: '320/20', score: 2840 },
    { rank: 2, name: 'VoidWalker', winRate: '88.5%', ratio: '240/31', score: 2210 },
    { rank: 3, name: 'DeAI-Oracle', winRate: '82.1%', ratio: '184/40', score: 1890 },
    { rank: 4, name: 'Neo-Sovereign', winRate: '78.5%', ratio: '110/30', score: 1540 },
    { rank: 5, name: 'CryptoKnight', winRate: '71.2%', ratio: '96/39', score: 1210 }
  ]);

  // Fetch block height from 0G Testnet RPC
  const fetchBlockHeight = async () => {
    setIsLoadingBlock(true);
    try {
      const response = await fetch('https://evmrpc-testnet.0g.ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1
        })
      });
      const data = await response.json();
      if (data && data.result) {
        const blockNumHex = data.result;
        const blockNumInt = parseInt(blockNumHex, 16);
        setBlockHeight(blockNumInt.toLocaleString());
      }
    } catch (e) {
      console.error("Failed to fetch 0G block number, falling back to simulation.", e);
      // Fallback: increment the block number slightly
      const randomIncrement = Math.floor(Math.random() * 3) + 1;
      setBlockHeight(prev => {
        const clean = parseInt(prev.replace(/,/g, ''), 10);
        return (clean + randomIncrement).toLocaleString();
      });
    } finally {
      setIsLoadingBlock(false);
    }
  };

  useEffect(() => {
    fetchBlockHeight();
    const interval = setInterval(fetchBlockHeight, 8000);
    return () => clearInterval(interval);
  }, []);

  // Helpers
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const generateKeccakHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return '0x' + Array(7).fill(hex).join('').substring(0, 64);
  };

  // Confidential Chat Smart Engine
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsProcessingTEE(true);

    // Simulate TEE Enclave processing the message
    setTimeout(() => {
      let aiText = "";
      const textLower = userMsg.text.toLowerCase();

      if (textLower.includes('storage') || textLower.includes('save')) {
        aiText = "All data packets on 0G Storage are chunked, distributed across active storage nodes, and protected via erasure coding. You can trigger the 'Seal and Save' module below to finalize upload transactions.";
      } else if (textLower.includes('tee') || textLower.includes('attestation') || textLower.includes('proof')) {
        aiText = "Intel SGX/TDX ensures hardware-level memory isolation. By requesting the attestation report, you receive a signature generated by the CPU enclave showing that this prompt was executed on unaltered firmware.";
      } else if (textLower.includes('agent') || textLower.includes('arena') || textLower.includes('battle')) {
        aiText = "Agents deployed to the Arena undergo simulated debates and strategic matches. They communicate over encrypted channels, and results are serialized as state variables recorded to the 0G Layer 1 ledger.";
      } else {
        aiText = `Confidential Agent Vault query processed successfully. Secure Attestation verified on block height ${blockHeight}. We have signed the hash of this payload in memory. CPU registers isolated.`;
      }

      const chatHash = generateKeccakHash(userMsg.text + aiText);
      const attestation = `TEE Proof Signature: ${chatHash.substring(0, 16)}... Intel TDX Secure CPU verified.`;

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString(),
        chatHash,
        attestation
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsProcessingTEE(false);
    }, 1500);
  };

  const handleSealToStorage = () => {
    setIsSealing(true);
    setStorageTx(null);
    setTimeout(() => {
      const fullHistory = JSON.stringify(messages);
      const payloadHash = generateKeccakHash(fullHistory);
      setStorageTx(payloadHash);
      setIsSealing(false);
    }, 2000);
  };

  // Node physics engine
  useEffect(() => {
    if (activeTab !== 'graph') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const updatePhysics = () => {
      // Apply center gravity and mutual repulsion
      for (let i = 0; i < files.length; i++) {
        const n1 = files[i];
        
        // Attract to center
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        n1.vx += (centerX - n1.x) * 0.0005;
        n1.vy += (centerY - n1.y) * 0.0005;

        // Repel from each other
        for (let j = i + 1; j < files.length; j++) {
          const n2 = files[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = n1.radius + n2.radius + 60;
          
          if (dist < minDist) {
            const force = (minDist - dist) * 0.01;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            
            if (n1 !== draggingNode) {
              n1.vx -= fx;
              n1.vy -= fy;
            }
            if (n2 !== draggingNode) {
              n2.vx += fx;
              n2.vy += fy;
            }
          }
        }

        // Apply velocities
        if (n1 !== draggingNode) {
          n1.x += n1.vx;
          n1.y += n1.vy;
          
          // Friction
          n1.vx *= 0.92;
          n1.vy *= 0.92;

          // Boundary bounce
          const margin = 50;
          if (n1.x < margin) { n1.x = margin; n1.vx *= -0.5; }
          if (n1.x > canvas.width - margin) { n1.x = canvas.width - margin; n1.vx *= -0.5; }
          if (n1.y < margin) { n1.y = margin; n1.vy *= -0.5; }
          if (n1.y > canvas.height - margin) { n1.y = canvas.height - margin; n1.vy *= -0.5; }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Background
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw connections
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1.5;
      files.forEach(n => {
        if (n.type === 'chunk' && n.rootId) {
          const root = files.find(r => r.id === n.rootId);
          if (root) {
            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(root.x, root.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      });

      // Draw Nodes
      files.forEach(n => {
        const isSelected = selectedNode?.id === n.id;
        ctx.save();

        // Node Glow
        ctx.shadowBlur = isSelected ? 20 : 10;
        ctx.shadowColor = n.type === 'root' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(168, 85, 247, 0.4)';

        // Circle base
        const grad = ctx.createRadialGradient(n.x, n.y, 2, n.x, n.y, n.radius);
        if (n.type === 'root') {
          grad.addColorStop(0, '#101f30');
          grad.addColorStop(1, '#081320');
        } else {
          grad.addColorStop(0, '#24123a');
          grad.addColorStop(1, '#130524');
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();

        // Outline border
        ctx.strokeStyle = isSelected 
          ? '#00f0ff' 
          : n.type === 'root' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(168, 85, 247, 0.4)';
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.stroke();

        // Details inside node
        ctx.fillStyle = '#ffffff';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const label = n.name.length > 10 ? n.name.substring(0, 7) + '...' : n.name;
        ctx.fillText(label, n.x, n.y);

        ctx.restore();
      });
    };

    const loop = () => {
      updatePhysics();
      draw();
      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationId);
  }, [activeTab, files, selectedNode, draggingNode]);

  // Canvas Mouse Interactions
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clicked = files.find(n => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) < n.radius;
    });

    if (clicked) {
      setDraggingNode(clicked);
      setSelectedNode(clicked);
    } else {
      setSelectedNode(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingNode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    draggingNode.x = e.clientX - rect.left;
    draggingNode.y = e.clientY - rect.top;
  };

  const handleCanvasMouseUp = () => {
    setDraggingNode(null);
  };

  // Mock Upload splits document into chunks
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    setTimeout(() => {
      const newRootId = 'f_' + Date.now();
      const canvas = canvasRef.current;
      const width = canvas?.width || 500;
      const height = canvas?.height || 400;

      const newRoot: FileNode = {
        id: newRootId,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        address: generateKeccakHash(file.name + Date.now()).substring(0, 20) + '...',
        integrity: 'Verified (Keccak256)',
        speed: (400 + Math.random() * 800).toFixed(0) + ' MB/s',
        replication: Math.floor(Math.random() * 8) + 4,
        x: width / 2,
        y: height / 2,
        vx: 0,
        vy: 0,
        radius: 26,
        type: 'root'
      };

      // Create chunks
      const numChunks = 4;
      const newChunks: FileNode[] = [];
      for (let i = 0; i < numChunks; i++) {
        const angle = (i / numChunks) * Math.PI * 2;
        newChunks.push({
          id: `${newRootId}_c${i}`,
          name: `chunk_${i + 1}`,
          size: (file.size / (1024 * numChunks)).toFixed(1) + ' KB',
          address: generateKeccakHash(file.name + i).substring(0, 20) + '...',
          integrity: 'Verified Chunk ' + (i + 1),
          speed: (600 + Math.random() * 1200).toFixed(0) + ' MB/s',
          replication: newRoot.replication,
          x: width / 2 + Math.cos(angle) * 80,
          y: height / 2 + Math.sin(angle) * 80,
          vx: Math.cos(angle) * 4,
          vy: Math.sin(angle) * 4,
          radius: 16,
          type: 'chunk',
          rootId: newRootId
        });
      }

      setFiles(prev => [...prev, newRoot, ...newChunks]);
      setSelectedNode(newRoot);
      setIsUploading(false);
    }, 1500);
  };

  // Arena Battle Simulation Engine
  const startTournamentArena = () => {
    setIsFighting(true);
    setBattleLogs([]);
    setWinner(null);
    setTxReceipt(null);
    setShowReceipt(false);

    let round = 1;
    const tempLogs: MatchLog[] = [];
    const maxRounds = 4;

    const interval = setInterval(() => {
      if (round <= maxRounds) {
        let action = "";
        let effect = "";
        let initiator = round % 2 === 1 ? userAgent.name : opponentAgent.name;

        if (round === 1) {
          action = `${initiator} initiated cryptographic proof queries, flooding the memory buffer.`;
          effect = `Lowered opponent memory bandwidth response index.`;
        } else if (round === 2) {
          action = `${initiator} launched transactional arbitrage routes across 0G Storage Nodes.`;
          effect = `Drained pool liquidity on isolated channel pipelines.`;
        } else if (round === 3) {
          action = `${initiator} executed a zero-knowledge stealth model weight update.`;
          effect = `Disrupted predictions of opponents response matrix.`;
        } else if (round === 4) {
          action = `${initiator} committed final attestation reports directly to block height ${blockHeight}.`;
          effect = `Secured dominant consensus validation proofs.`;
        }

        tempLogs.push({ round, action, effect, initiator });
        setBattleLogs([...tempLogs]);
        round++;
      } else {
        clearInterval(interval);
        
        // Calculate winner based on logic & speed stats
        const userScore = userAgent.logic * 0.4 + userAgent.speed * 0.3 + userAgent.aggression * 0.3 + Math.random() * 20;
        const oppScore = opponentAgent.logic * 0.4 + opponentAgent.speed * 0.3 + opponentAgent.aggression * 0.3 + Math.random() * 20;
        const winName = userScore >= oppScore ? userAgent.name : opponentAgent.name;
        
        setWinner(winName);
        setIsFighting(false);

        // Update leaderboard if user won
        if (winName === userAgent.name) {
          setLeaderboard(prev => {
            return prev.map(p => {
              if (p.name === userAgent.name) {
                const ratio = p.ratio.split('/');
                const wins = parseInt(ratio[0]) + 1;
                const losses = parseInt(ratio[1]);
                return {
                  ...p,
                  winRate: ((wins / (wins + losses)) * 100).toFixed(1) + '%',
                  ratio: `${wins}/${losses}`,
                  score: p.score + 150
                };
              }
              return p;
            }).sort((a, b) => b.score - a.score);
          });
        }
      }
    }, 1200);
  };

  const handleRecordMatch = () => {
    const txHash = generateKeccakHash(winner + Date.now().toString());
    const receipt = {
      transactionHash: txHash,
      status: '0x1 (Success)',
      blockNumber: blockHeight,
      from: '0xce807d4b4a5bc49c00a88f3c2394f849e782be3b',
      to: '0x0gdeai_arena_contract_v2_398a',
      gasUsed: '84,103 / 120,000 gwei',
      logs: [
        { topic: 'MatchEnded', winner: winner, block: blockHeight },
        { topic: 'LedgerRecorded', scoreUpdated: 'Neo-Sovereign +150' }
      ]
    };
    setTxReceipt(receipt);
    setShowReceipt(true);
  };

  return (
    <div className="min-h-screen bg-[#06060c] text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30">
      <div className="scanline"></div>

      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0F1420]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
            0G
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center">
              Sovereign AI Nexus <span className="ml-2 text-xs px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">0G DeAI Console</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-xs text-slate-300">
            <Server className={`w-3.5 h-3.5 text-cyan-400 ${isLoadingBlock ? 'animate-spin' : ''}`} />
            <span className="font-semibold text-cyan-400">0G Testnet</span>
            <span className="text-slate-500">|</span>
            <span>Block: <span className="font-mono text-white">{blockHeight}</span></span>
          </div>
        </div>
      </header>

      {/* Body Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-[#0B0F17] p-4 flex flex-col justify-between hidden md:flex">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3">Nexus Modules</span>
              <button 
                onClick={() => setActiveTab('vault')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border-l-2 ${
                  activeTab === 'vault' 
                    ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-400 border-cyan-400 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Confidential Agent Vault</span>
              </button>
              <button 
                onClick={() => setActiveTab('graph')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border-l-2 ${
                  activeTab === 'graph' 
                    ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-400 border-cyan-400 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent'
                }`}
              >
                <Network className="w-4 h-4" />
                <span>Nexus Knowledge Graph</span>
              </button>
              <button 
                onClick={() => setActiveTab('arena')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border-l-2 ${
                  activeTab === 'arena' 
                    ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-400 border-cyan-400 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Agent Tournament Arena</span>
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3">TEE Status</span>
              <div className="bg-[#101726]/70 border border-slate-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-semibold text-emerald-400">Intel TDX Active</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Cryptographic verification and memory enclave active on physical nodes.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/60 pt-4 space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3">Network Stats</span>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-[#101726]/40 border border-slate-800/60 rounded-lg p-2">
                <div className="text-[10px] text-slate-400">Storage Nodes</div>
                <div className="text-sm font-bold text-white font-mono">1,247</div>
              </div>
              <div className="bg-[#101726]/40 border border-slate-800/60 rounded-lg p-2">
                <div className="text-[10px] text-slate-400">DA Score</div>
                <div className="text-sm font-bold text-cyan-400 font-mono">99.97%</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Panel Content */}
        <main className="flex-1 bg-[#0F1420]/30 overflow-hidden flex flex-col">
          {/* TAB 1: CONFIDENTIAL VAULT */}
          {activeTab === 'vault' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="bg-[#121A2C] border-b border-slate-800 px-6 py-3 flex justify-between items-center shrink-0">
                <div>
                  <h2 class="text-sm font-bold text-white tracking-wide">Confidential Agent Vault</h2>
                  <p className="text-[10px] text-slate-400">Private AI Compute via 0G TEE Infrastructure</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-1 rounded border border-slate-700 font-mono">Intel TDX Secured</span>
                </div>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0B0F17]/30">
                {messages.map(m => (
                  <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-xs font-bold ${m.sender === 'user' ? 'text-indigo-400' : 'text-cyan-400'}`}>
                        {m.sender === 'user' ? 'Operator' : 'Secure AI Advisor'}
                      </span>
                      {m.sender === 'ai' && (
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">#00a88f3c2394f849</span>
                      )}
                    </div>
                    
                    <div className={`max-w-2xl rounded-xl p-4 text-sm leading-relaxed border shadow-md ${
                      m.sender === 'user' 
                        ? 'bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border-indigo-500/20 text-slate-100 rounded-tr-none' 
                        : 'bg-slate-900/60 border-slate-800/60 text-slate-200 rounded-tl-none'
                    }`}>
                      <p>{m.text}</p>
                      {m.chatHash && (
                        <div className="mt-2 text-[10px] font-mono text-slate-500 tracking-wider break-all">
                          {m.chatHash}
                        </div>
                      )}
                    </div>

                    <div className="mt-1 flex items-center space-x-3 text-[10px] text-slate-500">
                      <span>{m.timestamp}</span>
                      {m.attestation && (
                        <button 
                          onClick={() => {
                            setSelectedProof(m);
                            setShowProofModal(true);
                          }}
                          className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
                        >
                          <FileCode className="w-3 h-3 mr-0.5" />
                          <span>Verify Cryptographic Proof</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {isProcessingTEE && (
                  <div className="flex flex-col items-start animate-pulse">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-bold text-cyan-400">Secure AI Enclave</span>
                      <span className="text-[10px] text-slate-500 font-semibold">Processing...</span>
                    </div>
                    <div className="glass border-cyan-500/30 rounded-xl p-4 text-xs font-mono text-cyan-400/80 rounded-tl-none flex items-center space-x-3">
                      <Cpu className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>Hardware isolation locked. Attesting CPU memory state...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input form */}
              <div className="p-4 bg-[#0F1420]/80 border-t border-slate-800/80 space-y-3">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Ask your secure AI advisor..."
                    className="flex-1 bg-slate-900/60 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-semibold text-sm px-5 py-2 rounded-lg transition shadow-lg shadow-cyan-500/10 flex items-center space-x-1.5"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Encrypt and seal tools */}
                <div className="flex justify-start space-x-3">
                  <button 
                    onClick={handleSealToStorage}
                    disabled={isSealing}
                    className="flex items-center space-x-1.5 text-[11px] font-medium bg-[#101726] border border-slate-800 hover:border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition"
                  >
                    <Database className={`w-3.5 h-3.5 ${isSealing ? 'animate-bounce' : ''}`} />
                    <span>{isSealing ? 'Encrypting & Uploading...' : 'Seal and Save to 0G Storage'}</span>
                  </button>
                </div>

                {storageTx && (
                  <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-3 text-xs flex justify-between items-center text-emerald-400">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-semibold text-emerald-300">Sealed successfully on 0G storage!</div>
                        <div className="font-mono text-[10px] mt-0.5 text-emerald-500 break-all select-all">
                          Tx Hash: {storageTx}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(storageTx)}
                      className="text-emerald-400 hover:text-emerald-300 text-[10px] font-bold border border-emerald-900 px-2 py-1 rounded"
                    >
                      {copiedText === storageTx ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: KNOWLEDGE GRAPH */}
          {activeTab === 'graph' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="bg-[#121A2C] border-b border-slate-800 px-6 py-3 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">Nexus Knowledge Graph</h2>
                  <p className="text-[10px] text-slate-400">Chunked data distribution across 0G Storage Nodes</p>
                </div>
                <div className="flex items-center space-x-3">
                  <input 
                    type="file" 
                    ref={uploadInputRef}
                    onChange={handleFileUpload}
                    className="hidden" 
                  />
                  <button 
                    onClick={() => uploadInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center space-x-1.5 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white px-3 py-1.5 rounded-lg transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Chunking & Storing...' : 'Upload Mock File'}</span>
                  </button>
                </div>
              </div>

              {/* Graphic Viewport and detail panel */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                {/* Canvas graph */}
                <div className="flex-1 bg-[#07090F] relative overflow-hidden flex items-center justify-center">
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center space-y-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin"></div>
                        <Cpu className="w-5 h-5 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
                      </div>
                      <div className="text-sm font-bold text-cyan-300">0G DA Chunking System Active</div>
                      <div className="text-xs text-slate-400">Splitting document into replication matrices...</div>
                    </div>
                  )}

                  <canvas 
                    ref={canvasRef}
                    width={700}
                    height={460}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                    className="w-full h-full cursor-grab active:cursor-grabbing"
                  />
                </div>

                {/* Node Detail sidebar */}
                <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0B0F17] p-5 overflow-y-auto flex flex-col justify-between">
                  <div className="space-y-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Node Properties</h3>
                    
                    {selectedNode ? (
                      <div className="space-y-4">
                        <div className="bg-[#101726]/40 border border-slate-800 rounded-lg p-4 space-y-3">
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block uppercase">Name</span>
                            <span className="text-sm font-bold text-white flex items-center">
                              {selectedNode.name}
                              <span className={`ml-2 text-[8px] px-1.5 py-0.5 rounded-full ${
                                selectedNode.type === 'root' 
                                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                                  : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              }`}>
                                {selectedNode.type}
                              </span>
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">Size</span>
                            <span className="text-xs text-slate-200 font-mono">{selectedNode.size}</span>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">0G Store Hash</span>
                            <span className="text-[10px] text-cyan-400 font-mono break-all">{selectedNode.address}</span>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">DA Verification</span>
                            <span className="text-xs text-emerald-400 font-mono flex items-center">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                              {selectedNode.integrity}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-[#101726]/40 border border-slate-800/80 rounded-lg p-3">
                            <span className="text-[8px] text-slate-500 block font-bold uppercase">Retrieval Speed</span>
                            <span className="text-xs font-bold text-white font-mono">{selectedNode.speed}</span>
                          </div>
                          <div className="bg-[#101726]/40 border border-slate-800/80 rounded-lg p-3">
                            <span className="text-[8px] text-slate-500 block font-bold uppercase">Replications</span>
                            <span className="text-xs font-bold text-cyan-400 font-mono">{selectedNode.replication} Nodes</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-500 space-y-2">
                        <Info className="w-8 h-8 mx-auto text-slate-600" />
                        <p className="text-xs leading-relaxed">
                          Click on nodes in the visual network graph to inspect 0G Storage addresses, speeds, and integrity confirmations.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900/40 border border-slate-800/60 rounded-lg p-3 mt-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center mb-1">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 mr-1" />
                      About 0G Storage Nodes
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Files are partitioned, coded via erasure codes, and distributed to storage nodes to ensure high durability and parallelised DA retrieval speeds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ARENA */}
          {activeTab === 'arena' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="bg-[#121A2C] border-b border-slate-800 px-6 py-3 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">Agent Tournament Arena</h2>
                  <p className="text-[10px] text-slate-400">Simulate on-chain strategy games between AI agents</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-1 rounded border border-slate-700 font-mono">0G EVM Engine Active</span>
                </div>
              </div>

              {/* Tournament Panels */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto p-6 gap-6 bg-[#0B0F17]/30">
                {/* Agent configurator */}
                <div className="flex-1 space-y-6">
                  <div className="glass rounded-xl p-5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                      <User className="w-4 h-4 text-cyan-400 mr-1.5" />
                      Configure Your AI Agent
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-slate-500 block uppercase font-bold mb-1">Agent Name</label>
                        <input 
                          type="text" 
                          value={userAgent.name}
                          onChange={e => setUserAgent(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-500 block uppercase font-bold mb-1">Role Type</label>
                          <select 
                            value={userAgent.role}
                            onChange={e => setUserAgent(prev => ({ ...prev, role: e.target.value as any }))}
                            className="w-full bg-slate-900/60 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                          >
                            <option value="Hacker">Hacker</option>
                            <option value="Trader">Trader</option>
                            <option value="Philosopher">Philosopher</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 block uppercase font-bold mb-1">Match strategy</label>
                          <input 
                            type="text" 
                            value={userAgent.strategy}
                            onChange={e => setUserAgent(prev => ({ ...prev, strategy: e.target.value }))}
                            className="w-full bg-slate-900/60 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Stat sliders */}
                      <div className="space-y-2 pt-2">
                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-500">
                            <span>Aggression</span>
                            <span className="text-white">{userAgent.aggression}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="10" 
                            max="100" 
                            value={userAgent.aggression}
                            onChange={e => setUserAgent(prev => ({ ...prev, aggression: parseInt(e.target.value) }))}
                            className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-500">
                            <span>Logical Depth</span>
                            <span className="text-white">{userAgent.logic}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="10" 
                            max="100" 
                            value={userAgent.logic}
                            onChange={e => setUserAgent(prev => ({ ...prev, logic: parseInt(e.target.value) }))}
                            className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-500">
                            <span>Compute Speed</span>
                            <span className="text-white">{userAgent.speed}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="10" 
                            max="100" 
                            value={userAgent.speed}
                            onChange={e => setUserAgent(prev => ({ ...prev, speed: parseInt(e.target.value) }))}
                            className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={startTournamentArena}
                      disabled={isFighting}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold text-sm rounded-lg transition"
                    >
                      <Play className="w-4 h-4" />
                      <span>{isFighting ? 'Simulating Tournament...' : 'Matchmake and De-AI Duel'}</span>
                    </button>
                  </div>

                  {/* Opponent Profile */}
                  <div className="glass rounded-xl p-4 bg-[#101726]/20 space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Matched Opponent</h4>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white text-sm">{opponentAgent.name}</div>
                        <div className="text-[10px] text-slate-400">Role: {opponentAgent.role} | {opponentAgent.strategy}</div>
                      </div>
                      <span className="text-xs px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full font-mono font-bold">LVL 48</span>
                    </div>
                  </div>
                </div>

                {/* Match logs and receipts */}
                <div className="flex-1 flex flex-col space-y-6">
                  {/* Logs log */}
                  <div className="glass rounded-xl p-5 flex-1 flex flex-col min-h-[300px]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center mb-4">
                      <Terminal className="w-4 h-4 text-cyan-400 mr-1.5" />
                      Battle Simulation Logs
                    </h3>

                    <div className="flex-1 bg-slate-950/70 border border-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-y-auto space-y-3">
                      {battleLogs.length > 0 ? (
                        battleLogs.map((log, index) => (
                          <div key={index} className="space-y-1 py-1 border-b border-slate-900/60 last:border-b-0 animate-fade-in-up">
                            <div className="flex items-center space-x-2 text-[10px]">
                              <span className="text-cyan-400">Round {log.round}</span>
                              <span className="text-slate-500">•</span>
                              <span className="text-indigo-400">{log.initiator}</span>
                            </div>
                            <p className="text-slate-200">{log.action}</p>
                            <p className="text-[10px] text-slate-500 italic">Effect: {log.effect}</p>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-500">
                          {isFighting ? 'Calculating consensus...' : 'No duel active. Click Matchmake to query opponent.'}
                        </div>
                      )}

                      {winner && (
                        <div className="pt-2 animate-bounce flex flex-col items-center justify-center space-y-2">
                          <div className="text-center text-emerald-400 font-bold text-sm flex items-center">
                            <Sparkles className="w-4 h-4 mr-1.5 text-emerald-400" />
                            DUEL ENDED - WINNER: {winner}
                          </div>
                          <button 
                            onClick={handleRecordMatch}
                            className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs px-4 py-1.5 rounded transition shadow-md"
                          >
                            Record Match to 0G Chain
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* EVM Receipt */}
                  {txReceipt && showReceipt && (
                    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3 animate-fade-in-up">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-white flex items-center">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mr-1.5" />
                          0G L1 Tx Confirmation Receipt
                        </span>
                        <button 
                          onClick={() => setShowReceipt(false)}
                          className="text-xs text-slate-500 hover:text-slate-300"
                        >
                          Close
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] font-mono">
                        <div>
                          <span className="text-slate-500 block uppercase font-bold">Transaction Hash</span>
                          <span className="text-slate-300 break-all select-all">{txReceipt.transactionHash}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block uppercase font-bold">Block height</span>
                          <span className="text-slate-300">{txReceipt.blockNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block uppercase font-bold">Sender</span>
                          <span className="text-slate-300">{txReceipt.from}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block uppercase font-bold">Contract Address</span>
                          <span className="text-cyan-400">{txReceipt.to}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block uppercase font-bold">Gas consumed</span>
                          <span className="text-slate-300">{txReceipt.gasUsed}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block uppercase font-bold">Status</span>
                          <span className="text-emerald-400 font-bold">{txReceipt.status}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Leaderboard */}
                  <div className="glass rounded-xl p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center mb-3">
                      Arena Leaderboard
                    </h3>
                    <div className="space-y-2">
                      {leaderboard.map((player) => (
                        <div 
                          key={player.rank} 
                          className={`flex justify-between items-center text-xs py-1.5 px-3 rounded ${
                            player.name === userAgent.name 
                              ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' 
                              : 'bg-slate-900/40 border border-slate-900/60 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-500 w-4">{player.rank}.</span>
                            <span className="font-semibold text-white">{player.name}</span>
                          </div>
                          <div className="flex items-center space-x-6 font-mono text-[11px]">
                            <div>
                              <span className="text-[9px] text-slate-500 block text-right">Win rate</span>
                              <span>{player.winRate}</span>
                            </div>
                            <div className="w-16">
                              <span className="text-[9px] text-slate-500 block text-right">Ratio</span>
                              <span className="block text-right">{player.ratio}</span>
                            </div>
                            <div className="w-12">
                              <span className="text-[9px] text-slate-500 block text-right">Score</span>
                              <span className="block text-right font-bold text-white">{player.score}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Proof Modal */}
      {showProofModal && selectedProof && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-[#0B0F17] border border-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center">
                  <Shield className="w-4 h-4 text-cyan-400 mr-2" />
                  TEE Cryptographic Attestation Document
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Intel TDX Security Verification Report</p>
              </div>
              <button 
                onClick={() => setShowProofModal(false)}
                className="text-slate-400 hover:text-white font-bold text-xs"
              >
                Close Report
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto font-mono text-xs bg-slate-950 text-cyan-400/90 space-y-4">
              <div className="space-y-1">
                <div>[+] PLATFORM REPORT INFO</div>
                <div>Intel(R) Trust Domain Extensions (Intel TDX) Attestation Report</div>
                <div>Format Version: 1.0</div>
                <div>Platform: Intel Xeon Scalable Processor (Emerald Rapids)</div>
              </div>

              <div className="space-y-1.5">
                <div>[+] MEASUREMENT REGISTERS</div>
                <div>MRENCLAVE:  0x9df3421ac08f32bc421b0e9f1a2394f8e9399e7b2be3c90f2a3d3c8c6a2e8c61</div>
                <div>MRSIGNER:   0xce807d4b4a5bc49c00a88f3c2394f849e782be3bc30f9a2d3c90e8f812cd394f</div>
                <div>RTMR[0]:    {selectedProof.chatHash}</div>
                <div>RTMR[1]:    0x0000000000000000000000000000000000000000000000000000000000000000</div>
              </div>

              <div className="space-y-1">
                <div>[+] VERIFICATION LOG DETAILS</div>
                <div>Timestamp: {selectedProof.timestamp}</div>
                <div>Consensus Target Height: {blockHeight}</div>
                <div>Attestation Status: verified_on_chain</div>
                <div>Verification Engine: 0G-TEE-Attestation-Verifier-v1.2</div>
              </div>

              <div className="bg-slate-900 border border-slate-800/80 p-3 text-[10px] text-slate-400 whitespace-pre-wrap break-all leading-normal select-all">
                {"--- BEGIN TEE ATTESTATION SIGNATURE ---\n"}
                {generateKeccakHash(selectedProof.text + selectedProof.timestamp)}
                {generateKeccakHash(selectedProof.text + "IntelAttestationReportSignatureStringPart2")}
                {"\n--- END TEE ATTESTATION SIGNATURE ---"}
              </div>
            </div>

            <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                Proof registered at Block Height {blockHeight}
              </span>
              <button 
                onClick={() => copyToClipboard(generateKeccakHash(selectedProof.text + selectedProof.timestamp))}
                className="text-cyan-400 font-bold border border-cyan-800/40 px-3 py-1 rounded hover:bg-cyan-500/10 transition"
              >
                {copiedText ? 'Copied' : 'Copy Hash Signature'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
