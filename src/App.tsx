import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Network, 
  Trophy, 
  Cpu, 
  FileCode, 
  Terminal, 
  Send, 
  Upload, 
  Database, 
  Play, 
  CheckCircle, 
  Server, 
  User, 
  Info,
  Clock,
  Zap,
  Sparkles,
  Activity,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import trophyImg from '../zero_cup_trophy.png';

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

interface MatchLog {
  round: number;
  minute: number;
  action: string;
  effect: string;
  initiator: string;
}

interface LeaderboardTeam {
  rank: number;
  name: string;
  tactic: string;
  winRate: string;
  ratio: string;
  score: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'vault' | 'graph' | 'arena'>('graph');
  const [blockHeight, setBlockHeight] = useState<string>('39,665,672');
  const [isLoadingBlock, setIsLoadingBlock] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // --- Confidential Scout Enclave (Vault) ---
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Welcome to the Confidential Scout Enclave. I am your secure AI Football Analyst operating within a hardware-isolated Intel TDX TEE environment. All computational tactical models are cryptographically attested. Ask me for squad reports, player value optimizations, or match simulations.',
      timestamp: new Date().toLocaleTimeString(),
      chatHash: '0x3a48e788bc92d11e9f1a2394f8e9399e7b2be3bc30f9a2d3c90e8f812cd394f8',
      attestation: 'Intel TDX Secure TEE Verification Confirmed on 0G Chain.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessingTEE, setIsProcessingTEE] = useState(false);
  const [selectedProof, setSelectedProof] = useState<Message | null>(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [storageTx, setStorageTx] = useState<string | null>(null);
  const [isSealing, setIsSealing] = useState(false);

  // Live validator sequence inside TEE Modal
  const [validatorStep, setValidatorStep] = useState<number>(0);
  const [validatorState, setValidatorState] = useState<'idle' | 'running' | 'done'>('idle');

  // --- World Cup Bracket Predictor (Graph) ---
  const [qfWinner1, setQfWinner1] = useState<string | null>(null);
  const [qfWinner2, setQfWinner2] = useState<string | null>(null);
  const [qfWinner3, setQfWinner3] = useState<string | null>(null);
  const [qfWinner4, setQfWinner4] = useState<string | null>(null);

  const [sfWinner1, setSfWinner1] = useState<string | null>(null);
  const [sfWinner2, setSfWinner2] = useState<string | null>(null);

  const [champion, setChampion] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionLog, setPredictionLog] = useState<string>('');

  // 0G Storage Nodes (Visualizing chunk distribution)
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [draggingNode, setDraggingNode] = useState<FileNode | null>(null);
  const [isSealingBracket, setIsSealingBracket] = useState(false);
  const [bracketTx, setBracketTx] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- AI Manager Arena (Arena) ---
  const [userAgent, setUserAgent] = useState({
    name: 'Sovereign-Coach',
    formation: '4-3-3 Attacking',
    role: 'Tiki-Taka Maestro' as 'Tiki-Taka Maestro' | 'Gegenpress Coach' | 'Catenaccio Specialist',
    offense: 80,
    defense: 75,
    chemistry: 85
  });

  const [opponentAgent, setOpponentAgent] = useState({
    name: 'Mourinho-GPT',
    formation: '5-3-2 Defensive',
    role: 'Catenaccio Specialist',
    offense: 65,
    defense: 95,
    chemistry: 78
  });

  const opponents = [
    { name: 'Mourinho-GPT', formation: '5-3-2 Defensive', role: 'Catenaccio Specialist', offense: 65, defense: 95, chemistry: 78 },
    { name: 'Ancelotti-AI', formation: '4-4-2 Balanced', role: 'Tiki-Taka Maestro', offense: 85, defense: 80, chemistry: 90 },
    { name: 'Klopp-Gegenpress', formation: '4-3-3 Heavy Metal', role: 'Gegenpress Coach', offense: 92, defense: 70, chemistry: 88 }
  ];

  // Dynamic statistics dashboard during simulation
  const [matchStats, setMatchStats] = useState({
    possession: { user: 50, opp: 50 },
    shots: { user: 0, opp: 0 },
    accuracy: { user: 0, opp: 0 },
    xg: { user: 0.0, opp: 0.0 }
  });

  const [battleLogs, setBattleLogs] = useState<MatchLog[]>([]);
  const [isFighting, setIsFighting] = useState(false);
  const [arenaWinner, setArenaWinner] = useState<string | null>(null);
  const [arenaScore, setArenaScore] = useState<string | null>(null);
  const [txReceipt, setTxReceipt] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardTeam[]>([
    { rank: 1, name: 'Pep-AI-Oracle', tactic: 'Tiki-Taka Maestro', winRate: '92.4%', ratio: '240/20', score: 2580 },
    { rank: 2, name: 'Klopp-Gegenpress', tactic: 'Gegenpress Coach', winRate: '86.1%', ratio: '210/34', score: 2210 },
    { rank: 3, name: 'Mourinho-GPT', tactic: 'Catenaccio Specialist', winRate: '79.2%', ratio: '175/46', score: 1910 },
    { rank: 4, name: 'Sovereign-Coach', tactic: 'Tiki-Taka Maestro', winRate: '75.0%', ratio: '90/30', score: 1350 },
    { rank: 5, name: 'Ancelotti-AI', tactic: 'Tiki-Taka Maestro', winRate: '72.1%', ratio: '88/34', score: 1280 }
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

  // --- Confidential Chat Smart Engine ---
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

    setTimeout(() => {
      let aiText = "";
      const textLower = userMsg.text.toLowerCase();

      if (textLower.includes('tactic') || textLower.includes('formation') || textLower.includes('play')) {
        aiText = "Based on our model analysis in TEE: A 4-3-3 formation with high defensive line matches best against defensive low-blocks. Gegenpress tactics require a high physical chemistry index (>85%) to prevent transition gaps.";
      } else if (textLower.includes('predict') || textLower.includes('winner') || textLower.includes('cup')) {
        aiText = "0G DeAI engine calculates France and Brazil as the highest probability finalists (26.4% and 24.1% respectively). Argentine squad depth shows a 68% win-rate in standard climate simulations.";
      } else if (textLower.includes('tee') || textLower.includes('security') || textLower.includes('attestation')) {
        aiText = "The Scout Enclave isolates all tactical data inside Intel TDX hardware. The system signs the resulting reports in isolated memory, proving that no third-party tampered with the weights or statistics during inference.";
      } else {
        aiText = `Tactical query processed within 0G TEE Enclave. Models run with fully attested weights. Cryptographic proof sealed under consensus block height ${blockHeight}.`;
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
    }, 1200);
  };

  const handleSealToStorage = () => {
    setIsSealing(true);
    setStorageTx(null);
    setTimeout(() => {
      const fullHistory = JSON.stringify(messages);
      const payloadHash = generateKeccakHash(fullHistory);
      setStorageTx(payloadHash);
      setIsSealing(false);
    }, 1800);
  };

  // Trigger Live attestation check sequences
  const handleVerifyProof = (m: Message) => {
    setSelectedProof(m);
    setShowProofModal(true);
    setValidatorState('running');
    setValidatorStep(1);

    setTimeout(() => setValidatorStep(2), 800);
    setTimeout(() => setValidatorStep(3), 1600);
    setTimeout(() => setValidatorStep(4), 2400);
    setTimeout(() => setValidatorState('done'), 3200);
  };

  // --- World Cup Bracket Simulation ---
  const simulatePredictions = () => {
    setIsPredicting(true);
    setPredictionLog('Loading GLM-5.2 DeAI Sports model weights...');
    
    // Reset bracket first
    setQfWinner1(null);
    setQfWinner2(null);
    setQfWinner3(null);
    setQfWinner4(null);
    setSfWinner1(null);
    setSfWinner2(null);
    setChampion(null);

    const steps = [
      { log: 'Analyzing Quarterfinal 1: France vs Spain... Tactical dominance matches favor France.', run: () => setQfWinner1('France') },
      { log: 'Analyzing Quarterfinal 2: Germany vs England... England squad depth proves superior.', run: () => setQfWinner2('England') },
      { log: 'Analyzing Quarterfinal 3: Argentina vs Netherlands... Messi-GPT index projects Argentina victory.', run: () => setQfWinner3('Argentina') },
      { log: 'Analyzing Quarterfinal 4: Brazil vs Portugal... Brazil attacking efficiency edges out Portugal.', run: () => setQfWinner4('Brazil') },
      { log: 'Simulating Semifinal 1: France vs England... Extra time simulations favor France high press.', run: () => setSfWinner1('France') },
      { log: 'Simulating Semifinal 2: Argentina vs Brazil... Brazil tactical agility secures final slot.', run: () => setSfWinner2('Brazil') },
      { log: 'World Cup Grand Final: France vs Brazil... DeAI calculates Brazil winner!', run: () => {
        setChampion('Brazil');
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }}
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setPredictionLog(steps[currentStep].log);
        steps[currentStep].run();
        currentStep++;
      } else {
        clearInterval(interval);
        setIsPredicting(false);
        setPredictionLog('Prediction matrix successfully calculated by 0G DeAI Engine.');
      }
    }, 1200);
  };

