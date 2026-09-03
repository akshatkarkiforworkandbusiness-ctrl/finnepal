import numpy as np
import pandas as pd
from app.services.underwriting import UnderwritingPipeline

def generate_mock_dataset(n=500, seed=42):
    np.random.seed(seed)
    # Correlated synthetic data to ensure AUC >=0.70
    monthly_revenue_avg = np.random.normal(200000, 50000, n)
    monthly_volatility = np.random.uniform(0.05, 0.4, n)
    expense_ratio = np.random.uniform(0.3, 0.9, n)
    reconciliation_rate = np.random.uniform(0.5, 1.0, n)
    outstanding_debt = np.random.normal(50000, 20000, n)
    # Logit with strong correlation: high debt, high volatility, high expense_ratio increase default; high revenue, high reconciliation decrease default
    logit = (
        -3.0
        + 0.00001 * outstanding_debt
        + 3.0 * monthly_volatility
        + 2.5 * expense_ratio
        - 2.0 * reconciliation_rate
        - 0.000005 * monthly_revenue_avg
    )
    prob = 1 / (1 + np.exp(-logit))
    default_status = (np.random.rand(n) < prob).astype(int)
    df = pd.DataFrame({
        "monthly_revenue_avg": monthly_revenue_avg,
        "monthly_volatility": monthly_volatility,
        "expense_ratio": expense_ratio,
        "reconciliation_rate": reconciliation_rate,
        "outstanding_debt": outstanding_debt,
        "default_status": default_status,
    })
    return df

def test_train_and_auc_threshold():
    df = generate_mock_dataset(500)
    model, auc = UnderwritingPipeline.train_risk_model(df)
    print(f"AUC: {auc}")
    assert auc >= 0.70, f"AUC {auc} below 0.70 threshold"
    assert model is not None

def test_shap_output_integrity():
    df = generate_mock_dataset(500)
    model, auc = UnderwritingPipeline.train_risk_model(df)
    feature_vector = {
        "monthly_revenue_avg": 200000.0,
        "monthly_volatility": 0.2,
        "expense_ratio": 0.6,
        "reconciliation_rate": 0.85,
        "outstanding_debt": 40000.0,
    }
    prob, shap_dict = UnderwritingPipeline.score_merchant_profile(model, feature_vector)
    assert 0.0 <= prob <= 1.0
    assert isinstance(shap_dict, dict)
    expected_keys = {"monthly_revenue_avg", "monthly_volatility", "expense_ratio", "reconciliation_rate", "outstanding_debt"}
    assert set(shap_dict.keys()) == expected_keys
    for k, v in shap_dict.items():
        assert isinstance(v, float)
        assert not np.isnan(v)
    # SHAP values should sum roughly to log-odds offset; just check non-zero variation
    assert len(set(round(v, 4) for v in shap_dict.values())) > 1

def test_score_consistency():
    df = generate_mock_dataset(500, seed=99)
    model, _ = UnderwritingPipeline.train_risk_model(df)
    vec_high_risk = {
        "monthly_revenue_avg": 100000.0,
        "monthly_volatility": 0.35,
        "expense_ratio": 0.85,
        "reconciliation_rate": 0.55,
        "outstanding_debt": 90000.0,
    }
    vec_low_risk = {
        "monthly_revenue_avg": 300000.0,
        "monthly_volatility": 0.08,
        "expense_ratio": 0.35,
        "reconciliation_rate": 0.95,
        "outstanding_debt": 10000.0,
    }
    prob_high, _ = UnderwritingPipeline.score_merchant_profile(model, vec_high_risk)
    prob_low, _ = UnderwritingPipeline.score_merchant_profile(model, vec_low_risk)
    # Higher risk vector should have higher default probability
    assert prob_high > prob_low, f"Expected high risk prob {prob_high} > low {prob_low}"
