import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_squared_error

def generate_market_data(n_samples=500):
    np.random.seed(42)
    data = {
        'Momentum_12M': np.random.normal(10, 15, n_samples),
        'Volatility_30D': np.random.normal(20, 5, n_samples),
        'Market_Beta': np.random.normal(1.0, 0.3, n_samples),
        'RSI_14D': np.random.uniform(20, 80, n_samples),
        'Valuation_Score': np.random.uniform(0, 100, n_samples),
        'Quality_Index': np.random.uniform(0, 100, n_samples),
    }
    df = pd.DataFrame(data)
    df['Forward_Return'] = (
        0.35 * df['Momentum_12M'] -
        0.20 * df['Volatility_30D'] +
        0.10 * df['Valuation_Score'] +
        0.15 * df['Quality_Index'] +
        np.random.normal(0, 5, n_samples)
    )
    return df

def run_ridge_regression():
    print("==================================================")
    print("VORTEX CORE: RUNNING RIDGE REGRESSION TEST...")
    print("==================================================\n")
    
    df = generate_market_data()
    features = ['Momentum_12M', 'Volatility_30D', 'Market_Beta', 'RSI_14D', 'Valuation_Score', 'Quality_Index']
    X = df[features]
    y = df['Forward_Return']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    ridge = Ridge(alpha=1.0)
    ridge.fit(X_train_scaled, y_train)
    ridge_preds = ridge.predict(X_test_scaled)
    
    print(f"-> R² Score: {r2_score(y_test, ridge_preds):.4f}")
    print(f"-> MSE:      {mean_squared_error(y_test, ridge_preds):.4f}\n")
    print("RIDGE REGRESSION TEST COMPLETE.")

if __name__ == "__main__":
    run_ridge_regression()
