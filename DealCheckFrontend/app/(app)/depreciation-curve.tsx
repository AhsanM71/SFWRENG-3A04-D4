import { mockActivities, mockDepreciationCurve, mockValuations, mockRecommendations } from "@/constants"
import { DealValuation, Recommendation } from "@/types"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { StyleSheet, KeyboardAvoidingView, ScrollView, View, Text, Platform, Alert, TouchableOpacity, ActivityIndicator, Image } from "react-native"
import { useAuth } from "@/context/AuthContext"
import { valuationRetrieval } from "@/api/dealCheck"
import { recommendationRetrieval, curveRetrieval, CurveRequestResponse } from "@/api/carRecommend"
import { getStorageImgDownloadURL } from "@/FirebaseConfig"
import { carRecommendRequest, CarRecommendResponse } from "@/api/carRecommend"

const DepreciationCurveScreen = () => {
  const { user } = useAuth()
  const [dealValuation, setDealValuation] = useState<null | DealValuation>(null)
  const [recommendation, setRecommendation] = useState<null | Recommendation>(null)
  const [isLoading, setIsLoading] = useState(false)
  const params = useLocalSearchParams()
  const [dealActivities, setDealActivities] = useState<any[]>([])
  const [recActivities, setRecActivities] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [depreciationCurve, setDepreciationCurve] = useState("");
  const [depreciationCurveURI, setDepreciationCurveURI] = useState("");
  const [depDesc, setDepDesc] = useState("");
  const [carYear, setCarYear] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carMake, setCarMake] = useState("");
  const [overallDescription, setOverallDescription] = useState("");
  const [depreciationCurveSrc, setDepreciationCurveSrc] = useState("");
  const [carRecommendationSrc, setCarRecommendationSrc] = useState("");
  const [carRecommendation, setCarRecommendation] = useState("");
  const [listOfPros, setListOfPros] = useState([]);
  const [listOfCons, setListOfCons] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchValuations = async () => {
        setDealActivities([]);
        setRecActivities([]);
        setFetching(true);
  
        const token = user?.uid;
  
        const input_data = {
          user_id: token || ""
        };
  
        try {
  
          const valuations = await valuationRetrieval(input_data);
          const recommendations = await recommendationRetrieval(input_data);
  
          //@ts-ignore
          const valuationActivities = valuations.deal_checks.map((deal: any, index: number) => ({
            id: `valuation-${index}`,
            type: "Deal Valuation",
            description: `${deal.car_details.year} ${deal.car_details.make} ${deal.car_details.model} - $${deal.pricing.price}`,
            decision: deal.answers.actual,
          }));
  
          //@ts-ignore
          const recommendationActivities = recommendations.recommendations.map((rec: any, index: number) => ({
            id: `recommendation-${index}`,
            type: "Recommendation",
            description: `${rec.carInfo.year} ${rec.carInfo.make} ${rec.carInfo.model} - $${rec.carInfo.price}`,
            decision: "Yes",
            curveImg: rec.depreciation_info.curveImg
          }));
  
          setDealActivities(valuationActivities);
          setRecActivities(recommendationActivities);
  
        } catch (error: any) {
          Alert.alert("Deal valuation failed", error.message);
        } finally {
          setFetching(false);
        }
      };
  
      fetchValuations();
    }, [user?.uid]) 
  );

  //Used for parsing data to generate new valuation curve.
  const formatDataForSubmission = (make: string, model: string, year: string, price: string) => {
    // Convert string values to numbers where needed
    const token = user?.uid

    return {
      user_id: {
        id: token || ""
      },
      car: {
        price: price,
        make: make,
        model: model,
        year: year,
      }
    };
  };

  // Creating new depreciation curve for a deal valuation.
  const generateCurve = async (id: any) => {
    setIsLoading(true)
  
    const token = user?.uid;
    const input_data = {
      user_id: token || ""
    };
  
    try {
      const valuations = await valuationRetrieval(input_data);
  
      //@ts-ignore
      const valuationActivities = valuations.deal_checks.map((deal: any, index: number) => ({
        id: `valuation-${index}`,
        type: "Deal Valuation",
        year: deal.car_details.year,
        make: deal.car_details.make,
        model: deal.car_details.model,
        price: deal.pricing.price,
        decision: deal.answers.actual,
      }));
  
      const matched = valuationActivities.find((activity: any) => activity.id === id);
  
      if (matched) {
        const { make, model, price, year } = matched;
  
        // If you want to still store these in state for display later:
        setCarMake(make);
        setCarModel(model);
        setCarPrice(price);
        setCarYear(year);
        setDepDesc(`${year} ${make} ${model} - $${price}`);
        const formattedData = formatDataForSubmission(make, model, year, price);
  
        const curveRequestResponse: CurveRequestResponse = await curveRetrieval(formattedData);
        //@ts-ignore
        const curve = await getStorageImgDownloadURL(curveRequestResponse.depreciation.depreciationCurveSrc);
        setDepreciationCurveURI(curve);
      } else {
        Alert.alert("Valuation not found");
      }
  
    } catch (error: any) {
      Alert.alert("Image fetching failed: ", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Viewing depreciation curve for a car recommendation.
  const handleGetCurve = async (id: any) => {
    setIsLoading(true)

    const token = user?.uid;
    const input_data = {
      user_id: token || ""
    };

    try {
      const recommendations = await recommendationRetrieval(input_data);
      //@ts-ignore
      const recommendationActivities = recommendations.recommendations.map((rec: any, index: number) => ({
        id: `recommendation-${index}`,
        type: "Recommendation",
        description: `${rec.carInfo.year} ${rec.carInfo.make} ${rec.carInfo.model} - $${rec.carInfo.price}`,
        decision: "Yes",
        curveImg: rec.depreciation_info.curveImg
      }));

      //@ts-ignore
      let curve = "";
      let desc = "";
      for (let i = 0; i < recommendationActivities.length; i++) {
        if(recommendationActivities[i].id == id){
          curve = recommendationActivities[i].curveImg;
          desc = recommendationActivities[i].description;
          break;
        }
      }
      setDepDesc(desc);
      const urlResponse = await getStorageImgDownloadURL(curve)
      setDepreciationCurveURI(urlResponse)
    } catch (error: any){
      Alert.alert("Image fetching failed: ", error.message);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Depreciation Curve</Text>
          <Text style={styles.subtitle}>
            Visualize how your car’s value changes over time based on market trends and historical data
          </Text>
        </View>
        <View style={styles.contentContainer}>
          {isLoading ? <ActivityIndicator color="#000" style={styles.loading} /> : !depreciationCurveURI ? (
            <View>
              <Text style={styles.sectionTitle}>Select a Deal Valuation or Recommendation:</Text>
              <View style={styles.recentActivityContainer}>
        {fetching ? (
          <ActivityIndicator color="#000" style={styles.loading} />
        ) : dealActivities.length === 0 && recActivities.length === 0 ? (
          <Text style={styles.activityDate}>No recent activity.</Text>
        ) : (
          <>
            {/* Deal Valuations */}
            {dealActivities.map((activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTitle}>{activity.type}</Text>
                </View>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <View style={styles.activityResult}>
                  <Text
                    style={[
                      styles.activityStatus,
                      activity.decision === "Yes"
                        ? styles.recommended
                        : activity.decision === "No"
                          ? styles.notRecommended
                          : styles.neutral
                    ]}
                  >
                    {activity.decision === "Yes" ? "RECOMMENDED" : "NOT RECOMMENDED"}
                  </Text>
                    <TouchableOpacity onPress={() => generateCurve(activity.id)}>
                      <Text style={styles.viewDetails}>Generate Curve →</Text>
                    </TouchableOpacity>
                </View>
              </View>
            ))}
    
            {/* Recommendations */}
            {recActivities.map((activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTitle}>{activity.type}</Text>
                </View>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <View style={styles.activityResult}>
                  <Text
                    style={[
                      styles.activityStatus,
                      activity.decision === "Yes"
                        ? styles.recommended
                        : activity.decision === "No"
                          ? styles.notRecommended
                          : styles.neutral
                    ]}
                  >
                    {activity.decision === "Yes" ? "RECOMMENDED" : "NOT RECOMMENDED"}
                  </Text>
                    <TouchableOpacity onPress={() => handleGetCurve(activity.id)}>
                      <Text style={styles.viewDetails}>View Curve →</Text>
                    </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
            </View>
          ) : (
            <View style={styles.depreciationCurveContainer}>
              <Text style={styles.activityHeader}>Depreciation Curve for {depDesc}</Text>
              <Image source={{ uri: depreciationCurveURI }} style={styles.depreciationCurve} />
            </View>
          )}
        </View>
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
  recentActivityContainer: {
    marginTop: 15,
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
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: 15,
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2d3436",
  },
  activityDate: {
    fontSize: 14,
    color: "#636e72",
  },
  activityDescription: {
    fontSize: 14,
    color: "#636e72",
    marginBottom: 10,
  },
  activityResult: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityStatus: {
    fontWeight: "bold",
  },
  recommended: {
    color: "#27ae60", // Green
  },
  notRecommended: {
    color: "#e74c3c", // Red
  },
  neutral: {
    color: "#f39c12", // Yellow/Neutral
  },
  viewDetails: {
    color: "#2980b9",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  image: {
    width: "100%",
    height: 200,
  },
  depreciationCurveContainer: {
    padding: 3,
  },
  depreciationCurve: {
    width: "100%",
    height: 250,
  },
})

export default DepreciationCurveScreen