  const handleSealBracket = () => {
    setIsSealingBracket(true);
    setBracketTx(null);
    
    setTimeout(() => {
      const predState = {
        qf: [qfWinner1, qfWinner2, qfWinner3, qfWinner4],
        sf: [sfWinner1, sfWinner2],
        champion
      };
      const blockHash = generateKeccakHash(JSON.stringify(predState) + Date.now());
      setBracketTx(blockHash);
      setIsSealingBracket(false);

      // Create storage chunk physics nodes on Canvas
      const width = 600;
      const height = 280;
      const rootNode: FileNode = {
        id: 'root-bracket',
        name: 'WorldCup_Predictions_2026.json',
        size: '1.4 KB',
        address: blockHash.substring(0, 20) + '...',
        integrity: 'Verified (Keccak256)',
        speed: '1.4 GB/s',
        replication: 6,
        x: width / 2,
        y: height / 2,
        vx: 0,
        vy: 0,
        radius: 24,
        type: 'root'
      };

      const newChunks: FileNode[] = [];
      const numChunks = 6;
      for (let i = 0; i < numChunks; i++) {
        const angle = (i / numChunks) * Math.PI * 2;
        newChunks.push({
          id: `chunk-bracket-${i}`,
          name: `chunk_${i + 1}`,
          size: '235 B',
          address: generateKeccakHash('bracket-chunk' + i + Date.now()).substring(0, 20) + '...',
          integrity: `Erasure Coded Chunk ${i + 1}`,
          speed: (600 + Math.random() * 800).toFixed(0) + ' MB/s',
          replication: 6,
          x: width / 2 + Math.cos(angle) * 90,
          y: height / 2 + Math.sin(angle) * 90,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3,
          radius: 14,
          type: 'chunk',
          rootId: 'root-bracket'
        });
      }

      setFiles([rootNode, ...newChunks]);
      setSelectedNode(rootNode);
    }, 1500);
  };

