import { useEffect, useState } from "react"
import { View, SafeAreaView, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, FlatList, Image } from "react-native"
import { Feather } from "@expo/vector-icons"
import { mockValuationResults } from "@/constants"
import { DealValuation, ValuationResult } from "@/types" 
import DropDownPicker from "react-native-dropdown-picker";
import { useLocalSearchParams, useRouter } from "expo-router"
import carData from "../../assets/data/car-list.json"
import { valuationRequest, ValuationResponse } from "@/api/dealCheck"
import { useAuth } from "@/context/AuthContext"
import { parse } from "@babel/core"
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system";

const DealValuationScreen = () => {

  // State variables to track form inputs
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [carMake, setCarMake] = useState("")
  const [carModel, setCarModel] = useState("")
  const [carTrim, setCarTrim] = useState("")
  const [carCondition, setCarCondition] = useState("Used")
  const [previousOwners, setPreviousOwners] = useState("1")
  const [sellerType, setSellerType] = useState("Dealer")
  const [warranty, setWarranty] = useState("")
  const [carYear, setCarYear] = useState("")
  const [mileage, setMileage] = useState("")
  const [price, setPrice] = useState("")
  const [accidentHistory, setAccidentHistory] = useState(false)
  const [inspectionCompleted, setInspectionCompleted] = useState(false)
  const [fuelEfficiencyMpg, setFuelEfficiencyMpg] = useState("")
  const [insuranceEstimate, setInsuranceEstimate] = useState("")
  const [resaleValueEstimate, setResaleValueEstimate] = useState("")
  const [userGuess, setUserGuess] = useState(false);
  const [description, setDescription] = useState("")
  const [fuelType, setFuelType] = useState("gasoline")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<null | ValuationResult>(null)
  const params = useLocalSearchParams()

  // Further boolean variables to track drop-down inputs
  const [carMakeOpen, setCarMakeOpen] = useState(false);
  const [carModelOpen, setCarModelOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [fuelTypeOpen, setFuelTypeOpen] = useState(false)
  const [sellerTypeOpen, setSellerTypeOpen] = useState(false);

  const { user, loading, reload } = useAuth()

  // Tracking car models, used in drop-down inputs
  const models = carData.find(car => car.brand === carMake)?.models || []

  useEffect(() => {
    let parsedValuation = {
      carMake: "",
      carModel: "",
      carTrim: "",
      carCondition: "Used",
      sellerType: "Dealer",
      carYear: "",
      mileage: "",
      price: "",
      acidentHistory: false,
      inspectionCompleted: false,
      fuelEfficiencyMpg: "",
      insuranceEstimate: "",
      resaleValueEstimate: "",
      userGuess: false,
      description: "",
      fuelType: "gasoline",
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
    setCarMake(parsedValuation.carModel);
    setCarCondition(parsedValuation.carCondition);
    setSellerType(parsedValuation.sellerType);
    setCarYear(parsedValuation.carYear);
    setMileage(parsedValuation.mileage);
    setPrice(parsedValuation.price);
    setAccidentHistory(parsedValuation.acidentHistory);
    setFuelEfficiencyMpg(parsedValuation.fuelEfficiencyMpg);
    setResaleValueEstimate(parsedValuation.resaleValueEstimate);
    setUserGuess(parsedValuation.userGuess);
    setDescription(parsedValuation.description);
    setResult(parsedValuation.result);
    setFuelType(parsedValuation.fuelType);

  }, [params.dealValuation]);

  const convertImageToBase64 = async (uri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error("Error converting image to Base64:", error);
    }
  };

  const pickImage = async (fromCamera: boolean) => {
    const permissionResult = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.status !== "granted") {
      Alert.alert("Permission Denied", "You need to grant permissions.");
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })
      : await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

    if (!result.canceled) {
      const uri = result.assets[0]?.uri ?? null;
      setImage(uri);
      const base64 = await convertImageToBase64(uri) ?? null;
      setImageBase64(base64);
    }
  };

  const formatDataForSubmission = () => {
    // Convert string values to numbers where needed
    const yearInt = parseInt(carYear) || 0;
    const mileageInt = parseInt(mileage) || 0;
    const priceInt = parseInt(price) || 0;
    const ownersInt = parseInt(previousOwners) || 1;
    const fuelEffInt = parseInt(fuelEfficiencyMpg) || 0;
    const insuranceInt = parseInt(insuranceEstimate) || 0;
    const resaleInt = parseInt(resaleValueEstimate) || 0;
    
    const token = user?.uid

    return {
      user_id: {
        id: token || ""
      },
      car_details: {
        make: carMake,
        model: carModel,
        year: yearInt,
        trim: carTrim,
        mileage: mileageInt,
        condition: carCondition,
        accident_history: accidentHistory,
        previous_owners: ownersInt,
        image: imageBase64,
        description: description
      },
      pricing: {
        listed_price: priceInt
      },
      seller_info: {
        seller_type: sellerType,
        warranty: warranty || "None",
        inspection_completed: inspectionCompleted
      },
      additional_factors: {
        fuel_efficiency_mpg: fuelEffInt,
        insurance_estimate: insuranceInt,
        resale_value_estimate: resaleInt
      },
      answers: {
        predicted: "Yes", // This would be set based on user input
        actual: ""      // This would be set based on agent analysis
      }
    };
  };
  
  const handleSubmit = async () => {

    // Validate inputs
    if (!carMake || !carModel || !carYear || !mileage || !price) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    setIsLoading(true)

    const formattedData = await formatDataForSubmission();
    
    try{
      const valuationResponse: ValuationResponse = await valuationRequest(
        formattedData
      );

      setTimeout(() => {
        setIsLoading(false)
        const result: ValuationResult = {
          decision: valuationResponse.answers.actual === "NO" ? "NOT RECOMMENDED" : "RECOMMENDED",
          confidence: valuationResponse.answers.confidence,
          reports: [{
            agentName: "AI Agent",
            decision: (valuationResponse.answers.actual === "NO" && valuationResponse.answers.confidence > 90) ? "AWFUL" : 
            (valuationResponse.answers.actual === "NO" && valuationResponse.answers.confidence > 60) ? "WEAK" : 
            (valuationResponse.answers.actual === "YES" && valuationResponse.answers.confidence < 50) ? "FAIR" : 
            (valuationResponse.answers.actual === "YES" && valuationResponse.answers.confidence > 50 && valuationResponse.answers.confidence < 90) ? "GOOD" : "GREAT",
            reasoning: valuationResponse.answers.rationale
          }]
        };
        // Mock result from the 3 agents
        setResult(result)
        
      }, 10000)

    } catch(error: any) {
      Alert.alert("Deal valuation failed: ", error.message);
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setCarMake("")
    setCarModel("")
    setCarTrim("")
    setCarCondition("Used")
    setPreviousOwners("1")
    setSellerType("Dealer")
    setWarranty("")
    setCarYear("")
    setMileage("")
    setPrice("")
    setAccidentHistory(false)
    setInspectionCompleted(false)
    setFuelEfficiencyMpg("")
    setInsuranceEstimate("")
    setUserGuess(false)
    setDescription("")
    setFuelType("gasoline")
    setResaleValueEstimate("");
    setResult(null)
  }

  // Option sets for dropdowns.
  const fuelTypeOptions = [
    { label: "Gasoline", value: "gasoline" },
    { label: "Diesel", value: "diesel" },
    { label: "Hybrid", value: "hybrid" },
    { label: "Electric", value: "electric" },
  ];

  const conditionOptions = [
    { label: "New", value: "New" },
    { label: "Used", value: "Used" },
    { label: "Salvage", value: "Salvage" },
  ];

  const sellerTypeOptions = [
    { label: "Dealer", value: "Dealer" },
    { label: "Private", value: "Private" },
  ];

  // Close other dropdowns when one opens
  const onCarMakeOpen = () => {
    setCarModelOpen(false);
    setFuelTypeOpen(false);
    setConditionOpen(false);
    setSellerTypeOpen(false);
  };

  const onCarModelOpen = () => {
    setCarMakeOpen(false);
    setFuelTypeOpen(false);
    setConditionOpen(false);
    setSellerTypeOpen(false);
  };

  const onFuelTypeOpen = () => {
    setCarMakeOpen(false);
    setCarModelOpen(false);
    setSellerTypeOpen(false);
    setConditionOpen(false);
  };

  const onConditionOpen = () => {
    setCarMakeOpen(false);
    setCarModelOpen(false);
    setFuelTypeOpen(false);
    setSellerTypeOpen(false);
  };

  const onSellerTypeOpen = () => {
    setCarMakeOpen(false);
    setCarModelOpen(false);
    setFuelTypeOpen(false);
    setConditionOpen(false);
  };

  // Create form data elements
  const renderFormElements = () => (
    <View style={styles.formContainer}>
      {/* Brand Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Car Brand*</Text>
        <DropDownPicker
          open={carMakeOpen}
          value={carMake}
          items={carData.map(car => ({ label: car.brand, value: car.brand }))}
          setOpen={setCarMakeOpen}
          setValue={setCarMake}
          onOpen={onCarMakeOpen}
          placeholder="Select Car Brand"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={3000}
          zIndexInverse={1000}
          listMode="SCROLLVIEW"
        />
      </View>

      {/* Model Picker */}
      <View style={[styles.inputGroup, { marginTop: carMakeOpen ? 100 : 15 }]}>
        <Text style={styles.label}>Car Model*</Text>
        <DropDownPicker
          open={carModelOpen}
          value={carModel}
          items={models.map(model => ({ label: model, value: model }))}
          setOpen={setCarModelOpen}
          setValue={setCarModel}
          onOpen={onCarModelOpen}
          placeholder={"Select Car Model"}
          placeholderStyle={!carMake ? styles.disabledPlaceholder : styles.placeholder}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          disabled={!carMake}
          disabledStyle={styles.disabledDropdown}
          disabledItemLabelStyle={styles.disabledText}
          zIndex={2000}
          zIndexInverse={2000}
          listMode="SCROLLVIEW"
        />
      </View>

      {/* Trim Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Trim (Optional)</Text>
        <TextInput
          style={styles.input}
          value={carTrim}
          onChangeText={setCarTrim}
          placeholder="e.g., XLE, Sport, Limited"
        />
      </View>

      {/* Picture Input */}
      <View style={styles.imageInputContainer}>
        <Text style={styles.label}>Picture (Optional)</Text>
        <TouchableOpacity style={styles.button} onPress={() => pickImage(true)}>
          <Text style={styles.buttonText}>📷 Take a Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => pickImage(false)}>
          <Text style={styles.buttonText}>🖼️ Pick from Gallery</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
      </View>

      {/* Year Input */}
      <View style={[styles.inputGroup, { marginTop: carModelOpen ? 100 : 15 }]}>
        <Text style={styles.label}>Year*</Text>
        <TextInput
          style={styles.input}
          value={carYear}
          onChangeText={setCarYear}
          placeholder="e.g., 2020"
          keyboardType="number-pad"
        />
      </View>

      {/* Mileage Input */}
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

      {/* Price Input */}
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

      {/* Fuel Type Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fuel Type</Text>
        <DropDownPicker
          open={fuelTypeOpen}
          value={fuelType}
          items={fuelTypeOptions}
          setOpen={setFuelTypeOpen}
          setValue={setFuelType}
          onOpen={onFuelTypeOpen}
          placeholder="Select Fuel Type"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={1000}
          zIndexInverse={3000}
          listMode="SCROLLVIEW"
        />
      </View>

      {/* Condition Dropdown */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Condition*</Text>
        <DropDownPicker
          open={conditionOpen}
          value={carCondition}
          items={conditionOptions}
          setOpen={setConditionOpen}
          setValue={setCarCondition}
          onOpen={onConditionOpen}
          placeholder="Select Condition"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          placeholderStyle={styles.placeholder}
          zIndex={900}
          zIndexInverse={3100}
          listMode="SCROLLVIEW"
        />
      </View>

      {/* Description Input */}
      <View style={[styles.inputGroup, { marginTop: fuelTypeOpen ? 100 : 15 }]}>
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add further description..."
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Accident History */}
      <View style={[styles.inputGroup, { marginTop: conditionOpen ? 100 : 15 }]}>
        <Text style={styles.label}>Accident History</Text>
        <View style={styles.toggleContainer}>
          <Text>Has Accident History?</Text>
          <TouchableOpacity
            style={[styles.toggleButton, accidentHistory ? styles.toggleActive : {}]}
            onPress={() => setAccidentHistory(!accidentHistory)}
          >
            <Text style={accidentHistory ? styles.toggleTextActive : styles.toggleText}>
              {accidentHistory ? "Yes" : "No"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Previous Owners */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Previous Owners</Text>
        <TextInput
          style={styles.input}
          value={previousOwners}
          onChangeText={setPreviousOwners}
          placeholder="e.g., 1"
          keyboardType="number-pad"
        />
      </View>

      {/* Seller Type */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Seller Type*</Text>
        <DropDownPicker
          open={sellerTypeOpen}
          value={sellerType}
          items={sellerTypeOptions}
          setOpen={setSellerTypeOpen}
          setValue={setSellerType}
          onOpen={onSellerTypeOpen}
          placeholder="Select Seller Type"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          placeholderStyle={styles.placeholder}
          zIndex={800}
          zIndexInverse={3200}
          listMode="SCROLLVIEW"
        />
      </View>

      {/* Warranty */}
      <View style={[styles.inputGroup, { marginTop: sellerTypeOpen ? 100 : 15 }]}>
        <Text style={styles.label}>Warranty (Optional)</Text>
        <TextInput
          style={styles.input}
          value={warranty}
          onChangeText={setWarranty}
          placeholder="e.g., 6 months"
        />
      </View>

      {/* Inspection Completed */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Inspection Status</Text>
        <View style={styles.toggleContainer}>
          <Text>Inspection Completed?</Text>
          <TouchableOpacity
            style={[styles.toggleButton, inspectionCompleted ? styles.toggleActive : {}]}
            onPress={() => setInspectionCompleted(!inspectionCompleted)}
          >
            <Text style={inspectionCompleted ? styles.toggleTextActive : styles.toggleText}>
              {inspectionCompleted ? "Yes" : "No"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Fuel Efficiency */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fuel Efficiency (MPG)</Text>
        <TextInput
          style={styles.input}
          value={fuelEfficiencyMpg}
          onChangeText={setFuelEfficiencyMpg}
          placeholder="e.g., 28"
          keyboardType="number-pad"
        />
      </View>

      {/* Insurance Estimate */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Monthly Insurance Estimate ($)</Text>
        <TextInput
          style={styles.input}
          value={insuranceEstimate}
          onChangeText={setInsuranceEstimate}
          placeholder="e.g., 120"
          keyboardType="number-pad"
        />
      </View>

      {/* Resale Value Estimate */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Resale Value Estimate ($)</Text>
        <TextInput
          style={styles.input}
          value={resaleValueEstimate}
          onChangeText={setResaleValueEstimate}
          placeholder="e.g., 18000"
          keyboardType="number-pad"
        />
      </View>

      {/* User Estimate of Deal Rating */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>User Guess</Text>
        <View style={styles.toggleContainer}>
          <Text>Is this a good deal?</Text>
          <TouchableOpacity 
            style={[styles.toggleButton, userGuess ? styles.toggleActive : {}]} 
            onPress={() => setUserGuess(!userGuess)}
          >
            <Text style={userGuess ? styles.toggleTextActive : styles.toggleText}>
              {userGuess ? "Yes" : "No"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Submit Form Button */}
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
  );

  // Create result elements
  const renderResultElements = () => (
    <View style={styles.resultContainer}>
      <View
        style={[styles.resultHeader, result?.decision === "RECOMMENDED" ? styles.goodDealHeader : styles.badDealHeader]}
      >
        <Text style={styles.resultHeaderText}>{result?.decision}</Text>
        <Text style={styles.confidenceText}>{result?.confidence}% Confidence</Text>
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

      {result?.reports.map((report, index) => (
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
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Car Deal Valuation</Text>
      <Text style={styles.subtitle}>
        Our AI agents will analyze your potential car deal and tell you if it's a good deal
      </Text>
    </View>
  );

  const renderContent = () => {
    if (!result) {
      return renderFormElements();
    } else {
      return renderResultElements();
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => renderContent()}
        ListHeaderComponent={renderHeader}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
        style={styles.container}
      />
    </KeyboardAvoidingView>
  );
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
    borderRadius: 10,
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
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledDropdown: {
    backgroundColor: "#f5f5f5",  // Light grey background
    opacity: 0.7,                // Reduced opacity
    borderColor: "#e0e0e0",      // Lighter border
  },
  disabledText: {
    color: "#aaa",  // Grey text color for disabled state
  },
  placeholder: {
    color: "#000000",  // Regular placeholder color
  },
  disabledPlaceholder: {
    color: "#bdc3c7",  // Lighter gray for disabled state
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  toggleButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  toggleActive: {
    backgroundColor: "#3498db",
  },
  toggleText: {
    fontWeight: "bold",
    color: "#7f8c8d",
  },
  toggleTextActive: {
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  imageInputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default DealValuationScreen
