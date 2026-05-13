import pandas as pd
import yfinance as yf
import ssl
import warnings

# Bypass SSL errors and suppress warnings for cleaner output
ssl._create_default_https_context = ssl._create_unverified_context
warnings.filterwarnings('ignore')

def fetch_5y_performance():
    print("==================================================")
    print("NIFTY 500: 5-YEAR PERFORMANCE FETCH (yfinance)")
    print("==================================================")
    
    # Dictionary mapping ticker to its proper company name
    # We include a broad set of 40 prominent Nifty 500 constituents here.
    # You can expand this to the full 500 tickers as needed.
    nifty_stocks = {
        "RELIANCE.NS": "Reliance Industries Limited",
        "TCS.NS": "Tata Consultancy Services Limited",
        "HDFCBANK.NS": "HDFC Bank Limited",
        "INFY.NS": "Infosys Limited",
        "ICICIBANK.NS": "ICICI Bank Limited",
        "HINDUNILVR.NS": "Hindustan Unilever Limited",
        "SBIN.NS": "State Bank of India",
        "BAJFINANCE.NS": "Bajaj Finance Limited",
        "BHARTIARTL.NS": "Bharti Airtel Limited",
        "ITC.NS": "ITC Limited",
        "KOTAKBANK.NS": "Kotak Mahindra Bank Limited",
        "LT.NS": "Larsen & Toubro Limited",
        "HCLTECH.NS": "HCL Technologies Limited",
        "ASIANPAINT.NS": "Asian Paints Limited",
        "AXISBANK.NS": "Axis Bank Limited",
        "MARUTI.NS": "Maruti Suzuki India Limited",
        "SUNPHARMA.NS": "Sun Pharmaceutical Industries Limited",
        "TITAN.NS": "Titan Company Limited",
        "ULTRACEMCO.NS": "UltraTech Cement Limited",
        "WIPRO.NS": "Wipro Limited",
        "TATASTEEL.NS": "Tata Steel Limited",
        "ONGC.NS": "Oil & Natural Gas Corporation Limited",
        "POWERGRID.NS": "Power Grid Corporation of India Limited",
        "NTPC.NS": "NTPC Limited",
        "M&M.NS": "Mahindra & Mahindra Limited",
        "TECHM.NS": "Tech Mahindra Limited",
        "ADANIENT.NS": "Adani Enterprises Limited",
        "ADANIPORTS.NS": "Adani Ports and Special Economic Zone",
        "HINDALCO.NS": "Hindalco Industries Limited",
        "TATACOMM.NS": "Tata Communications Limited",
        "ZOMATO.NS": "Zomato Limited",
        "NYKAA.NS": "FSN E-Commerce Ventures (Nykaa)",
        "PAYTM.NS": "One97 Communications (Paytm)",
        "TRENT.NS": "Trent Limited",
        "DMART.NS": "Avenue Supermarts Limited",
        "HAL.NS": "Hindustan Aeronautics Limited",
        "BEL.NS": "Bharat Electronics Limited",
        "IRCTC.NS": "Indian Railway Catering and Tourism",
        "BHEL.NS": "Bharat Heavy Electricals Limited",
        "COALINDIA.NS": "Coal India Limited"
    }
    
    tickers = list(nifty_stocks.keys())
    print(f"Fetching 5-year historical data for {len(tickers)} Prominent Nifty 500 Equities...\n")
    
    # Download 5 years of data
    try:
        data = yf.download(tickers, period="5y", group_by="ticker", auto_adjust=True, progress=True)
    except Exception as e:
        print(f"Failed to fetch data from yfinance: {e}")
        return

    results = []
    
    print("\nCalculating performance over the last 5 years...")
    for ticker in tickers:
        try:
            if len(tickers) == 1:
                stock_data = data.dropna()
            else:
                stock_data = data[ticker].dropna()
                
            if len(stock_data) == 0:
                print(f"No valid data found for {ticker}")
                continue
                
            start_price = float(stock_data['Close'].iloc[0])
            end_price = float(stock_data['Close'].iloc[-1])
            perf_pct = ((end_price - start_price) / start_price) * 100
            
            results.append({
                'Ticker': ticker,
                'Company_Name': nifty_stocks[ticker],
                'Start_Price_5y_Ago': round(start_price, 2),
                'Current_Price': round(end_price, 2),
                'Performance_5y_%': round(perf_pct, 2)
            })
            
        except Exception as e:
            # Catching internal pandas indexing errors for missing tickers
            pass
            
    df = pd.DataFrame(results)
    
    if len(df) > 0:
        # Sort by performance descending
        df = df.sort_values(by='Performance_5y_%', ascending=False)
        
        output_file = 'nifty500_5y_performance.csv'
        df.to_csv(output_file, index=False)
        
        print("\n==================================================")
        print(f"Fetch complete! Saved {len(df)} records to '{output_file}'")
        print("==================================================")
        print("\nTop 5 Performers (Last 5 Years):")
        print(df.head(5).to_string(index=False))
        
        print("\nBottom 5 Performers (Last 5 Years):")
        print(df.tail(5).to_string(index=False))
    else:
        print("No valid data processed. Please check your internet connection and yfinance limits.")

if __name__ == "__main__":
    fetch_5y_performance()
