import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONT, RADIUS, SPACING } from "@/constants/theme";

interface Props {
  onScanned: (url: string) => void;
  onClose: () => void;
}

const BUKU_TAMU_PATH = "/buku-tamu";

function isValidBukuTamuUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.pathname === BUKU_TAMU_PATH;
  } catch {
    return false;
  }
}

export default function QrScanner({ onScanned, onClose }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch]               = useState(false);
  const scannedRef                      = useRef(false);

  const handleBarcode = ({ data }: { data: string }) => {
    if (scannedRef.current) return;
    scannedRef.current = true;

    if (isValidBukuTamuUrl(data)) {
      onScanned(data);
    } else {
      Alert.alert(
        "QR Tidak Valid",
        "QR Code ini bukan untuk Buku Tamu SADESA.\nArahkan ke QR Code di meja resepsionis.",
        [{ text: "Coba Lagi", onPress: () => { scannedRef.current = false; } }]
      );
    }
  };

  const handleUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });
    if (!result.canceled) {
      Alert.alert(
        "Info",
        "Fitur scan dari gambar belum tersedia.\nGunakan kamera untuk scan QR Code."
      );
    }
  };

  // ── Belum ada izin ────────────────────────────────────────────────────────
  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Ionicons name="camera-off-outline" size={48} color={COLORS.textMuted} />
        <Text style={styles.permText}>Izin kamera diperlukan untuk scan QR</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Izinkan Kamera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.permCancel}>
          <Text style={styles.permCancelText}>Batal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Scanner ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarcode}
      />

      {/* Overlay gelap di luar viewfinder */}
      <View style={styles.overlay}>
        {/* Baris atas: tombol tutup + flash */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, torch && styles.iconBtnActive]}
            onPress={() => setTorch((v) => !v)}
          >
            <Ionicons
              name={torch ? "flash" : "flash-outline"}
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Area transparan (viewfinder) */}
        <View style={styles.viewfinderWrap}>
          <View style={styles.viewfinder}>
            {/* Sudut bracket */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
        </View>

        {/* Teks instruksi */}
        <View style={styles.bottomArea}>
          <Text style={styles.hint}>Arahkan kamera ke QR Code</Text>
          <Text style={styles.hintSub}>DI MEJA RESEPSIONIS</Text>

          <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
            <Ionicons name="image-outline" size={18} color="#fff" />
            <Text style={styles.uploadBtnText}>Unggah Gambar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const FINDER_SIZE = 240;
const CORNER_SIZE = 28;
const CORNER_WIDTH = 3;
const CORNER_COLOR = "#fff";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.md,
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  permText: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  permBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.sm,
  },
  permBtnText: {
    fontSize: 14,
    fontFamily: FONT.semibold,
    color: "#fff",
  },
  permCancel: {
    paddingVertical: SPACING.sm,
  },
  permCancelText: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: COLORS.textMuted,
  },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnActive: {
    backgroundColor: "rgba(255,200,0,0.4)",
  },

  // Viewfinder
  viewfinderWrap: {
    width: FINDER_SIZE,
    height: FINDER_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  viewfinder: {
    width: FINDER_SIZE,
    height: FINDER_SIZE,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: CORNER_COLOR,
  },
  cornerTL: {
    top: 0, left: 0,
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0, right: 0,
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderBottomRightRadius: 4,
  },

  // Bottom
  bottomArea: {
    alignItems: "center",
    paddingBottom: SPACING.xl * 2,
    gap: SPACING.sm,
  },
  hint: {
    fontSize: 16,
    fontFamily: FONT.semibold,
    color: "#fff",
  },
  hintSub: {
    fontSize: 11,
    fontFamily: FONT.regular,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  uploadBtnText: {
    fontSize: 14,
    fontFamily: FONT.semibold,
    color: "#fff",
  },
});
