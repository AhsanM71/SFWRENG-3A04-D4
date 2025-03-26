import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native"
import { useUser } from "../context/UserContext"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"

const AccountScreen = () => {
  const { user, setUser } = useUser()
  const router = useRouter()

  const handleLogout = () => {
    setUser(null)
    router.push("/")
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={require("../assets/images/profile.png")} style={styles.profileImage} />
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => router.push("/edit-account")}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="bell" size={20} color="#3498db" />
          <Text style={styles.menuItemText}>Notifications</Text>
          <Feather name="chevron-right" size={20} color="#bbb" style={styles.menuItemIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="lock" size={20} color="#3498db" />
          <Text style={styles.menuItemText}>Privacy & Security</Text>
          <Feather name="chevron-right" size={20} color="#bbb" style={styles.menuItemIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="credit-card" size={20} color="#3498db" />
          <Text style={styles.menuItemText}>Payment Methods</Text>
          <Feather name="chevron-right" size={20} color="#bbb" style={styles.menuItemIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="globe" size={20} color="#3498db" />
          <Text style={styles.menuItemText}>Language</Text>
          <Text style={styles.menuItemValue}>English</Text>
          <Feather name="chevron-right" size={20} color="#bbb" style={styles.menuItemIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="moon" size={20} color="#3498db" />
          <Text style={styles.menuItemText}>Dark Mode</Text>
          <Feather name="toggle-right" size={20} color="#bbb" style={styles.menuItemIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="help-circle" size={20} color="#3498db" />
          <Text style={styles.menuItemText}>Help Center</Text>
          <Feather name="chevron-right" size={20} color="#bbb" style={styles.menuItemIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather name="message-circle" size={20} color="#3498db" />
          <Text style={styles.menuItemText}>Contact Support</Text>
          <Feather name="chevron-right" size={20} color="#bbb" style={styles.menuItemIcon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Feather name="log-out" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  userEmail: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 5,
  },
  editButton: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3498db",
  },
  editButtonText: {
    color: "#3498db",
    fontSize: 14,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginLeft: 15,
    marginBottom: 10,
    marginTop: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  menuItemText: {
    fontSize: 16,
    color: "#2c3e50",
    marginLeft: 15,
    flex: 1,
  },
  menuItemValue: {
    fontSize: 14,
    color: "#7f8c8d",
    marginRight: 10,
  },
  menuItemIcon: {
    marginLeft: "auto",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e74c3c",
    marginHorizontal: 15,
    marginVertical: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
})

export default AccountScreen

