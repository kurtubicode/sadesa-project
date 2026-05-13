import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import api from "@/lib/api";

const { width } = Dimensions.get("window");
const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Bukti {
  id: number;
  path_file: string;
}

interface Tanggapan {
  id: number;
  isi: string;
  created_at: string;
  user: { name: string; role: string };
}

interface DetailPengaduan {
  id: number;
  judul: string;
  deskripsi: string;
  status: string;
  created_at: string;
  kategori: { id: number; nama_kategori: string } | null;
  bukti: Bukti[];
  tanggapan: Tanggapan[];
}

// ─── Status & timeline config ─────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { warna: string; label: string; icon: string }> = {
  menunggu: { warna: "#FFC107", label: "Menunggu",  icon: "⏳" },
  diproses: { warna: "#17A2B8", label: "Diproses",  icon: "🔄" },
  selesai:  { warna: "#28A745", label: "Selesai",   icon: "✅" },
  ditolak:  { warna: "#DC3545", label: "Ditolak",   icon: "❌" },
};

const TIMELINE_STEPS = [
  { key: "menunggu", label: "Laporan Dikirim" },
  { key: "diproses", label: "Sedang Ditangani" },
  { key: "selesai",  label: "Selesai" },
];

function getStepState(stepKey: string, currentStatus: string): "done" | "active" | "pending" | "rejected" {
  if (currentStatus === "ditolak") {
    if (stepKey === "menunggu") return "done";
    if (stepKey === "diproses") return "rejected";
    return "pending";
  }
  const order = TIMELINE_STEPS.map((s) => s.key);
  const currentIdx = order.indexOf(currentStatus);
  const stepIdx    = order.indexOf(stepKey);
  if (stepIdx < currentIdx)  return "done";
  if (stepIdx === currentIdx) return "active";
  return "pending";
}

