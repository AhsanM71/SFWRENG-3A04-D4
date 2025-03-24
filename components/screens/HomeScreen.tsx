import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image } from "react-native"
import { useUser } from "../../context/UserContext"
import { Feather } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { menuItems, mockRecentActivities, mockValuations } from "@/constants"

const HomeScreen = ({ navigation }: any) => {
  const { user, setUser } = useUser()

  const handleLogout = () => {
    setUser(null)
    navigation.navigate("Landing")
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={require("../../assets/images/longLogo.png")} style={styles.logo} />
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Feather name="log-out" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hey, {user?.name} 👋</Text>
          <Text style={styles.subGreeting}>What would you like to do today?</Text>
        </View>

        {/* Action Tiles */}
        <View style={styles.tilesContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.tile} onPress={() => navigation.navigate(item.screen)}>
              <LinearGradient colors={[item.color1, item.color2]} style={styles.gradient}>
                <Feather name={item.icon as any} size={40} color="#fff" />
                <Text style={styles.tileText}>{item.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {mockRecentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
              <Text style={styles.activityDescription}>{activity.description}</Text>
              <View style={styles.activityResult}>
                <Text
                  style={[
                    styles.activityStatus,
                    activity.result === "RECOMMENDED"
                      ? styles.recommended
                      : activity.result === "NOT RECOMMENDED"
                      ? styles.notRecommended
                      : styles.neutral,
                  ]}
                >
                  {activity.result}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("DealValuation", { dealValuation: mockValuations[activity.id] })}>
                  <Text style={styles.viewDetails}>View Details →</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
    marginTop: 25,
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
})

export default HomeScreen
