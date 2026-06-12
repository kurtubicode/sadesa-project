import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "@/lib/api";
import { getUser, UserData } from "@/lib/userStorage";
import { COLORS, FONT, RADIUS, SHADOW, SPACING } from "@/constants/theme";
import QrScanner from "@/components/QrScanner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  nama_pengunjung: string;
  instansi: string;
  keperluan: string;
  no_hp: string;
}

interface FormErrors {
  nama_pengunjung?: string;
  keperluan?: string;
}

type Tab = "manual" | "scan";

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function BukuTamuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [user, setUser]           = useState<UserData | null>(null);
  const [tab, setTab]             = useState<Tab>("manual");
  const [showScanner, setShowScanner] = useState(false);
  const [qrVerified, setQrVerified]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [errors, setErrors]       = useState<FormErrors>({});

  const [form, setForm] = useState<FormData>({
    nama_pengunjung: "",
    instansi:        "",
    keperluan:       "",
    no_hp:           "",
  });

  useEffect(() => {
    getUser().then((u) => {
      setUser(u);
      if (u) {
        setForm((prev) => ({
          ...prev,
          nama_pengunjung: u.name  ?? "",
          no_hp:           u.phone ?? "",
        }));
      }
    });
  }, []);

  const setField = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleTabChange = (next: Tab) => {
    setTab(next);
    if (next === "scan") setShowScanner(true);
  };

  const handleScanned = (_url: string) => {
    setShowScanner(false);
    setTab("manual");
    setQrVerified(true);
  };

  const handleScannerClose = () => {
    setShowScanner(false);
    setTab("manual");
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.nama_pengunjung.trim()) errs.nama_pengunjung = "Nama wajib diisi.";
    if (!form.keperluan.trim())       errs.keperluan       = "Keperluan wajib diisi.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/api/buku-tamu", {
        nama_pengunjung: form.nama_pengunjung.trim(),
        instansi:        form.instansi.trim()  || null,
        keperluan:       form.keperluan.trim(),
        no_hp:           form.no_hp.trim()     || null,
      });
      setSuccess(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Gagal menyimpan data. Coba lagi.";
      Alert.alert("Gagal", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setQrVerified(false);
    setTab("manual");
    setForm({
      nama_pengunjung: user?.name  ?? "",
      instansi:        "",
      keperluan:       "",
      no_hp:           user?.phone ?? "",
    });
    setErrors({});
  };

  // ── QR Scanner Modal ───────────────────────────────────────────────────────
  if (showScanner) {
    return (
      <Modal visible animationType="slide" statusBarTranslucent>
        <QrScanner onScanned={handleScanned} onClose={handleScannerClose} />
      </Modal>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (success) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buku Tamu</Text>
          <View style={styles.iconBtn} />
        </View>

        <View style={styles.successContainer}>
          <View style={styles.successIconWrap}>
            <Ionicons name="checkmark-circle" size={60} color={COLORS.primary} />
          </View>
          <Text style={styles.successTitle}>Terima Kasih!</Text>
          <Text style={styles.successDesc}>
            Data kunjungan Anda telah berhasil tercatat.{"\n"}
            Silakan masuk ke loket pelayanan.
          </Text>
          <TouchableOpacity style={styles.btnOutline} onPress={handleReset}>
            <Ionicons name="refresh" size={16} color={COLORS.primary} />
            <Text style={styles.btnOutlineText}>Isi Ulang (Tamu Lain)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={styles.btnBack}>
            <Text style={styles.btnBackText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buku Tamu</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Heading */}
        <View style={styles.headingWrap}>
          <Text style={styles.headingLabel}>Layanan Digital</Text>
          <Text style={styles.headingTitle}>Pendaftaran Kunjungan</Text>
          <Text style={styles.headingDesc}>
            Silakan isi formulir di bawah ini untuk mendata kunjungan Anda ke SADESA.
          </Text>
        </View>

        {/* Tab toggle */}
        <View style={styles.tabWrap}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === "manual" && styles.tabBtnActive]}
            onPress={() => handleTabChange("manual")}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabBtnText, tab === "manual" && styles.tabBtnTextActive]}>
              Isi Manual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === "scan" && styles.tabBtnActive]}
            onPress={() => handleTabChange("scan")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="qr-code-outline"
              size={14}
              color={tab === "scan" ? COLORS.primary : COLORS.textMuted}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.tabBtnText, tab === "scan" && styles.tabBtnTextActive]}>
              Scan QR
            </Text>
          </TouchableOpacity>
        </View>

        {/* Badge QR terverifikasi */}
        {qrVerified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
            <Text style={styles.verifiedText}>QR Code terverifikasi</Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.card}>
          {/* Nama */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Nama Lengkap <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.nama_pengunjung && styles.inputError]}
              value={form.nama_pengunjung}
              onChangeText={(v) => setField("nama_pengunjung", v)}
              placeholder="Masukkan nama lengkap"
              placeholderTextColor={COLORS.textPlaceholder}
              autoCapitalize="words"
            />
            {errors.nama_pengunjung && (
              <Text style={styles.errorText}>{errors.nama_pengunjung}</Text>
            )}
          </View>

          {/* Instansi */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Instansi / Asal Desa{" "}
              <Text style={styles.optional}>(opsional)</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={form.instansi}
              onChangeText={(v) => setField("instansi", v)}
              placeholder="Masukkan nama instansi atau desa"
              placeholderTextColor={COLORS.textPlaceholder}
              autoCapitalize="words"
            />
          </View>

          {/* Keperluan */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Tujuan Kunjungan <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.inputMultiline, errors.keperluan && styles.inputError]}
              value={form.keperluan}
              onChangeText={(v) => setField("keperluan", v)}
              placeholder="Jelaskan tujuan kunjungan Anda"
              placeholderTextColor={COLORS.textPlaceholder}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            {errors.keperluan && (
              <Text style={styles.errorText}>{errors.keperluan}</Text>
            )}
          </View>

          {/* No HP */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Nomor HP{" "}
              <Text style={styles.optional}>(opsional)</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={form.no_hp}
              onChangeText={(v) => setField("no_hp", v)}
              placeholder="cth: 08123456789"
              placeholderTextColor={COLORS.textPlaceholder}
              keyboardType="phone-pad"
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.btnSubmit, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.btnSubmitText}>Hadir / Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: SPACING.md,
    paddingBottom:     SPACING.sm,
    backgroundColor:   COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconBtn: {
    width:           36,
    height:          36,
    alignItems:      "center",
    justifyContent:  "center",
  },
  headerTitle: {
    fontSize:   16,
    fontFamily: FONT.semibold,
    color:      COLORS.text,
  },

  // Scroll
  scrollContent: {
    padding: SPACING.md,
    gap:     SPACING.md,
    paddingBottom: SPACING.xl * 2,
  },

  // Heading
  headingWrap: {
    gap: 6,
    paddingHorizontal: 2,
  },
  headingLabel: {
    fontSize:      11,
    fontFamily:    FONT.semibold,
    color:         COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  headingTitle: {
    fontSize:   24,
    fontFamily: FONT.bold,
    color:      COLORS.text,
    lineHeight: 30,
  },
  headingDesc: {
    fontSize:   13,
    fontFamily: FONT.regular,
    color:      COLORS.textSecondary,
    lineHeight: 20,
  },

  // Tab toggle
  tabWrap: {
    flexDirection:    "row",
    backgroundColor:  COLORS.inputBg,
    borderRadius:     RADIUS.xl,
    padding:          4,
  },
  tabBtn: {
    flex:            1,
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    paddingVertical: SPACING.sm,
    borderRadius:    RADIUS.lg,
  },
  tabBtnActive: {
    backgroundColor: COLORS.card,
    ...SHADOW.sm,
  },
  tabBtnText: {
    fontSize:   14,
    fontFamily: FONT.semibold,
    color:      COLORS.textMuted,
  },
  tabBtnTextActive: {
    color: COLORS.primary,
  },

  // QR verified badge
  verifiedBadge: {
    flexDirection:   "row",
    alignItems:      "center",
    gap:             6,
    backgroundColor: "#f0fdf4",
    borderWidth:     1,
    borderColor:     "#bbf7d0",
    borderRadius:    RADIUS.md,
    paddingVertical:  SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  verifiedText: {
    fontSize:   13,
    fontFamily: FONT.semibold,
    color:      "#16a34a",
  },

  // Form card
  card: {
    backgroundColor: COLORS.card,
    borderRadius:    RADIUS.xl,
    padding:         SPACING.lg,
    gap:             SPACING.md,
    ...SHADOW.sm,
  },

  // Fields
  fieldGroup: { gap: 6 },
  label: {
    fontSize:   13,
    fontFamily: FONT.semibold,
    color:      COLORS.text,
  },
  required: { color: COLORS.danger },
  optional: {
    fontFamily: FONT.regular,
    color:      COLORS.textMuted,
  },
  input: {
    backgroundColor:   COLORS.inputBg,
    borderRadius:      RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.sm + 2,
    fontSize:          14,
    fontFamily:        FONT.regular,
    color:             COLORS.text,
    borderWidth:       1,
    borderColor:       "transparent",
  },
  inputMultiline: {
    minHeight:  88,
    paddingTop: SPACING.sm + 2,
  },
  inputError: {
    borderColor:     COLORS.danger,
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    fontSize:   12,
    fontFamily: FONT.regular,
    color:      COLORS.danger,
  },

  // Submit
  btnSubmit: {
    alignItems:      "center",
    justifyContent:  "center",
    backgroundColor: COLORS.primary,
    borderRadius:    RADIUS.xl,
    paddingVertical: SPACING.md,
    marginTop:       4,
  },
  btnDisabled: { opacity: 0.6 },
  btnSubmitText: {
    fontSize:   15,
    fontFamily: FONT.bold,
    color:      "#fff",
  },

  // Success
  successContainer: {
    flex:           1,
    alignItems:     "center",
    justifyContent: "center",
    padding:        SPACING.xl,
    gap:            SPACING.md,
  },
  successIconWrap: {
    width:           96,
    height:          96,
    borderRadius:    48,
    backgroundColor: "#dbeafe",
    alignItems:      "center",
    justifyContent:  "center",
    marginBottom:    SPACING.sm,
  },
  successTitle: {
    fontSize:   22,
    fontFamily: FONT.bold,
    color:      COLORS.text,
  },
  successDesc: {
    fontSize:   14,
    fontFamily: FONT.regular,
    color:      COLORS.textSecondary,
    textAlign:  "center",
    lineHeight: 22,
  },
  btnOutline: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               6,
    borderWidth:       1.5,
    borderColor:       COLORS.primary,
    borderRadius:      RADIUS.xl,
    paddingVertical:   SPACING.sm + 2,
    paddingHorizontal: SPACING.xl,
    marginTop:         SPACING.md,
  },
  btnOutlineText: {
    fontSize:   14,
    fontFamily: FONT.semibold,
    color:      COLORS.primary,
  },
  btnBack: {
    paddingVertical:   SPACING.sm,
    paddingHorizontal: SPACING.xl,
  },
  btnBackText: {
    fontSize:   14,
    fontFamily: FONT.regular,
    color:      COLORS.textMuted,
  },
});
