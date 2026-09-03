from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict
import pandas as pd
from app.services.underwriting import UnderwritingPipeline

router = APIRouter(prefix="/underwriting", tags=["underwriting"])

# In-memory model store for demo
_model_cache = {}

class TrainRequest(BaseModel):
    records: list  # list of dicts with features + default_status

class ScoreRequest(BaseModel):
    features: Dict[str, float]

@router.post("/train")
def train_model(payload: TrainRequest):
    if not payload.records:
        raise HTTPException(status_code=400, detail="No training records")
    df = pd.DataFrame(payload.records)
    model, auc = UnderwritingPipeline.train_risk_model(df)
    _model_cache["model"] = model
    return {"auc": auc, "records": len(df)}

@router.post("/score")
def score_merchant(payload: ScoreRequest):
    model = _model_cache.get("model")
    if not model:
        raise HTTPException(status_code=400, detail="Model not trained yet")
    prob, shap_dict = UnderwritingPipeline.score_merchant_profile(model, payload.features)
    return {"default_probability": prob, "shap_values": shap_dict}
