import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  ReferenceArea,
  LineChart,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  LayoutDashboard,
  Zap,
  Search,
  Bell,
  User,
  Settings,
  PieChart,
  Activity,
  Cpu,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Wallet,
  Compass,
  Menu,
  X,
  Plus,
  Crosshair,
  Pencil,
  Eye,
  Trash2,
  Maximize2,
  Lock,
  FileText,
  UserCheck,
  Star,
  Target,
  ShieldAlert,
  ArrowRightLeft,
  LayoutGrid,
  MessagesSquare,
  Sparkles,
  RefreshCcw,
  Play,
  Bot,
  Filter,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  SlidersHorizontal,
  Check,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { TOP_STOCKS, SECTORS, NEWS_FEED, NIFTY_500_STOCKS, Nifty500Stock } from './constants';
import { MarketData, NewsItem } from './types';

const MarketIntel = React.memo(() => {
  const [news, setNews] = useState<NewsItem[]>(NEWS_FEED);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchIntel = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const now = new Date();
      const currentTimestamp = now.toISOString();

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Today's date and time is ${currentTimestamp}. 
        Perform a Google search to find the 5 most critical news headlines for the Indian stock market (NSE/BSE) specifically targeting events that happened since yesterday. 
        Focus on real-time earnings, RBI updates, or major corporate developments. 
        Provide the output in JSON format matching the schema.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                source: { type: Type.STRING },
                time: { type: Type.STRING },
                sentiment: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] },
                impact: { type: Type.STRING, enum: ['high', 'medium', 'low'] }
              },
              required: ['id', 'title', 'source', 'time', 'sentiment', 'impact']
            }
          }
        }
      });

      if (aiResponse.text) {
        const data = JSON.parse(aiResponse.text);
        if (Array.isArray(data)) {
          setNews(data);
          setLastUpdated(now.toLocaleTimeString('en-US', { hour12: false }));
        }
      }
    } catch (error) {
      console.error("Vortex Intel Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntel();
    const intelInterval = setInterval(fetchIntel, 300000); // Refresh every 5 minutes
    return () => clearInterval(intelInterval);
  }, []);

  return (
    <div className="mb-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="label-mono tracking-[0.2em] text-accent block">Market Intel</span>
          {lastUpdated && (
            <span className="text-[7px] font-mono text-muted uppercase mt-1 block">LAST_SYNC: {lastUpdated} UTC</span>
          )}
        </div>
        <button
          onClick={fetchIntel}
          disabled={isLoading}
          className="flex items-center gap-2 label-mono text-[9px] text-muted hover:text-accent transition-colors group px-2 py-1 border border-line hover:border-accent/40 bg-bg/20"
        >
          <RefreshCcw size={10} className={`${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          {isLoading ? 'SYNCING...' : 'REFRESH_INTEL'}
        </button>
      </div>

      <div className="space-y-6 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 z-10 flex flex-col items-center justify-center border border-accent/20">
            <div className="label-mono text-[8px] animate-pulse text-accent mb-2">ACCESSING_GLOBAL_SATELLITE_FEED</div>
            <div className="w-24 h-[1px] bg-line relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-accent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              />
            </div>
          </div>
        )}

        {news.slice(0, 5).map((item) => (
          <div key={item.id} className="border-b border-line pb-6 last:border-0 relative pl-5">
            <div className={`absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full ${item.sentiment === 'positive' ? 'bg-green-500' :
                item.sentiment === 'negative' ? 'bg-red-500' : 'bg-blue-400'
              }`} />
            <div className="label-mono mb-1 text-muted text-[9px]">{item.time} • {item.source.toUpperCase()}</div>
            <h4 className="text-sm font-medium leading-snug italic">{item.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
});

const VortexDashboard = ({ onBackToLanding }: { onBackToLanding: () => void }) => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedStock, setExpandedStock] = useState<Nifty500Stock | null>(null);
  const [sentimentScore, setSentimentScore] = useState(78);
  const [fiiIndex, setFiiIndex] = useState(62);
  const [socialBuzz, setSocialBuzz] = useState(91);

  // Real-time market state
  const [marketData, setMarketData] = useState({
    nifty: 23450.25,
    sensex: 76825.10,
    bank: 51200.40
  });

  const [marketTrends, setMarketTrends] = useState({
    nifty: true,
    sensex: false,
    bank: true
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Simulating live market ticks
    const marketTicker = setInterval(() => {
      setMarketData(prev => ({
        nifty: prev.nifty + (Math.random() - 0.5) * 5,
        sensex: prev.sensex + (Math.random() - 0.5) * 10,
        bank: prev.bank + (Math.random() - 0.5) * 8
      }));

      const newNiftyTrend = Math.random() > 0.4;
      const newSensexTrend = Math.random() > 0.5;
      const newBankTrend = Math.random() > 0.3;

      setMarketTrends({
        nifty: newNiftyTrend,
        sensex: newSensexTrend,
        bank: newBankTrend
      });

      // Update sentiment based on trends
      setSentimentScore(prev => {
        const trendFactor = (newNiftyTrend ? 1 : -1) + (newSensexTrend ? 1 : -1) + (newBankTrend ? 1 : -1);
        const change = (Math.random() * 2 * trendFactor);
        return Math.min(100, Math.max(0, Math.round(prev + change)));
      });

      setFiiIndex(prev => Math.min(100, Math.max(0, Math.round(prev + (Math.random() - 0.5) * 4))));
      setSocialBuzz(prev => Math.min(100, Math.max(0, Math.round(prev + (Math.random() - 0.5) * 2))));

    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(marketTicker);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onExpandStock={setExpandedStock} sentimentScore={sentimentScore} fiiIndex={fiiIndex} socialBuzz={socialBuzz} />;
      case 'research':
        return <ResearchView onExpandStock={setExpandedStock} />;
      case 'trading':
        return <TradingView onExpandStock={setExpandedStock} />;
      case 'portfolio':
        return <PortfolioView onExpandStock={setExpandedStock} />;
      case 'analytics':
        return <AnalyticsView />;
      case 'ai':
        return <PlaceholderView title="Vortex Copilot" icon={<Cpu size={48} />} subtitle="Synthesizing market patterns..." />;
      case 'settings':
        return <PlaceholderView title="System Configuration" icon={<Settings size={48} />} />;
      default:
        return <DashboardView onExpandStock={setExpandedStock} sentimentScore={sentimentScore} fiiIndex={fiiIndex} socialBuzz={socialBuzz} />;
    }
  };

  const renderAside = () => {
    if (activeTab === 'research') return <ResearchAside onExpandStock={setExpandedStock} />;
    if (activeTab === 'trading') return <TradingAside />;
    if (activeTab === 'analytics') return <AnalyticsAside />;

    return (
      <>
        <MarketIntel />

        <div>
          <span className="label-mono block mb-6 tracking-[0.2em]">Asset Configuration</span>
          <div className="space-y-4">
            <DataRow label="PRIMARY UPLINK" value="ACTIVE" />
            <DataRow label="RISK THRESHOLD" value="MEDIUM" />
            <DataRow label="ENC_KEY" value="AES_256" />
            <DataRow label="LAST_AUDIT" value="14:02 UTC" />
          </div>
        </div>

        <div className="relative mt-20 h-24 w-24 border border-line mx-auto">
          <div className="absolute inset-0 border border-line rotate-45" />
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-muted text-center p-2">
            VORTEX PROSTABILITY_CORE
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {expandedStock && (
          <ExpandedChart stock={expandedStock} onClose={() => setExpandedStock(null)} />
        )}
      </AnimatePresence>

      <div className={`grid grid-cols-[80px_1fr_320px] grid-rows-[80px_1fr] h-full bg-bg text-ink overflow-hidden border-[1px] border-line transition-all duration-700 ${expandedStock ? 'blur-xl grayscale-[0.5]' : ''}`}>
        {/* Sidebar */}
        <nav className="row-span-2 border-r border-ink flex flex-col pt-8 bg-white overflow-y-visible relative z-20">
          <div className="flex flex-col items-center mb-12">
            <div
              onClick={onBackToLanding}
              className="w-10 h-10 bg-ink flex items-center justify-center rounded-[2px] mb-4 hover:bg-accent transition-colors cursor-pointer group relative"
            >
              <Zap className="w-6 h-6 text-white fill-white" />
              <div className="absolute left-[55px] bg-accent text-white text-[9px] font-black py-2 px-4 tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 z-50 whitespace-nowrap border border-white/10 shadow-2xl">
                RETURN_TO_UPLINK
              </div>
            </div>
            <div className="w-8 h-[1px] bg-line" />
          </div>

          <div className="flex flex-col gap-1">
            <SidebarLink icon={<LayoutDashboard size={20} />} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} title="Dashboard" />
            <SidebarLink icon={<Compass size={20} />} active={activeTab === 'research'} onClick={() => setActiveTab('research')} title="Market Data" />
            <SidebarLink icon={<BarChart3 size={20} />} active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} title="ML Predictions" />
            <SidebarLink icon={<PieChart size={20} />} active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} title="Portfolio" />
            <SidebarLink icon={<Activity size={20} />} active={activeTab === 'trading'} onClick={() => setActiveTab('trading')} title="Live Trading" />
          </div>

          <div className="mt-auto pb-10 flex flex-col items-center gap-6">
            <div className="relative group cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div className="absolute left-[30px] top-1/2 -translate-y-1/2 bg-ink text-white text-[8px] font-mono py-1 px-3 tracking-widest uppercase opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 whitespace-nowrap border border-white/10">
                CORE_ONLINE
              </div>
            </div>
            <div className="relative group cursor-pointer grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
              <FileText size={18} className="text-muted" />
              <div className="absolute left-[40px] top-1/2 -translate-y-1/2 bg-ink text-white text-[8px] font-mono py-1 px-3 tracking-widest uppercase opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 whitespace-nowrap border border-white/10">
                VIEW_DOCS
              </div>
            </div>
          </div>
        </nav>

        {/* Header */}
        <header className="col-span-2 border-b border-ink flex items-center justify-between px-10 bg-white">
          <div className="flex items-baseline gap-4">
            <h1 className="text-2xl font-medium tracking-tight uppercase">System Dashboard</h1>
            <span className="font-mono text-[10px] text-muted tracking-widest uppercase">VPRO_QUANT_v1.0</span>
          </div>

          <div className="flex items-center gap-10">
            <div className="flex items-center gap-6 overflow-hidden max-w-lg no-scrollbar">
              <MarketTicker label="NIF50" value={marketData.nifty.toFixed(2)} isUp={marketTrends.nifty} />
              <MarketTicker label="SENSEX" value={marketData.sensex.toFixed(2)} isUp={marketTrends.sensex} />
              <MarketTicker label="BANK" value={marketData.bank.toFixed(2)} isUp={marketTrends.bank} />
            </div>
            <div className="font-mono text-xs tracking-widest text-muted border-l border-line pl-10 h-8 flex items-center">
              SYNC: OK — {formatTime(currentTime)}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-10 overflow-y-auto no-scrollbar bg-white relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Detail Panel */}
        <aside className="border-l border-ink bg-[#F1F1EF] p-10 overflow-y-auto no-scrollbar">
          {renderAside()}
        </aside>
      </div>
      <VortexAICopilot />
    </div>
  );
};

// Subcomponents
const DashboardView = ({
  onExpandStock,
  sentimentScore,
  fiiIndex,
  socialBuzz
}: {
  onExpandStock: (s: Nifty500Stock) => void,
  sentimentScore: number,
  fiiIndex: number,
  socialBuzz: number
}) => {
  const getSentimentLabel = (score: number) => {
    if (score <= 40) return "EXTREME BEARISH";
    if (score <= 60) return "NEUTRAL (SLIGHT BEARISH)";
    if (score <= 80) return "NEUTRAL (SLIGHT BULLISH)";
    return "EXTREME BULLISH";
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-10 h-full max-h-[1200px]">
      {/* Active Movers */}
      <section className="geometric-card flex flex-col justify-between">
        <div className="flex justify-between items-start mb-6">
          <span className="label-mono">Active Analysis</span>
          <div className="w-3 h-3 bg-accent animate-pulse" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {TOP_STOCKS.slice(0, 4).map((stock) => {
            const niftyStock = NIFTY_500_STOCKS.find(s => s.symbol === stock.symbol)!;
            return (
              <div
                key={stock.symbol}
                onClick={() => onExpandStock(niftyStock)}
                className="p-2 -mx-2 hover:bg-bg transition-colors border-b border-line last:border-0 border-transparent hover:border-line cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-[10px] font-bold">{stock.symbol}</span>
                  <span className={`font-mono text-[10px] ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.changePercent}%
                  </span>
                </div>
                <div className="text-xl font-light tracking-tighter">₹{stock.price.toLocaleString()}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto pt-6 border-t border-line flex justify-between items-center">
          <span className="label-mono">Live Stream</span>
          <span className="text-[10px] font-bold text-accent tracking-[0.2em] font-mono">CONTINUOUS</span>
        </div>
      </section>

      {/* AI Sentiment */}
      <section className="geometric-card flex flex-col justify-between bg-bg/30">
        <div className="flex justify-between items-start">
          <span className="label-mono">Cognitive Sentiment</span>
          <div className="w-3 h-3 border border-ink" />
        </div>

        <div className="py-8 flex flex-col items-center">
          <div className="text-[64px] font-light tracking-tighter leading-none">{sentimentScore}<span className="text-xl align-top pt-2">/100</span></div>
          <div className="label-mono mt-4 text-accent font-black tracking-[0.2em]">{getSentimentLabel(sentimentScore)}</div>
        </div>

        <div className="space-y-4 border-t border-line pt-6">
          <SentimentFactor label="FII INDEX" value={fiiIndex} />
          <SentimentFactor label="SOCIAL Buzz" value={socialBuzz} />
        </div>
      </section>

      {/* Quick Trade */}
      <section className="geometric-card flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="label-mono">Instant Execution</span>
          <div className="w-3 h-3 bg-ink" />
        </div>

        <div className="space-y-6">
          <div>
            <label className="label-mono block mb-2">TARGET ASSET</label>
            <div className="border border-line p-3 font-mono text-xs">RELIANCE_NSE</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-mono block mb-2">LOTS</label>
              <div className="border border-line p-3 font-mono text-xs">100</div>
            </div>
            <div>
              <label className="label-mono block mb-2">LEVERAGE</label>
              <div className="border border-line p-3 font-mono text-xs">5.0x</div>
            </div>
          </div>
        </div>

        <button className="btn-geometric w-full mt-6">INITIATE TRANSACTION</button>
      </section>

      {/* Portfolio Pulse */}
      <section className="geometric-card flex flex-col justify-between border-ink">
        <div className="flex justify-between items-start">
          <span className="label-mono">Algorithm Health</span>
          <div className="w-3 h-3 border border-accent bg-accent/10" />
        </div>

        <div className="space-y-4 my-6">
          <div className="flex justify-between items-center py-2 border-b border-line">
            <span className="text-sm">Mean Reversion</span>
            <span className="font-mono text-xs text-green-600">+12%</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-line">
            <span className="text-sm">Sentiment Scalp</span>
            <span className="font-mono text-xs text-green-600">+4.2%</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm">Vol-Breakout</span>
            <span className="font-mono text-xs text-red-600">-2.1%</span>
          </div>
        </div>

        <div className="text-[10px] text-muted font-mono leading-relaxed">
          System clusters operating within expected parameters. No manual intervention required.
        </div>
      </section>
    </div>
  );
};

