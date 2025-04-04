import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity, ActivityIndicator, Image, KeyboardAvoidingView, Platform } from "react-native"
import { Feather } from "@expo/vector-icons"
import { carImages, mockRecommendations } from "@/constants"
import { Recommendation } from "@/types"
import { useLocalSearchParams } from "expo-router"
import { useAuth } from "@/context/AuthContext"
import { carRecommendRequest, CarRecommendResponse } from "@/api/carRecommend"

const CarRecommendationScreen = () => {
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<null | Array<Recommendation>>(null)
  const params = useLocalSearchParams()
  const { user, loading, reload } = useAuth()

  useEffect(() => {
    let parsedRecommendations: Array<Recommendation> | null = null;
  
    if (params?.recommendations && typeof params.recommendations === "string") {
      try {
        parsedRecommendations = JSON.parse(params.recommendations);
      } catch (error) {
        console.error("Failed to parse recommendations:", error);
      }
    }
  
    setRecommendations(parsedRecommendations);
  }, []);

  const formatDataForSubmission = () => {
    // Convert string values to numbers where needed
    const yearInt = parseInt(carYear) || 0;
    const mileageInt = parseInt(mileage) || 0;
    const priceInt = parseInt(price) || 0;
    const ownersInt = parseInt(previousOwners) || 1;
    
    const token = user?.uid

    return {
      user_id: {
        id: token || ""
      },
      description: {
        user_preferences: userInput
      },
      recommendation: {
        price: price,
        make: carMake,
        model: carModel,
        year: yearInt,
        trim: carTrim,
        mileage: mileageInt,
        condition: carCondition,
        accident_history: accidentHistory,
        previous_owners: ownersInt,
        image: imageBase64,
        description: description || `${yearInt} ${carMake} ${carModel} ${carTrim} with ${mileageInt} miles`,
        pros: listOfPros,
        cons: listOfCons,
        overall_description: overallDescription,
      }
    };
  };
  
  const handleSubmit = async () => {
    if (!description) {
      return
    }

    setIsLoading(true)

    const formattedData = await formatDataForSubmission();
    
    try{
          const carRecommendResponse: CarRecommendResponse = await carRecommendRequest(
            formattedData
          );
          
          // console.log("Agent Output: ", JSON.stringify(valuationResponse, null, 2))
    
        } catch(error: any) {
          Alert.alert("Deal valuation failed: ", error.message);
          setIsLoading(false)
        }

    // Simulate API call to the recommendation agents
    setTimeout(() => {
      setIsLoading(false)

      // Mock recommendations
      setRecommendations(mockRecommendations)
    }, 2000)
  }

  const resetForm = () => {
    setDescription("")
    setRecommendations(null)
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Car Recommendations</Text>
          <Text style={styles.subtitle}>
            Tell us about your needs and our AI agents will recommend the best cars for you
          </Text>
        </View>

        {!recommendations ? (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description*</Text>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="e.g. budget, purpose, preferences, etc."
                keyboardType="number-pad"
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Get Recommendations</Text>
                  <Feather name="arrow-right" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsTitle}>Recommended Cars for You</Text>

            {recommendations.map((car, index) => (
              <View key={index} style={styles.carCard}>
                <Image source={carImages[car.image] || { uri: "https://via.placeholder.com/300x200" }} style={styles.carImage} />

                <View style={styles.carInfo}>
                  <Text style={styles.carTitle}>
                    {car.year} {car.make} {car.model}
                  </Text>
                  <Text style={styles.carPrice}>${car.price}</Text>
                  <Text style={styles.carDescription}>{car.description}</Text>

                  <View style={styles.prosConsContainer}>
                    <View style={styles.prosContainer}>
                      <Text style={styles.prosConsTitle}>Pros</Text>
                      {car.pros.map((pro, i) => (
                        <View key={i} style={styles.bulletPoint}>
                          <Feather name="check" size={16} color="#2ecc71" />
                          <Text style={styles.bulletText}>{pro}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.consContainer}>
                      <Text style={styles.prosConsTitle}>Cons</Text>
                      {car.cons.map((con, i) => (
                        <View key={i} style={styles.bulletPoint}>
                          <Feather name="x" size={16} color="#e74c3c" />
                          <Text style={styles.bulletText}>{con}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <TouchableOpacity style={styles.findDealsButton}>
                    <Text style={styles.findDealsButtonText}>Find Deals</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.newSearchButton} onPress={resetForm}>
              <Text style={styles.newSearchButtonText}>New Search</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    lineHeight: 20,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  recommendationsContainer: {
    padding: 20,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
  },
  carCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  carImage: {
    width: "100%",
    height: 200,
  },
  carInfo: {
    padding: 15,
  },
  carTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  carPrice: {
    fontSize: 16,
    color: "#3498db",
    fontWeight: "bold",
    marginTop: 5,
  },
  carDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 10,
    lineHeight: 20,
  },
  prosConsContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  prosContainer: {
    flex: 1,
    marginRight: 10,
  },
  consContainer: {
    flex: 1,
  },
  prosConsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  bulletText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginLeft: 5,
    flex: 1,
  },
  findDealsButton: {
    backgroundColor: "#2ecc71",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 15,
  },
  findDealsButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  newSearchButton: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  newSearchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default CarRecommendationScreen

