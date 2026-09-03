import numpy as np
import pandas as pd
import lightgbm as lgb
import shap
from typing import Tuple, Dict

class UnderwritingPipeline:

    @classmethod
    def train_risk_model(cls, training_df: pd.DataFrame) -> Tuple[lgb.LGBMClassifier, float]:
        features = [
            "monthly_revenue_avg",
            "monthly_volatility",
            "expense_ratio",
            "reconciliation_rate",
            "outstanding_debt"
        ]
        X = training_df[features]
        y = training_df["default_status"]
        model = lgb.LGBMClassifier(
            objective="binary",
            boosting_type="gbdt",
            metric="auc",
            n_estimators=1500,
            learning_rate=0.03,
            num_leaves=63,
            max_depth=8,
            is_unbalance=True,
            random_state=42,
            n_jobs=-1,
            verbose=-1
        )
        model.fit(X, y)
        train_preds = model.predict_proba(X)[:, 1]
        from sklearn.metrics import roc_auc_score
        auc = roc_auc_score(y, train_preds)
        return model, auc

    @classmethod
    def score_merchant_profile(cls, model: lgb.LGBMClassifier, feature_vector: Dict[str, float]) -> Tuple[float, Dict[str, float]]:
        df_vec = pd.DataFrame([feature_vector])
        default_probability = float(model.predict_proba(df_vec)[0][1])
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(df_vec)
        shap_dict = {}
        features_list = list(df_vec.columns)
        # Handle binary classification output formats across shap versions
        if isinstance(shap_values, list):
            # list of arrays per class
            values = shap_values[1][0] if len(shap_values) > 1 else shap_values[0][0]
        elif isinstance(shap_values, np.ndarray) and shap_values.ndim == 3:
            # newer shap returns (1, n_features, n_classes) or (n_samples, n_features, n_classes)
            values = shap_values[0, :, 1] if shap_values.shape[2] > 1 else shap_values[0]
        elif isinstance(shap_values, np.ndarray) and shap_values.ndim == 2:
            values = shap_values[0]
        else:
            # fallback
            values = np.array(shap_values).flatten()[:len(features_list)]
        for idx, col in enumerate(features_list):
            shap_dict[col] = float(values[idx])
        return default_probability, shap_dict
