import { EditAccountResponse, editRequest } from "@/api/AuthAPI"
import { useAuth } from "@/context/AuthContext"
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

const EditProfileScreen = () => {
  const { user, loading, reload } = useAuth()
  const [name, setName] = useState(user?.displayName || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "")
  const [password, setPassword] = useState("")

  const handleSaveProfile = async () => {
    if (!name || !email || !phoneNumber) {
      Alert.alert("Error", "Name, email, and phone number cannot be empty")
      return
    }
    
    try {
      const editResponse: EditAccountResponse = await editRequest(
        await user?.getIdToken(),
        name,
        email, 
        phoneNumber, 
        password
      );

      if(editResponse.success) {
        Alert.alert('Updated Successfully.', 'Your data has been successfully updated!');
        reload();
      } else
        throw Error(editResponse.msg);
    } catch(error: any) {
      Alert.alert("Editting Account Failed: ", error.message);
    }
  }

  const handleUpdatePassword = async () => {
    if (!password) {
      Alert.alert("Error", "Password cannot be empty")
      return
    }

    try {
      const editResponse: EditAccountResponse = await editRequest(
        await user?.getIdToken(),
        name,
        email, 
        phoneNumber, 
        password
      );

      if(editResponse.success) {
        Alert.alert('Updated Successfully.', 'Your password has been successfully updated!');
        reload();
      } else
        throw Error(editResponse.msg);
    } catch(error: any) {
      Alert.alert("Editting Password Failed: ", error.message);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Edit Profile</Text>

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
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          dataDetectorTypes='phoneNumber'
          textContentType='telephoneNumber'
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="New Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdatePassword}>
          <Text style={styles.saveButtonText}>Update Password</Text>
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
  saveButton: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default EditProfileScreen