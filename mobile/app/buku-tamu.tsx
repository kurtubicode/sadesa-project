import { useEffect, useRef, useState } from "react";
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
import { CameraView, useCameraPermissions } from "expo-camera";
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

<<<<<<< HEAD
type Tab = "manual" | "scan";
=======
type Mode = "manual" | "scan";

// ─── QR Scanner ───────────────────────────────────────────────────────────────

function QRScanner({ onScanned }: { onScanned: () => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const scannedRef = useRef(false);

  if (!permission) {
    return (
      <View style={qrStyles.center}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={qrStyles.center}>
        <Ionicons name="camera-off-outline" size={48} color={COLORS.textMuted} />
        <Text style={qrStyles.permTitle}>Izin Kamera Diperlukan</Text>
        <Text style={qrStyles.permSub}>
          Aplikasi butuh akses kamera untuk memindai QR Code.
        </Text>
        <TouchableOpacity style={qrStyles.permBtn} onPress={requestPermission}>
          <Text style={qrStyles.permBtnText}>Izinkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcode = ({ data }: { data: string }) => {
    if (scannedRef.current) return;
    scannedRef.current = true;

    try {
      const parsed = JSON.parse(data);
      if (parsed?.type === "buku-tamu") {
        onScanned();
        return;
      }
    } catch {
      // bukan JSON, cek apakah URL buku-tamu
      if (data.includes("buku-tamu")) {
        onScanned();
        return;
      }
    }

    // QR tidak dikenal — reset setelah 2 detik agar bisa scan ulang
    setTimeout(() => { scannedRef.current = false; }, 2000);
    Alert.alert("QR Tidak Valid", "Pastikan Anda memindai QR Code resmi dari Kantor Desa.");
  };

  return (
    <View style={qrStyles.scannerWrap}>
      <CameraView
        style={qrStyles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarcode}
      />
      {/* Overlay */}
      <View style={qrStyles.overlay} pointerEvents="none">
        <View style={qrStyles.frame}>
          <View style={[qrStyles.corner, qrStyles.tl]} />
          <View style={[qrStyles.corner, qrStyles.tr]} />
          <View style={[qrStyles.corner, qrStyles.bl]} />
          <View style={[qrStyles.corner, qrStyles.br]} />
        </View>
        <Text style={qrStyles.hint}>Arahkan ke QR Code di loket</Text>
      </View>
    </View>
  );
}

const CORNER = 20;
const BORDER = 3;

const qrStyles = StyleSheet.create({
  center: {
    flex: 1, alignItems: "center", justifyContent: "center",
    padding: SPACING.xl, gap: SPACING.md,
  },
  permTitle: {
    fontSize: FONT.xl, fontWeight: "700", color: COLORS.text, textAlign: "center",
  },
  permSub: {
    fontSize: FONT.md, color: COLORS.textSecondary, textAlign: "center", lineHeight: 20,
  },
  permBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl,
    paddingVertical: SPACING.sm + 2, paddingHorizontal: SPACING.xl,
    marginTop: SPACING.sm,
  },
  permBtnText: { fontSize: FONT.md, fontWeight: "700", color: "#fff" },

  scannerWrap: { flex: 1 },
  camera: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    gap: SPACING.lg,
  },
  frame: {
    width: 220, height: 220,
    position: "relative",
  },
  corner: {
    position: "absolute", width: CORNER, height: CORNER,
    borderColor: "#fff",
  },
  tl: { top: 0, left: 0, borderTopWidth: BORDER, borderLeftWidth: BORDER },
  tr: { top: 0, right: 0, borderTopWidth: BORDER, borderRightWidth: BORDER },
  bl: { bottom: 0, left: 0, borderBottomWidth: BORDER, borderLeftWidth: BORDER },
  br: { bottom: 0, right: 0, borderBottomWidth: BORDER, borderRightWidth: BORDER },
  hint: {
    fontSize: FONT.md, color: "#fff", fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.6)", textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
>>>>>>> origin/main

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function BukuTamuScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();

<<<<<<< HEAD
  const [user, setUser]           = useState<UserData | null>(null);
  const [tab, setTab]             = useState<Tab>("manual");
  const [showScanner, setShowScanner] = useState(false);
  const [qrVerified, setQrVerified]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [errors, setErrors]       = useState<FormErrors>({});
=======
  const [mode, setMode]         = useState<Mode>("manual");
  const [user, setUser]         = useState<UserData | null>(null);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [errors, setErrors]     = useState<FormErrors>({});
>>>>>>> origin/main

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
<<<<<<< HEAD
    setQrVerified(false);
    setTab("manual");
=======
    setMode("manual");
>>>>>>> origin/main
    setForm({
      nama_pengunjung: user?.name  ?? "",
      instansi:        "",
      keperluan:       "",
      no_hp:           user?.phone ?? "",
    });
    setErrors({});
  };

<<<<<<< HEAD
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

=======
  // ── Header shared ──────────────────────────────────────────────────────────
  const Header = (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={22} color={COLORS.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Buku Tamu Digital</Text>
      <View style={styles.backBtn} />
    </View>
  );

  // ── Success screen ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        {Header}
>>>>>>> origin/main
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
<<<<<<< HEAD
          <TouchableOpacity onPress={() => router.back()} style={styles.btnBack}>
=======
          <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}>
>>>>>>> origin/main
            <Text style={styles.btnBackText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Scan mode ──────────────────────────────────────────────────────────────
  if (mode === "scan") {
    return (
      <View style={[styles.container, { backgroundColor: "#000" }]}>
        {/* Header di atas kamera */}
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: "#000", borderBottomColor: "#222" }]}>
          <TouchableOpacity onPress={() => setMode("manual")} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: "#fff" }]}>Scan QR Buku Tamu</Text>
          <View style={styles.backBtn} />
        </View>

        <QRScanner onScanned={() => setMode("manual")} />
      </View>
    );
  }

  // ── Form (manual) ──────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
