import { useEffect, useState, useCallback } from "react"
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, SafeAreaView, Image, Alert } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { menuItems, mockActivities, mockDepreciationCurve, mockRecommendations, mockValuations } from "@/constants"
import { DealValuation, Recommendation } from "@/types"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "expo-router"
import { logoutRequest, LogoutResponse } from "@/api/AuthAPI"
import { valuationRetrieval, ValuationResponse } from "@/api/dealCheck"
import { signOut } from "firebase/auth"
import { auth } from "@/FirebaseConfig"
import { CarRecommendResponse, recommendationRetrieval } from "@/api/carRecommend"

const HomeScreen = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [dealActivities, setDealActivities] = useState<any[]>([])
  const [recActivities, setRecActivities] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)

  const handleLogout = async () => {
    try {
      // Get id token and send request to revoke token
      const idToken = await user?.getIdToken();
      const responseData: LogoutResponse = await logoutRequest(idToken);

      if(responseData.success)
        // Signout the user
        signOut(auth)
      else
        throw Error(responseData.msg);
    } catch(error: any) {
      Alert.alert("Logout Failed: ", error.message);
    }
  }

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
            docid: deal.obj_id.id,
            id: `valuation-${index}`,
            type: "Deal Valuation",
            description: `${deal.car_details.year} ${deal.car_details.make} ${deal.car_details.model} - $${deal.pricing.price}`,
            decision: deal.answers.actual,
          }));
  
          //@ts-ignore
          const recommendationActivities = recommendations.recommendations.map((rec: any, index: number) => ({
            id: `recommendation-${index}`,
            docid: rec.obj_id.id,
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
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={require("@/assets/images/longLogo.png")} style={styles.logo} />
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Feather name="log-out" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hey, {user?.displayName} 👋</Text>
          <Text style={styles.subGreeting}>What would you like to do today?</Text>
        </View>

        {/* Action Tiles */}
        <View style={styles.tilesContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.tile} onPress={() => router.push(item.screen)}>
              <LinearGradient colors={[item.color1, item.color2]} style={styles.gradient}>
                <Feather name={item.icon as any} size={40} color="#fff" />
                <Text style={styles.tileText}>{item.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
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
                    <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/deal-valuation",
                        params: { docid: activity.docid } 
                      })
                    }
                  >
                    <Text style={styles.viewDetails}>View Details →</Text>
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
                    <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "car-recommendation",
                        params: { docid: activity.docid }
                      })
                    }
                    >
                    <Text style={styles.viewDetails}>View Details →</Text>
                  </TouchableOpacity> 
                </View>
              </View>
            ))}
          </>
        )}
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fd",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logo: {
    width: 160,
    resizeMode: "contain",
  },
  logoutButton: {
    padding: 10,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  greetingContainer: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3436",
  },
  subGreeting: {
    fontSize: 16,
    color: "#636e72",
    marginTop: 5,
  },
  tilesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tile: {
    width: "48%",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  gradient: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 120,
  },
  tileText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  recentActivityContainer: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: 5,
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
})

export default HomeScreen
