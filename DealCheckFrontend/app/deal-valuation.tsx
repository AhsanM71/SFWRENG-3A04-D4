"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native"
import { Feather } from "@expo/vector-icons"
import { mockValuationResults } from "@/constants"
import { DealValuation, ValuationResult } from "@/types"
import { useLocalSearchParams, useRouter } from "expo-router"

const DealValuationScreen = () => {
  const [carMake, setCarMake] = useState("")
  const [carModel, setCarModel] = useState("")
  const [carYear, setCarYear] = useState("")
  const [mileage, setMileage] = useState("")
  const [price, setPrice] = useState("")
  const [condition, setCondition] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<null | ValuationResult>(null)
  const params = useLocalSearchParams()

  useEffect(() => {
    let parsedValuation = {
      carMake: "",
      carModel: "",
      carYear: "",
      mileage: "",
      price: "",
      condition: "",
      result: null,
    };
  
    if (typeof params.dealValuation === "string") {
      try {
        parsedValuation = JSON.parse(params.dealValuation);
      } catch (error) {
        console.error("Failed to parse deal valuation:", error);
      }
    }
  
    setCarMake(parsedValuation.carMake);
    setCarModel(parsedValuation.carModel);
    setCarYear(parsedValuation.carYear);
    setMileage(parsedValuation.mileage);
    setPrice(parsedValuation.price);
    setCondition(parsedValuation.condition);
    setResult(parsedValuation.result);
  }, [params.dealValuation]);
  
  

  const handleSubmit = () => {
    // Validate inputs
    if (!carMake || !carModel || !carYear || !mileage || !price) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    setIsLoading(true)

    // Simulate API call to the agents
    setTimeout(() => {
      setIsLoading(false)

      // Mock result from the 3 agents
      setResult(mockValuationResults[0])
    }, 2000)
  }

  const resetForm = () => {
    setCarMake("")
    setCarModel("")
    setCarYear("")
    setMileage("")
    setPrice("")
    setCondition("")
    setResult(null)
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Car Deal Valuation</Text>
          <Text style={styles.subtitle}>
            Our AI agents will analyze your potential car deal and tell you if it's a good deal
          </Text>
        </View>

        {!result ? (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Car Make*</Text>
              <TextInput style={styles.input} value={carMake} onChangeText={setCarMake} placeholder="e.g., Toyota" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Car Model*</Text>
              <TextInput style={styles.input} value={carModel} onChangeText={setCarModel} placeholder="e.g., Camry" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Year*</Text>
              <TextInput
                style={styles.input}
                value={carYear}
                onChangeText={setCarYear}
                placeholder="e.g., 2020"
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mileage*</Text>
              <TextInput
                style={styles.input}
                value={mileage}
                onChangeText={setMileage}
                placeholder="e.g., 35000"
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Asking Price*</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="e.g., 18500"
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Condition (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={condition}
                onChangeText={setCondition}
                placeholder="Describe the condition of the vehicle..."
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Analyze Deal</Text>
                  <Feather name="arrow-right" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultContainer}>
            <View
              style={[styles.resultHeader, result.decision === "RECOMMENDED" ? styles.goodDealHeader : styles.badDealHeader]}
            >
              <Text style={styles.resultHeaderText}>{result.decision}</Text>
              <Text style={styles.confidenceText}>{result.confidence}% Confidence</Text>
            </View>

            <View style={styles.carSummary}>
              <Text style={styles.carSummaryText}>
                {carYear} {carMake} {carModel}
              </Text>
              <Text style={styles.carDetailsText}>
                {mileage} miles · ${price}
              </Text>
            </View>

            <Text style={styles.agentReportsTitle}>Agent Reports</Text>

            {result.reports.map((report, index) => (
              <View key={index} style={styles.reportCard}>
                <View style={styles.reportHeader}>
                  <Text style={styles.agentName}>{report.agentName}</Text>
                  <View
                    style={[
                      styles.decisionBadge,
                      report.decision === "GREAT" ? styles.greatDeal :
                        report.decision === "GOOD" ? styles.goodDeal :
                          report.decision === "FAIR" ? styles.fairDeal :
                            report.decision === "WEAK" ? styles.weakDeal :
                              report.decision === "AWFUL" ? styles.awfulDeal :
                                ""
                    ]}
                  >
                    <Text style={styles.decisionText}>{report.decision}</Text>
                  </View>
                </View>
                <Text style={styles.reasoning}>{report.reasoning}</Text>
              </View>
            ))}

            <TouchableOpacity style={styles.newAnalysisButton} onPress={resetForm}>
              <Text style={styles.newAnalysisButtonText}>New Analysis</Text>
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
  resultContainer: {
    padding: 20,
  },
  resultHeader: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  goodDealHeader: {
    backgroundColor: "#2ecc71",
  },
  badDealHeader: {
    backgroundColor: "#e74c3c",
  },
  resultHeaderText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  confidenceText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 5,
  },
  carSummary: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  carSummaryText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  carDetailsText: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  agentReportsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  reportCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  agentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  decisionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  greatDeal: {
    backgroundColor: "#27ae60", // Green background for GREAT DEAL
  },
  goodDeal: {
    backgroundColor: "#2ecc71", // Light Green background for GOOD DEAL
  },
  fairDeal: {
    backgroundColor: "#f39c12", // Yellow background for FAIR DEAL
  },
  weakDeal: {
    backgroundColor: "#e67e22", // Orange background for WEAK DEAL
  },
  awfulDeal: {
    backgroundColor: "#c0392b", // Red background for AWFUL DEAL
  },
  decisionText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  reasoning: {
    fontSize: 14,
    color: "#7f8c8d",
    lineHeight: 20,
  },
  newAnalysisButton: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  newAnalysisButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default DealValuationScreen

