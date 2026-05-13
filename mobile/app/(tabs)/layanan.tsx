import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PengajuanItem {
  id: number;
  no_pengajuan: string;
  jenis_surat: string;
  status: string;
  tanggal: string;
}

interface PengaduanItem {
  id: number;
  judul: string;
  status: string;
  tanggal: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const PENGAJUAN_STATUS: Record<string, { warna: string; label: string }> = {
  menunggu:             { warna: "#FFC107", label: "Menunggu" },
  diproses:             { warna: "#17A2B8", label: "Diproses" },
  diverifikasi:         { warna: "#4A90E2", label: "Diverifikasi" },
  ditolak_staff:        { warna: "#DC3545", label: "Ditolak Petugas" },
  menunggu_pengesahan:  { warna: "#6F42C1", label: "Menunggu Pengesahan" },
  disetujui:            { warna: "#28A745", label: "Disetujui" },
  ditolak_kepala:       { warna: "#DC3545", label: "Ditolak" },
  selesai:              { warna: "#28A745", label: "Selesai ✓" },
  dibatalkan:           { warna: "#6C757D", label: "Dibatalkan" },
};

const PENGADUAN_STATUS: Record<string, { warna: string; label: string }> = {
  menunggu: { warna: "#FFC107", label: "Menunggu" },
  diproses: { warna: "#17A2B8", label: "Diproses" },
  selesai:  { warna: "#28A745", label: "Selesai ✓" },
  ditolak:  { warna: "#DC3545", label: "Ditolak" },
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function StatusPill({ config }: { config: { warna: string; label: string } }) {
  return (
    <View style={[styles.pill, { backgroundColor: config.warna + "22" }]}>
      <Text style={[styles.pillText, { color: config.warna }]}>{config.label}</Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function LayananScreen() {
  const router = useRouter();
  const [tab, setTab]                     = useState<"pengajuan" | "pengaduan">("pengajuan");
  const [pengajuan, setPengajuan]         = useState<PengajuanItem[]>([]);
  const [pengaduan, setPengaduan]         = useState<PengaduanItem[]>([]);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);

  const fetchData = async () => {
    try {
      const [ajRes, aduRes] = await Promise.all([
        api.get("/api/pengajuan?per_page=10"),
        api.get("/api/pengaduan?per_page=10"),
      ]);
      setPengajuan(ajRes.data.data ?? []);
      setPengaduan(aduRes.data.data ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, []));

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  return (
    <View style={styles.screen}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Layanan Saya</Text>
        <Text style={styles.headerSub}>Pengajuan & Pengaduan</Text>
      </View>

      {/* ── Tombol aksi ── */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#4A90E2" }]}
          onPress={() => router.push("/pengajuan/buat")}
          activeOpacity={0.85}
        >
          <Text style={styles.actionBtnText}>📝  Ajukan Surat Baru</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#E07B39" }]}
          onPress={() => router.push("/pengaduan/buat")}
          activeOpacity={0.85}
        >
          <Text style={styles.actionBtnText}>📢  Buat Pengaduan</Text>
        </TouchableOpacity>
      </View>

      {/* ── Tab switcher ── */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "pengajuan" && styles.tabBtnActive]}
          onPress={() => setTab("pengajuan")}
        >
          <Text style={[styles.tabBtnText, tab === "pengajuan" && styles.tabBtnTextActive]}>
            Pengajuan Surat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "pengaduan" && styles.tabBtnActive]}
          onPress={() => setTab("pengaduan")}
        >
          <Text style={[styles.tabBtnText, tab === "pengaduan" && styles.tabBtnTextActive]}>
            Pengaduan
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── List ── */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4A90E2" />}
          showsVerticalScrollIndicator={false}
        >
          {tab === "pengajuan" ? (
            pengajuan.length === 0 ? (
              <EmptyState icon="📄" text="Belum ada pengajuan surat." />
            ) : (
              pengajuan.map((item) => {
                const cfg = PENGAJUAN_STATUS[item.status] ?? { warna: "#999", label: item.status };
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.card}
                    onPress={() => router.push(`/pengajuan/${item.id}` as any)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.cardTop}>
                      <Text style={styles.cardNo}>{item.no_pengajuan}</Text>
                      <StatusPill config={cfg} />
                    </View>
                    <Text style={styles.cardTitle}>{item.jenis_surat}</Text>
                    <Text style={styles.cardDate}>Diajukan: {item.tanggal}</Text>
                  </TouchableOpacity>
                );
              })
            )
          ) : (
            pengaduan.length === 0 ? (
              <EmptyState icon="📢" text="Belum ada pengaduan." />
            ) : (
              pengaduan.map((item) => {
                const cfg = PENGADUAN_STATUS[item.status] ?? { warna: "#999", label: item.status };
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.card}
                    onPress={() => router.push(`/pengaduan/${item.id}` as any)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.cardTop}>
                      <Text style={styles.cardNo}>#{item.id}</Text>
                      <StatusPill config={cfg} />
                    </View>
                    <Text style={styles.cardTitle}>{item.judul}</Text>
                    <Text style={styles.cardDate}>Dilaporkan: {item.tanggal}</Text>
                  </TouchableOpacity>
                );
              })
            )
          )}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </View>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F5F5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 60 },

  header: {
    backgroundColor: "#4A90E2",
    paddingTop: 52,
    paddingBottom: 18,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  headerSub:   { fontSize: 13, color: "#CCE4FF", marginTop: 2 },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
  },
  actionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 2,
    backgroundColor: "#E8EEF6",
    borderRadius: 10,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  tabBtnActive: { backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  tabBtnText:       { fontSize: 13, fontWeight: "600", color: "#999" },
  tabBtnTextActive: { color: "#4A90E2" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTop:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  cardNo:    { fontSize: 11, color: "#aaa", fontWeight: "600" },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#222", marginBottom: 4 },
  cardDate:  { fontSize: 12, color: "#999" },
  pill:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  pillText:  { fontSize: 11, fontWeight: "700" },

  emptyBox:  { alignItems: "center", paddingVertical: 48 },
  emptyIcon: { fontSize: 42, marginBottom: 10 },
  emptyText: { fontSize: 14, color: "#aaa", textAlign: "center" },
});
