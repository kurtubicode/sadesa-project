import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import api from "@/lib/api";

const { width } = Dimensions.get("window");
const PRIMARY   = "#4A90E2";
const MAX_FOTO  = 3;

interface KategoriAduan {
  id: number;
  nama_kategori: string;
  deskripsi: string;
}

interface FotoItem {
  uri: string;
  name: string;
  type: string;
}

export default function BuatPengaduanScreen() {
  const router = useRouter();

  const [kategoriList, setKategoriList] = useState<KategoriAduan[]>([]);
  const [selectedKat, setSelectedKat]   = useState<KategoriAduan | null>(null);
  const [judul, setJudul]               = useState("");
  const [deskripsi, setDeskripsi]       = useState("");
  const [fotos, setFotos]               = useState<FotoItem[]>([]);
  const [loadingKat, setLoadingKat]     = useState(true);
  const [submitting, setSubmitting]     = useState(false);

  useEffect(() => {
    api.get("/api/kategori-aduan")
      .then((r) => setKategoriList(r.data.data ?? r.data))
      .catch(() => Alert.alert("Error", "Gagal memuat kategori aduan."))
      .finally(() => setLoadingKat(false));
  }, []);

  // ── Pilih foto ──
  const handleTambahFoto = async () => {
    if (fotos.length >= MAX_FOTO) {
      Alert.alert("Batas Foto", `Maksimal ${MAX_FOTO} foto bukti.`);
      return;
    }

    Alert.alert("Tambah Foto", "Pilih sumber foto", [
      {
        text: "Kamera",
        onPress: async () => {
          const perm = await ImagePicker.requestCameraPermissionsAsync();
          if (!perm.granted) {
            Alert.alert("Izin Dibutuhkan", "Izin kamera diperlukan.");
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            quality: 0.7,
          });
          if (!result.canceled && result.assets.length > 0) {
            addFoto(result.assets[0]);
          }
        },
      },
      {
        text: "Galeri",
        onPress: async () => {
          const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!perm.granted) {
            Alert.alert("Izin Dibutuhkan", "Izin galeri diperlukan.");
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.7,
            allowsMultipleSelection: fotos.length < MAX_FOTO,
            selectionLimit: MAX_FOTO - fotos.length,
          });
          if (!result.canceled) {
            result.assets.forEach((a) => addFoto(a));
          }
        },
      },
      { text: "Batal", style: "cancel" },
    ]);
  };

  const addFoto = (asset: ImagePicker.ImagePickerAsset) => {
    const ext  = asset.uri.split(".").pop() ?? "jpg";
    const mime = asset.mimeType ?? `image/${ext}`;
    setFotos((prev) => [
      ...prev,
      { uri: asset.uri, name: `bukti_${Date.now()}_${prev.length}.${ext}`, type: mime },
    ].slice(0, MAX_FOTO));
  };

  const hapusFoto = (idx: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!selectedKat) return Alert.alert("Perhatian", "Pilih kategori pengaduan.");
    if (!judul.trim())     return Alert.alert("Perhatian", "Judul tidak boleh kosong.");
    if (!deskripsi.trim()) return Alert.alert("Perhatian", "Deskripsi tidak boleh kosong.");

    const formData = new FormData();
    formData.append("kategori_aduan_id", String(selectedKat.id));
    formData.append("judul",     judul.trim());
    formData.append("deskripsi", deskripsi.trim());

    // Upload semua foto sebagai array bukti[]
    fotos.forEach((f) => {
      formData.append("bukti[]", { uri: f.uri, name: f.name, type: f.type } as any);
    });

    setSubmitting(true);
    try {
      const res = await api.post("/api/pengaduan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newId = res.data.data?.id;
      Alert.alert(
        "Pengaduan Terkirim ✅",
        "Laporan Anda telah dikirim. Petugas akan menindaklanjuti dalam 1–3 hari kerja.",
        [
          {
            text: "Lihat Status",
            onPress: () => router.replace("/(tabs)/status"),
          },
          ...(newId ? [{
            text: "Lihat Detail",
            onPress: () => router.replace(`/pengaduan/${newId}` as any),
          }] : []),
        ],
      );
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Gagal mengirim pengaduan.";
      Alert.alert("Gagal", msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingKat) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Kategori ── */}
      <Text style={styles.label}>
        Kategori Pengaduan <Text style={styles.required}>*</Text>
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {kategoriList.map((kat) => {
          const active = selectedKat?.id === kat.id;
          return (
            <TouchableOpacity
              key={kat.id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setSelectedKat(kat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {kat.nama_kategori}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {selectedKat?.deskripsi ? (
        <Text style={styles.katDesc}>ℹ️ {selectedKat.deskripsi}</Text>
      ) : null}

      {/* ── Judul ── */}
      <Text style={[styles.label, { marginTop: 20 }]}>
        Judul Pengaduan <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: Jalan rusak di Gang Mawar RT 02"
        placeholderTextColor="#bbb"
        value={judul}
        onChangeText={setJudul}
        maxLength={100}
      />

      {/* ── Deskripsi ── */}
      <Text style={[styles.label, { marginTop: 16 }]}>
        Deskripsi Lengkap <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.textArea}
        placeholder="Jelaskan secara rinci — lokasi, waktu kejadian, dampak yang dirasakan, dll."
        placeholderTextColor="#bbb"
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        value={deskripsi}
        onChangeText={setDeskripsi}
        maxLength={2000}
      />
      <Text style={styles.charCount}>{deskripsi.length}/2000</Text>

      {/* ── Foto bukti ── */}
      <View style={styles.fotoHeader}>
        <Text style={[styles.label, { marginBottom: 0 }]}>
          Foto Bukti{" "}
          <Text style={styles.optional}>(Maks. {MAX_FOTO} foto)</Text>
        </Text>
        <Text style={styles.fotoCounter}>{fotos.length}/{MAX_FOTO}</Text>
      </View>

      <View style={styles.fotoGrid}>
        {/* Preview foto yang sudah dipilih */}
        {fotos.map((f, idx) => (
          <View key={idx} style={styles.fotoItem}>
            <Image source={{ uri: f.uri }} style={styles.fotoThumb} resizeMode="cover" />
            <TouchableOpacity
              style={styles.fotoHapus}
              onPress={() => hapusFoto(idx)}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            >
              <Text style={styles.fotoHapusText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Tombol tambah foto */}
        {fotos.length < MAX_FOTO && (
          <TouchableOpacity
            style={styles.fotoAdd}
            onPress={handleTambahFoto}
            activeOpacity={0.7}
          >
            <Text style={styles.fotoAddIcon}>📷</Text>
            <Text style={styles.fotoAddText}>
              {fotos.length === 0 ? "Tambah Foto" : "Tambah Lagi"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Info ── */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          ℹ️ Pengaduan akan diproses dalam 1–3 hari kerja. Harap lampirkan foto yang jelas
          dan deskripsi yang akurat agar petugas dapat segera menindaklanjuti.
        </Text>
      </View>

      {/* ── Submit ── */}
      <TouchableOpacity
        style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
        activeOpacity={0.85}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitBtnText}>📢  Kirim Pengaduan</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ─── Foto grid size ───────────────────────────────────────────────────────────

const FOTO_SIZE = (width - 32 - 24) / 3; // 3 columns, padding 16 each side, gap 12

const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: "#F5F5F5" },
  center:   { flex: 1, justifyContent: "center", alignItems: "center" },
  label:    { fontSize: 13, fontWeight: "700", color: "#444", marginBottom: 8, marginTop: 4 },
  required: { color: "#DC3545" },
  optional: { fontWeight: "400", color: "#999" },

  chipScroll:    { marginBottom: 6 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#DDD",
    marginRight: 8,
  },
  chipActive:    { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipText:      { fontSize: 13, color: "#555", fontWeight: "600" },
  chipTextActive:{ color: "#fff" },
  katDesc:       { fontSize: 12, color: "#888", marginBottom: 4, lineHeight: 17 },

  input: {
    backgroundColor: "#fff", borderRadius: 10, padding: 12,
    fontSize: 14, color: "#222", borderWidth: 1, borderColor: "#DDD",
  },
  textArea: {
    backgroundColor: "#fff", borderRadius: 10, padding: 12,
    fontSize: 14, color: "#222", borderWidth: 1, borderColor: "#DDD",
    minHeight: 120,
  },
  charCount: { textAlign: "right", fontSize: 11, color: "#ccc", marginTop: 4 },

  // Foto
  fotoHeader:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20, marginBottom: 10 },
  fotoCounter:  { fontSize: 13, color: PRIMARY, fontWeight: "700" },
  fotoGrid:     { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  fotoItem: {
    width: FOTO_SIZE,
    height: FOTO_SIZE,
    borderRadius: 10,
    overflow: "visible",
    position: "relative",
  },
  fotoThumb: {
    width: FOTO_SIZE,
    height: FOTO_SIZE,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
  },
  fotoHapus: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#DC3545",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  fotoHapusText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  fotoAdd: {
    width: FOTO_SIZE,
    height: FOTO_SIZE,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: PRIMARY,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EBF4FD",
  },
  fotoAddIcon: { fontSize: 24, marginBottom: 4 },
  fotoAddText: { fontSize: 11, color: PRIMARY, fontWeight: "600" },

  infoBox: {
    backgroundColor: "#EBF4FD", borderRadius: 10, padding: 12,
    marginTop: 20, borderLeftWidth: 3, borderLeftColor: PRIMARY,
  },
  infoText: { fontSize: 12, color: "#1A5B9A", lineHeight: 18 },

  submitBtn: {
    backgroundColor: PRIMARY, borderRadius: 12,
    padding: 16, alignItems: "center", marginTop: 20,
    shadowColor: PRIMARY, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  submitBtnDisabled: { backgroundColor: "#A0C4F1", elevation: 0, shadowOpacity: 0 },
  submitBtnText:     { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
