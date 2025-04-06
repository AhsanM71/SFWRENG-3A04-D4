from __future__ import annotations
from core.blackboard.expert.Expert import Expert
from core.dealCheck.data.DealCheckData import DealCheckData
import re

class PointSys(Expert[DealCheckData]):
    async def evaluateRequest(self, request: DealCheckData) -> DealCheckData:
        self.queue.append(request)
        id: int = len(self.queue) - 1
        return await self._process_request(id=id)

    async def _process_request(self, id: str) -> DealCheckData:
        request: DealCheckData = self.queue[id]
        del self.queue[id]
        rationale = ""
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
        confidence = (successfully_extracted / total_fields)*100
        format_confidence = round(confidence, 2)
        request.setConfidence(format_confidence)

        # Final classification (Yes/No based on score)
        if score >= 70:
            request.setActual("Yes")
            deal_status = "good"
        else:
            request.setActual("No")
            deal_status = "bad"
        
        # Generate rationale
        rationale = f"The deal is considered {deal_status} because:\n"
        rationale += f"- Confidence score: {format_confidence}%\n"
        rationale += f"- Total score: {score} (threshold for a good deal is 70)\n"

        # Add details about how each field contributed to the score
        rationale += "Score breakdown:\n"
        rationale += f"- Production Year: {max(0, 2025 - int(filters['Prod. year']))} points (rewarding newer cars)\n" if "Prod. year" in filters else ""
        rationale += f"- Mileage: {max(0, 50_000 - int(filters['Mileage'])) // 1_000} points (rewarding lower mileage)\n" if "Mileage" in filters else ""
        rationale += f"- Condition: {'10 points (new)' if filters['Condition'].lower() == 'new' else '5 points (used)' if filters['Condition'].lower() == 'used' else '-5 points (salvage)'}\n" if "Condition" in filters else ""
        rationale += f"- Previous Owners: {max(0, 3 - int(filters['Previous Owners'])) * 5} points (rewarding fewer owners)\n" if "Previous Owners" in filters else ""
        rationale += f"- Seller Type: {'5 points (dealer)' if filters['Seller Type'].lower() == 'dealer' else '2 points (private)'}\n" if "Seller Type" in filters else ""
        rationale += f"- Accident History: {'-10 points (accident reported)' if filters['Accident History'] == 'yes' else '0 points (no accident)'}\n" if "Accident History" in filters else ""
        rationale += f"- Inspection Completed: {'5 points (inspection completed)' if filters['Inspection Completed'] == 'yes' else '0 points (no inspection)'}\n" if "Inspection Completed" in filters else ""
        rationale += f"- Fuel Efficiency: {max(0, filters['Fuel Efficiency'] - 10)} points (rewarding higher mpg)\n" if "Fuel Efficiency" in filters else ""
        rationale += f"- Insurance Estimate: {max(0, 500 - int(filters['Insurance Estimate'])) // 10} points (rewarding lower insurance cost)\n" if "Insurance Estimate" in filters else ""
        request.setRationale(rationale)
        request.setExpertUsed("point_system")
        return request



