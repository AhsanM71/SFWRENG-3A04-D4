import { mockActivities, mockDepreciationCurve, mockValuations, mockRecommendations } from "@/constants"
import { DealValuation, Recommendation } from "@/types"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet, KeyboardAvoidingView, ScrollView, View, Text, Platform, TouchableOpacity, ActivityIndicator, Image } from "react-native"
import Recents from "./recents"

const DepreciationCurveScreen = () => {
  const [dealValuation, setDealValuation] = useState<null | DealValuation>(null)
  const [recommendation, setRecommendation] = useState<null | Recommendation>(null)
  const [isLoading, setIsLoading] = useState(false)
  const params = useLocalSearchParams()

  useEffect(() => {
    let parsedValuation = null;
    
    if (params?.dealValuation && typeof params.dealValuation === "string") {
      try {
        parsedValuation = JSON.parse(params.dealValuation);
      } catch (error) {
        console.error("Failed to parse deal valuation:", error);
      }
    }

    if (params?.recommendation && typeof params.recommendation === "string"){
      try {
        parsedValuation = JSON.parse(params.recommendation);
      } catch (error) {
        console.error("Failed to parse recommendation", error);
      }
    }
  
    setDealValuation(parsedValuation);
  }, []);

  const handleGetCurve = (id: number) => {
    setIsLoading(true)

    // Simulate API call to the agent
    setTimeout(() => {
      setIsLoading(false)
      //@ts-ignore
      setDealValuation({ id })
    }, 2000)
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
          {isLoading ? <ActivityIndicator color="#000" style={styles.loading} /> : !dealValuation ? (
            <View>
              <Text style={styles.sectionTitle}>Select a Deal Valuation / Recommendation:</Text>
              <Recents mode="curve" onSelectCurve={handleGetCurve}></Recents>
            </View>
          ) : (
            <View style={styles.card}>
              <Image source={mockDepreciationCurve} style={styles.image} />
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
})

export default DepreciationCurveScreen