<<<<<<< HEAD
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buku Tamu</Text>
        <View style={styles.iconBtn} />
      </View>
=======
      {Header}
>>>>>>> origin/main

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
<<<<<<< HEAD
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
=======
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="book" size={28} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>Daftar Kunjungan</Text>
          <Text style={styles.heroSub}>Kantor Desa Cirangkong</Text>
        </View>

        {/* Mode toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === "manual" && styles.toggleBtnActive]}
            onPress={() => setMode("manual")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="create-outline"
              size={16}
              color={mode === "manual" ? "#fff" : COLORS.textMuted}
            />
            <Text style={[styles.toggleText, mode === "manual" && styles.toggleTextActive]}>
>>>>>>> origin/main
              Isi Manual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
<<<<<<< HEAD
            style={[styles.tabBtn, tab === "scan" && styles.tabBtnActive]}
            onPress={() => handleTabChange("scan")}
=======
            style={[styles.toggleBtn, mode === "scan" && styles.toggleBtnActive]}
            onPress={() => setMode("scan")}
>>>>>>> origin/main
            activeOpacity={0.8}
          >
            <Ionicons
              name="qr-code-outline"
<<<<<<< HEAD
              size={14}
              color={tab === "scan" ? COLORS.primary : COLORS.textMuted}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.tabBtnText, tab === "scan" && styles.tabBtnTextActive]}>
=======
              size={16}
              color={mode === "scan" ? "#fff" : COLORS.textMuted}
            />
            <Text style={[styles.toggleText, mode === "scan" && styles.toggleTextActive]}>
>>>>>>> origin/main
              Scan QR
            </Text>
          </TouchableOpacity>
        </View>
<<<<<<< HEAD
=======

        {/* Form card */}
        <View style={styles.card}>
          <Text style={styles.cardHint}>
            Harap isi data di bawah ini sebelum memulai pelayanan
          </Text>
>>>>>>> origin/main

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
  container: { flex: 1 },

  header: {
<<<<<<< HEAD
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
=======
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
>>>>>>> origin/main
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 16, fontFamily: FONT.semibold, color: COLORS.text },

