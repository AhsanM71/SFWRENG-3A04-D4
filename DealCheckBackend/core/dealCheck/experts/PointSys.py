from __future__ import annotations
from core.blackboard.expert.Expert import Expert
from core.dealCheck.data.DealCheckData import DealCheckData
import re

class PointSys(Expert[DealCheckData]):
    async def evaluateRequest(self, request: DealCheckData) -> DealCheckData:
        self.queue.append(request)
        id: int = len(self.queue) - 1
        return await self._processRequest(id=id)

    def process_request(self, id: str) -> DealCheckData:
        request: DealCheckData = self.queue[id]
        del self.queue[id]

        car = request.getCar()

        # Extract car details directly from the `DealCheckData` object
        make = car.getMake()
        model = car.getModel()
        year = car.getYear()
        mileage = car.getMileage()
        condition = car.getCondition()
        accident_history = car.getAccidentHistory()
        previous_owners = car.getPreviousOwners()

        seller_type = request.getSellerType()
        inspection_status = request.getInspectionCompleted()

        # Extract additional info
        fuel_efficiency = request.getfuelEfficiencyMpg()
        insurance_estimate = request.getInsuranceEstimate()

        # Prepare filters
        filters = {
            "Prod. year": year,
            "Mileage": mileage,
            "Condition": condition,
            "Previous Owners": previous_owners,
            "Seller Type": seller_type,
            "Accident History": accident_history,
            "Inspection Completed": inspection_status,
            "Fuel Efficiency": fuel_efficiency,
            "Insurance Estimate": insurance_estimate,
        }

        total_fields = len(filters)
        successfully_extracted = 0
        score = 0

        # Process each field and affect the score

        # Process the production year
        try:
            score += max(0, 2025 - int(filters["Prod. year"]))  # Assuming the target year is 2025
            successfully_extracted += 1
        except:
            pass

        # Process mileage
        try:
            score += max(0, 50_000 - int(filters["Mileage"])) // 1_000  # Rewarding lower mileage
            successfully_extracted += 1
        except:
            pass

        # Process condition (if it's "Used", "New", or "Salvage")
        if filters["Condition"].lower() == "new":
            score += 10
            successfully_extracted += 1
        elif filters["Condition"].lower() == "used":
            score += 5
            successfully_extracted += 1
        elif filters["Condition"].lower() == "salvage":
            score -= 5
            successfully_extracted += 1

        # Process previous owners (rewarding fewer previous owners)
        try:
            score += max(0, 3 - int(filters["Previous Owners"])) * 5  # Rewarding for fewer owners (lower number is better)
            successfully_extracted += 1
        except:
            pass

        # Process seller type (rewarding "Dealer" over "Private")
        if filters["Seller Type"].lower() == "dealer":
            score += 5
            successfully_extracted += 1
        elif filters["Seller Type"].lower() == "private":
            score += 2
            successfully_extracted += 1

        # Process accident history (deduct points if there's an accident)
        if filters["Accident History"] == "yes":
            score -= 10
            successfully_extracted += 1

        # Process inspection completed (reward if the inspection was completed)
        if filters["Inspection Completed"] == "yes":
            score += 5
            successfully_extracted += 1

        # Process fuel efficiency (reward better fuel efficiency)
        try:
            score += max(0, filters["Fuel Efficiency"] - 10)  # Rewarding better fuel efficiency (higher mpg)
            successfully_extracted += 1
        except:
            pass

        # Process insurance estimate (reward lower insurance cost)
        try:
            score += max(0, 500 - int(filters["Insurance Estimate"])) // 10  # Rewarding lower insurance cost
            successfully_extracted += 1
        except:
            pass

        # Confidence score (how many fields were successfully extracted)
        confidence = successfully_extracted / total_fields
        request.setConfidence(confidence)

        # Final classification (Yes/No based on score)
        if score >= 70:
            request.setActual("Yes")
        else:
            request.setActual("No")

        return request



