export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  sentiment: number; // -1 to 1
  trend: 'up' | 'down' | 'neutral';
}

export interface SectorData {
  name: string;
  change: number;
  stocks: MarketData[];
}

export interface TechnicalIndicator {
  name: string;
  value: string;
  signal: 'Buy' | 'Sell' | 'Neutral';
  color: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
}
