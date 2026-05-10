import { MarketData, SectorData, NewsItem } from './types';

export const TOP_STOCKS: MarketData[] = [
  { symbol: 'RELIANCE', price: 2942.50, change: 12.40, changePercent: 0.42, volume: '4.2M', marketCap: '19.8T', sentiment: 0.8, trend: 'up' },
  { symbol: 'TCS', price: 4120.15, change: -45.20, changePercent: -1.08, volume: '1.8M', marketCap: '14.9T', sentiment: 0.2, trend: 'down' },
  { symbol: 'HDFCBANK', price: 1640.80, change: 5.60, changePercent: 0.34, volume: '12.4M', marketCap: '12.4T', sentiment: 0.5, trend: 'up' },
  { symbol: 'INFY', price: 1892.40, change: 28.15, changePercent: 1.51, volume: '3.1M', marketCap: '7.8T', sentiment: 0.9, trend: 'up' },
  { symbol: 'ICICIBANK', price: 1105.30, change: -2.40, changePercent: -0.22, volume: '8.9M', marketCap: '7.7T', sentiment: 0.4, trend: 'neutral' },
];

export const SECTORS: SectorData[] = [
  { name: 'Nifty IT', change: 1.25, stocks: [] },
  { name: 'Nifty Bank', change: -0.45, stocks: [] },
  { name: 'Nifty Auto', change: 0.82, stocks: [] },
  { name: 'Nifty Pharma', change: 2.14, stocks: [] },
  { name: 'Nifty FMCG', change: -0.12, stocks: [] },
];

export const NEWS_FEED: NewsItem[] = [
  { id: '1', title: 'Nifty 50 approaches all-time highs as global markets rally', source: 'Economic Times', time: '10m ago', sentiment: 'positive', impact: 'high' },
  { id: '2', title: 'TCS reports lower than expected Q4 margins, stock slips 2%', source: 'Reuters', time: '25m ago', sentiment: 'negative', impact: 'high' },
  { id: '3', title: 'RBI maintains status quo on repo rates: Market implications', source: 'LiveMint', time: '1h ago', sentiment: 'neutral', impact: 'medium' },
  { id: '4', title: 'Reliance Retail aggressive expansion plans boost confidence', source: 'Bloomberg', time: '2h ago', sentiment: 'positive', impact: 'medium' },
];

export interface Nifty500Stock {
  symbol: string;
  name: string;
  price: number;
  momentum: number;
  valuation: number;
  quality: number;
  compositeScore: number;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  // New Quantitative fields
  momentum12_1: number;
  relVol: number;
  rsiMonthly: number;
  bbBandwidth: number;
  marketBeta: number;
  index: number; // 50, 100, 200, 500
}

