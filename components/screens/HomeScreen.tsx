import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image } from "react-native"
import { useUser } from "../../context/UserContext"
import { Feather } from "@expo/vector-icons"
import { menuItems, mockRecentActivities, mockResults, mockValuations } from "@/constants"

const HomeScreen = ({ navigation }: any) => {
  const { user, setUser } = useUser()

  const handleLogout = () => {
    setUser(null)
    navigation.navigate("Landing")
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Image source={require("../../assets/images/longLogo.png")} style={styles.logo} />
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Feather name="log-out" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.menuContainer}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hello, {user?.name}</Text>
          <Text style={styles.subGreeting}>What would you like to do today?</Text>
        </View>

        <View style={styles.tilesContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.tile, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Feather name={item.icon as any} size={40} color="#fff" />
              <Text style={styles.tileText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

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
                <Text style={activity.result === "RECOMMENDED" ? styles.recommended : activity.result === "NOT RECOMMENDED" ? styles.notRecommended : ""}>
                  {activity.result}
                </Text>
                <TouchableOpacity>
                  <Text style={styles.viewDetails} onPress={() => navigation.navigate("DealValuation", { dealValuation: mockValuations[activity.id] })}>View Details</Text>
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
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  greetingContainer: {
    marginBottom: 20
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  subGreeting: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 5,
  },
  logoutButton: {
    padding: 10,
  },
  menuContainer: {
    flex: 1,
    padding: 15,
  },
  tilesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  tile: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tileText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "center",
  },
  recentActivityContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2c3e50",
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  activityDate: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  activityDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 10,
  },
  activityResult: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  recommended: {
    color: "#28a745", // Green
    fontWeight: "bold",
  },
  notRecommended: {
    color: "#dc3545", // Red
    fontWeight: "bold",
  },
  viewDetails: {
    color: "#3498db",
  },
  logo: {
    width: 150,
    resizeMode: "contain",
    marginLeft: 10
  }
})

export default HomeScreen

