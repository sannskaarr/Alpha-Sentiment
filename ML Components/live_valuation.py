import time
import random
import numpy as np
from sklearn.ensemble import RandomForestRegressor

def load_pretrained_model():
    """
    Simulates loading a pre-trained ML model from disk (e.g., joblib/pickle)
    to perform live market inferences.
    """
    print("Loading VORTEX CORE Random Forest Model from local cache...")
    # Generate a lightweight dummy model for the simulation
    X_dummy = np.random.rand(100, 6)
    y_dummy = np.random.normal(0, 5, 100)
    rf = RandomForestRegressor(n_estimators=10, random_state=42)
    rf.fit(X_dummy, y_dummy)
    return rf

def simulate_broker_api_stream():
    """
    Simulates a live WebSocket connection to a broker like Zerodha Kite Connect.
    It streams live ticks and feeds them into our pre-trained ML model for valuation.
    """
    tickers = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "ITC", "SBIN"]
    
    print("==================================================")
    print("INITIALIZING KITE CONNECT API (ZERODHA SIMULATION)")
    print("==================================================")
    print("Authenticating with API Key/Secret...")
    time.sleep(1.5)
    print("Connected to WebSocket: wss://ws.kite.trade/")
    print("Subscribing to live Orderbook and Ticks for key NIFTY Equities...\n")
    
    model = load_pretrained_model()
    
    try:
        print("\nStreaming Live Market Data... (Press Ctrl+C to stop)\n")
        # Infinite loop to simulate live market ticks
        for tick in range(1, 16): # Loop 15 times for demonstration
            time.sleep(1.5) # Simulate time between live ticks
            
            symbol = random.choice(tickers)
            live_price = round(random.uniform(500, 4000), 2)
            
            # Simulate real-time feature extraction based on the latest tick
            live_features = np.array([[
                np.random.normal(10, 5),    # Momentum_12M
                np.random.normal(20, 2),    # Volatility_30D
                np.random.normal(1.0, 0.1), # Market_Beta
                np.random.uniform(30, 70),  # RSI_14D
                np.random.uniform(40, 80),  # Valuation_Score
                np.random.uniform(50, 90)   # Quality_Index
            ]])
            
            # ML Valuation Pipeline
            predicted_forward_alpha = model.predict(live_features)[0]
            
            # Trading Logic based on the Model
            if predicted_forward_alpha > 2.0:
                action = "BUY "
            elif predicted_forward_alpha < -2.0:
                action = "SELL"
            else:
                action = "HOLD"
                
            confidence = round(random.uniform(70, 98), 1)
            
            print(f"[LIVE TICK {tick:02d}] {symbol:<10} @ ₹{live_price:<7.2f}")
            print(f"  -> Features Computed: RSI={live_features[0][3]:.1f}, Volatility={live_features[0][1]:.1f}")
            
            # Color coding the output action
            if action == "BUY ":
                signal_color = "\033[92m" # Green
            elif action == "SELL":
                signal_color = "\033[91m" # Red
            else:
                signal_color = "\033[93m" # Yellow
                
            end_color = "\033[0m"
            
            print(f"  -> VORTEX SIGNAL:     [{signal_color}{action}{end_color}] (Forward Alpha: {predicted_forward_alpha:+.2f}%) | Model Confidence: {confidence}%")
            print("-" * 75)
            
    except KeyboardInterrupt:
        print("\n[!] Live stream disconnected by user. Shutting down securely.")

if __name__ == "__main__":
    simulate_broker_api_stream()