export const NIFTY_500_STOCKS: Nifty500Stock[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2942.50, momentum: 85, valuation: 62, quality: 78, compositeScore: 75, signal: 'BUY', momentum12_1: 12.5, relVol: 1.2, rsiMonthly: 64, bbBandwidth: 15, marketBeta: 1.05, index: 50 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4120.15, momentum: 42, valuation: 75, quality: 92, compositeScore: 68, signal: 'NEUTRAL', momentum12_1: 5.2, relVol: 0.8, rsiMonthly: 48, bbBandwidth: 12, marketBeta: 0.85, index: 50 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1640.80, momentum: 58, valuation: 82, quality: 85, compositeScore: 74, signal: 'BUY', momentum12_1: 8.4, relVol: 1.1, rsiMonthly: 55, bbBandwidth: 18, marketBeta: 1.10, index: 50 },
  { symbol: 'INFY', name: 'Infosys Ltd', price: 1892.40, momentum: 91, valuation: 55, quality: 88, compositeScore: 78, signal: 'BUY', momentum12_1: 15.1, relVol: 1.5, rsiMonthly: 68, bbBandwidth: 22, marketBeta: 1.15, index: 50 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', price: 1105.30, momentum: 65, valuation: 70, quality: 82, compositeScore: 72, signal: 'BUY', momentum12_1: 9.2, relVol: 0.9, rsiMonthly: 58, bbBandwidth: 14, marketBeta: 1.08, index: 50 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', price: 1210.45, momentum: 78, valuation: 45, quality: 65, compositeScore: 62, signal: 'NEUTRAL', momentum12_1: 10.5, relVol: 1.3, rsiMonthly: 60, bbBandwidth: 25, marketBeta: 0.95, index: 100 },
  { symbol: 'SBI', name: 'State Bank of India', price: 782.15, momentum: 88, valuation: 80, quality: 60, compositeScore: 76, signal: 'BUY', momentum12_1: 14.8, relVol: 1.8, rsiMonthly: 72, bbBandwidth: 30, marketBeta: 1.45, index: 100 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', price: 6845.00, momentum: 35, valuation: 40, quality: 85, compositeScore: 52, signal: 'SELL', momentum12_1: -2.1, relVol: 0.7, rsiMonthly: 38, bbBandwidth: 35, marketBeta: 1.55, index: 100 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', price: 2840.50, momentum: 45, valuation: 35, quality: 90, compositeScore: 55, signal: 'NEUTRAL', momentum12_1: 1.5, relVol: 0.6, rsiMonthly: 42, bbBandwidth: 10, marketBeta: 0.75, index: 100 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', price: 2350.25, momentum: 52, valuation: 50, quality: 95, compositeScore: 64, signal: 'NEUTRAL', momentum12_1: 3.2, relVol: 0.5, rsiMonthly: 45, bbBandwidth: 8, marketBeta: 0.65, index: 100 },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd', price: 3450.80, momentum: 82, valuation: 55, quality: 75, compositeScore: 70, signal: 'BUY', momentum12_1: 11.2, relVol: 1.4, rsiMonthly: 62, bbBandwidth: 20, marketBeta: 1.20, index: 200 },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd', price: 1045.30, momentum: 60, valuation: 72, quality: 70, compositeScore: 67, signal: 'NEUTRAL', momentum12_1: 7.5, relVol: 1.0, rsiMonthly: 52, bbBandwidth: 22, marketBeta: 1.12, index: 200 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1780.45, momentum: 38, valuation: 65, quality: 82, compositeScore: 60, signal: 'NEUTRAL', momentum12_1: 2.1, relVol: 0.9, rsiMonthly: 45, bbBandwidth: 15, marketBeta: 0.90, index: 200 },
  { symbol: 'ITC', name: 'ITC Ltd', price: 425.15, momentum: 70, valuation: 85, quality: 88, compositeScore: 81, signal: 'BUY', momentum12_1: 9.8, relVol: 1.7, rsiMonthly: 65, bbBandwidth: 12, marketBeta: 0.70, index: 200 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd', price: 3120.50, momentum: 95, valuation: 20, quality: 45, compositeScore: 53, signal: 'NEUTRAL', momentum12_1: 25.5, relVol: 2.5, rsiMonthly: 78, bbBandwidth: 65, marketBeta: 2.10, index: 500 },
  { symbol: 'DLF', name: 'DLF Limited', price: 920.40, momentum: 75, valuation: 30, quality: 55, compositeScore: 58, signal: 'BUY', momentum12_1: 18.2, relVol: 2.1, rsiMonthly: 72, bbBandwidth: 45, marketBeta: 1.80, index: 500 },
  { symbol: 'ZOMATO', name: 'Zomato Ltd', price: 185.30, momentum: 98, valuation: 10, quality: 40, compositeScore: 62, signal: 'BUY', momentum12_1: 45.1, relVol: 3.5, rsiMonthly: 82, bbBandwidth: 55, marketBeta: 2.50, index: 500 },
  { symbol: 'JIOFIN', name: 'Jio Financial Services', price: 345.15, momentum: 88, valuation: 25, quality: 60, compositeScore: 65, signal: 'BUY', momentum12_1: 22.4, relVol: 2.8, rsiMonthly: 75, bbBandwidth: 40, marketBeta: 1.95, index: 500 },
  { symbol: 'POLYCAB', name: 'Polycab India Ltd', price: 5420.00, momentum: 72, valuation: 45, quality: 80, compositeScore: 71, signal: 'BUY', momentum12_1: 15.5, relVol: 1.5, rsiMonthly: 64, bbBandwidth: 28, marketBeta: 1.15, index: 500 },
  { symbol: 'TITAN', name: 'Titan Company Ltd', price: 3620.45, momentum: 55, valuation: 38, quality: 92, compositeScore: 62, signal: 'NEUTRAL', momentum12_1: 8.2, relVol: 1.1, rsiMonthly: 58, bbBandwidth: 20, marketBeta: 1.02, index: 50 },
];
