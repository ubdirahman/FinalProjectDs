import math
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

MODEL_PATH = "house_price_model.pkl"

# Load model (no numpy._core hacking)
model = joblib.load(MODEL_PATH)

FEATURES = list(model.feature_names_in_)
# Expected 12:
# ['Size_sqft','Bedrooms','Bathrooms','YearBuilt','Location_City','Location_Rural','Location_Suburb',
#  'HouseAge','Rooms_per_1000sqft','Size_per_Bedroom','Is_City','LogPrice']

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


def solve_price_from_log_feature(base, coef_log, max_iter=50):
    """
    Solve: y = base + coef_log * log(y)  (y > 0)
    Newton method
    """
    y = max(base, 1.0)

    for _ in range(max_iter):
        f = y - coef_log * math.log(y) - base
        fp = 1.0 - (coef_log / y)

        if abs(fp) < 1e-9:
            break

        y_new = y - (f / fp)
        if y_new <= 0:
            y_new = y * 0.5

        if abs(y_new - y) < 1e-6:
            y = y_new
            break

        y = y_new

    return float(y)


@app.get("/health")
def health():
    return jsonify({"status": "ok", "expected_features": FEATURES})


@app.post("/predict")
def predict():
    data = request.get_json(silent=True) or {}

    try:
        size_sqft = float(data["size_sqft"])
        bedrooms = float(data["bedrooms"])
        bathrooms = float(data["bathrooms"])
        year_built = float(data["year_built"])
        location = str(data["location"]).strip().lower()
    except Exception:
        return jsonify({
            "error": "Missing/invalid fields. Required: size_sqft, bedrooms, bathrooms, year_built, location"
        }), 400

    # Derived features
    current_year = 2026
    house_age = max(current_year - year_built, 0)

    size_per_bedroom = size_sqft / bedrooms if bedrooms > 0 else size_sqft
    rooms_per_1000 = (bedrooms + bathrooms) / \
        (size_sqft / 1000.0) if size_sqft > 0 else 0.0

    loc_city = 1.0 if location == "city" else 0.0
    loc_rural = 1.0 if location == "rural" else 0.0
    loc_suburb = 1.0 if location == "suburb" else 0.0
    is_city = loc_city

    x_no_log = {
        "Size_sqft": size_sqft,
        "Bedrooms": bedrooms,
        "Bathrooms": bathrooms,
        "YearBuilt": year_built,
        "Location_City": loc_city,
        "Location_Rural": loc_rural,
        "Location_Suburb": loc_suburb,
        "HouseAge": house_age,
        "Rooms_per_1000sqft": rooms_per_1000,
        "Size_per_Bedroom": size_per_bedroom,
        "Is_City": is_city,
    }

    coefs = dict(zip(FEATURES, model.coef_))
    intercept = float(model.intercept_)
    coef_log = float(coefs["LogPrice"])

    base = intercept + sum(float(coefs[k]) * float(v)
                           for k, v in x_no_log.items())

    predicted_price = solve_price_from_log_feature(base, coef_log)

    return jsonify({
        "predicted_price": predicted_price,
        "inputs_used": x_no_log,
        "note": "Using your trained model. LogPrice handled internally."
    })


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
