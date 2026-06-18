import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  StyleSheet, ActivityIndicator, SafeAreaView,
  KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "@/lib/api";
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from "@/constants/theme";

export default function LupaPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [terkirim, setTerkirim] = useState(false);
  const router = useRouter();

  const handleKirim = async () => {
    if (!email.trim()) {
      Alert.alert("Peringatan", "Masukkan alamat email terlebih dahulu.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/forgot-password", { email: email.trim() });
      setTerkirim(true);
    } catch (err: any) {
      Alert.alert(
        "Gagal",
        err?.response?.data?.message ?? "Tidak dapat terhubung ke server.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* Back */}
          <TouchableOpacity style={s.back} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>

          {/* Icon */}
          <View style={s.iconWrap}>
            <Ionicons name="lock-open-outline" size={40} color={COLORS.primary} />
          </View>

          <Text style={s.title}>Lupa Kata Sandi?</Text>
          <Text style={s.sub}>
            Masukkan email yang terdaftar. Kami akan mengirimkan link untuk mereset kata sandi Anda.
          </Text>

          {terkirim ? (
            <View style={s.successBox}>
              <Ionicons name="checkmark-circle" size={32} color="#16a34a" style={{ marginBottom: SPACING.sm }} />
              <Text style={s.successTitle}>Email Terkirim!</Text>
              <Text style={s.successSub}>
                Cek kotak masuk email <Text style={{ fontWeight: "700" }}>{email}</Text>. Ikuti link di email untuk mereset kata sandi.
              </Text>
              <TouchableOpacity style={s.btnOutline} onPress={() => router.replace("/")}>
                <Text style={s.btnOutlineText}>Kembali ke Login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={s.label}>EMAIL</Text>
              <View style={s.inputWrap}>
                <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="Masukkan email terdaftar"
                  placeholderTextColor={COLORS.textPlaceholder}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={[s.btn, loading && { opacity: 0.7 }]}
                onPress={handleKirim}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading
                  ? <ActivityIndicator color={COLORS.white} />
                  : <Text style={s.btnText}>Kirim Link Reset</Text>
                }
              </TouchableOpacity>

              <TouchableOpacity style={s.backLink} onPress={() => router.back()}>
                <Text style={s.backLinkText}>← Kembali ke Login</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, paddingHorizontal: SPACING.xxl, paddingBottom: SPACING.xxxl },

  back: { marginTop: SPACING.xl, marginBottom: SPACING.xl, alignSelf: "flex-start" },

  iconWrap: {
    width: 80, height: 80, borderRadius: RADIUS.xl,
    backgroundColor: "#EFF6FF",
    justifyContent: "center", alignItems: "center",
    alignSelf: "center",
    marginBottom: SPACING.xl,
    ...SHADOW.sm,
  },

  title: {
    fontSize: FONT.xxxl, fontWeight: "800",
    color: COLORS.text, textAlign: "center",
    marginBottom: SPACING.sm,
  },
  sub: {
    fontSize: FONT.md, color: COLORS.textMuted,
    textAlign: "center", lineHeight: 22,
    marginBottom: SPACING.xxxl,
  },

  label: {
    fontSize: FONT.xs, fontWeight: "700",
    color: COLORS.textSecondary, letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  inputWrap: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    height: 52,
    marginBottom: SPACING.xl,
  },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, fontSize: FONT.lg, color: COLORS.text },

  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    height: 54,
    justifyContent: "center", alignItems: "center",
    ...SHADOW.md,
  },
  btnText: { color: COLORS.white, fontSize: FONT.xl, fontWeight: "700" },

  backLink: { alignItems: "center", marginTop: SPACING.xl },
  backLinkText: { fontSize: FONT.md, color: COLORS.primary, fontWeight: "600" },

  successBox: {
    alignItems: "center", padding: SPACING.xl,
    backgroundColor: "#F0FDF4",
    borderRadius: RADIUS.xl, borderWidth: 1,
    borderColor: "#86EFAC",
  },
  successTitle: { fontSize: FONT.xl, fontWeight: "800", color: "#15803D", marginBottom: SPACING.sm },
  successSub: { fontSize: FONT.md, color: "#166534", textAlign: "center", lineHeight: 22, marginBottom: SPACING.xl },

  btnOutline: {
    borderWidth: 1.5, borderColor: COLORS.primary,
    borderRadius: RADIUS.full, paddingHorizontal: SPACING.xl,
    height: 48, justifyContent: "center", alignItems: "center",
  },
  btnOutlineText: { color: COLORS.primary, fontWeight: "700", fontSize: FONT.md },
});
