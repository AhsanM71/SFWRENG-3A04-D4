"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { useUser } from "../../context/UserContext"

const CreateAccountScreen = ({ navigation }: any) => {
  const { setUser } = useUser()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleCreateAccount = () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "All fields are required")
      return
    }

    // Simulate account creation
    setUser({ id: "1", name, email })
    Alert.alert("Success", "Account created successfully")
    navigation.navigate("Home")
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.createButton} onPress={handleCreateAccount}>
          <Text style={styles.createButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  createButton: {
    backgroundColor: "#2ecc71",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default CreateAccountScreen