const PlaceholderView = ({ title, icon, subtitle }: { title: string; icon: React.ReactNode; subtitle?: string }) => (
  <div className="h-full border border-line flex flex-col items-center justify-center bg-bg/20 p-20 text-center">
    <div className="mb-6 text-ink opacity-20">{icon}</div>
    <h2 className="text-2xl font-light tracking-widest uppercase mb-4">{title}</h2>
    <p className="label-mono text-muted max-w-sm mx-auto leading-loose">
      {subtitle || "This quantitative module is being calibrated for real-time asset processing. Estimated synchronization 14:02 UTC."}
    </p>
    <div className="mt-12 w-48 h-[1px] bg-line relative overflow-hidden">
      <motion.div
        animate={{ x: ['-100%', '100%'] }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="absolute inset-0 bg-accent w-1/2"
      />
    </div>
  </div>
);

const SidebarLink = ({ icon, title, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center w-full py-5 transition-all relative group ${active ? 'bg-accent/5 text-ink' : 'text-muted hover:text-ink hover:bg-bg/50'}`}
  >
    <div className={`transition-transform duration-300 ${active ? 'text-accent' : 'opacity-40 group-hover:opacity-100 group-hover:scale-110'}`}>{icon}</div>

    {/* Tooltip */}
    <div className="absolute left-[65px] bg-ink text-white text-[9px] font-mono py-2 px-4 tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 z-50 whitespace-nowrap border border-white/10 shadow-2xl skew-x-[-5deg]">
      {title}
    </div>

    {active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-accent" />
    )}
  </button>
);

const MarketTicker = ({ label, value, isUp }: { label: string; value: string; isUp: boolean }) => (
  <motion.div
    key={value}
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    className="flex items-center gap-2 whitespace-nowrap"
  >
    <span className="font-mono text-[10px] text-muted">{label}</span>
    <span className="font-medium text-sm">₹{value}</span>
    <motion.span
      animate={{ scale: [1, 1.2, 1], color: isUp ? "#16a34a" : "#dc2626" }}
      className={`font-mono text-[9px] ${isUp ? 'text-green-600' : 'text-red-600'}`}
    >
      {isUp ? '▲' : '▼'}
    </motion.span>
  </motion.div>
);

const DataRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-3 border-b border-line last:border-0 font-mono">
    <span className="text-[11px] text-muted">{label}</span>
    <span className="text-[11px] font-bold">{value}</span>
  </div>
);

const SentimentFactor = ({ label, value }: { label: string; value: number }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
      <span className="text-muted">{label}</span>
      <span className="text-accent">{value}%</span>
    </div>
    <div className="h-[2px] bg-line overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full bg-accent"
      />
    </div>
  </div>
);

const TradingView = ({ onExpandStock }: { onExpandStock: (s: Nifty500Stock) => void }) => (
  <div className="grid grid-cols-12 gap-10 h-full">
    {/* Order Book */}
    <div className="col-span-8 space-y-10">
      <section className="geometric-card min-h-[400px]">
        <div className="flex justify-between items-start mb-8">
          <span className="label-mono">Live Depth Terminal</span>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="label-mono text-[9px]">BID_X</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="label-mono text-[9px]">ASK_X</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-1">
            <OrderEntry price="24,350.25" vol="1.2k" type="bid" />
            <OrderEntry price="24,349.80" vol="0.8k" type="bid" opacity={0.8} />
            <OrderEntry price="24,348.10" vol="2.4k" type="bid" opacity={0.6} />
            <OrderEntry price="24,347.50" vol="1.1k" type="bid" opacity={0.4} />
          </div>
          <div className="space-y-1">
            <OrderEntry price="24,351.40" vol="0.5k" type="ask" />
            <OrderEntry price="24,352.15" vol="1.4k" type="ask" opacity={0.8} />
            <OrderEntry price="24,353.90" vol="0.9k" type="ask" opacity={0.6} />
            <OrderEntry price="24,354.20" vol="3.2k" type="ask" opacity={0.4} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-10">
        <section className="geometric-card">
          <span className="label-mono block mb-4">Position Summary</span>
          <div className="space-y-4">
            <PositionRow symbol="RELIANCE" side="BUY" qty={100} pnl={12400} />
            <PositionRow symbol="TCS" side="SELL" qty={50} pnl={-2100} />
          </div>
        </section>
        <section className="geometric-card">
          <span className="label-mono block mb-4">Risk Exposure</span>
          <div className="flex items-center justify-center p-4">
            <div className="w-32 h-32 rounded-full border-4 border-accent border-r-transparent animate-spin-slow flex items-center justify-center relative">
              <div className="absolute inset-2 rounded-full border-2 border-line/30" />
              <span className="label-mono text-accent">V_RISK</span>
            </div>
          </div>
        </section>
      </div>
    </div>

    {/* Controls */}
    <div className="col-span-4 space-y-6">
      <div className="geometric-card bg-ink text-white">
        <span className="label-mono mb-6 block text-white/50 tracking-widest">ORDER_ENTRY</span>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-mono mb-2 block text-white/40">ASSET_ID</label>
            <div className="bg-bg/10 border border-white/10 p-3 font-mono text-sm">SELECT...</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="py-4 border border-green-500 text-green-500 font-bold hover:bg-green-500 hover:text-white transition-all">BUY</button>
            <button className="py-4 border border-red-500 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all">SELL</button>
          </div>
        </div>
      </div>

      <div className="geometric-card">
        <span className="label-mono mb-4 block">System Messages</span>
        <div className="text-[11px] font-mono space-y-3 opacity-70">
          <div className="flex gap-2">
            <span className="text-accent">[SEC]</span> Checksum verified.
          </div>
          <div className="flex gap-2">
            <span className="text-accent">[ORD]</span> Limit hit @ HDFC.
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CandlestickChart = ({ data, color }: { data: any[]; color: string }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        barGap={-1.5}
      >
        <XAxis dataKey="time" hide />
        <YAxis domain={['auto', 'auto']} hide />
        <RechartsTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload[0].payload;
              return (
                <div className="bg-ink p-2 text-[9px] font-mono text-white border border-white/10 shadow-lg">
                  <div className="text-accent mb-1 font-black">OHLC</div>
                  <div>O: {d.open.toFixed(2)}</div>
                  <div>H: {d.high.toFixed(2)}</div>
                  <div>L: {d.low.toFixed(2)}</div>
                  <div>C: {d.close.toFixed(2)}</div>
                </div>
              );
            }
            return null;
          }}
        />
        {/* Wick */}
        <Bar
          dataKey="wickData"
          fill="#8E8E8E"
          shape={(props: any) => {
            const { x, y, width, height } = props;
            const wickWidth = 1;
            const centerX = x + width / 2;

            return (
              <line
                x1={centerX}
                y1={y}
                x2={centerX}
                y2={y + height}
                stroke="#8E8E8E"
                strokeWidth={wickWidth}
              />
            );
          }}
        />
        {/* Body */}
        <Bar
          dataKey="bodyData"
          shape={(props: any) => {
            const { x, y, width, height, payload } = props;
            const isUp = payload.close >= payload.open;
            const barWidth = width * 0.8;
            const barX = x + (width - barWidth) / 2;
            return (
              <rect
                x={barX}
                y={y}
                width={barWidth}
                height={Math.max(1, height)}
                fill={isUp ? '#16a34a' : '#dc2626'}
                stroke={isUp ? '#16a34a' : '#dc2626'}
              />
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const TradingAside = () => {
  const [indexFilter, setIndexFilter] = useState(50);
  const [expandedStock, setExpandedStock] = useState<string | null>(null);
  const [stocks, setStocks] = useState<Nifty500Stock[]>(NIFTY_500_STOCKS);
  const [candleHistory, setCandleHistory] = useState<Record<string, any[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Nifty500Stock; order: 'asc' | 'desc' }>({ key: 'symbol', order: 'asc' });
  const [signalFilter, setSignalFilter] = useState<'ALL' | 'BUY' | 'SELL' | 'NEUTRAL'>('ALL');

  // Lazy Loading metrics state
  const [loadingMetrics, setLoadingMetrics] = useState<Record<string, boolean>>({});
  const [loadedMetrics, setLoadedMetrics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (expandedStock && !loadedMetrics[expandedStock]) {
      setLoadingMetrics(prev => ({ ...prev, [expandedStock]: true }));
      const timer = setTimeout(() => {
        setLoadingMetrics(prev => ({ ...prev, [expandedStock]: false }));
        setLoadedMetrics(prev => ({ ...prev, [expandedStock]: true }));
      }, 1200); // Realistic simulated async delay
      return () => clearTimeout(timer);
    }
  }, [expandedStock, loadedMetrics]);

  // Generate initial candle history for all stocks
  useEffect(() => {
    const history: Record<string, any[]> = {};
    NIFTY_500_STOCKS.forEach(s => {
      let lastClose = s.price;
      history[s.symbol] = Array.from({ length: 20 }, (_, i) => {
        const open = lastClose + (Math.random() - 0.5) * 4;
        const close = open + (Math.random() - 0.5) * 6;
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;
        lastClose = close;
        return {
          time: i,
          open,
          close,
          high,
          low,
          bodyData: [Math.min(open, close), Math.max(open, close)], // For BarChart range representation
          // Actually, BarChart with dataKey="bodyData" where bodyData is [start, end] works for candles
          wickData: [low, high]
        };
      });
    });
    setCandleHistory(history);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const newPrice = stock.price + (Math.random() - 0.5) * 4;

        // Update candle history for the expanded stock in real-time
        if (expandedStock === stock.symbol) {
          setCandleHistory(prevH => {
            const history = [...(prevH[stock.symbol] || [])];
            const lastCandle = history[history.length - 1];

            // Update the last candle or add a new one?
            // For "real-time" feel, we update the current candle's close/high/low
            if (lastCandle) {
              const updatedCandle = {
                ...lastCandle,
                close: newPrice,
                high: Math.max(lastCandle.high, newPrice),
                low: Math.min(lastCandle.low, newPrice)
              };
              updatedCandle.bodyData = [Math.min(updatedCandle.open, updatedCandle.close), Math.max(updatedCandle.open, updatedCandle.close)];
              updatedCandle.wickData = [updatedCandle.low, updatedCandle.high];
              history[history.length - 1] = updatedCandle;
            }

            // Every 10 ticks, add a new candle
            if (Math.random() > 0.8 && history.length < 30) {
              const open = newPrice;
              const close = open;
              history.push({
                time: history.length,
                open, close, high: open, low: open,
                bodyData: [open, open],
                wickData: [open, open]
              });
              if (history.length > 30) history.shift();
            }

            return { ...prevH, [stock.symbol]: history };
          });
        }

        return {
          ...stock,
          price: newPrice
        };
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, [expandedStock]);

  const filteredStocks = stocks
    .filter(s => s.index <= indexFilter)
    .filter(s => s.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(s => signalFilter === 'ALL' || s.signal === signalFilter)
    .sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.order === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.order === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });

  const toggleSort = (key: keyof Nifty500Stock) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right duration-500">
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="label-mono tracking-[0.2em] text-accent uppercase">Quantum Filters</span>
          <Filter size={14} className="text-muted opacity-40 shadow-sm" />
        </div>

        <div className="relative group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="SEARCH_SYMBOL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg border border-line pl-10 pr-4 py-2 font-mono text-[10px] outline-none hover:border-accent focus:border-accent transition-all uppercase"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select
            value={indexFilter}
            onChange={(e) => setIndexFilter(Number(e.target.value))}
            className="bg-bg border border-line p-2 font-mono text-[10px] outline-none hover:border-accent transition-colors uppercase"
          >
            <option value={50}>NIFTY_50</option>
            <option value={100}>NIFTY_100</option>
            <option value={200}>NIFTY_200</option>
            <option value={500}>NIFTY_500</option>
          </select>
          <select
            value={signalFilter}
            onChange={(e) => setSignalFilter(e.target.value as any)}
            className="bg-bg border border-line p-2 font-mono text-[10px] outline-none hover:border-accent transition-colors uppercase"
          >
            <option value="ALL">SIG_ALL</option>
            <option value="BUY">SIG_BUY</option>
            <option value="SELL">SIG_SELL</option>
            <option value="NEUTRAL">SIG_NEUTRAL</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => toggleSort('price')}
            className={`flex-1 py-1.5 border font-mono text-[9px] transition-all flex items-center justify-center gap-1 ${sortConfig.key === 'price' ? 'bg-ink text-white border-ink' : 'bg-bg text-muted border-line hover:border-accent'}`}
          >
            SORT_PRICE {sortConfig.key === 'price' ? (sortConfig.order === 'asc' ? '↑' : '↓') : ''}
          </button>
          <button
            onClick={() => toggleSort('momentum')}
            className={`flex-1 py-1.5 border font-mono text-[9px] transition-all flex items-center justify-center gap-1 ${sortConfig.key === 'momentum' ? 'bg-ink text-white border-ink' : 'bg-bg text-muted border-line hover:border-accent'}`}
          >
            SORT_MOM {sortConfig.key === 'momentum' ? (sortConfig.order === 'asc' ? '↑' : '↓') : ''}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pb-10">
        {filteredStocks.map(stock => (
          <div
            key={stock.symbol}
            className={`border transition-all duration-300 ${expandedStock === stock.symbol ? 'border-ink bg-white' : 'border-line bg-transparent hover:border-muted'}`}
          >
            <div
              className="p-3 flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedStock(expandedStock === stock.symbol ? null : stock.symbol)}
            >
              <div>
                <div className="font-mono text-[10px] font-bold">{stock.symbol}</div>
                <div className="text-[8px] text-muted overflow-hidden truncate max-w-[100px]">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium tracking-tighter">₹{stock.price.toFixed(1)}</div>
                <div className={`text-[9px] font-mono font-bold ${stock.momentum > 50 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.signal}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {expandedStock === stock.symbol && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-line"
                >
                  <div className="p-4 space-y-4">
                    {/* Candlestick Chart */}
                    <div className="h-32 w-full bg-bg/30 border border-line p-2">
                      <CandlestickChart
                        data={candleHistory[stock.symbol] || []}
                        color={stock.signal === 'BUY' ? '#16a34a' : stock.signal === 'SELL' ? '#dc2626' : '#0047FF'}
                      />
                    </div>

                    <div className="space-y-4 min-h-[140px]">
                      <div className="label-mono text-[9px] text-accent font-black border-b border-accent/20 pb-1 tracking-[0.2em]">MODEL_ALPHA_FACTORS</div>

                      {loadingMetrics[stock.symbol] ? (
                        <div className="space-y-3 pt-2">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-6 bg-bg animate-pulse border-l-2 border-line/10" />
                          ))}
                        </div>
                      ) : loadedMetrics[stock.symbol] ? (
                        <>
                          <AlphaMetric
                            label="MOMENTUM_12_1"
                            value={`${stock.momentum12_1}%`}
                            note="Cross-sectional price trend (12m - 1m)"
                          />
                          <AlphaMetric
                            label="RELATIVE_VOLUME"
                            value={`${stock.relVol}x`}
                            note="Liquidity & institutional flow"
                          />
                          <AlphaMetric
                            label="RSI_MONTHLY"
                            value={stock.rsiMonthly}
                            note="Rel. Strength Index (Mean-Reversion)"
                          />
                          <AlphaMetric
                            label="BB_BANDWIDTH"
                            value={`${stock.bbBandwidth}%`}
                            note="Volatility-adjusted price extension"
                          />
                          <AlphaMetric
                            label="MARKET_BETA"
                            value={stock.marketBeta}
                            note="Systematic risk sensitivity (^NSEI)"
                          />
                        </>
                      ) : (
                        <div className="text-[10px] font-mono text-muted py-4 text-center italic">Initialize analysis uplink...</div>
                      )}

                      <div className="pt-2">
                        <button className={`w-full py-2 font-mono text-[10px] uppercase font-bold tracking-widest ${stock.signal === 'BUY' ? 'bg-green-600 text-white' :
                            stock.signal === 'SELL' ? 'bg-red-600 text-white' :
                              'bg-ink text-white'
                          }`}>
                          EXECUTE {stock.signal}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

const AlphaMetric = ({ label, value, note }: { label: string; value: string | number; note: string }) => (
  <div className="border-l-2 border-line/30 pl-3 py-1 hover:bg-bg/50 transition-colors">
    <div className="flex justify-between items-baseline mb-0.5">
      <span className="text-[10px] font-mono font-bold tracking-tight text-ink">{label}</span>
      <span className="text-[10px] font-mono font-black text-accent">{value}</span>
    </div>
    <div className="text-[8px] text-muted font-mono uppercase tracking-[0.05em] leading-tight">
      {note}
    </div>
  </div>
);

const OrderEntry = ({ price, vol, type, opacity = 1 }: { price: string; vol: string; type: 'bid' | 'ask'; opacity?: number }) => (
  <div className="flex justify-between items-center py-1.5 px-3 hover:bg-bg transition-colors" style={{ opacity }}>
    <span className={`font-mono text-[11px] font-bold ${type === 'bid' ? 'text-green-600' : 'text-red-600'}`}>{price}</span>
    <span className="font-mono text-[10px]">{vol}</span>
  </div>
);

const PositionRow = ({ symbol, side, qty, pnl }: { symbol: string; side: 'BUY' | 'SELL'; qty: number; pnl: number }) => (
  <div className="flex justify-between items-center py-2 border-b border-line px-1 hover:bg-bg">
    <div>
      <div className="text-[10px] font-bold">{symbol}</div>
      <div className={`text-[8px] font-mono ${side === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>{side} {qty}L</div>
    </div>
    <div className={`text-sm font-light ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      ₹{pnl.toLocaleString()}
    </div>
  </div>
);

const ResearchView = ({ onExpandStock }: { onExpandStock: (s: Nifty500Stock) => void }) => {
  const [timeframe, setTimeframe] = useState('1hr');

  const generateData = (tf: string) => {
    let count = 50;
    let basePrice = 24000;
    if (tf === '1hr') count = 60;
    if (tf === '6hr') count = 360;
    if (tf === '24hr') count = 144;
    if (tf === '2 days') count = 288;
    if (tf === '1 month') count = 30;
    if (tf === '6 month') count = 180;
    if (tf === '1 year') count = 365;

    return Array.from({ length: count }, (_, i) => ({
      time: i,
      price: basePrice + Math.random() * 500 + i * (Math.random() > 0.5 ? 1 : -1),
      volume: 1000 + Math.random() * 500,
      sma: basePrice + 200 + Math.random() * 300,
      ema: basePrice + 250 + Math.random() * 300
    }));
  };

  const [data, setData] = useState(() => generateData('1hr'));
  const [indicators, setIndicators] = useState({ sma: true, ema: false });
  const [trendlines, setTrendlines] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<any>(null);

  // Live update effect
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        const nextPrice = last.price + (Math.random() - 0.5) * 20;
        const newDataPoint = {
          time: last.time + 1,
          price: nextPrice,
          volume: 1000 + Math.random() * 500,
          sma: prev[prev.length - 1].sma + (Math.random() - 0.5) * 5,
          ema: prev[prev.length - 1].ema + (Math.random() - 0.5) * 5
        };
        return [...prev.slice(1), newDataPoint];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setData(generateData(timeframe));
  }, [timeframe]);

  const toggleIndicator = (key: keyof typeof indicators) => {
    setIndicators(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChartClick = (e: any) => {
    if (!isDrawing) return;
    if (!drawStart) {
      if (e && e.activeLabel !== undefined && e.activePayload && e.activePayload[0]) {
        setDrawStart({ x: e.activeLabel, y: e.activePayload[0].value });
      }
    } else {
      if (e && e.activeLabel !== undefined && e.activePayload && e.activePayload[0]) {
        setTrendlines([...trendlines, { start: drawStart, end: { x: e.activeLabel, y: e.activePayload[0].value } }]);
        setDrawStart(null);
        setIsDrawing(false);
      }
    }
  };

  const timeframes = ['1hr', '6hr', '24hr', '2 days', '1 month', '6 month', '1 year'];

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex justify-between items-center border-b border-line pb-4">
        <div className="flex items-center gap-6">
          <div className="label-mono text-accent font-bold">NIFTY 500 INDEX (REAL-TIME LIVE)</div>
          <div className="flex gap-2">
            <button
              onClick={() => toggleIndicator('sma')}
              className={`px-3 py-1 border font-mono text-[10px] ${indicators.sma ? 'bg-accent text-white border-accent' : 'border-line text-muted'}`}
            >
              SMA Overlay
            </button>
            <button
              onClick={() => toggleIndicator('ema')}
              className={`px-3 py-1 border font-mono text-[10px] ${indicators.ema ? 'bg-accent text-white border-accent' : 'border-line text-muted'}`}
            >
              EMA Overlay
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDrawing(!isDrawing)}
            className={`w-8 h-8 flex items-center justify-center border ${isDrawing ? 'bg-ink text-white border-ink' : 'border-line text-muted hover:border-ink'}`}
          >
            <Pencil size={14} />
          </button>
          <button onClick={() => setTrendlines([])} className="w-8 h-8 flex items-center justify-center border border-line text-muted hover:border-ink">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[400px] border border-line bg-white p-4 relative cursor-crosshair group">
        <div className="absolute top-2 right-2 z-10 flex gap-1 p-1 bg-white/80 border border-line shadow-sm">
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 text-[8px] font-mono border ${timeframe === tf ? 'bg-ink text-white border-ink' : 'border-transparent text-muted hover:border-line'}`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} onClick={handleChartClick}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="time" hide />
            <YAxis domain={['auto', 'auto']} orientation="right" tick={{ fontSize: 10, fill: '#8E8E8E' }} axisLine={false} tickLine={false} />
            <RechartsTooltip
              contentStyle={{ background: '#121212', border: 'none', color: '#fff' }}
              labelStyle={{ color: '#8E8E8E' }}
              animationDuration={0}
            />
            <Area type="monotone" dataKey="price" stroke="#0047FF" fill="url(#colorPrice)" strokeWidth={2} isAnimationActive={false} />
            {indicators.sma && <Line type="monotone" dataKey="sma" stroke="#EF4444" strokeWidth={1} dot={false} strokeDasharray="5 5" isAnimationActive={false} />}
            {indicators.ema && <Line type="monotone" dataKey="ema" stroke="#10B981" strokeWidth={1} dot={false} strokeDasharray="5 5" isAnimationActive={false} />}

            {/* Custom Trendlines */}
            {trendlines.map((line, idx) => (
              <Line
                key={idx}
                data={[{ time: line.start.x, price: line.start.y }, { time: line.end.x, price: line.end.y }]}
                type="linear"
                dataKey="price"
                stroke="#000"
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
              />
            ))}

            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0047FF" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#0047FF" stopOpacity={0} />
              </linearGradient>
            </defs>
          </ComposedChart>
        </ResponsiveContainer>

        {isDrawing && !drawStart && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-ink text-white text-[10px] px-3 py-1 font-mono tracking-widest z-10 shadow-lg">
            CLICK TO START LINE
          </div>
        )}
        {isDrawing && drawStart && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] px-3 py-1 font-mono tracking-widest z-10 shadow-lg">
            CLICK AGAIN TO FINISH
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="geometric-card p-4">
          <div className="label-mono text-[9px] mb-1 uppercase tracking-wider">RSI (14)</div>
          <div className="text-xl font-light">{(60 + Math.random() * 10).toFixed(2)}</div>
        </div>
        <div className="geometric-card p-4">
          <div className="label-mono text-[9px] mb-1 uppercase tracking_wider">MACD</div>
          <div className="text-xl font-light text-green-600">0.023</div>
        </div>
        <div className="geometric-card p-4">
          <div className="label-mono text-[9px] mb-1 uppercase tracking-wider">BOLL_UP</div>
          <div className="text-xl font-light">24,521</div>
        </div>
        <div className="geometric-card p-4">
          <div className="label-mono text-[9px] mb-1 uppercase tracking-wider">BOLL_LOW</div>
          <div className="text-xl font-light">23,940</div>
        </div>
      </div>
    </div>
  );
};

const ResearchAside = ({ onExpandStock }: { onExpandStock: (s: Nifty500Stock) => void }) => {
  const [stocks, setStocks] = useState<Nifty500Stock[]>(NIFTY_500_STOCKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Nifty500Stock; order: 'asc' | 'desc' }>({ key: 'compositeScore', order: 'desc' });
  const [minComposite, setMinComposite] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStocks(prev => prev.map(stock => ({
        ...stock,
        price: stock.price + (Math.random() - 0.5) * 10
      })));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const filteredStocks = stocks
    .filter(s => s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(s => s.compositeScore >= minComposite)
    .sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.order === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.order === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });

  const handleSort = (key: keyof Nifty500Stock) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="animate-in fade-in slide-in-from-right duration-500 h-full flex flex-col">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <span className="label-mono tracking-[0.2em] text-accent uppercase">NIFTY 500 REAL-TIME</span>
          <SlidersHorizontal size={14} className="text-muted opacity-40 shadow-sm" />
        </div>

        <div className="space-y-4 mb-6">
          <div className="relative group">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Universal Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-line pl-8 pr-4 py-2 font-mono text-[9px] outline-none focus:border-accent transition-all uppercase"
            />
          </div>

          <div className="bg-white border border-line p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="label-mono text-[8px] uppercase tracking-widest text-muted">Min Composite Score: {minComposite}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={minComposite}
              onChange={(e) => setMinComposite(Number(e.target.value))}
              className="w-full h-1 bg-line rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>
        </div>

        <div className="bg-white border border-line p-1 overflow-x-auto no-scrollbar">
          <table className="w-full text-[9px] font-mono">
            <thead>
              <tr className="border-b border-line text-muted">
                <th
                  className={`text-left font-bold py-2 cursor-pointer hover:text-accent transition-colors ${sortConfig.key === 'symbol' ? 'text-accent' : ''}`}
                  onClick={() => handleSort('symbol')}
                >
                  STOCK {sortConfig.key === 'symbol' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-center font-normal py-2">LIVE</th>
                <th
                  className={`text-right font-bold py-2 px-2 cursor-pointer hover:text-accent transition-colors ${sortConfig.key === 'momentum' ? 'text-accent' : ''}`}
                  onClick={() => handleSort('momentum')}
                >
                  MOM {sortConfig.key === 'momentum' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className={`text-right font-bold py-2 px-2 cursor-pointer hover:text-accent transition-colors ${sortConfig.key === 'valuation' ? 'text-accent' : ''}`}
                  onClick={() => handleSort('valuation')}
                >
                  VAL {sortConfig.key === 'valuation' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className={`text-right font-bold py-2 px-2 cursor-pointer hover:text-accent transition-colors ${sortConfig.key === 'compositeScore' ? 'text-accent' : ''}`}
                  onClick={() => handleSort('compositeScore')}
                >
                  COMP {sortConfig.key === 'compositeScore' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map(stock => (
                <tr
                  key={stock.symbol}
                  onClick={() => onExpandStock(stock)}
                  className="border-b border-line/50 last:border-0 hover:bg-bg group cursor-pointer"
                >
                  <td className="py-2">
                    <div className="font-bold">{stock.symbol}</div>
                    <div className="text-[7px] text-muted truncate max-w-[50px]">{stock.name}</div>
                  </td>
                  <td className="px-2 min-w-[60px] h-10">
                    <CandleMini chartData={Array.from({ length: 6 }, (_, i) => ({ o: 10 + Math.random() * 2, c: 10 + Math.random() * 2, h: 13, l: 8 }))} live />
                  </td>
                  <td className="text-right px-2">{stock.momentum}</td>
                  <td className="text-right px-2">{stock.valuation}</td>
                  <td className="text-right px-2">{stock.quality}</td>
                  <td className="text-right px-2 font-bold">{stock.compositeScore}</td>
                  <td className="text-center py-2">
                    <span className={`px-1 rounded-[1px] ${stock.signal === 'BUY' ? 'bg-green-100 text-green-700' :
                        stock.signal === 'SELL' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-500'
                      }`}>
                      {stock.signal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="geometric-card border-accent bg-accent/5 mt-auto">
        <span className="label-mono block mb-4 text-[10px] text-accent uppercase">VORTEX PATTERN SCAN</span>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span>Pattern Confidence</span>
            <span className="font-bold">88.4%</span>
          </div>
          <div className="h-1 bg-line">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '88.4%' }}
              className="h-full bg-accent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const AlgorithmCard = ({ name, status, profit, color }: { name: string; status: string; profit: string; color: string }) => (
  <div className="flex items-center justify-between p-3 bg-white border border-line hover:border-ink transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2" style={{ backgroundColor: color }} />
      <div>
        <div className="text-xs font-medium">{name}</div>
        <div className="label-mono">{status}</div>
      </div>
    </div>
    <div className={`text-[10px] font-mono font-bold ${profit.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
      {profit}
    </div>
  </div>
);

const AnalyticsView = () => {
  const [selectedModel, setSelectedModel] = useState('linear');
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<{
    accuracy: { r2: number; mse: number };
    scatterData: any[];
    sectors: any[];
    shapData: any[];
    tableData: any[];
  } | null>(null);

  // Generate distinct model characteristics
  const runInference = () => {
    setIsRunning(true);

    // Simulate training/testing latency
    setTimeout(() => {
      let r2, mse, scatter, sectorsData, shap, table;

      if (selectedModel === 'linear') {
        r2 = 0.842 + Math.random() * 0.02;
        mse = 0.0042 + Math.random() * 0.0005;
        shap = [
          { feature: 'Market_Beta', impact: 0.45, category: 'Risk' },
          { feature: 'Momentum_12_1', impact: 0.15, category: 'Momentum' },
          { feature: 'Volatility_30d', impact: -0.12, category: 'Volatility' },
          { feature: 'P/E Ratio', impact: 0.08, category: 'Valuation' },
        ];
      } else if (selectedModel === 'ridge') {
        r2 = 0.815 + Math.random() * 0.03;
        mse = 0.0058 + Math.random() * 0.0008;
        shap = [
          { feature: 'P/E Ratio', impact: 0.32, category: 'Valuation' },
          { feature: 'Volatility_30d', impact: 0.28, category: 'Volatility' },
          { feature: 'Market_Beta', impact: 0.12, category: 'Risk' },
          { feature: 'RSI_14', impact: -0.05, category: 'Momentum' },
        ];
      } else { // forest
        r2 = 0.912 + Math.random() * 0.04;
        mse = 0.0021 + Math.random() * 0.0003;
        shap = [
          { feature: 'RSI_14', impact: 0.38, category: 'Momentum' },
          { feature: 'Momentum_12_1', impact: 0.35, category: 'Momentum' },
          { feature: 'Relative_Volume', impact: 0.22, category: 'Volume' },
          { feature: 'Volatility_30d', impact: 0.18, category: 'Volatility' },
          { feature: 'Market_Beta', impact: -0.05, category: 'Risk' },
        ];
      }

      scatter = Array.from({ length: 20 }, (_, i) => ({
        volatility: i * (selectedModel === 'forest' ? 0.5 : 0.75),
        returns: i * 0.2 + (Math.random() - 0.5) * (selectedModel === 'linear' ? 1 : 3),
        variance: Math.random() > 0.7 ? (i * 0.2 + (Math.random() - 0.5) * 5) : null
      }));

      sectorsData = [
        { name: 'PHARMA', confidence: selectedModel === 'forest' ? 'High' : 'Mid' },
        { name: 'INFRA', confidence: selectedModel === 'linear' ? 'High' : 'Mid' },
        { name: 'MEDIA', confidence: 'High' },
        { name: 'REALTY', confidence: selectedModel === 'ridge' ? 'High' : 'Low' },
        { name: 'CEMENT', confidence: 'Mid' },
        { name: 'FMCG', confidence: 'High' },
      ];

      table = [
        { symbol: 'RELIANCE', pred: '+1.24%', actual: '+1.18%', delta: '0.06%' },
        { symbol: 'TCS', pred: '-0.42%', actual: '-0.45%', delta: '0.03%' },
        { symbol: 'HDFCBANK', pred: '+0.85%', actual: '+1.12%', delta: '0.27%' },
        { symbol: 'INFY', pred: '+2.10%', actual: '+2.05%', delta: '0.05%' },
        { symbol: 'ICICIBANK', pred: '+0.15%', actual: '+0.18%', delta: '0.03%' },
      ];

      setTestResult({
        accuracy: { r2, mse },
        scatterData: scatter,
        sectors: sectorsData,
        shapData: shap.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)),
        tableData: table
      });
      setIsRunning(false);
    }, 1500);
  };

  useEffect(() => {
    if (!testResult) runInference();
  }, []);

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in duration-500 overflow-y-auto no-scrollbar pb-10">
      <div className="flex items-center gap-3">
        <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-accent animate-pulse' : 'bg-green-500'}`} />
        <span className="label-mono text-[9px] text-accent font-bold tracking-[0.2em] uppercase">
          {isRunning ? 'TEST_IN_PROGRESS_UPLINK_STABLE' : 'ENGINE READY FOR INFERENCE'}
        </span>
      </div>

      <div className="flex items-baseline justify-between mb-4">
        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl font-light tracking-tighter text-ink">ML Predictions</h2>
          <span className="text-xl text-muted font-light tracking-tighter">/ NIFTY 500</span>
        </div>

        <button
          onClick={runInference}
          disabled={isRunning}
          className={`btn-geometric flex items-center gap-2 group px-8 ${isRunning ? 'opacity-50' : ''}`}
        >
          {isRunning ? <RefreshCcw size={14} className="animate-spin" /> : <Play size={14} className="group-hover:translate-x-0.5 transition-transform" />}
          {isRunning ? 'TRAINING MODEL...' : `RUN ${selectedModel.toUpperCase()} TEST`}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-4 flex flex-col gap-6">
          <div className="geometric-card">
            <div className="flex justify-between items-center mb-6">
              <span className="label-mono text-[10px]">Select Inference Model</span>
              <span className="text-[8px] bg-accent/10 text-accent px-2 py-0.5 font-bold tracking-widest">
                {isRunning ? 'ALLOCATING CORES' : 'READY'}
              </span>
            </div>

            <div className="space-y-3">
              <ModelCard
                icon={<TrendingUp size={16} />}
                title="Linear Regression"
                subtitle="BASELINE MODEL"
                active={selectedModel === 'linear'}
                onClick={() => setSelectedModel('linear')}
              />
              <ModelCard
                icon={<Activity size={16} />}
                title="Ridge Regression"
                subtitle="L2 REGULARIZATION"
                active={selectedModel === 'ridge'}
                onClick={() => setSelectedModel('ridge')}
              />
              <ModelCard
                icon={<BarChart3 size={16} />}
                title="Random Forest"
                subtitle="ENSEMBLE LEARNING"
                active={selectedModel === 'forest'}
                onClick={() => setSelectedModel('forest')}
              />
              <ModelCard
                icon={<Cpu size={16} />}
                title="Transformers / LSTM"
                subtitle="UPCOMING IN V3.0"
                locked
              />
            </div>
          </div>

          <div className="geometric-card min-h-[140px] relative">
            {isRunning && <LoadingOverlay message="CRUNCHING ACCURACY" />}
            <div className="label-mono mb-2">MODEL ACCURACY (R²)</div>
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-4xl font-light tracking-tighter font-mono">
                {testResult ? testResult.accuracy.r2.toFixed(3) : '---'}
              </span>
              {testResult && (
                <span className="text-[10px] text-green-600 font-bold font-mono">↗ +{(Math.random() * 2).toFixed(1)}%</span>
              )}
            </div>
            <div className="h-1 bg-line relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(testResult?.accuracy.r2 || 0) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0 bg-accent"
              />
            </div>
          </div>

          <div className="geometric-card min-h-[100px] relative">
            {isRunning && <LoadingOverlay message="CALCULATING MSE" />}
            <div className="label-mono mb-2">MEAN SQUARED ERROR (MSE)</div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-3xl font-light tracking-tighter font-mono text-ink">
                {testResult ? testResult.accuracy.mse.toFixed(4) : '----'}
              </span>
              <span className="label-mono text-[8px] opacity-40 uppercase tracking-widest">
                {isRunning ? 'COMPUTING...' : 'STABLE'}
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-8 geometric-card flex flex-col relative min-h-[450px]">
          {isRunning && <LoadingOverlay message="RE-SYNTHESIZING PATTERNS" />}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-medium tracking-tight">Predicted vs Actual Returns</h3>
              <p className="text-[10px] text-muted font-mono uppercase tracking-wider">
                Model: {selectedModel.toUpperCase()} Inference Results
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="label-mono text-[8px]">Predicted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span className="label-mono text-[8px]">Variance</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={testResult?.scatterData || []}>
                <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="volatility"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: '#8E8E8E' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: '#8E8E8E' }}
                />
                <RechartsTooltip content={<CustomScatterTooltip />} />

                <Line
                  type={selectedModel === 'forest' ? 'stepAfter' : 'monotone'}
                  dataKey="volatility"
                  stroke="#0047FF"
                  strokeWidth={2}
                  strokeDasharray={selectedModel === 'ridge' ? "2 2" : "4 4"}
                  dot={false}
                />

                <Area
                  type="monotone"
                  dataKey="returns"
                  stroke="none"
                  fill="none"
                  dot={{ r: 4, fill: '#22d3ee', fillOpacity: 0.8, stroke: '#fff', strokeWidth: 1 }}
                />

                <Area
                  type="monotone"
                  dataKey="variance"
                  stroke="none"
                  fill="none"
                  dot={{ r: 8, fill: '#c084fc', fillOpacity: 0.6, stroke: '#fff', strokeWidth: 1 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-7 relative">
          {isRunning && <LoadingOverlay message="MAPPING CONFIDENCE" />}
          <div className="flex justify-between items-center mb-6">
            <span className="label-mono">Sector Confidence Heatmap</span>
            <div className="flex gap-4">
              <LegendItem color="bg-line" label="Low" />
              <LegendItem color="bg-accent/30" label="Mid" />
              <LegendItem color="bg-accent" label="High" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(testResult?.sectors || []).map(s => (
              <div key={s.name} className={`p-6 border border-line flex flex-col items-center justify-center transition-all hover:border-accent group ${s.confidence === 'High' ? 'bg-accent/5' : 'bg-transparent'}`}>
                <div className="label-mono text-[9px] text-muted group-hover:text-accent mb-2 uppercase tracking-widest">{s.name}</div>
                <div className={`text-[10px] font-bold tracking-[0.2em] font-mono ${s.confidence === 'High' ? 'text-accent' : 'text-muted'}`}>{(s.confidence || '').toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-5 geometric-card relative">
          {isRunning && <LoadingOverlay message="SYNCING SYMBOLS" />}
          <div className="flex justify-between items-center mb-6">
            <span className="label-mono text-ink">Model Forecast Accuracy</span>
            <Activity size={12} className="text-muted" />
          </div>
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr className="text-muted border-b border-line">
                <th className="text-left py-2 font-normal text-muted/60">SYMBOL</th>
                <th className="text-right py-2 font-normal text-muted/60">PRED.</th>
                <th className="text-right py-2 font-normal text-muted/60">ACTUAL</th>
                <th className="text-right py-2 font-normal text-muted/60">DELTA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/20">
              {(testResult?.tableData || []).map(row => (
                <tr key={row.symbol} className="hover:bg-bg transition-colors">
                  <td className="py-2.5 font-bold text-ink">{row.symbol}</td>
                  <td className="text-right py-2.5 text-accent font-bold">{row.pred}</td>
                  <td className="text-right py-2.5 text-muted">{row.actual}</td>
                  <td className="text-right py-2.5 font-bold text-green-600">{row.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SHAPValuesPlot selectedModel={selectedModel} shapData={testResult?.shapData || []} isRunning={isRunning} />
      <BacktestingModule />
    </div>
  );
};

const LoadingOverlay = ({ message }: { message: string }) => (
  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-6 text-center">
    <div className="w-10 h-10 border-2 border-accent border-r-transparent rounded-full animate-spin mb-4" />
    <div className="label-mono text-[10px] text-accent font-black tracking-widest animate-pulse">{message}</div>
    <div className="mt-4 w-32 h-[1px] bg-line relative overflow-hidden">
      <motion.div
        animate={{ x: ['-100%', '100%'] }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="absolute inset-0 bg-accent w-1/2"
      />
    </div>
  </div>
);

/* --- PORTFOLIO VIEW & ASSET MANAGEMENT --- */

const PortfolioView = ({ onExpandStock }: { onExpandStock: (s: Nifty500Stock) => void }) => {
  const [watchlist, setWatchlist] = useState<string[]>(['RELIANCE', 'TCS', 'ZOMATO']);
  const [activeSubTab, setActiveSubTab] = useState<'holdings' | 'mtf'>('holdings');
  const [localHoldings, setLocalHoldings] = useState([
    { symbol: 'RELIANCE', qty: 10, avgPrice: 2800.00, currentPrice: 2942.50 + Math.random() * 20, index: 50 },
    { symbol: 'INFY', qty: 25, avgPrice: 1750.00, currentPrice: 1892.40 + Math.random() * 15, index: 50 },
    { symbol: 'DLF', qty: 100, avgPrice: 850.00, currentPrice: 920.40 + Math.random() * 5, index: 500 },
    { symbol: 'BAJFINANCE', qty: 5, avgPrice: 7200.00, currentPrice: 6845.00 + Math.random() * 50, index: 100 },
  ]);

  useEffect(() => {
    const ticker = setInterval(() => {
      setLocalHoldings(prev => prev.map(h => ({
        ...h,
        currentPrice: h.currentPrice + (Math.random() - 0.5) * 5
      })));
    }, 3000);
    return () => clearInterval(ticker);
  }, []);

  const currentValuation = localHoldings.reduce((acc, h) => acc + (h.qty * h.currentPrice), 0);
  const totalInvestment = localHoldings.reduce((acc, h) => acc + (h.qty * h.avgPrice), 0);
  const totalPnL = currentValuation - totalInvestment;
  const pnlPercent = (totalPnL / totalInvestment) * 100;

  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]);
  };

  return (
    <div className="h-full flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-y-auto no-scrollbar pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl font-light tracking-tighter text-ink">Asset Intelligence</h2>
          <span className="text-xl text-muted font-light tracking-tighter">/ Global Portfolio</span>
        </div>
        <div className="flex gap-4">
          <div className="geometric-card py-2 px-6 flex flex-col items-end border-accent/20 bg-accent/5">
            <span className="label-mono text-[8px] opacity-40">Portfolio Value</span>
            <span className="text-xl font-mono font-bold">₹{currentValuation.toLocaleString()}</span>
          </div>
          <div className={`geometric-card py-2 px-6 flex flex-col items-end border-line ${totalPnL >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <span className="label-mono text-[8px] opacity-40">Unrealized P&L</span>
            <span className={`text-xl font-mono font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalPnL >= 0 ? '+' : ''}{totalPnL.toLocaleString()} ({pnlPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      <section className="col-span-12 grid grid-cols-4 gap-8">
        <IntelligenceMetric label="SHARPE_RATIO" value="1.84" status="EXCELLENT" trend="up" />
        <IntelligenceMetric label="VOLATILITY_SIGMA" value="0.12" status="LOW" trend="down" />
        <IntelligenceMetric label="BETA_SENSITIVITY" value="0.94" status="CORRELATED" trend="stable" />
        <IntelligenceMetric label="ALPHA_GENERATION" value="+4.2%" status="HIGH" trend="up" />
      </section>

      <div className="grid grid-cols-12 gap-8">
        {/* Market Exposure Distribution */}
        <section className="col-span-12 geometric-card grid grid-cols-4 gap-0 divide-x divide-line p-0 overflow-hidden">
          <ExposureCard title="NIFTY 50" value="₹1.4M" weight={65} color="#0047FF" />
          <ExposureCard title="NIFTY 200" value="₹0.4M" weight={25} color="#c084fc" />
          <ExposureCard title="NIFTY 500" value="₹0.2M" weight={10} color="#22d3ee" />
          <ExposureCard title="MTF_MARGIN" value="₹4.5M" weight={85} color="#F27D26" label="LIMIT_AVAIL" />
        </section>

        {/* Holdings Table */}
        <div className="col-span-8 flex flex-col gap-8">
          <section className="geometric-card">
            <div className="flex justify-between items-center mb-8">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveSubTab('holdings')}
                  className={`label-mono font-black text-xs tracking-widest italic pb-1 border-b-2 transition-all ${activeSubTab === 'holdings' ? 'border-accent text-ink' : 'border-transparent text-muted opacity-40'}`}
                >
                  CASH_HOLDINGS
                </button>
                <button
                  onClick={() => setActiveSubTab('mtf')}
                  className={`label-mono font-black text-xs tracking-widest italic pb-1 border-b-2 transition-all flex items-center gap-2 ${activeSubTab === 'mtf' ? 'border-accent text-ink' : 'border-transparent text-muted opacity-40'}`}
                >
                  PAY_LATER_MTF <span className="bg-accent/10 px-1 text-[8px] rounded-sm text-accent">LEVERAGE_4X</span>
                </button>
              </div>
              {activeSubTab === 'holdings' ? (
                <button className="label-mono text-[9px] text-muted hover:text-ink transition-colors flex items-center gap-1">
                  <ArrowRightLeft size={12} /> REBALANCE_ENGINE
                </button>
              ) : (
                <button className="label-mono text-[9px] text-accent font-bold hover:text-ink transition-colors flex items-center gap-1">
                  <Lock size={12} /> PLEDGE_ASSETS
                </button>
              )}
            </div>

            <div className="space-y-2">
              {activeSubTab === 'holdings' ? (
                localHoldings.map((h) => {
                  const stock = NIFTY_500_STOCKS.find(s => s.symbol === h.symbol)!;
                  const pnl = (h.currentPrice - h.avgPrice) * h.qty;
                  return (
                    <div
                      key={h.symbol}
                      onClick={() => onExpandStock(stock)}
                      className="group flex items-center justify-between p-4 border border-line hover:border-accent transition-all cursor-crosshair bg-white/50 hover:bg-white hover:shadow-xl"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-1.5 h-8 bg-line group-hover:bg-accent transition-colors" />
                        <div>
                          <div className="text-sm font-bold tracking-tight">{h.symbol}</div>
                          <div className="label-mono text-[8px] opacity-40">QTY: {h.qty} • AVG: ₹{h.avgPrice}</div>
                        </div>
                      </div>
                      <div className="w-48 h-10 px-4">
                        <CandleMini chartData={Array.from({ length: 12 }, (_, i) => ({ o: 10 + Math.random() * 2, c: 10 + Math.random() * 2, h: 13, l: 8 }))} live />
                      </div>
                      <div className="text-right flex-1">
                        <div className="text-sm font-mono font-bold">₹{(h.qty * h.currentPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        <div className={`text-[9px] font-mono font-bold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <MTFPositionsTable onExpandStock={onExpandStock} />
              )}
            </div>
          </section>

          <section className="geometric-card">
            <div className="flex justify-between items-center mb-8">
              <span className="label-mono font-black text-xs tracking-widest italic border-b-2 border-accent">QUANTS_RECOMMENDATIONS</span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {NIFTY_500_STOCKS.slice(4, 8).map(stock => (
                <div key={stock.symbol} className="p-5 border border-line flex items-center justify-between group hover:border-ink transition-all">
                  <div>
                    <div className="text-sm font-bold">{stock.symbol}</div>
                    <div className="label-mono text-[8px] text-muted">BETA: {stock.marketBeta} | RSI: {stock.rsiMonthly}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <RecommendationBadge signal={stock.signal} />
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWatchlist(stock.symbol); }}
                      className={`mt-2 ${watchlist.includes(stock.symbol) ? 'text-accent' : 'text-muted/40 hover:text-accent'}`}
                    >
                      <Star size={14} fill={watchlist.includes(stock.symbol) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Watchlist & Risk */}
        <div className="col-span-4 flex flex-col gap-8">
          <section className="geometric-card bg-ink text-white">
            <div className="flex justify-between items-baseline mb-8">
              <span className="label-mono text-white/50 italic font-black text-xs">WATCHLIST_V3</span>
              <LayoutGrid size={12} className="opacity-40" />
            </div>
            <div className="space-y-4">
              {watchlist.map(sym => {
                const stock = NIFTY_500_STOCKS.find(s => s.symbol === sym)!;
                return (
                  <div
                    key={sym}
                    onClick={() => onExpandStock(stock)}
                    className="flex items-center justify-between p-3 border border-white/5 hover:border-white/20 hover:bg-white/5 cursor-pointer transition-all"
                  >
                    <span className="font-mono text-xs">{sym}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-white/60">₹{stock.price}</span>
                      <div className={`w-1 h-1 rounded-full ${stock.signal === 'BUY' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="geometric-card">
            <span className="label-mono block mb-6 text-xs italic font-black border-b-2 border-accent w-fit">RISK_ALLOCATION</span>
            <div className="space-y-6">
              <RiskProgress label="Systemic Variance" value={42} />
              <RiskProgress label="Concentration Risk" value={68} status="CRITICAL" />
              <RiskProgress label="Liquidity Buffer" value={85} />
            </div>
          </section>

          <section className="geometric-card bg-accent/5 border-dashed border-accent">
            <span className="label-mono block mb-4 text-[9px] text-accent font-black tracking-widest">SMART_REBALANCE_ADVISORY</span>
            <div className="space-y-4">
              <RebalanceItem symbol="HDFCBANK" action="BUY" weight="+4.2%" />
              <RebalanceItem symbol="INFY" action="SELL" weight="-2.1%" />
              <p className="text-[8px] text-muted font-mono mt-4 leading-tight italic">
                System detects high correlation in current IT holdings. Reducing INFY to normalize sector weight.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const RebalanceItem = ({ symbol, action, weight }: any) => (
  <div className="flex justify-between items-center p-2 border border-line bg-white/50">
    <div>
      <div className="text-[10px] font-bold">{symbol}</div>
      <div className={`text-[8px] font-black tracking-widest ${action === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>{action}</div>
    </div>
    <div className="font-mono text-[10px] font-bold text-accent">{weight}</div>
  </div>
);

/* --- SUPPORTING COMPONENTS --- */

const ExposureCard = ({ title, value, weight, color, label = "Allocation" }: any) => (
  <div className="p-8 group hover:bg-bg/40 transition-colors cursor-default">
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="label-mono text-[9px] opacity-40 uppercase mb-1">{title}</div>
        <div className="text-2xl font-mono font-bold tracking-tighter">{value}</div>
      </div>
      <div className="p-2 border border-line bg-white group-hover:border-ink transition-all">
        <PieChart size={14} className="text-muted" />
      </div>
    </div>
    <div className="h-1 bg-line relative rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${weight}%` }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="absolute inset-y-0 left-0"
        style={{ backgroundColor: color }}
      />
    </div>
    <div className="flex justify-between mt-2 font-mono text-[8px] text-muted font-bold tracking-widest uppercase">
      <span>{label}</span>
      <span>{weight}%</span>
    </div>
  </div>
);

const MTFPositionsTable = ({ onExpandStock }: { onExpandStock: (s: Nifty500Stock) => void }) => {
  const [showMarginWorkflow, setShowMarginWorkflow] = useState(false);
  const mtfPositions = [
    { symbol: 'ADANIENT', marketValue: 145000, marginPaid: 36250, funding: 108750, pnl: 4200 },
    { symbol: 'TATASTEEL', marketValue: 85000, marginPaid: 21250, funding: 63750, pnl: -1200 },
  ];

  return (
    <>
      <AnimatePresence>
        {showMarginWorkflow && (
          <MarginAcquisitionModal onClose={() => setShowMarginWorkflow(false)} />
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div className="grid grid-cols-12 px-4 py-2 bg-bg/50 border border-line text-[9px] font-mono text-muted tracking-widest uppercase">
          <div className="col-span-3">POSITION</div>
          <div className="col-span-2 text-right">MARKET_VAL</div>
          <div className="col-span-2 text-right">MARGIN_PAID</div>
          <div className="col-span-3 text-right">FUNDING_VORTEX</div>
          <div className="col-span-2 text-right">PNL</div>
        </div>
        {mtfPositions.map(pos => {
          const stock = NIFTY_500_STOCKS.find(s => s.symbol === pos.symbol)!;
          return (
            <div
              key={pos.symbol}
              onClick={() => onExpandStock(stock)}
              className="grid grid-cols-12 p-4 border border-line hover:border-accent transition-all cursor-crosshair bg-white group"
            >
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-1 h-6 bg-accent opacity-20 group-hover:opacity-100 transition-opacity" />
                <div className="text-xs font-bold">{pos.symbol}</div>
              </div>
              <div className="col-span-2 text-right text-xs font-mono">₹{pos.marketValue.toLocaleString()}</div>
              <div className="col-span-2 text-right text-xs font-mono text-muted">₹{pos.marginPaid.toLocaleString()}</div>
              <div className="col-span-3 text-right text-xs font-mono text-accent">₹{pos.funding.toLocaleString()}</div>
              <div className={`col-span-2 text-right text-xs font-mono font-bold ${pos.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{pos.pnl.toLocaleString()}
              </div>
            </div>
          );
        })}
        <div className="geometric-card bg-accent/5 p-4 border-dashed border-accent flex justify-between items-center transition-all hover:bg-accent/10">
          <div>
            <div className="label-mono text-[9px] text-accent mb-1 font-black">MARGIN_AVAILABILITY_UPLINK</div>
            <div className="text-[10px] text-muted max-w-sm italic">You can use your ₹4.5M limit to buy 4x more stocks. Pay only 25% upfront.</div>
          </div>
          <button
            onClick={() => setShowMarginWorkflow(true)}
            className="btn-geometric px-6 bg-accent text-white border-accent hover:bg-ink flex items-center gap-2 group"
          >
            GET_MARGIN <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </>
  );
};

const MarginAcquisitionModal = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { id: 1, title: 'SELECT_ASSETS', desc: 'Pledge existing holdings to generate collateral value.' },
    { id: 2, title: 'VERIFY_E-OBLIGATION', desc: 'Authorize pledging through digital depository signature.' },
    { id: 3, title: 'LIMIT_ACTIVATION', desc: 'Synchronize new margin limit with the trading engine.' },
  ];

  const handleNext = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (step < 3) setStep(step + 1);
      else onClose();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-8 backdrop-blur-md bg-white/20"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-white border border-ink shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] p-12 relative overflow-hidden"
      >
        {/* Background Grids */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>

        <button onClick={onClose} className="absolute top-8 right-8 text-muted hover:text-ink transition-colors">
          <X size={24} />
        </button>

        <div className="relative z-10">
          <div className="flex justify-between items-baseline mb-12 border-b border-line pb-6">
            <div>
              <div className="label-mono text-accent font-black tracking-[0.2em] mb-2 uppercase">Margin Expansion Protocol</div>
              <h2 className="text-4xl font-light tracking-tighter">Acquire Additional Funding</h2>
            </div>
            <div className="text-right">
              <div className="label-mono text-[9px] opacity-40 mb-1 tracking-widest">STATUS_UPLINK</div>
              <div className="text-xs font-mono font-bold">{isProcessing ? 'CALIBRATING...' : 'READY_FOR_SYNC'}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-12">
            {steps.map((s) => (
              <div key={s.id} className={`relative pt-6 border-t-2 transition-all duration-500 ${step >= s.id ? 'border-accent opacity-100' : 'border-line opacity-30'}`}>
                <div className="text-[10px] font-mono font-black text-accent mb-2">0{s.id}</div>
                <div className="text-xs font-bold mb-2 tracking-tight uppercase">{s.title}</div>
                <div className="text-[10px] text-muted leading-relaxed font-mono italic">{s.desc}</div>
              </div>
            ))}
          </div>

          <div className="geometric-card bg-bg p-8 mb-12 border-dashed">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <p className="label-mono text-[10px] text-muted opacity-60 mb-6 tracking-widest">SELECTABLE_COLLATERAL</p>
                <PledgeItem symbol="RELIANCE" value="₹1,24,000" margin="₹93,000" />
                <PledgeItem symbol="INFY" value="₹85,000" margin="₹63,750" />
                <PledgeItem symbol="TCS" value="₹2,10,000" margin="₹1,57,500" />
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-col items-center py-12 animate-in zoom-in-95 duration-300">
                <RefreshCcw className={`w-16 h-16 text-accent mb-6 ${isProcessing ? 'animate-spin' : ''}`} />
                <div className="text-xl font-light tracking-tighter text-center">Digitally Signing e-DIS Request</div>
                <div className="label-mono text-[10px] mt-2 opacity-40">Connecting to NSDL/CDSL Secure Vault...</div>
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-col items-center py-12 animate-in fade-in scale-95 duration-500">
                <div className="w-20 h-20 bg-green-50 flex items-center justify-center rounded-full mb-6">
                  <Check size={40} className="text-green-600" />
                </div>
                <div className="text-3xl font-light tracking-tighter text-center mb-2">₹1,50,000 Limit Unlocked</div>
                <div className="label-mono text-accent font-black tracking-widest">SYNC_COMPLETE_TERMINAL_ACTIVE</div>
              </div>
            )}
          </div>

          <button
            disabled={isProcessing}
            onClick={handleNext}
            className="btn-geometric w-full py-5 bg-ink text-white hover:bg-accent hover:border-accent disabled:opacity-50 disabled:cursor-wait relative group"
          >
            {isProcessing ? 'PROCESSING_QUANTUM_HANDSHAKE...' : step === 3 ? 'RETURN_TO_TERMINAL' : 'AUTHORIZE_PROTOCOL_NEXT'}
            {!isProcessing && <ArrowRight size={18} className="absolute right-8 top-1/2 -translate-y-1/2 group-hover:translate-x-2 transition-transform" />}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PledgeItem = ({ symbol, value, margin }: { symbol: string; value: string; margin: string }) => (
  <div className="flex items-center justify-between p-4 bg-white border border-line hover:border-accent transition-all cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="w-4 h-4 border-2 border-line group-hover:border-accent group-hover:bg-accent/10 transition-all flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-accent opacity-0 group-hover:opacity-100" />
      </div>
      <div>
        <div className="text-xs font-bold">{symbol}</div>
        <div className="label-mono text-[8px] opacity-40 tracking-widest">VALUE: {value}</div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-xs font-mono font-bold text-accent">{margin}</div>
      <div className="label-mono text-[8px] opacity-40 tracking-widest uppercase">ADD_MARGIN</div>
    </div>
  </div>
);

const IndicatorToggle = ({ label, active }: any) => (
  <button className={`px-2 py-1 border text-[8px] font-mono font-bold tracking-widest transition-all ${active ? 'bg-ink text-white border-ink' : 'bg-white text-muted border-line hover:border-ink hover:text-ink'}`}>
    {label}
  </button>
);

const IntelligenceMetric = ({ label, value, status, trend }: any) => (
  <div className="geometric-card p-6 border-line/40 bg-white/40 backdrop-blur-sm relative overflow-hidden group hover:border-ink transition-all border-dashed">
    <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity translate-x-2 -translate-y-2 scale-150">
      {trend === 'up' ? <ArrowUpRight size={80} /> : trend === 'down' ? <ArrowDownRight size={80} /> : <Activity size={80} />}
    </div>
    <div className="label-mono text-[9px] mb-4 text-muted tracking-[0.2em] font-bold uppercase">{label}</div>
    <div className="text-4xl font-light tracking-tighter mb-2 font-mono flex items-baseline gap-1">
      {value}
      <span className="text-[10px] opacity-40 font-normal">v.1.2</span>
    </div>
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${trend === 'up' ? 'bg-green-500' : trend === 'down' ? 'bg-red-500' : 'bg-blue-500'} animate-pulse`} />
      <span className={`label-mono text-[8px] font-black uppercase tracking-widest ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-blue-600'}`}>
        {status}
      </span>
    </div>
  </div>
);

const CandleMini = ({ chartData, live }: { chartData: any[], live?: boolean }) => {
  const [data, setData] = useState(chartData);

  useEffect(() => {
    if (!live) return;
    const ticker = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        const nextO = last.c;
        // Accurate volatility simulation
        const move = (Math.random() - 0.5) * 4;
        const nextC = nextO + move;
        const h = Math.max(nextO, nextC) + Math.random() * 0.5;
        const l = Math.min(nextO, nextC) - Math.random() * 0.5;
        return [...prev.slice(1), { o: nextO, c: nextC, h, l }];
      });
    }, 2000);
    return () => clearInterval(ticker);
  }, [live]);

  return (
    <div className="w-full h-full flex items-center justify-center gap-[2px]">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center">
          <div className="w-[1px] h-2 bg-line/30" />
          <div className={`w-1.5 rounded-sm transition-all duration-500 ${d.c > d.o ? 'bg-green-500/30 border border-green-500' : 'bg-red-500/30 border border-red-500'}`}
            style={{ height: `${Math.max(4, Math.abs(d.c - d.o) * 5)}px` }} />
          <div className="w-[1px] h-2 bg-line/30" />
        </div>
      ))}
    </div>
  );
};

const RecommendationBadge = ({ signal }: { signal: string }) => {
  const colors = {
    BUY: 'bg-green-500/10 text-green-600 border-green-600/20',
    SELL: 'bg-red-500/10 text-red-600 border-red-600/20',
    NEUTRAL: 'bg-blue-500/10 text-blue-600 border-blue-600/20',
  };
  return (
    <span className={`px-2 py-0.5 border text-[8px] font-black tracking-widest rounded-full ${(colors as any)[signal]}`}>
      {signal}
    </span>
  );
};

const RiskProgress = ({ label, value, status }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] items-center">
      <span className="label-mono uppercase tracking-widest">{label}</span>
      <span className={`font-mono font-bold ${status === 'CRITICAL' ? 'text-red-600' : 'text-accent'}`}>{value}% {status && <span className="ml-1 text-[8px] animate-pulse">[{status}]</span>}</span>
    </div>
    <div className="h-1 bg-line overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-full ${value > 60 ? 'bg-red-500' : 'bg-accent'}`}
      />
    </div>
  </div>
);

const ExpandedChart = ({ stock, onClose }: { stock: Nifty500Stock, onClose: () => void }) => {
  // Simulate 50 candle dataset with symbol-specific volatility seeding
  const generateInitialData = () => {
    const volatilityBase = (stock.marketBeta || 1) * 5;
    let lastC = stock.price;
    return Array.from({ length: 60 }, (_, i) => {
      const o = lastC + (Math.random() - 0.5) * volatilityBase;
      const c = o + (Math.random() - 0.5) * (volatilityBase * 1.5);
      const h = Math.max(o, c) + Math.random() * (volatilityBase * 0.2);
      const l = Math.min(o, c) - Math.random() * (volatilityBase * 0.2);
      lastC = c;
      return { name: `T-${60 - i}`, o, c, h, l };
    });
  };

  const [candleData, setCandleData] = useState(generateInitialData());
  const [livePrice, setLivePrice] = useState(stock.price);

  useEffect(() => {
    const volatility = (stock.marketBeta || 1) * 4;
    const ticker = setInterval(() => {
      setLivePrice(prev => prev + (Math.random() - 0.5) * volatility);
      setCandleData(prev => {
        const last = prev[prev.length - 1];
        const o = last.c;
        const c = o + (Math.random() - 0.5) * (volatility * 1.2);
        const h = Math.max(o, c) + Math.random() * 0.5;
        const l = Math.min(o, c) - Math.random() * 0.5;
        return [...prev.slice(1), { name: 'NOW', o, c, h, l }];
      });
    }, 2500);
    return () => clearInterval(ticker);
  }, [stock.marketBeta]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 lg:p-20 bg-ink/60 backdrop-blur-2xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 30, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-7xl h-full bg-white border border-white/20 shadow-[-50px_50px_100px_rgba(0,0,0,0.5)] relative flex flex-col p-10 overflow-hidden rounded-sm"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full translate-x-1/4 -translate-y-1/4 blur-[120px] pointer-events-none" />

        <div className="flex justify-between items-start mb-10 z-10">
          <div className="animate-in slide-in-from-left duration-700">
            <div className="flex items-center gap-4">
              <h2 className="text-6xl font-black italic tracking-tighter text-ink uppercase leading-none">{stock.symbol}</h2>
              <div className="flex flex-col">
                <span className="px-2 py-0.5 bg-accent text-white font-mono text-[9px] font-black tracking-widest uppercase">LIVE_DATA_FEED</span>
                <span className="text-[8px] font-mono text-muted mt-1 tracking-tighter">SECURE_CHANNEL://VORTEX_CORE_{stock.symbol}</span>
              </div>
            </div>
            <p className="text-muted tracking-[0.3em] uppercase font-mono text-[11px] mt-4 font-bold opacity-60">{stock.name} • NATIONAL STOCK EXCHANGE</p>
          </div>
          <div className="flex items-center gap-10 animate-in slide-in-from-right duration-700">
            <div className="text-right">
              <div className="label-mono text-muted text-[10px] mb-1 tracking-widest">REALTIME_QUOTE</div>
              <div className="text-5xl font-mono font-bold tracking-tighter text-ink transition-all duration-500">
                ₹{livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-14 h-14 flex items-center justify-center border border-line hover:bg-ink hover:text-white transition-all duration-500 rounded-full group bg-white shadow-lg"
            >
              <X size={24} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 z-10 relative">
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <IndicatorToggle label="VOL" active />
            <IndicatorToggle label="RSI" />
            <IndicatorToggle label="MACD" />
            <IndicatorToggle label="EMA_20" active />
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={candleData} barGap={0}>
              <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="#f1f1f1" />
              <XAxis dataKey="name" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <RechartsTooltip
                content={({ payload }) => {
                  if (!payload || !payload[0]) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-ink p-4 text-[10px] font-mono text-white border border-white/10 shadow-2xl skew-x-[-2deg]">
                      <div className="mb-2 text-accent italic font-black">OHLC_REPORT</div>
                      <div className="space-y-1">
                        <div className="flex justify-between gap-6"><span>OPEN:</span> <span>{d.o.toFixed(2)}</span></div>
                        <div className="flex justify-between gap-6"><span>HIGH:</span> <span>{d.h.toFixed(2)}</span></div>
                        <div className="flex justify-between gap-6"><span>LOW:</span> <span>{d.l.toFixed(2)}</span></div>
                        <div className="flex justify-between gap-6"><span>CLOSE:</span> <span className={d.c > d.o ? 'text-green-400' : 'text-red-400'}>{d.c.toFixed(2)}</span></div>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="c"
                fill="none"
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props;
                  const isUp = payload.c >= payload.o;
                  const bodyWidth = 12;
                  const centerX = x + width / 2;
                  const openY = y + (payload.c >= payload.o ? height : 0);
                  const closeY = y + (payload.c >= payload.o ? 0 : height);
                  const bodyHeight = Math.max(2, Math.abs(openY - closeY));

                  return (
                    <g>
                      {/* Wick calculation based on actual H/L data rather than fixed offsets */}
                      <line x1={centerX} y1={y + (payload.c >= payload.o ? height : 0) - (payload.h - Math.max(payload.o, payload.c)) * 2}
                        x2={centerX} y2={y + (payload.c >= payload.o ? 0 : height) + (Math.min(payload.o, payload.c) - payload.l) * 2}
                        stroke={isUp ? '#16a34a' : '#dc2626'} strokeWidth={1} />
                      <rect x={centerX - bodyWidth / 2} y={Math.min(openY, closeY)} width={bodyWidth} height={bodyHeight} fill={isUp ? '#16a34a' : '#dc2626'} />
                    </g>
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-10 grid grid-cols-4 gap-4 border-t border-line pt-10">
          <QuantMetric label="MOMENTUM_12M" value={stock.momentum} />
          <QuantMetric label="VALUATION_SCORE" value={stock.valuation} />
          <QuantMetric label="QUALITY_INDEX" value={stock.quality} />
          <QuantMetric label="COMPOSITE_V_SIGNAL" value={stock.compositeScore} />
        </div>
      </motion.div>
    </motion.div>
  );
};

const QuantMetric = ({ label, value }: any) => (
  <div className="geometric-card">
    <div className="label-mono text-[8px] text-muted mb-2 font-bold tracking-widest">{label}</div>
    <div className="flex items-baseline justify-between">
      <div className="text-2xl font-mono font-bold">{value}%</div>
      <div className={`w-1.5 h-1.5 rounded-full ${value > 70 ? 'bg-green-500 animate-pulse' : value > 50 ? 'bg-accent' : 'bg-red-400'}`} />
    </div>
  </div>
);

/* --- VORTEX AI COPILOT --- */

const VortexAICopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const askAI = async (e?: any) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsTyping(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Missing API Key");

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: `You are the Vortex AI Market Copilot. Analyze the Indian Stock Market in real-time using Google Search.
          You must answer based on the official metrics and current events.
          Specifically address aspects like:
          - Market Mood Right Now (Positive/Negative/Fearful/Greedy)
          - Stocks with good growth signals
          - Companies investing in expansion
          - Management indicating cautious outlook
          - Companies facing margin pressures
          - Companies seeing rising demand
          Be concise, use quantitative language, and maintain a professional high-tech tone.`
        }
      });

      const aiContent = response.text || "Synchronizing with global data streams... No specific delta found at this moment.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "[ERROR] UPLINK_INTERRUPTED: Check secure configuration." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-96 h-[500px] bg-ink text-white border border-white/10 shadow-3xl flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-accent/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="label-mono italic font-black text-xs tracking-widest text-accent uppercase">VORTEX_COPILOT_v2.0</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col no-scrollbar">
              {messages.length === 0 && (
                <div className="text-[11px] font-mono opacity-50 italic leading-loose text-center mt-20 px-10">
                  Welcome to the Intelligence Terminal. Ask me about margin pressures, expansion plans, or current market mood.
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 text-[11px] font-mono leading-relaxed max-w-[85%] ${m.role === 'user' ? 'bg-accent text-white italic' : 'bg-white/5 border border-white/10 text-white/90'}`}>
                    {m.content}
                  </div>
                  <span className="text-[7px] font-mono opacity-30 mt-2 uppercase tracking-widest">{m.role === 'user' ? 'OPERATOR' : 'VORTEX_CORES'}</span>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-accent label-mono text-[8px] animate-pulse">
                  SYNTHESIZING_RESPONSE...
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-black/40">
              <form onSubmit={askAI} className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="QUERY_MARKET..."
                  className="flex-1 bg-transparent border border-white/10 p-3 text-xs font-mono text-white focus:outline-none focus:border-accent transition-all placeholder:text-white/20"
                />
                <button type="submit" className="p-3 bg-accent border border-accent hover:bg-white hover:text-ink transition-all">
                  <ArrowUpRight size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-none flex items-center justify-center transition-all ${isOpen ? 'bg-white text-ink rotate-45' : 'bg-accent text-white hover:shadow-2xl hover:-translate-y-1'}`}
      >
        <Bot size={28} className={isOpen ? 'text-ink' : 'animate-bounce-slow'} />
      </button>
    </div>
  );
};

const SHAPValuesPlot = ({ selectedModel, shapData, isRunning }: { selectedModel: string; shapData: any[]; isRunning: boolean }) => {
  return (
    <div className="geometric-card relative overflow-hidden min-h-[350px]">
      {isRunning && <LoadingOverlay message="EXTRACTING SHAP VALUES" />}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-medium tracking-tight">Feature Dominance (SHAP)</h3>
          <p className="text-[10px] text-muted font-mono uppercase tracking-wider">Model Interpretation: {selectedModel.toUpperCase()} - Current Market Context</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent" />
            <span className="label-mono text-[8px]">Positive Impact</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400" />
            <span className="label-mono text-[8px]">Negative Impact</span>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={shapData}
            layout="vertical"
            margin={{ left: 40, right: 40 }}
          >
            <CartesianGrid strokeDasharray="1 1" horizontal={true} vertical={false} stroke="#E5E7EB" />
            <XAxis type="number" hide />
            <YAxis
              dataKey="feature"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#121212', fontWeight: 500 }}
              width={120}
            />
            <RechartsTooltip
              cursor={{ fill: '#F1F1EF' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-ink p-3 text-[10px] font-mono text-white border border-white/10 shadow-2xl">
                      <p className="text-accent mb-1 uppercase font-black">{data.feature}</p>
                      <p className="opacity-70">Category: {data.category}</p>
                      <p className="font-bold">Impact: {data.impact > 0 ? '+' : ''}{data.impact}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="impact"
              radius={[0, 2, 2, 0]}
              barSize={20}
            >
              {shapData.map((entry, index) => (
                <Bar
                  key={`cell-${index}`}
                  fill={entry.impact > 0 ? '#0047FF' : '#F87171'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const BacktestingModule = () => {
  const [params, setParams] = useState({
    lookback: 252,
    rebalance: 'Monthly',
    riskToggle: true
  });

  const backtestData = Array.from({ length: 50 }, (_, i) => {
    const time = i;
    const strategy = 100 + i * 1.5 + Math.sin(i * 0.5) * 5;
    const benchmark = 100 + i * 1.1 + Math.cos(i * 0.4) * 3;
    return { time, strategy, benchmark };
  });

  return (
    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-4 space-y-6">
        <div className="geometric-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-3 bg-accent" />
            <span className="label-mono tracking-[0.2em] text-accent uppercase font-black text-xs">Backtest Config</span>
          </div>

          <div className="space-y-6">
            <div>
              <label className="label-mono block mb-2 opacity-60">TEST PERIOD (DAYS)</label>
              <input
                type="number"
                value={params.lookback}
                onChange={(e) => setParams({ ...params, lookback: parseInt(e.target.value) })}
                className="w-full bg-transparent border-b border-line py-2 font-mono text-sm focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="label-mono block mb-2 opacity-60">REBALANCE FREQUENCY</label>
              <select
                value={params.rebalance}
                onChange={(e) => setParams({ ...params, rebalance: e.target.value })}
                className="w-full bg-transparent border-b border-line py-2 font-mono text-sm focus:border-accent outline-none"
              >
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="label-mono opacity-60">VOLATILITY TARGETING</span>
              <button
                onClick={() => setParams({ ...params, riskToggle: !params.riskToggle })}
                className={`w-10 h-5 rounded-full transition-colors relative ${params.riskToggle ? 'bg-accent' : 'bg-line'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${params.riskToggle ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <button className="btn-geometric w-full bg-ink text-white hover:bg-accent transition-all py-3 flex items-center justify-center gap-2 group">
              <Activity size={16} className="group-hover:animate-pulse" />
              RUN SIMULATION
            </button>
          </div>
        </div>

        <div className="geometric-card bg-bg/50">
          <div className="label-mono mb-4 text-muted">Simulation Statistics</div>
          <div className="space-y-4">
            <SimStat label="NET PROFIT" value="+28.42%" trend="pos" />
            <SimStat label="MAX DRAWDOWN" value="-8.15%" trend="neg" />
            <SimStat label="SHARPE RATIO" value="2.14" trend="pos" />
            <SimStat label="WIN RATE" value="62.4%" trend="pos" />
          </div>
        </div>
      </div>

      <div className="col-span-8 geometric-card">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-lg font-medium tracking-tight">Walk-Forward Equity Curve</h3>
            <p className="text-[10px] text-muted font-mono uppercase tracking-wider">Strategy Simulation vs NIFTY 500 Benchmark (T+1 Inference)</p>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-[2px] bg-accent" />
              <span className="label-mono text-[8px]">Vortex Strategy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-[2px] bg-muted" />
              <span className="label-mono text-[8px]">Index (NIF500)</span>
            </div>
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={backtestData}>
              <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="time" hide />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#8E8E8E' }}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-ink p-4 text-[11px] font-mono text-white border border-white/10 shadow-2xl">
                        <p className="text-accent mb-2 font-black">BACKTEST STEP: {payload[0].payload.time}</p>
                        <div className="space-y-1">
                          <p className="flex justify-between gap-8"><span>Strategy:</span> <span className="text-accent">₹{payload[0].value.toFixed(2)}</span></p>
                          <p className="flex justify-between gap-8 opacity-60"><span>Index:</span> <span>₹{payload[1].value.toFixed(2)}</span></p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="strategy"
                stroke="#0047FF"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="#8E8E8E"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const SimStat = ({ label, value, trend }: { label: string; value: string; trend: 'pos' | 'neg' }) => (
  <div className="flex justify-between items-center py-1 group border-b border-line last:border-0 pb-2 last:pb-0">
    <span className="text-[10px] font-mono text-muted group-hover:text-ink transition-colors">{label}</span>
    <span className={`text-xs font-bold font-mono ${trend === 'pos' ? 'text-green-600' : 'text-red-500'}`}>{value}</span>
  </div>
);

const AnalyticsAside = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar pb-10 h-full flex flex-col">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-4 bg-accent" />
          <span className="label-mono tracking-[0.2em] text-accent uppercase font-black text-xs">Core Model Implementation</span>
        </div>

        <div className="space-y-6">
          <FrameworkBlock
            title="LINEAR REGRESSION (BASELINE)"
            content="Role: Primary alpha benchmark. Logic: Captures linear feature-return mappings. Metric: R² across NIFTY 500 universe."
          />
          <FrameworkBlock
            title="RIDGE REGRESSION (REGULARIZED)"
            content="Focus: Stable coefficient estimation. Logic: L2 regularization shrinks feature coefficients to handle collinear market data."
          />
          <FrameworkBlock
            title="RANDOM FOREST (ENSEMBLE)"
            content="Role: Captures non-linear dynamics. Insight: Explains dominant market drivers via SHAP feature importance values."
          />
        </div>
      </section>

      <section className="space-y-4">
        <span className="label-mono block text-accent font-black uppercase tracking-widest text-[10px] mb-2">Evaluation Metrics</span>
        <div className="grid grid-cols-1 gap-4 bg-white/50 p-4 border border-line">
          <EvaluationMetric label="SHARPE RATIO" value="2.42" />
          <EvaluationMetric label="SORTINO RATIO" value="2.98" />
          <EvaluationMetric label="ANNUALIZED_ALPHA" value="12.4%" />
        </div>
      </section>

      <div className="geometric-card border-accent bg-accent/5 p-4 flex flex-col gap-3">
        <span className="label-mono text-accent uppercase tracking-widest text-[9px]">Feature Engineering Pipeline</span>
        <div className="text-[10px] font-mono leading-relaxed text-muted uppercase tracking-tight opacity-70">
          Raw NSE data transformed via Momentum, Volatility, and Risk/Beta filters. Currently processing 499 peer comparisons.
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-4 pt-10">
        <button className="w-full bg-accent text-white py-4 font-mono text-[10px] tracking-[0.3em] font-black hover:bg-ink transition-all shadow-2xl relative overflow-hidden group">
          <span className="relative z-10 text-[11px]">RETRAIN MODEL V2.4</span>
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
        </button>
        <button className="flex items-center justify-center gap-2 text-[10px] font-mono text-muted hover:text-accent transition-colors py-2 border border-line border-dashed hover:border-accent">
          <FileText size={12} />
          <span>TECHNICAL_DOCUMENTATION.PDF</span>
        </button>
        <div className="flex justify-between items-center text-[8px] font-mono text-muted uppercase tracking-widest opacity-50 px-2 mt-2">
          <span>Walk-Forward Backtesting Enabled</span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const EvaluationMetric = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center border-b border-line last:border-0 pb-2 mb-2 last:pb-0 last:mb-0">
    <span className="text-[9px] font-mono text-muted tracking-tighter">{label}</span>
    <span className="text-[11px] font-black text-ink">{value}</span>
  </div>
);

const FrameworkBlock = ({ title, content }: { title: string; content: string }) => (
  <div className="border-l-2 border-line/30 pl-4 group hover:border-accent transition-colors">
    <div className="label-mono text-[9px] text-muted mb-1.5 group-hover:text-accent transition-colors tracking-widest font-black leading-none">{title}</div>
    <div className="text-[11px] leading-relaxed font-light opacity-60 text-ink">{content}</div>
  </div>
);

const LegendItem = ({ color, label }: any) => (
  <div className="flex items-center gap-2">
    <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
    <span className="label-mono text-[8px] uppercase tracking-tighter text-muted">{label}</span>
  </div>
);

const CustomScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-ink p-3 text-[10px] font-mono text-white border border-white/10 shadow-2xl">
        <p className="text-accent mb-2 tracking-[0.2em] font-black uppercase">Inference Point</p>
        <div className="space-y-1 opacity-80">
          <p>Volatility: {payload[0].value.toFixed(2)}</p>
          <p>Predicted: {payload[1].value.toFixed(4)}</p>
        </div>
      </div>
    );
  }
  return null;
};

const ModelCard = ({ icon, title, subtitle, active, onClick, locked }: any) => (
  <button
    onClick={onClick}
    disabled={locked}
    className={`w-full flex items-center gap-4 p-4 border transition-all relative ${locked ? 'opacity-40 cursor-not-allowed bg-bg/30 border-line/50' : active ? 'border-accent bg-white shadow-xl translate-x-1 outline outline-1 outline-accent/20' : 'border-line hover:border-ink hover:bg-bg bg-transparent'}`}
  >
    <div className={`w-10 h-10 flex items-center justify-center border ${active ? 'border-accent text-accent bg-accent/5' : 'border-line text-muted bg-white'}`}>
      {icon}
    </div>
    <div className="text-left flex-1 min-w-0">
      <div className="text-[11px] font-bold leading-none mb-1 uppercase tracking-tight text-ink truncate">{title}</div>
      <div className="label-mono text-[8px] opacity-40 uppercase truncate tracking-widest">{subtitle}</div>
    </div>
    {active && (
      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
    )}
    {locked && <Lock size={12} className="text-muted/40 ml-auto" />}
  </button>
);

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <LandingPage onLaunch={() => setView('dashboard')} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <VortexDashboard onBackToLanding={() => setView('landing')} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const LandingBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden bg-transparent">
    <iframe
      src="https://my.spline.design/galaxyrollercoaster-noZmo93Bu8AML3T4vSkVGMgs/"
      className="w-full h-full border-none opacity-90 scale-105"
      title="Galaxy Rollercoaster Spline Background"
    />

    {/* Overlay to ensure readability and block iframe interactions */}
    <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none" />
  </div>
);

const LandingPage = ({ onLaunch }: { onLaunch: () => void }) => {
  return (
    <div className="min-h-screen bg-bg text-ink selection:bg-accent/10 selection:text-ink font-sans overflow-x-hidden overflow-y-auto relative no-scrollbar">
      {/* Immersive Background Layer */}
      <LandingBackground />

      {/* Top Banner Ticker */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-ink text-white py-1.5 overflow-hidden">
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
          {TOP_STOCKS.map((stock, i) => (
            <div key={i} className="flex items-center gap-3 font-mono text-[8px] tracking-widest uppercase">
              <span className="opacity-60">{stock.symbol}</span>
              <span className="font-bold">₹{stock.price.toLocaleString()}</span>
              <span className={`${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock.change >= 0 ? '▲' : '▼'} {stock.changePercent}%
              </span>
            </div>
          ))}
          {TOP_STOCKS.map((stock, i) => (
            <div key={`${i}-dup`} className="flex items-center gap-3 font-mono text-[8px] tracking-widest uppercase">
              <span className="opacity-60">{stock.symbol}</span>
              <span className="font-bold">₹{stock.price.toLocaleString()}</span>
              <span className={`${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock.change >= 0 ? '▲' : '▼'} {stock.changePercent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <main className="container mx-auto px-12 min-h-screen flex flex-col items-center justify-center relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 inline-flex items-center gap-3 px-6 py-2 border border-line bg-white shadow-sm"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="label-mono text-[10px] tracking-[0.4em] uppercase text-ink font-black">Institutional Intelligence Protocol</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-light leading-[0.9] tracking-[-0.04em] mb-10 text-ink"
        >
          ALPHA SENTIMENT <br />
          <span className="font-bold text-accent italic">PLATFORM v1.0</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="max-w-xl text-muted text-lg leading-relaxed mb-12 font-light tracking-tight px-6"
        >
          AI-driven alpha generation for professional equities. Leverage deep neural networks to decode market noise and capture systematic premium.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 relative z-50 mb-20"
        >
          <button
            onClick={onLaunch}
            className="btn-geometric px-12 py-5 text-sm flex items-center gap-4 group shadow-xl hover:shadow-accent/20"
          >
            Launch System Analysis
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
          <button className="px-12 py-5 border border-line text-ink font-mono text-xs uppercase font-bold tracking-[0.2em] hover:bg-white hover:border-ink transition-all bg-white/50 backdrop-blur-sm">
            Configuration
          </button>
        </motion.div>

        {/* Geometric Accents */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute -left-20 xl:-left-32 top-[5%] w-56 geometric-card shadow-[10px_10px_0px_0px_var(--color-line)] pointer-events-none text-left"
        >
          <div className="label-mono text-[8px] mb-4 text-accent font-black">MODEL_OUTPUT_V4</div>
          <div className="h-16 flex items-end gap-1 mb-4">
            {[30, 60, 40, 80, 50, 70].map((h, i) => (
              <div key={i} className="flex-1 bg-ink" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="text-xl font-bold tracking-tight text-ink">+24.0%</div>
          <div className="label-mono text-[8px] opacity-60 mt-1">Expected Asset Yield</div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute -right-12 bottom-[20%] w-72 geometric-card shadow-[-10px_-10px_0px_0px_var(--color-line)] pointer-events-none text-left"
        >
          <div className="flex justify-between items-center mb-6">
            <span className="label-mono text-[8px] text-accent font-black">NEURAL_CONSENSUS</span>
            <Bot size={12} className="text-muted" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-ink">Model Confidence</span>
              <span className="text-[10px] font-mono text-accent">98.4%</span>
            </div>
            <div className="h-[2px] bg-line w-full relative">
              <div className="absolute inset-0 bg-accent w-[98.4%]" />
            </div>
            <div className="text-[9px] text-muted italic">Calibrating institutional sentiment flow...</div>
          </div>
        </motion.div>
      </main>

      {/* Footer Branding */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-line py-6 px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="label-mono text-[9px] tracking-widest text-ink font-bold">VORTEX_CORE_ACTIVE</span>
        </div>
        <div className="flex items-center gap-10">
          <div className="flex flex-col items-end">
            <span className="label-mono text-[8px]">Current Handshake</span>
            <span className="text-[10px] font-bold font-mono">TLS_SECURE_1.3</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="label-mono text-[8px]">Processing Load</span>
            <span className="text-[10px] font-bold font-mono">2.4ms_LTCY</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

