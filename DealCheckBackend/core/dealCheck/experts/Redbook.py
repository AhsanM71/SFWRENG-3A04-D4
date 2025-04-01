from __future__ import annotations
from core.blackboard.expert.Expert import Expert
from core.dealCheck.data.DealCheckData import DealCheckData
import pandas as pd
import re

class Redbook(Expert[DealCheckData]):
    def __init__(self):
        pass
    
    async def evaluateRequest(self, request: DealCheckData) -> DealCheckData:
        df = pd.read_csv("../DealCheckBackend/core/dealCheck/experts/Corpus/redbook.csv")
        description = request.getDescription()
        
        patterns = {
        "engine_volume": r"(\d+(\.\d+)?)L",
        "cylinders": r"(\d+)-cylinder",
        "transmission": r"\b(automatic|manual|tiptronic|variator)\b", 
        "fuel_type": r"\b(petrol|diesel|lpg|cng)\b",
        "leather_seats": r"\bleather seats\b"
        }
        
        extracted_features = {}
        for key, pattern in patterns.items():
            match = re.search(pattern, description, re.IGNORECASE)
            if match:
                extracted_features[key] = match.group(1) if key != "leather_seats" else True
            else:
                if key == "leather_seats":
                    extracted_features[key] = False
                elif key == "fuel_type":
                    extracted_features[key] = "petrol"  # Default fuel type
                elif key == "engine_volume":
                    extracted_features[key] = "0.0"  # Default engine volume
                elif key == "cylinders":
                    extracted_features[key] = "0"  # Default cylinders
                elif key == "transmission":
                    extracted_features[key] = "manual"  # Default transmission type
        filters = {
            "Manufacturer": request.getCar().getMake(),
            "Model": request.getCar().getModel(),
            "Prod. year": request.getCar().getYear(),
            "Mileage": request.getCar().getMileage(),
            "Fuel type": extracted_features["fuel_type"],
            "Engine volume": extracted_features["engine_volume"],
            "Cylinders": extracted_features["cylinders"][0],
            "Leather interior": "Yes" if extracted_features["leather_seats"] else "No",
            "Gear box type": extracted_features["transmission"]
        }
        df = df.astype(str)
        
        filtered_df = df[
            (df["Manufacturer"].str.lower() == filters["Manufacturer"].lower()) &
            (df["Model"].str.lower() == filters["Model"].lower()) &
            (df["Prod. year"].astype(int) >= filters["Prod. year"] - 1) &
            (df["Prod. year"].astype(int) <= filters["Prod. year"] + 1) &
            (df["Fuel type"].str.lower() == filters["Fuel type"].lower()) &
            (df["Engine volume"].str.contains(filters["Engine volume"], na=False)) &
            (df["Cylinders"].astype(float) == float(filters["Cylinders"])) &
            (df["Leather interior"].str.lower() == filters["Leather interior"].lower()) &
            (df["Gear box type"].str.lower() == filters["Gear box type"].lower())
        ]

        # If no exact match, allow more flexibility (e.g., ignoring leather interior or gearbox type)
        if filtered_df.empty:
            filtered_df = df[
                (df["Manufacturer"].str.lower() == filters["Manufacturer"].lower()) &
                (df["Model"].str.lower() == filters["Model"].lower()) &
                (df["Prod. year"].astype(int) >= filters["Prod. year"] - 1) &
                (df["Prod. year"].astype(int) <= filters["Prod. year"] + 1) &
                (df["Fuel type"].str.lower() == filters["Fuel type"].lower()) &
                (df["Engine volume"].str.contains(filters["Engine volume"], na=False))
            ]
        
        if not filtered_df.empty:
            best_match = filtered_df.iloc[0]
            price = best_match["Price"]

            # Extract numeric mileage
            mileage_str = best_match["Mileage"]
            mileage = float(re.sub(r"[^\d.]", "", mileage_str))  # Remove non-numeric characters

            matching_attributes = sum([
                best_match["Manufacturer"].lower() == filters["Manufacturer"].lower(),
                best_match["Model"].lower() == filters["Model"].lower(),
                abs(int(best_match["Prod. year"]) - filters["Prod. year"]) <= 1,
                abs(mileage - filters["Mileage"]) <= 5000,  # Use numeric mileage here
                best_match["Fuel type"].lower() == filters["Fuel type"].lower(),
                best_match["Engine volume"] in filters["Engine volume"],
                float(best_match["Cylinders"]) == float(filters["Cylinders"]),
                best_match["Leather interior"].lower() == filters["Leather interior"].lower(),
                best_match["Gear box type"].lower() == filters["Gear box type"].lower()
            ])
            confidence = matching_attributes / 9
            request.setConfidence(confidence)

            # print(f"Confidence: {confidence * 100:.2f}%")
            # print(f"Closest match found: {best_match['Manufacturer']} {best_match['Model']} ({best_match['Prod. year']})")
            # print(f"Price: ${price}")
            if request.getPrice() <= float(price) * 1.05:
                request.setActual("Yes")
            else:
                request.setActual("No")
            
        else:
            print("No similar car found in the dataset.")
        return request