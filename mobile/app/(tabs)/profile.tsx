import { router } from "expo-router";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function ProfileScreen() {
  const handleLogout = async () => {
    Alert.alert("Konfirmasi", "Yakin ingin keluar dari Sadesa?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: async () => {
          try {
            // 1. Hapus kunci token dari brankas HP
            await SecureStore.deleteItemAsync("sadesa_user_token");

            // 2. Langsung lempar ke halaman utama (Login)
            router.replace("/");
          } catch (error) {
            console.error("Gagal logout:", error);
            Alert.alert("Error", "Terjadi kesalahan saat logout.");
          }
        },
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Warga</Text>
      <Text style={styles.subtitle}>Pengaturan Akun & Aplikasi</Text>

      {/* Tombol Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: "#FF3B30", // Warna merah khas untuk tombol bahaya/keluar
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
