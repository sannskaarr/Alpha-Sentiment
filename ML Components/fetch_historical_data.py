import pandas as pd
import numpy as np
import time

def fetch_nifty500_data(output_file='nifty500_historical.csv'):
    """
    Simulates fetching historical OHLCV data from an API like yfinance
    and saving it directly to a CSV file.
    """
    print("==================================================")
    print("INITIALIZING DATA PIPELINE (yfinance Simulation)")
    print("==================================================")
    time.sleep(1)
    
    # Generate 500 synthetic tickers to represent NIFTY 500
    tickers = [f"NIFTY_{i}.NS" for i in range(1, 501)]
    print(f"Fetching historical OHLCV data for {len(tickers)} equities...")
    
    all_data = []
    
    # Simulate a loop over the tickers, fetching 1 year of daily data (252 days)
    for i, ticker in enumerate(tickers):
        if i > 0 and i % 100 == 0:
            print(f"[{i}/{len(tickers)}] Packets received and processed...")
            time.sleep(0.5) # Simulate network delay
            
        days = 252
        dates = pd.date_range(end=pd.Timestamp.today(), periods=days, freq='B')
        
        # Simulate price paths using random walk
        start_price = np.random.uniform(100, 5000)
        returns = np.random.normal(0.0005, 0.02, days)
        prices = start_price * np.exp(np.cumsum(returns))
        
        # Add OHLC noise
        highs = prices * (1 + np.abs(np.random.normal(0, 0.01, days)))
        lows = prices * (1 - np.abs(np.random.normal(0, 0.01, days)))
        opens = prices * (1 + np.random.normal(0, 0.005, days))
        volumes = np.random.randint(10000, 5000000, days)
        
        df = pd.DataFrame({
            'Date': dates,
            'Ticker': ticker,
            'Open': opens.round(2),
            'High': highs.round(2),
            'Low': lows.round(2),
            'Close': prices.round(2),
            'Volume': volumes
        })
        all_data.append(df)
        
    final_df = pd.concat(all_data, ignore_index=True)
    print("Data compilation complete.")
    
    print(f"Saving compiled dataset to '{output_file}'...")
    final_df.to_csv(output_file, index=False)
    print(f"Done. Successfully saved {len(final_df)} rows of data.")

if __name__ == "__main__":
    fetch_nifty500_data()