function formatTgl(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function formatTglWaktu(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const ROLE_LABEL: Record<string, string> = {
  admin:       "Admin",
  staff:       "Petugas",
  kepala_desa: "Kepala Desa",
  warga:       "Warga",
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DetailPengaduanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();

  const [data, setData]         = useState<DetailPengaduan | null>(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get(`/api/pengaduan/${id}`);
      setData(res.data.data ?? res.data);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        Alert.alert("Tidak Ditemukan", "Pengaduan tidak ditemukan.", [
          { text: "Kembali", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Error", "Gagal memuat detail pengaduan.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, [id]));

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Data tidak ditemukan.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cfg = STATUS_CONFIG[data.status] ?? { warna: "#999", label: data.status, icon: "❓" };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor="#4A90E2" />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header card ── */}
      <View style={styles.headerCard}>
        {data.kategori && (
          <Text style={styles.kategoriText}>
            🏷️ {data.kategori.nama_kategori}
          </Text>
        )}
        <Text style={styles.judul}>{data.judul}</Text>
        <Text style={styles.tanggal}>Dilaporkan: {formatTgl(data.created_at)}</Text>

        <View style={[styles.statusBadge, { backgroundColor: cfg.warna + "22" }]}>
          <Text style={[styles.statusBadgeText, { color: cfg.warna }]}>
            {cfg.icon}  {cfg.label}
          </Text>
        </View>
      </View>

      {/* ── Deskripsi ── */}
      <Text style={styles.sectionLabel}>Deskripsi Laporan</Text>
      <View style={styles.contentCard}>
        <Text style={styles.deskripsiText}>{data.deskripsi}</Text>
      </View>

      {/* ── Timeline status ── */}
      <Text style={styles.sectionLabel}>Perkembangan Status</Text>
      <View style={styles.timelineCard}>
        {TIMELINE_STEPS.map((step, idx) => {
          const state = getStepState(step.key, data.status);
          const isLast = idx === TIMELINE_STEPS.length - 1;
          return (
            <View key={step.key} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View style={[
                  styles.dot,
                  state === "done"     && styles.dotDone,
                  state === "active"   && styles.dotActive,
                  state === "rejected" && styles.dotRejected,
                ]} />
                {!isLast && (
                  <View style={[styles.line, state === "done" && styles.lineDone]} />
                )}
              </View>
              <Text style={[
                styles.tlLabel,
                state === "done"     && styles.tlLabelDone,
                state === "active"   && styles.tlLabelActive,
                state === "rejected" && styles.tlLabelRejected,
              ]}>
                {step.label}
                {state === "active" && data.status !== "ditolak" && "  ◀ saat ini"}
              </Text>
            </View>
          );
        })}
        {data.status === "ditolak" && (
          <View style={styles.timelineRow}>
            <View style={[styles.dot, styles.dotRejected]} />
            <Text style={styles.tlLabelRejected}>❌ Pengaduan Ditolak</Text>
          </View>
        )}
      </View>

      {/* ── Bukti foto ── */}
      {data.bukti.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>Foto Bukti ({data.bukti.length})</Text>
          <View style={styles.fotoGrid}>
            {data.bukti.map((b) => {
              const uri = b.path_file.startsWith("http")
                ? b.path_file
                : `${API_BASE}/storage/${b.path_file}`;
              return (
                <View key={b.id} style={styles.fotoBox}>
                  <Image
                    source={{ uri }}
                    style={styles.foto}
                    resizeMode="cover"
                    onError={() => {}}
                  />
                </View>
              );
            })}
          </View>
        </>
      )}

      {/* ── Tanggapan ── */}
      <Text style={styles.sectionLabel}>
        Tanggapan Petugas {data.tanggapan.length > 0 ? `(${data.tanggapan.length})` : ""}
      </Text>
      {data.tanggapan.length === 0 ? (
        <View style={styles.emptyTanggapan}>
          <Text style={styles.emptyTanggapanText}>
            💬 Belum ada tanggapan dari petugas.
          </Text>
        </View>
      ) : (
        <View style={styles.tanggapanList}>
          {data.tanggapan.map((t) => {
            const isOfficer = t.user.role !== "warga";
            return (
              <View key={t.id} style={[
                styles.bubble,
                isOfficer ? styles.bubbleOfficer : styles.bubbleWarga,
              ]}>
                <View style={styles.bubbleHeader}>
                  <Text style={[styles.bubbleName, isOfficer && styles.bubbleNameOfficer]}>
                    {isOfficer ? "🛡️ " : "👤 "}
                    {t.user.name} · {ROLE_LABEL[t.user.role] ?? t.user.role}
                  </Text>
                  <Text style={styles.bubbleTgl}>{formatTglWaktu(t.created_at)}</Text>
                </View>
                <Text style={[styles.bubbleIsi, isOfficer && styles.bubbleIsiOfficer]}>
                  {t.isi}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: "#F5F5F5" },
  center:    { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  errorText: { fontSize: 15, color: "#888", marginBottom: 12 },
  backBtn:   { padding: 12, borderRadius: 8, backgroundColor: "#EEE" },
  backBtnText: { color: "#555", fontWeight: "600" },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 20,
    marginBottom: 8,
  },

  // Header card
  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  kategoriText: { fontSize: 12, fontWeight: "700", color: "#4A90E2", marginBottom: 6 },
  judul:        { fontSize: 20, fontWeight: "700", color: "#111", marginBottom: 6 },
  tanggal:      { fontSize: 13, color: "#999", marginBottom: 12 },
  statusBadge:  { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusBadgeText: { fontSize: 13, fontWeight: "700" },

  // Deskripsi
  contentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    elevation: 1,
  },
  deskripsiText: { fontSize: 14, color: "#333", lineHeight: 22 },

  // Timeline
  timelineCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineRow:  { flexDirection: "row", alignItems: "flex-start" },
  timelineLeft: { alignItems: "center", width: 24, marginRight: 12 },
  dot:          { width: 14, height: 14, borderRadius: 7, backgroundColor: "#DDD", borderWidth: 2, borderColor: "#CCC" },
  dotDone:      { backgroundColor: "#28A745", borderColor: "#28A745" },
  dotActive:    { backgroundColor: "#4A90E2", borderColor: "#4A90E2", width: 18, height: 18, borderRadius: 9, marginLeft: -2 },
  dotRejected:  { backgroundColor: "#DC3545", borderColor: "#DC3545" },
  line:         { width: 2, height: 28, backgroundColor: "#E0E0E0", marginTop: 2 },
  lineDone:     { backgroundColor: "#28A745" },
  tlLabel:      { fontSize: 13, color: "#BBB", paddingTop: 0, marginBottom: 18 },
  tlLabelDone:  { color: "#28A745", fontWeight: "600" },
  tlLabelActive:{ color: "#4A90E2", fontWeight: "700" },
  tlLabelRejected: { color: "#DC3545", fontWeight: "700" },

  // Foto
  fotoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  fotoBox: {
    width: (width - 48) / 2,
    height: (width - 48) / 2,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#E0E0E0",
  },
  foto: { width: "100%", height: "100%" },

  // Tanggapan
  emptyTanggapan: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    elevation: 1,
  },
  emptyTanggapanText: { color: "#999", fontSize: 13 },

  tanggapanList: { gap: 10 },
  bubble: {
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    elevation: 1,
  },
  bubbleOfficer: { backgroundColor: "#EBF4FD", borderLeftWidth: 3, borderLeftColor: "#4A90E2" },
  bubbleWarga:   { backgroundColor: "#fff" },
  bubbleHeader:  { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  bubbleName:    { fontSize: 12, fontWeight: "600", color: "#666", flex: 1 },
  bubbleNameOfficer: { color: "#2078D4" },
  bubbleTgl:     { fontSize: 11, color: "#aaa", marginLeft: 8 },
  bubbleIsi:     { fontSize: 14, color: "#333", lineHeight: 20 },
  bubbleIsiOfficer: { color: "#1A5B9A" },
});
