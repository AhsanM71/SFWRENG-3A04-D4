import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native"
import { useRouter } from "expo-router"

export default function LandingScreen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/login")}>
          <Text style={styles.secondaryButtonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/sign-up")}>
          <Text style={styles.secondaryButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  slogan: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 40,
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    borderColor: "#007AFF",
    borderWidth: 2,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  logo: {
    width: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
})
