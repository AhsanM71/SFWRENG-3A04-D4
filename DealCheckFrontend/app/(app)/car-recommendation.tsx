import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity, ActivityIndicator, Image, KeyboardAvoidingView, Platform } from "react-native"
import { Feather } from "@expo/vector-icons"
import { carImages, mockDepreciationCurve, mockRecommendations } from "@/constants"
import { Recommendation } from "@/types"
import { useLocalSearchParams } from "expo-router"
import { useAuth } from "@/context/AuthContext"
import { carRecommendRequest, CarRecommendResponse, carRecommendRetrieve } from "@/api/carRecommend"
import { getStorageImgDownloadURL } from "@/FirebaseConfig"

const CarRecommendationScreen = () => {
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<null | Array<Recommendation>>(null)

  const [carYear, setCarYear] = useState("");
  const [mileage, setCarMileage] = useState("");
  const [previousOwners, setPreviousOwners] = useState("");
  const [price, setPrice] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carTrim, setCarTrim] = useState("");
  const [carCondition, setCarCondition] = useState("");
  const [accidentHistory, setAccidentHistory] = useState("");
  const [listOfPros, setListOfPros] = useState([]);
  const [listOfCons, setListOfCons] = useState([]);
  const [overallDescription, setOverallDescription] = useState("");

  const [depreciationCurveSrc, setDepreciationCurveSrc] = useState("");
  const [depreciationCurve, setDepreciationCurve] = useState("");

  const [carRecommendationSrc, setCarRecommendationSrc] = useState("");
  const [carRecommendation, setCarRecommendation] = useState("");


  const params = useLocalSearchParams()
  const { user, loading, reload } = useAuth()

  const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({})

  const toggleExpand = (id: number) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchCarRecommendation = async () => {
      if (params.docid) {
        try {
          const carRecommendResponse: CarRecommendResponse = await carRecommendRetrieve({
            doc_id: params.docid as string
          });
          const depreciationCurveURI = await getStorageImgDownloadURL(carRecommendResponse.recommendation.depreciationCurveSrc)
          const carRecommendationURI = carRecommendResponse.recommendation.image ? await getStorageImgDownloadURL(carRecommendResponse.recommendation.image) : "";
          setDepreciationCurve(depreciationCurveURI)
          setCarRecommendation(carRecommendationURI)
          setRecommendations([carRecommendResponse.recommendation])
          // Handle the response data here
        } catch (error) {
          console.error("Error retrieving car recommendation:", error);
        }
      }
    };   
    fetchCarRecommendation()
    setIsLoading(false);

  }, [params.docid]);

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
        user_preferences: description
      },
      recommendation: {
        price: priceInt,
        make: carMake,
        model: carModel,
        year: yearInt,
        trim: carTrim,
        mileage: mileageInt,
        condition: carCondition,
        accident_history: accidentHistory,
        previous_owners: ownersInt,
        image: carRecommendationSrc,
        description: description || `${yearInt} ${carMake} ${carModel} ${carTrim} with ${mileageInt} miles`,
        pros: listOfPros,
        cons: listOfCons,
        overall_description: overallDescription,
        depreciationCurveSrc: depreciationCurveSrc,
      }
    };
  };

  const handleSubmit = async () => {
    if (!description) {
      return
    }

    setIsLoading(true)

    const formattedData = await formatDataForSubmission();
    try {
      const carRecommendResponse: CarRecommendResponse = await carRecommendRequest(
        formattedData
      );
      // console.log("Agent Output: ", JSON.stringify(carRecommendResponse, null, 2))
      const depreciationCurveURI = await getStorageImgDownloadURL(carRecommendResponse.recommendation.depreciationCurveSrc)
      const carRecommendationURI = carRecommendResponse.recommendation.image ? await getStorageImgDownloadURL(carRecommendResponse.recommendation.image) : "";
      setDepreciationCurve(depreciationCurveURI)
      setCarRecommendation(carRecommendationURI)
      setRecommendations([carRecommendResponse.recommendation])
    } catch (error: any) {
      Alert.alert("Deal valuation failed: ", error.message);
    } finally {
      setIsLoading(false)
    }

    // // Simulate API call to the recommendation agents
    // setTimeout(() => {
    //   setIsLoading(false)

    //   // Mock recommendations
    //   setRecommendations(mockRecommendations)
    // }, 2000)
  }

  const resetForm = () => {
    setRecommendations(null);
    setCarYear("");
    setCarMileage("");
    setPreviousOwners("");
    setPrice("");
    setCarMake("");
    setCarModel("");
    setCarTrim("");
    setCarCondition("");
    setAccidentHistory("");
    setListOfPros([]);
    setListOfCons([]);
    setOverallDescription("");
    setDepreciationCurveSrc("");
    setExpandedItems({});
    setDepreciationCurve("");
    setCarRecommendation("");
    setCarRecommendationSrc("");
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Car Recommendations</Text>
          <Text style={styles.subtitle}>
            Tell us about your needs and our AI agents will recommend the best cars for you
          </Text>
        </View>

        {isLoading ? <ActivityIndicator color="#000" style={styles.loading} /> : !recommendations ? (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description*</Text>
              <TextInput
                style={[styles.input]}
                value={description}
                onChangeText={setDescription}
                placeholder="e.g. budget, purpose, preferences, etc."
                multiline={true}
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
                <View style={styles.carImageContainer}>
                  <Image source={{ uri: carRecommendation }} style={styles.carImage} />
                </View>
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
                  <Text style={styles.rationale}>Rationale</Text>
                  <TouchableOpacity style={styles.rationaleContainer} onPress={() => toggleExpand(index)}>
                    <Text style={styles.carDescription} numberOfLines={expandedItems[index] ? 0 : 3}>{car.overall_description}</Text>
                    <Text style={styles.showMoreText}>
                      {expandedItems[index] ? 'Show Less' : 'Show More'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.rationale}>Depreciation Curve</Text>
                  <View style={styles.depreciationCurveContainer}>
                    <Image source={{ uri: depreciationCurve }} style={styles.depreciationCurve} />
                  </View>
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
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    minHeight: 100,
    textAlignVertical: 'top',
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
  carImageContainer: {
    padding: 15
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
  rationale: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 16,
  },
  rationaleContainer: {
    marginBottom: 15,
  },
  showMoreText: {
    color: '#3498db',
    fontSize: 14,
    marginTop: 5,
  },
  depreciationCurveContainer: {
    padding: 15
  },
  depreciationCurve: {
    width: "100%",
    height: 180
  },
})

export default CarRecommendationScreen

