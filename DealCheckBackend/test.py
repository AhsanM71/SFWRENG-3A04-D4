from google import genai
from google.genai import types
import json

def generate():
    client = genai.Client(
        vertexai=True,
        project="dealcheck",
        location="us-central1",
    )
    
    prefix = ["""I'm looking for an electric SUV under $50,000 that has great range, a spacious interior, and good tech features. I also drive in snowy conditions often. What's a good option?""",
              """I have a budget of $25,000 and need a fuel-efficient sedan for daily commuting and occasional road trips. I prefer something with good safety ratings and low maintenance costs. What would you recommend?""",
              """I need a reliable used car under $15,000 for city driving, with good gas mileage and low insurance costs. I don't need a lot of power, just something practical. Any recommendations?""",
              """I want a fun weekend sports car under $40,000 that's stylish, fast, and has good handling. It should also be somewhat practical for occasional daily use. What should I get?""",
              """I run a small business and need a durable pickup truck under $60,000 that can tow at least 8,000 lbs and handle off-road conditions. What are my best choices?"""]
    
    prompt = types.Part.from_text(text=f"""{prefix[0]} Based on these requirements, recommend a car and provide the following details. However, for each value only provide the string, boolean, or integer value without any explanations. The explanation of why the recommended car is good based on the provided scenario should come from the Overall Description. Also for the Description (Key features of the car) ensure you use only 2 sentences:
        price Integer (price of such a car)
        make (e.g., Toyota, Honda)
        model (e.g., Camry, Accord)
        year (e.g., 2020)
        trim (specific trim level, e.g., EX, LE)
        mileage Integer
        condition (New, Used, or Salvage)
        accident_history Boolean (specify if we should buy a car with an accident history)
        previous_owners Integer (specify the number of owners the car should have) 
        description (Key features of the car)
        pros (List of advantages)
        cons (List of disadvantages)
        recommendation_info (A brief explanation of why this car is a good recommendation for my needs)
        Return the response in a structured JSON format.""")
    
    model = "gemini-2.0-flash-001"
    contents = [
    types.Content(
        role="user",
        parts=[
            prompt
        ]
    ),
    ]
    generate_content_config = types.GenerateContentConfig(
    temperature = 0.2,
    top_p = 0.8,
    max_output_tokens = 1024,
    response_modalities = ["TEXT"],
    safety_settings = [types.SafetySetting(
      category="HARM_CATEGORY_HATE_SPEECH",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_HARASSMENT",
      threshold="OFF"
    )],
  )
    output = ""
    for chunk in client.models.generate_content_stream(model=model, contents=contents, config=generate_content_config):
        output += chunk.text

    cleaned_output = output.replace("```json\n", "").replace("```", "").strip()

    try:
        data = json.loads(cleaned_output)
        data["recommendation"]["image"] = ""
        json.dumps(data)
        print(data)
    except json.JSONDecodeError as e:
        print("Failed to parse JSON:", e)

generate()