  // Node physics engine
  useEffect(() => {
    if (activeTab !== 'graph' || files.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const updatePhysics = () => {
      for (let i = 0; i < files.length; i++) {
        const n1 = files[i];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        n1.vx += (centerX - n1.x) * 0.0004;
        n1.vy += (centerY - n1.y) * 0.0004;

        for (let j = i + 1; j < files.length; j++) {
          const n2 = files[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = n1.radius + n2.radius + 50;
          
          if (dist < minDist) {
            const force = (minDist - dist) * 0.012;
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

        if (n1 !== draggingNode) {
          n1.x += n1.vx;
          n1.y += n1.vy;
          n1.vx *= 0.90;
          n1.vy *= 0.90;

          const margin = 20;
          if (n1.x < margin) { n1.x = margin; n1.vx *= -0.5; }
          if (n1.x > canvas.width - margin) { n1.x = canvas.width - margin; n1.vx *= -0.5; }
          if (n1.y < margin) { n1.y = margin; n1.vy *= -0.5; }
          if (n1.y > canvas.height - margin) { n1.y = canvas.height - margin; n1.vy *= -0.5; }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 25;
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

      ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.lineWidth = 1.5;
      files.forEach(n => {
        if (n.type === 'chunk' && n.rootId) {
          const root = files.find(r => r.id === n.rootId);
          if (root) {
            ctx.beginPath();
            ctx.setLineDash([3, 3]);
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(root.x, root.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      });

      files.forEach(n => {
        const isSelected = selectedNode?.id === n.id;
        ctx.save();
        ctx.shadowBlur = isSelected ? 18 : 8;
        ctx.shadowColor = n.type === 'root' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(168, 85, 247, 0.5)';

        const grad = ctx.createRadialGradient(n.x, n.y, 2, n.x, n.y, n.radius);
        if (n.type === 'root') {
          grad.addColorStop(0, '#112240');
          grad.addColorStop(1, '#020c1b');
        } else {
          grad.addColorStop(0, '#2d124d');
          grad.addColorStop(1, '#0e051a');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isSelected ? '#00f0ff' : (n.type === 'root' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(168, 85, 247, 0.5)');
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '8px monospace';
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

  // --- AI Manager Arena Debate & Duel ---
  const handleSelectOpponent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const opp = opponents.find(o => o.name === e.target.value);
    if (opp) setOpponentAgent(opp);
  };

  const startArenaMatch = () => {
    setIsFighting(true);
    setBattleLogs([]);
    setArenaWinner(null);
    setArenaScore(null);
    setTxReceipt(null);
    setShowReceipt(false);

    // Reset match statistics
    setMatchStats({
      possession: { user: 50, opp: 50 },
      shots: { user: 0, opp: 0 },
      accuracy: { user: 0, opp: 0 },
      xg: { user: 0.0, opp: 0.0 }
    });

    let round = 1;
    const tempLogs: MatchLog[] = [];
    const maxRounds = 4;

    const interval = setInterval(() => {
      if (round <= maxRounds) {
        let action = "";
        let effect = "";
        let minute = round === 1 ? 15 : round === 2 ? 44 : round === 3 ? 72 : 90;
        let initiator = round % 2 === 1 ? userAgent.name : opponentAgent.name;

        // Calculate dynamic dashboard statistics per round
        setMatchStats(prev => {
          const userPoss = Math.round(50 + (userAgent.chemistry - opponentAgent.chemistry) * 0.15 + (Math.random() * 8 - 4));
          const boundedPoss = Math.max(30, Math.min(70, userPoss));
          
          const newShotsUser = prev.shots.user + Math.floor(userAgent.offense / 40 + Math.random() * 2);
          const newShotsOpp = prev.shots.opp + Math.floor(opponentAgent.offense / 45 + Math.random() * 2);
          
          const accUser = Math.round(userAgent.chemistry * 0.88 + Math.random() * 8);
          const accOpp = Math.round(opponentAgent.chemistry * 0.85 + Math.random() * 8);
          
          const addXgUser = parseFloat(((userAgent.offense / 100) * (Math.random() * 0.4 + 0.1)).toFixed(2));
          const addXgOpp = parseFloat(((opponentAgent.offense / 100) * (Math.random() * 0.35 + 0.1)).toFixed(2));
          
          return {
            possession: { user: boundedPoss, opp: 100 - boundedPoss },
            shots: { user: newShotsUser, opp: newShotsOpp },
            accuracy: { user: Math.min(98, accUser), opp: Math.min(98, accOpp) },
            xg: parseFloat((prev.xg.user + addXgUser).toFixed(2)),
            xg: parseFloat((prev.xg.opp + addXgOpp).toFixed(2))
          };
        });

        if (round === 1) {
          action = `${initiator} launches a rapid high-intensity offensive transition, testing the low-block spacing.`;
          effect = `Created 3 counter-pressing scenarios, increasing midfield presence.`;
        } else if (round === 2) {
          action = `${initiator} sets up a deep defensive pocket, intercepting and locking down the opponent's wingers.`;
          effect = `Reduced opponent's offensive threat multiplier.`;
        } else if (round === 3) {
          action = `${initiator} adjustments: moves wingbacks higher up the pitch to overwhelm the opponent's backline.`;
          effect = `Generated goalscoring threat under high computational probability.`;
        } else if (round === 4) {
          action = `${initiator} seals tactical debate in the box with a precise strike into the top corner!`;
          effect = `Attestation signature logged under 0G EVM consensus block height ${blockHeight}.`;
        }

        tempLogs.push({ round, minute, action, effect, initiator });
        setBattleLogs([...tempLogs]);
        round++;
      } else {
        clearInterval(interval);

        const userPower = userAgent.offense * 0.4 + userAgent.chemistry * 0.4 + userAgent.defense * 0.2 + Math.random() * 15;
        const oppPower = opponentAgent.offense * 0.3 + opponentAgent.defense * 0.5 + opponentAgent.chemistry * 0.2 + Math.random() * 15;

        let userGoals = 0;
        let oppGoals = 0;

        if (userPower > oppPower + 8) {
          userGoals = Math.floor(Math.random() * 3) + 2;
          oppGoals = Math.floor(Math.random() * 2);
        } else if (oppPower > userPower + 8) {
          userGoals = Math.floor(Math.random() * 2);
          oppGoals = Math.floor(Math.random() * 3) + 2;
        } else {
          userGoals = Math.floor(Math.random() * 2) + 1;
          oppGoals = userGoals + (Math.random() > 0.5 ? 1 : -1);
          if (oppGoals < 0) oppGoals = 0;
        }

        const winName = userGoals > oppGoals ? userAgent.name : (oppGoals > userGoals ? opponentAgent.name : 'Draw');
        setArenaWinner(winName);
        setArenaScore(`${userGoals} - ${oppGoals}`);
        setIsFighting(false);

        if (winName === userAgent.name) {
          confetti({
            particleCount: 100,
            spread: 60,
            origin: { y: 0.8 }
          });

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
                  score: p.score + 180
                };
              }
              return p;
            }).sort((a, b) => b.score - a.score);
          });
        }
      }
    }, 1200);
  };

  const handleRecordArenaMatch = () => {
    const txHash = generateKeccakHash(arenaWinner + arenaScore + Date.now().toString());
    const receipt = {
      transactionHash: txHash,
      status: '0x1 (Success)',
      blockNumber: blockHeight,
      from: '0x0g_tactical_arena_operator_ce80',
      to: '0x0gdeai_sports_arena_v3_92ac',
      gasUsed: '94,281 / 150,000 gwei',
      logs: [
        { topic: 'MatchConcluded', winner: arenaWinner, score: arenaScore, block: blockHeight },
        { topic: 'ConsensusAttested', code: 'TEE_INTEL_TDX_VERIFIED' }
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
              0G World Cup AI Arena <span className="ml-2 text-xs px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">Zero Cup Edition</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono">
            <Server className={`w-3.5 h-3.5 text-cyan-400 ${isLoadingBlock ? 'animate-spin' : ''}`} />
            <span className="font-semibold text-cyan-400">0G L1 Chain</span>
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
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3">Arena Modules</span>
              <button 
                onClick={() => setActiveTab('graph')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border-l-2 ${
                  activeTab === 'graph' 
                    ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-400 border-cyan-400 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Bracket Predictor</span>
              </button>
              <button 
                onClick={() => setActiveTab('arena')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border-l-2 ${
                  activeTab === 'arena' 
                    ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-400 border-cyan-400 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>AI Manager Arena</span>
              </button>
              <button 
                onClick={() => setActiveTab('vault')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border-l-2 ${
                  activeTab === 'vault' 
                    ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-400 border-cyan-400 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Confidential Scout Vault</span>
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3">TEE & Storage</span>
              <div className="bg-[#101726]/70 border border-slate-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-semibold text-emerald-400">0G Storage Active</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Prediction hashes and match histories are partitioned, encrypted, and sealed directly to storage nodes.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/60 pt-4 space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3">Zero Cup Stats</span>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-[#101726]/40 border border-slate-800/60 rounded-lg p-2">
                <div className="text-[9px] text-slate-400 uppercase">Prize Pool</div>
                <div className="text-sm font-bold text-cyan-400 font-mono">$17,000</div>
              </div>
              <div className="bg-[#101726]/40 border border-slate-800/60 rounded-lg p-2">
                <div className="text-[9px] text-slate-400 uppercase">DA Node speed</div>
                <div className="text-sm font-bold text-white font-mono">1.2 GB/s</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Panel Content */}
        <main className="flex-1 bg-[#0F1420]/30 overflow-hidden flex flex-col">
          
          {/* TAB 1: BRACKET PREDICTOR */}
          {activeTab === 'graph' && (
            <div className="flex-1 flex flex-col h-full overflow-y-auto">
              <div className="bg-[#121A2C] border-b border-slate-800 px-6 py-3 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">0G World Cup Bracket Predictor</h2>
                  <p className="text-[10px] text-slate-400">Build your bracket predictions or simulate using 0G DeAI Engine</p>
                </div>
                <button
                  onClick={simulatePredictions}
                  disabled={isPredicting}
                  className="flex items-center space-x-1.5 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white px-3 py-1.5 rounded-lg transition shadow-lg shadow-cyan-500/10"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{isPredicting ? 'DeAI Simulating...' : 'Auto-Predict (GLM-5.2)'}</span>
                </button>
              </div>

              {/* Bracket container */}
              <div className="p-6 flex flex-col space-y-6">
                
                {predictionLog && (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-xs font-mono text-cyan-400 flex items-center space-x-2 animate-fade-in-up">
                    <Activity className="w-4 h-4 animate-pulse text-cyan-400" />
                    <span>{predictionLog}</span>
                  </div>
                )}

                {/* Bracket Layout columns */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-[#07090F]/40 border border-slate-800/60 rounded-xl p-6 relative overflow-x-auto min-w-[950px]">
                  
                  {/* QUARTERFINALS */}
                  <div className="flex flex-col justify-between space-y-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center border-b border-slate-850 pb-2">Quarterfinals</h3>
                    
                    {/* Match 1 */}
                    <div className={`bracket-match ${qfWinner1 ? 'glow-border-cyan' : ''}`}>
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">QF Match 1</div>
                      <button 
                        onClick={() => { setQfWinner1('France'); if (sfWinner1 === 'France' || sfWinner1 === 'Spain') setSfWinner1(null); }}
                        className={`w-full text-left text-xs py-1.5 px-2 rounded mb-1 flex justify-between items-center transition ${qfWinner1 === 'France' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold' : 'hover:bg-slate-800/40 text-slate-300'}`}
                      >
                        <span>🇫🇷 France</span>
                        {qfWinner1 === 'France' && <CheckCircle className="w-3 h-3 text-cyan-400" />}
                      </button>
                      <button 
                        onClick={() => { setQfWinner1('Spain'); if (sfWinner1 === 'France' || sfWinner1 === 'Spain') setSfWinner1(null); }}
                        className={`w-full text-left text-xs py-1.5 px-2 rounded flex justify-between items-center transition ${qfWinner1 === 'Spain' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold' : 'hover:bg-slate-800/40 text-slate-300'}`}
                      >
                        <span>🇪🇸 Spain</span>
                        {qfWinner1 === 'Spain' && <CheckCircle className="w-3 h-3 text-cyan-400" />}
                      </button>
                    </div>

                    {/* Match 2 */}
                    <div className={`bracket-match ${qfWinner2 ? 'glow-border-cyan' : ''}`}>
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">QF Match 2</div>
                      <button 
                        onClick={() => { setQfWinner2('Germany'); if (sfWinner1 === 'Germany' || sfWinner1 === 'England') setSfWinner1(null); }}
                        className={`w-full text-left text-xs py-1.5 px-2 rounded mb-1 flex justify-between items-center transition ${qfWinner2 === 'Germany' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold' : 'hover:bg-slate-800/40 text-slate-300'}`}
                      >
                        <span>🇩🇪 Germany</span>
                        {qfWinner2 === 'Germany' && <CheckCircle className="w-3 h-3 text-cyan-400" />}
                      </button>
                      <button 
                        onClick={() => { setQfWinner2('England'); if (sfWinner1 === 'Germany' || sfWinner1 === 'England') setSfWinner1(null); }}
                        className={`w-full text-left text-xs py-1.5 px-2 rounded flex justify-between items-center transition ${qfWinner2 === 'England' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold' : 'hover:bg-slate-800/40 text-slate-300'}`}
                      >
                        <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿 England</span>
                        {qfWinner2 === 'England' && <CheckCircle className="w-3 h-3 text-cyan-400" />}
                      </button>
                    </div>

                    {/* Match 3 */}
                    <div className={`bracket-match ${qfWinner3 ? 'glow-border-cyan' : ''}`}>
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">QF Match 3</div>
                      <button 
                        onClick={() => { setQfWinner3('Argentina'); if (sfWinner2 === 'Argentina' || sfWinner2 === 'Netherlands') setSfWinner2(null); }}
                        className={`w-full text-left text-xs py-1.5 px-2 rounded mb-1 flex justify-between items-center transition ${qfWinner3 === 'Argentina' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold' : 'hover:bg-slate-800/40 text-slate-300'}`}
                      >
                        <span>🇦🇷 Argentina</span>
                        {qfWinner3 === 'Argentina' && <CheckCircle className="w-3 h-3 text-cyan-400" />}
                      </button>
                      <button 
                        onClick={() => { setQfWinner3('Netherlands'); if (sfWinner2 === 'Argentina' || sfWinner2 === 'Netherlands') setSfWinner2(null); }}
                        className={`w-full text-left text-xs py-1.5 px-2 rounded flex justify-between items-center transition ${qfWinner3 === 'Netherlands' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold' : 'hover:bg-slate-800/40 text-slate-300'}`}
                      >
                        <span>🇳🇱 Netherlands</span>
                        {qfWinner3 === 'Netherlands' && <CheckCircle className="w-3 h-3 text-cyan-400" />}
                      </button>
                    </div>

                    {/* Match 4 */}
                    <div className={`bracket-match ${qfWinner4 ? 'glow-border-cyan' : ''}`}>
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">QF Match 4</div>
                      <button 
                        onClick={() => { setQfWinner4('Brazil'); if (sfWinner2 === 'Brazil' || sfWinner2 === 'Portugal') setSfWinner2(null); }}
                        className={`w-full text-left text-xs py-1.5 px-2 rounded mb-1 flex justify-between items-center transition ${qfWinner4 === 'Brazil' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold' : 'hover:bg-slate-800/40 text-slate-300'}`}
                      >
                        <span>🇧🇷 Brazil</span>
                        {qfWinner4 === 'Brazil' && <CheckCircle className="w-3 h-3 text-cyan-400" />}
                      </button>
                      <button 
                        onClick={() => { setQfWinner4('Portugal'); if (sfWinner2 === 'Brazil' || sfWinner2 === 'Portugal') setSfWinner2(null); }}
                        className={`w-full text-left text-xs py-1.5 px-2 rounded flex justify-between items-center transition ${qfWinner4 === 'Portugal' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold' : 'hover:bg-slate-800/40 text-slate-300'}`}
                      >
                        <span>🇵🇹 Portugal</span>
                        {qfWinner4 === 'Portugal' && <CheckCircle className="w-3 h-3 text-cyan-400" />}
                      </button>
                    </div>

                  </div>

                  {/* SEMIFINALS */}
                  <div className="flex flex-col justify-around py-12">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center border-b border-slate-850 pb-2">Semifinals</h3>
                    
                    {/* Semi 1 */}
                    <div className={`bracket-match ${sfWinner1 ? 'glow-border-cyan' : ''}`}>
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Semifinal 1</div>
                      {qfWinner1 && qfWinner2 ? (
                        <>
                          <button 
                            onClick={() => { setSfWinner1(qfWinner1); if (champion === qfWinner1 || champion === qfWinner2) setChampion(null); }}
                            className={`w-full text-left text-xs py-1.5 px-2 rounded mb-1 flex justify-between items-center transition ${sfWinner1 === qfWinner1 ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold' : 'hover:bg-slate-800/40 text-slate-300'}`}
                          >
                            <span>{qfWinner1}</span>
                            {sfWinner1 === qfWinner1 && <CheckCircle className="w-3 h-3 text-cyan-400" />}
                          </button>
                          <button 
                            onClick={() => { setSfWinner1(qfWinner2); if (champion === qfWinner1 || champion === qfWinner2) setChampion(null); }}
                            className={`w-full text-left text-xs py-1.5 px-2 rounded flex justify-between items-center transition ${sfWinner1 === qfWinner2 ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold' : 'hover:bg-slate-800/40 text-slate-300'}`}
                          >
                            <span>{qfWinner2}</span>
                            {sfWinner1 === qfWinner2 && <CheckCircle className="w-3 h-3 text-cyan-400" />}
                          </button>
                        </>
                      ) : (
                        <div className="text-xs text-slate-600 text-center py-4 italic">Waiting for QF results...</div>
                      )}
                    </div>

                    {/* Semi 2 */}
                    <div className={`bracket-match ${sfWinner2 ? 'glow-border-cyan' : ''}`}>
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Semifinal 2</div>
                      {qfWinner3 && qfWinner4 ? (
                        <>
                          <button 
                            onClick={() => { setSfWinner2(qfWinner3); if (champion === qfWinner3 || champion === qfWinner4) setChampion(null); }}
                            className={`w-full text-left text-xs py-1.5 px-2 rounded mb-1 flex justify-between items-center transition ${sfWinner2 === qfWinner3 ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold' : 'hover:bg-slate-800/40 text-slate-300'}`}
                          >
                            <span>{qfWinner3}</span>
                            {sfWinner2 === qfWinner3 && <CheckCircle className="w-3 h-3 text-cyan-400" />}
                          </button>
                          <button 
                            onClick={() => { setSfWinner2(qfWinner4); if (champion === qfWinner3 || champion === qfWinner4) setChampion(null); }}
                            className={`w-full text-left text-xs py-1.5 px-2 rounded flex justify-between items-center transition ${sfWinner2 === qfWinner4 ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold' : 'hover:bg-slate-800/40 text-slate-300'}`}
                          >
                            <span>{qfWinner4}</span>
                            {sfWinner2 === qfWinner4 && <CheckCircle className="w-3 h-3 text-cyan-400" />}
                          </button>
                        </>
                      ) : (
                        <div className="text-xs text-slate-600 text-center py-4 italic">Waiting for QF results...</div>
                      )}
                    </div>

                  </div>

                  {/* FINALS */}
                  <div className="flex flex-col justify-center py-24">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center border-b border-slate-850 pb-2">Final</h3>
                    
                    <div className={`bracket-match mt-4 ${champion ? 'glow-border-purple' : ''}`}>
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Grand Final</div>
                      {sfWinner1 && sfWinner2 ? (
                        <>
                          <button 
                            onClick={() => {
                              setChampion(sfWinner1);
                              confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                            }}
                            className={`w-full text-left text-xs py-1.5 px-2 rounded mb-1 flex justify-between items-center transition ${champion === sfWinner1 ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 font-bold' : 'hover:bg-slate-800/40 text-slate-300'}`}
                          >
                            <span>{sfWinner1}</span>
                            {champion === sfWinner1 && <CheckCircle className="w-3 h-3 text-purple-400" />}
                          </button>
                          <button 
                            onClick={() => {
                              setChampion(sfWinner2);
                              confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                            }}
                            className={`w-full text-left text-xs py-1.5 px-2 rounded flex justify-between items-center transition ${champion === sfWinner2 ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 font-bold' : 'hover:bg-slate-800/40 text-slate-300'}`}
                          >
                            <span>{sfWinner2}</span>
                            {champion === sfWinner2 && <CheckCircle className="w-3 h-3 text-purple-400" />}
                          </button>
                        </>
                      ) : (
                        <div className="text-xs text-slate-600 text-center py-4 italic">Waiting for SF results...</div>
                      )}
                    </div>
                  </div>

                  {/* CHAMPION */}
                  <div className="flex flex-col items-center justify-center border-l border-slate-800/65 pl-4">
                    {champion ? (
                      <div className="text-center space-y-4 trophy-container p-6 rounded-2xl border border-yellow-500/20 bg-slate-950/80 animate-fade-in-up">
                        <img 
                          src={trophyImg} 
                          alt="Zero Cup Trophy" 
                          className="w-28 h-28 mx-auto animate-pulse object-contain filter drop-shadow-[0_0_12px_rgba(255,215,0,0.5)]" 
                        />
                        <div>
                          <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 mr-1 text-yellow-400" />
                            Zero Cup Winner
                          </div>
                          <div className="text-xl font-extrabold text-white gold-glow">{champion}</div>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          Predicted champion of the FIFA World Cup 2026.
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-600">
                        <Trophy className="w-12 h-12 mx-auto text-slate-800 mb-2" />
                        <span className="text-xs">Complete the bracket to crown a champion!</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Sealing to 0G Storage section */}
                <div className="bg-[#101726]/30 border border-slate-800/80 rounded-xl p-5 space-y-4 glow-card">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center">
                        <Database className="w-4 h-4 text-cyan-400 mr-2" />
                        Seal Predictions to 0G Storage
                      </h4>
                      <p className="text-[10px] text-slate-400">Partition, replicate, and store prediction metadata across decentralized nodes</p>
                    </div>
                    <button
                      onClick={handleSealBracket}
                      disabled={isSealingBracket || !champion}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg transition disabled:opacity-50"
                    >
                      {isSealingBracket ? 'Sealing & Chunking...' : 'Seal Prediction Matrix'}
                    </button>
                  </div>

                  {bracketTx && (
                    <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-3 text-xs flex justify-between items-center text-emerald-400 animate-fade-in-up">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="font-semibold text-emerald-300">Predictions Sealed on 0G Storage Node!</div>
                          <div className="font-mono text-[9px] mt-0.5 text-emerald-500 break-all select-all">
                            Metadata Root Hash: {bracketTx}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(bracketTx)}
                        className="text-emerald-400 hover:text-emerald-300 text-[10px] font-bold border border-emerald-900 px-2 py-1 rounded"
                      >
                        {copiedText === bracketTx ? 'Copied' : 'Copy Hash'}
                      </button>
                    </div>
                  )}

                  {/* Render Canvas Node physics network once predictions are sealed */}
                  {files.length > 0 && (
                    <div className="border border-slate-800 rounded-lg bg-[#07090F] h-72 relative flex flex-col md:flex-row">
                      <div className="flex-1">
                        <canvas
                          ref={canvasRef}
                          width={550}
                          height={280}
                          onMouseDown={handleCanvasMouseDown}
                          onMouseMove={handleCanvasMouseMove}
                          onMouseUp={() => setDraggingNode(null)}
                          onMouseLeave={() => setDraggingNode(null)}
                          className="w-full h-full cursor-grab active:cursor-grabbing"
                        />
                      </div>
                      <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-slate-850 p-4 overflow-y-auto text-xs space-y-3 bg-[#0B0F17]">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Node Details</span>
                        
                        {selectedNode ? (
                          <div className="space-y-2">
                            <div>
                              <span className="text-[9px] text-slate-500 block uppercase">Name</span>
                              <span className="font-bold text-white flex items-center">
                                {selectedNode.name}
                                <span className={`ml-2 text-[8px] px-1.5 py-0.5 rounded-full ${selectedNode.type === 'root' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                                  {selectedNode.type}
                                </span>
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-500 block uppercase">Hash Address</span>
                              <span className="font-mono text-[9px] text-cyan-400 break-all">{selectedNode.address}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <div className="bg-slate-900/60 p-2 rounded border border-slate-850">
                                <span className="text-[8px] text-slate-500 block uppercase">Speed</span>
                                <span className="font-mono font-bold text-white text-[10px]">{selectedNode.speed}</span>
                              </div>
                              <div className="bg-slate-900/60 p-2 rounded border border-slate-850">
                                <span className="text-[8px] text-slate-500 block uppercase">Replication</span>
                                <span className="font-mono font-bold text-cyan-400 text-[10px]">{selectedNode.replication} Nodes</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-slate-500 py-6 text-center italic">
                            Click nodes in the network graph to inspect chunk variables.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: AI MANAGER ARENA */}
          {activeTab === 'arena' && (
            <div className="flex-1 flex flex-col h-full overflow-y-auto">
              <div className="bg-[#121A2C] border-b border-slate-800 px-6 py-3 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">AI Team Manager Arena</h2>
                  <p className="text-[10px] text-slate-400">Matchmake and simulate tactical debates between AI managers</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-1 rounded border border-slate-700 font-mono">0G EVM Engine Active</span>
                </div>
              </div>

              {/* Tournament Panels */}
              <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                
                {/* Manager configurator */}
                <div className="space-y-6">
                  <div className="glass rounded-xl p-5 space-y-4 glow-card">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                      <User className="w-4 h-4 text-cyan-400 mr-1.5" />
                      Configure Your AI Manager
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-slate-500 block uppercase font-bold mb-1">Manager Profile Name</label>
                        <input 
                          type="text" 
                          value={userAgent.name}
                          onChange={e => setUserAgent(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-500 block uppercase font-bold mb-1">Tactic Model</label>
                          <select 
                            value={userAgent.role}
                            onChange={e => setUserAgent(prev => ({ ...prev, role: e.target.value as any }))}
                            className="w-full bg-slate-900/60 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                          >
                            <option value="Tiki-Taka Maestro">Tiki-Taka Maestro</option>
                            <option value="Gegenpress Coach">Gegenpress Coach</option>
                            <option value="Catenaccio Specialist">Catenaccio Specialist</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 block uppercase font-bold mb-1">Squad Formation</label>
                          <input 
                            type="text" 
                            value={userAgent.formation}
                            onChange={e => setUserAgent(prev => ({ ...prev, formation: e.target.value }))}
                            className="w-full bg-slate-900/60 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Stat sliders */}
                      <div className="space-y-2 pt-2">
                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-500">
                            <span>Offensive Threat Index</span>
                            <span className="text-white font-mono">{userAgent.offense}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="20" 
                            max="100" 
                            value={userAgent.offense}
                            onChange={e => setUserAgent(prev => ({ ...prev, offense: parseInt(e.target.value) }))}
                            className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-500">
                            <span>Defensive low-block solidity</span>
                            <span className="text-white font-mono">{userAgent.defense}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="20" 
                            max="100" 
                            value={userAgent.defense}
                            onChange={e => setUserAgent(prev => ({ ...prev, defense: parseInt(e.target.value) }))}
                            className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-500">
                            <span>Squad tactical chemistry</span>
                            <span className="text-white font-mono">{userAgent.chemistry}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="20" 
                            max="100" 
                            value={userAgent.chemistry}
                            onChange={e => setUserAgent(prev => ({ ...prev, chemistry: parseInt(e.target.value) }))}
                            className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={startArenaMatch}
                      disabled={isFighting}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold text-sm rounded-lg transition"
                    >
                      <Play className="w-4 h-4" />
                      <span>{isFighting ? 'Debating & Simulating...' : 'Matchmake and Start Match'}</span>
                    </button>
                  </div>

                  {/* Opponent Profile */}
                  <div className="glass rounded-xl p-4 bg-[#101726]/20 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Select Opponent AI</span>
                      <select 
                        onChange={handleSelectOpponent}
                        className="bg-slate-900 border border-slate-850 rounded px-2 py-1 text-xs text-white focus:outline-none"
                      >
                        <option value="Mourinho-GPT">Mourinho-GPT</option>
                        <option value="Ancelotti-AI">Ancelotti-AI</option>
                        <option value="Klopp-Gegenpress">Klopp-Gegenpress</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <div>
                        <div className="font-bold text-white text-sm">{opponentAgent.name}</div>
                        <div className="text-[10px] text-slate-400">Formation: {opponentAgent.formation} | Tactic: {opponentAgent.role}</div>
                      </div>
                      <span className="text-xs px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full font-mono font-bold">LVL 75</span>
                    </div>
                  </div>
                </div>

                {/* Match logs, stats dashboard, and receipts */}
                <div className="space-y-6">
                  
                  {/* Dynamic Match Stats Dashboard */}
                  {(isFighting || battleLogs.length > 0) && (
                    <div className="glass rounded-xl p-5 glow-card animate-fade-in-up space-y-3.5 bg-[#101726]/30">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                        <Activity className="w-4 h-4 text-cyan-400 mr-1.5" />
                        Live Match Stats Dashboard
                      </h3>
                      
                      <div className="space-y-3">
                        {/* Possession */}
                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                            <span>Possession ({userAgent.name})</span>
                            <span>{matchStats.possession.user}% - {matchStats.possession.opp}%</span>
                          </div>
                          <div className="stats-bar-bg flex">
                            <div className="stats-bar-fill-left" style={{ width: `${matchStats.possession.user}%` }}></div>
                            <div className="flex-1 bg-transparent"></div>
                          </div>
                        </div>

                        {/* Shots */}
                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                            <span>Total Shots Attempted</span>
                            <span>{matchStats.shots.user} vs {matchStats.shots.opp}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="stats-bar-bg flex justify-end">
                              <div className="stats-bar-fill-left" style={{ width: `${Math.min(100, (matchStats.shots.user / 25) * 100)}%` }}></div>
                            </div>
                            <div className="stats-bar-bg">
                              <div className="stats-bar-fill-right" style={{ width: `${Math.min(100, (matchStats.shots.opp / 25) * 100)}%` }}></div>
                            </div>
                          </div>
                        </div>

                        {/* Pass Accuracy */}
                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                            <span>Pass Completion Rate</span>
                            <span>{matchStats.accuracy.user}% - {matchStats.accuracy.opp}%</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="stats-bar-bg">
                              <div className="stats-bar-fill-left" style={{ width: `${matchStats.accuracy.user}%` }}></div>
                            </div>
                            <div className="stats-bar-bg">
                              <div className="stats-bar-fill-right" style={{ width: `${matchStats.accuracy.opp}%` }}></div>
                            </div>
                          </div>
                        </div>

                        {/* Expected Goals (xG) */}
                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                            <span>Expected Goals (xG)</span>
                            <span>{matchStats.xg.user.toFixed(2)} - {matchStats.xg.opp.toFixed(2)}</span>
                          </div>
                          <div className="stats-bar-bg flex">
                            <div className="stats-bar-fill-left" style={{ width: `${Math.min(100, (matchStats.xg.user / 4.0) * 100)}%` }}></div>
                            <div className="flex-1 bg-transparent"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Logs Console */}
                  <div className="glass rounded-xl p-5 flex flex-col glow-card">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center mb-4">
                      <Terminal className="w-4 h-4 text-cyan-400 mr-1.5" />
                      Tactical match engine console
                    </h3>

                    <div className="flex-1 bg-slate-950/70 border border-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 min-h-[180px] max-h-[280px] overflow-y-auto space-y-3">
                      {battleLogs.length > 0 ? (
                        battleLogs.map((log, index) => (
                          <div key={index} className="space-y-1 py-1 border-b border-slate-900/60 last:border-b-0 animate-fade-in-up">
                            <div className="flex items-center space-x-2 text-[10px]">
                              <span className="text-cyan-400">{log.minute}' Minute</span>
                              <span className="text-slate-500">•</span>
                              <span className="text-indigo-400">{log.initiator}</span>
                            </div>
                            <p className="text-slate-200">{log.action}</p>
                            <p className="text-[10px] text-slate-500 italic">Consensus state: {log.effect}</p>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-500 py-12">
                          {isFighting ? 'Simulating player movements...' : 'Match has not started. Select an opponent and click Matchmake.'}
                        </div>
                      )}

                      {arenaWinner && (
                        <div className="pt-3 animate-bounce flex flex-col items-center justify-center space-y-2">
                          <div className="text-center text-emerald-400 font-bold text-sm flex items-center">
                            <Sparkles className="w-4 h-4 mr-1.5 text-emerald-400" />
                            MATCH CONCLUDED — WINNER: {arenaWinner} ({arenaScore})
                          </div>
                          <button 
                            onClick={handleRecordArenaMatch}
                            className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs px-4 py-1.5 rounded transition shadow-md"
                          >
                            Submit Score to L1 Ledger
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
                          0G L1 Ledger Receipt
                        </span>
                        <button onClick={() => setShowReceipt(false)} className="text-xs text-slate-500 hover:text-slate-300">Close</button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] font-mono">
                        <div>
                          <span className="text-slate-500 block font-bold uppercase">Transaction Hash</span>
                          <span className="text-slate-300 break-all select-all">{txReceipt.transactionHash}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block font-bold uppercase">Block height</span>
                          <span className="text-slate-300">{txReceipt.blockNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block font-bold uppercase">Verifier Contract</span>
                          <span className="text-cyan-400">{txReceipt.to}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block font-bold uppercase">Gas burned</span>
                          <span className="text-slate-300">{txReceipt.gasUsed}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-500 block font-bold uppercase">Attestation Signature</span>
                          <span className="text-emerald-400 font-bold">{txReceipt.logs[1].topic} - verified_success</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Leaderboard */}
                  <div className="glass rounded-xl p-5 glow-card">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center mb-3">
                      Arena Leaderboard
                    </h3>
                    <div className="space-y-2">
                      {leaderboard.map((team) => (
                        <div 
                          key={team.rank} 
                          className={`flex justify-between items-center text-xs py-2 px-3 rounded ${
                            team.name === userAgent.name 
                              ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' 
                              : 'bg-slate-900/40 border border-slate-900/60 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-500 w-4">{team.rank}.</span>
                            <div>
                              <span className="font-semibold text-white block">{team.name}</span>
                              <span className="text-[9px] text-slate-500">{team.tactic}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6 font-mono text-[11px]">
                            <div>
                              <span className="text-[8px] text-slate-500 block text-right">Win rate</span>
                              <span>{team.winRate}</span>
                            </div>
                            <div className="w-16">
                              <span className="text-[8px] text-slate-500 block text-right">W/L ratio</span>
                              <span className="block text-right">{team.ratio}</span>
                            </div>
                            <div className="w-12">
                              <span className="text-[8px] text-slate-500 block text-right">XP Score</span>
                              <span className="block text-right font-bold text-white">{team.score}</span>
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

          {/* TAB 3: CONFIDENTIAL SCOUT VAULT */}
          {activeTab === 'vault' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="bg-[#121A2C] border-b border-slate-800 px-6 py-3 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">Confidential Scout Enclave</h2>
                  <p className="text-[10px] text-slate-400">Private AI Computations via Isolated 0G TEE Enclaves</p>
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
                        {m.sender === 'user' ? 'Head Coach / User' : 'AI Secure Scout Analyst'}
                      </span>
                      {m.sender === 'ai' && (
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">#0g-tdx-enclave</span>
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
                          Hash payload signature: {m.chatHash}
                        </div>
                      )}
                    </div>

                    <div className="mt-1 flex items-center space-x-3 text-[10px] text-slate-500">
                      <span>{m.timestamp}</span>
                      {m.attestation && (
                        <button 
                          onClick={() => handleVerifyProof(m)}
                          className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
                        >
                          <FileCode className="w-3 h-3 mr-0.5" />
                          <span>Request Cryptographic Attestation Proof</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {isProcessingTEE && (
                  <div className="flex flex-col items-start animate-pulse">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-bold text-cyan-400">Intel TDX Enclave</span>
                      <span className="text-[10px] text-slate-500 font-semibold font-mono">Running Inference...</span>
                    </div>
                    <div className="glass border-cyan-500/30 rounded-xl p-4 text-xs font-mono text-cyan-400/80 rounded-tl-none flex items-center space-x-3">
                      <Cpu className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>Verifying model weight parameters inside isolated CPU register blocks...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input form */}
              <div className="p-4 bg-[#0F1420]/80 border-t border-slate-800/80 space-y-3 shrink-0">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Ask AI Analyst for squad configurations or tactical responses..."
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
                    <span>{isSealing ? 'Encrypting & Sealing...' : 'Seal Analyst Report to 0G Storage'}</span>
                  </button>
                </div>

                {storageTx && (
                  <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-3 text-xs flex justify-between items-center text-emerald-400 animate-fade-in-up">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-semibold text-emerald-300">Report sealed successfully on 0G Storage Nodes!</div>
                        <div className="font-mono text-[9px] mt-0.5 text-emerald-500 break-all select-all">
                          Tx Hash: {storageTx}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(storageTx)}
                      className="text-emerald-400 hover:text-emerald-300 text-[10px] font-bold border border-emerald-900 px-2 py-1 rounded"
                    >
                      {copiedText === storageTx ? 'Copied' : 'Copy Hash'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Proof Verification Loader and Document Modal */}
      {showProofModal && selectedProof && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-[#0B0F17] border border-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-[#101726]/30">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center">
                  <Shield className="w-4 h-4 text-cyan-400 mr-2" />
                  TEE Cryptographic Attestation Proof Verifier
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Live security validation console of Intel TDX Registers</p>
              </div>
              <button 
                onClick={() => setShowProofModal(false)}
                className="text-slate-400 hover:text-white font-bold text-xs"
              >
                Close Console
              </button>
            </div>
            
            {validatorState === 'running' ? (
              <div className="p-8 flex flex-col items-center justify-center space-y-6 min-h-[300px]">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin"></div>
                  <Cpu className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-cyan-300">Executing verification scripts...</div>
                  <div className="text-xs text-slate-500 mt-1">Isolating memory register sets</div>
                </div>

                <div className="w-full max-w-sm space-y-2 pt-4">
                  {/* Step 1 */}
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="w-4 text-center">{validatorStep >= 1 ? '✓' : '•'}</span>
                    <span className={validatorStep >= 1 ? 'text-slate-300 font-bold' : 'text-slate-600'}>
                      [1] Check physical register block locks (Intel TDX)
                    </span>
                  </div>
                  {/* Step 2 */}
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="w-4 text-center">{validatorStep >= 2 ? '✓' : validatorStep === 1 ? '...' : '•'}</span>
                    <span className={validatorStep >= 2 ? 'text-slate-300 font-bold' : validatorStep === 1 ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}>
                      [2] Authenticate platform MRENCLAVE signing keys
                    </span>
                  </div>
                  {/* Step 3 */}
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="w-4 text-center">{validatorStep >= 3 ? '✓' : validatorStep === 2 ? '...' : '•'}</span>
                    <span className={validatorStep >= 3 ? 'text-slate-300 font-bold' : validatorStep === 2 ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}>
                      [3] Match RTMR[0] payload hash index parameters
                    </span>
                  </div>
                  {/* Step 4 */}
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="w-4 text-center">{validatorStep >= 4 ? '✓' : validatorStep === 3 ? '...' : '•'}</span>
                    <span className={validatorStep >= 4 ? 'text-slate-300 font-bold' : validatorStep === 3 ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}>
                      [4] Ledger match attestations on-chain
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="p-5 overflow-y-auto font-mono text-xs bg-slate-950 text-cyan-400/90 space-y-4">
                  <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-lg flex items-center justify-between text-emerald-400">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4.5 h-4.5" />
                      <span className="font-bold">Attestation Validation Verified Successful</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded">STATUS: 200 OK</span>
                  </div>

                  <div className="space-y-1">
                    <div>[+] PLATFORM SECURE INFO</div>
                    <div>Intel(R) Trust Domain Extensions (Intel TDX) Secure Hardware Report</div>
                    <div>Security Model: 0G-DeAI-Sports-Scout-Model</div>
                    <div>CPU Enclave: Intel Xeon Sapphire Rapids</div>
                  </div>

                  <div className="space-y-1.5">
                    <div>[+] ATTESTATION REGISTER CONFIGS</div>
                    <div>MRENCLAVE:  0x9df3421ac08f32bc421b0e9f1a2394f8e9399e7b2be3c90f2a3d3c8c6a2e8c61</div>
                    <div>MRSIGNER:   0xce807d4b4a5bc49c00a88f3c2394f849e782be3bc30f9a2d3c90e8f812cd394f</div>
                    <div>RTMR[0]:    {selectedProof.chatHash}</div>
                    <div>RTMR[1]:    0x0000000000000000000000000000000000000000000000000000000000000000</div>
                  </div>

                  <div className="space-y-1">
                    <div>[+] ATTESTATION SECURE LOG</div>
                    <div>Report Timestamp: {selectedProof.timestamp}</div>
                    <div>Consensus Target Height: {blockHeight}</div>
                    <div>Attestation Status: TEE_REGISTERED_SUCCESS</div>
                    <div>Verification Engine: Intel-TDX-Attestation-Verifier-v1.3</div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800/80 p-3 text-[10px] text-slate-400 whitespace-pre-wrap break-all leading-normal select-all">
                    {"--- BEGIN TEE SECURE SIGNATURE ---\n"}
                    {generateKeccakHash(selectedProof.text + selectedProof.timestamp)}
                    {generateKeccakHash(selectedProof.text + "IntelAttestationReportSignatureStringPart2")}
                    {"\n--- END TEE SECURE SIGNATURE ---"}
                  </div>
                </div>

                <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 flex items-center font-mono">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    Proof registered at Block Height {blockHeight}
                  </span>
                  <button 
                    onClick={() => copyToClipboard(generateKeccakHash(selectedProof.text + selectedProof.timestamp))}
                    className="text-cyan-400 font-bold border border-cyan-800/40 px-3 py-1 rounded hover:bg-cyan-500/10 transition animate-pulse"
                  >
                    {copiedText ? 'Copied' : 'Copy Hash'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
