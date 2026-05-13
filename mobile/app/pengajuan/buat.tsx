import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import api from "@/lib/api";

interface MasterSurat {
  id: number;
  kode: string;
  nama_surat: string;
  persyaratan: string | null;
}

const PRIMARY = "#4A90E2";

export default function BuatPengajuanScreen() {
  const router = useRouter();

  const [masterList, setMasterList]   = useState<MasterSurat[]>([]);
  const [selected, setSelected]       = useState<MasterSurat | null>(null);
  const [keterangan, setKeterangan]   = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => {
    api.get("/api/master-surat")
      .then((r) => setMasterList(r.data.data ?? r.data))
      .catch(() => Alert.alert("Error", "Gagal memuat daftar surat."))
      .finally(() => setLoadingList(false));
  }, []);

  const handleSubmit = async () => {
    if (!selected) {
      Alert.alert("Perhatian", "Pilih jenis surat terlebih dahulu.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("/api/pengajuan", {
        master_surat_id: selected.id,
        data_formulir: keterangan.trim() ? { keterangan: keterangan.trim() } : null,
      });
      const newId = res.data.data?.id;
      Alert.alert(
        "Pengajuan Terkirim ✅",
        `Nomor: ${res.data.data?.no_pengajuan ?? "—"}\n\nPetugas akan memverifikasi pengajuan Anda. Pantau status di tab Status.`,
        [
          {
            text: "Lihat Status",
            onPress: () => router.replace("/(tabs)/status"),
          },
          {
            text: "Unggah Dokumen",
            onPress: () => newId
              ? router.replace(`/pengajuan/${newId}` as any)
              : router.replace("/(tabs)/layanan"),
          },
        ],
      );
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Gagal mengirim pengajuan.";
      Alert.alert("Gagal", msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingList) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text style={styles.loadingText}>Memuat daftar surat…</Text>
      </View>
    );
  }

  if (masterList.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>📄</Text>
        <Text style={styles.emptyText}>Belum ada jenis surat yang tersedia.</Text>
        <Text style={styles.emptySubtext}>Silakan hubungi kantor desa.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Pilih jenis surat */}
      <Text style={styles.sectionTitle}>Pilih Jenis Surat <Text style={styles.required}>*</Text></Text>
      <Text style={styles.sectionHint}>Pilih sesuai kebutuhan Anda</Text>

      {masterList.map((item) => {
        const active = selected?.id === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, active && styles.cardActive]}
            onPress={() => setSelected(item)}
            activeOpacity={0.8}
          >
            <View style={styles.cardRow}>
              <View style={[styles.radio, active && styles.radioActive]}>
                {active && <View style={styles.radioDot} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, active && styles.cardTitleActive]}>
                  {item.nama_surat}
                </Text>
                <Text style={styles.cardCode}>{item.kode}</Text>
              </View>
              {active && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Persyaratan */}
      {selected?.persyaratan ? (
        <View style={styles.persyaratanBox}>
          <Text style={styles.persyaratanTitle}>📋 Persyaratan Dokumen</Text>
          <Text style={styles.persyaratanText}>{selected.persyaratan}</Text>
          <Text style={styles.persyaratanNote}>
            ℹ️ Anda dapat mengunggah dokumen setelah pengajuan dikirim.
          </Text>
        </View>
      ) : null}

      {/* Keterangan tambahan */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Keterangan Tambahan</Text>
      <Text style={styles.sectionHint}>Informasi pendukung (opsional)</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Contoh: untuk keperluan menikah, alamat tujuan, dll."
        placeholderTextColor="#bbb"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        value={keterangan}
        onChangeText={setKeterangan}
        maxLength={500}
      />
      {keterangan.length > 0 && (
        <Text style={styles.charCount}>{keterangan.length}/500</Text>
      )}

      {/* Reminder */}
      <View style={styles.reminderBox}>
        <Text style={styles.reminderText}>
          ℹ️  Setelah pengajuan dikirim, Anda dapat mengunggah dokumen persyaratan.
          Petugas akan memverifikasi dan menghubungi Anda jika ada kekurangan.
        </Text>
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitBtn, (!selected || submitting) && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={!selected || submitting}
        activeOpacity={0.85}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitBtnText}>
            📤  Kirim Pengajuan{selected ? ` — ${selected.nama_surat}` : ""}
          </Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: "#F5F5F5" },
  center:       { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  loadingText:  { marginTop: 10, color: "#888", fontSize: 14 },
  emptyIcon:    { fontSize: 48, marginBottom: 10 },
  emptyText:    { fontSize: 16, fontWeight: "600", color: "#333" },
  emptySubtext: { fontSize: 13, color: "#888", marginTop: 4 },

  sectionTitle: { fontSize: 13, fontWeight: "700", color: "#444", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  sectionHint:  { fontSize: 12, color: "#999", marginBottom: 12 },
  required:     { color: "#DC3545" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardActive:      { borderColor: PRIMARY, backgroundColor: "#EBF4FD" },
  cardRow:         { flexDirection: "row", alignItems: "center", gap: 12 },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: "#CCC",
    justifyContent: "center", alignItems: "center",
    flexShrink: 0,
  },
  radioActive:     { borderColor: PRIMARY },
  radioDot:        { width: 10, height: 10, borderRadius: 5, backgroundColor: PRIMARY },
  cardTitle:       { fontSize: 15, fontWeight: "600", color: "#222", flex: 1 },
  cardTitleActive: { color: "#1A5FB4" },
  cardCode:        { fontSize: 11, color: "#999", marginTop: 2 },
  checkmark:       { fontSize: 16, color: PRIMARY, fontWeight: "700" },

  persyaratanBox: {
    backgroundColor: "#FFF8E1",
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
    marginTop: 4,
    marginBottom: 4,
  },
  persyaratanTitle: { fontSize: 13, fontWeight: "700", color: "#8B6914", marginBottom: 8 },
  persyaratanText:  { fontSize: 13, color: "#5A4000", lineHeight: 20, marginBottom: 8 },
  persyaratanNote:  { fontSize: 11, color: "#8B6914", fontStyle: "italic" },

  textArea: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#222",
    borderWidth: 1,
    borderColor: "#DDD",
    minHeight: 100,
  },
  charCount: { textAlign: "right", fontSize: 11, color: "#bbb", marginTop: 4 },

  reminderBox: {
    backgroundColor: "#EBF4FD",
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY,
  },
  reminderText: { fontSize: 12, color: "#1A5B9A", lineHeight: 18 },

  submitBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: PRIMARY,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: { backgroundColor: "#A0C4F1", elevation: 0, shadowOpacity: 0 },
  submitBtnText:     { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