<<<<<<< HEAD
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
=======
  scrollContent: { padding: SPACING.md, gap: SPACING.md },

  hero: {
    alignItems: "center", paddingVertical: SPACING.lg,
    backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, gap: 6,
  },
  heroIcon: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center", marginBottom: 4,
>>>>>>> origin/main
  },
  heroTitle: { fontSize: 18, fontFamily: FONT.bold, color: "#fff" },
  heroSub:   { fontSize: 13, fontFamily: FONT.regular, color: "rgba(255,255,255,0.75)" },

  // Mode toggle
  toggleRow: {
    flexDirection: "row", backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.xl, padding: 4, gap: 4,
  },
  toggleBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: SPACING.sm + 2, borderRadius: RADIUS.lg,
  },
  toggleBtnActive: { backgroundColor: COLORS.primary },
  toggleText:      { fontSize: FONT.md, fontFamily: FONT.semibold, color: COLORS.textMuted },
  toggleTextActive:{ color: "#fff" },

<<<<<<< HEAD
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
=======
>>>>>>> origin/main
  card: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.xl,
    padding: SPACING.lg, gap: SPACING.md, ...SHADOW.sm,
  },
<<<<<<< HEAD

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
=======
  cardHint: {
    fontSize: 13, fontFamily: FONT.regular, color: COLORS.textMuted,
    textAlign: "center", marginBottom: 4,
  },

  fieldGroup: { gap: 6 },
  label:    { fontSize: 13, fontFamily: FONT.semibold, color: COLORS.text },
  required: { color: COLORS.danger },
  optional: { fontFamily: FONT.regular, color: COLORS.textMuted },
  input: {
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 2,
    fontSize: 14, fontFamily: FONT.regular, color: COLORS.text,
    borderWidth: 1, borderColor: "transparent",
>>>>>>> origin/main
  },
  inputMultiline: { minHeight: 88, paddingTop: SPACING.sm + 2 },
  inputError:     { borderColor: COLORS.danger, backgroundColor: "#FEF2F2" },
  errorText:      { fontSize: 12, fontFamily: FONT.regular, color: COLORS.danger },

<<<<<<< HEAD
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
=======
  btnSubmit: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: COLORS.primary, borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md, marginTop: 4,
>>>>>>> origin/main
  },
  btnDisabled:    { opacity: 0.6 },
  btnSubmitText:  { fontSize: 15, fontFamily: FONT.bold, color: "#fff" },

<<<<<<< HEAD
  // Success
=======
>>>>>>> origin/main
  successContainer: {
    flex: 1, alignItems: "center", justifyContent: "center",
    padding: SPACING.xl, gap: SPACING.md,
  },
  successIconWrap: {
<<<<<<< HEAD
    width:           96,
    height:          96,
    borderRadius:    48,
    backgroundColor: "#dbeafe",
    alignItems:      "center",
    justifyContent:  "center",
    marginBottom:    SPACING.sm,
=======
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center", justifyContent: "center", marginBottom: SPACING.sm,
>>>>>>> origin/main
  },
  successTitle: { fontSize: 22, fontFamily: FONT.bold, color: COLORS.text },
  successDesc:  {
    fontSize: 14, fontFamily: FONT.regular, color: COLORS.textSecondary,
    textAlign: "center", lineHeight: 22,
  },
  btnOutline: {
<<<<<<< HEAD
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
=======
    flexDirection: "row", alignItems: "center", gap: 6,
    borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: RADIUS.xl,
    paddingVertical: SPACING.sm + 2, paddingHorizontal: SPACING.xl,
    marginTop: SPACING.md,
>>>>>>> origin/main
  },
  btnOutlineText: { fontSize: 14, fontFamily: FONT.semibold, color: COLORS.primary },
  btnBack: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.xl },
  btnBackText: { fontSize: 14, fontFamily: FONT.regular, color: COLORS.textMuted },
});
