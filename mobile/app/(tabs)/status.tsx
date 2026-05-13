import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
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
  catatan: string | null;
}

interface PengaduanItem {
  id: number;
  judul: string;
  status: string;
  tanggal: string;
}

// ─── Status configs ───────────────────────────────────────────────────────────

const PENGAJUAN_STATUS: Record<string, { warna: string; label: string; icon: string }> = {
  menunggu:             { warna: "#FFC107", label: "Menunggu",              icon: "⏳" },
  diproses:             { warna: "#17A2B8", label: "Diproses",              icon: "🔄" },
  diverifikasi:         { warna: "#4A90E2", label: "Diverifikasi",          icon: "✅" },
  ditolak_staff:        { warna: "#DC3545", label: "Ditolak Petugas",       icon: "❌" },
  menunggu_pengesahan:  { warna: "#6F42C1", label: "Menunggu Pengesahan",   icon: "📋" },
  disetujui:            { warna: "#28A745", label: "Disetujui",             icon: "✅" },
  ditolak_kepala:       { warna: "#DC3545", label: "Ditolak Kepala Desa",   icon: "❌" },
  selesai:              { warna: "#28A745", label: "Selesai",               icon: "🎉" },
  dibatalkan:           { warna: "#6C757D", label: "Dibatalkan",            icon: "🚫" },
};

const PENGADUAN_STATUS: Record<string, { warna: string; label: string; icon: string }> = {
  menunggu: { warna: "#FFC107", label: "Menunggu", icon: "⏳" },
  diproses: { warna: "#17A2B8", label: "Diproses", icon: "🔄" },
  selesai:  { warna: "#28A745", label: "Selesai",  icon: "✅" },
  ditolak:  { warna: "#DC3545", label: "Ditolak",  icon: "❌" },
};

// ─── Timeline mini ────────────────────────────────────────────────────────────

const PENGAJUAN_STEPS = ["menunggu", "diproses", "diverifikasi", "menunggu_pengesahan", "selesai"];

function MiniTimeline({ status }: { status: string }) {
  const isRejected = ["ditolak_staff", "ditolak_kepala", "dibatalkan"].includes(status);
  const currentIdx = isRejected
    ? PENGAJUAN_STEPS.indexOf("diverifikasi")
    : PENGAJUAN_STEPS.indexOf(status === "disetujui" ? "selesai" : status);

  return (
    <View style={tlStyles.row}>
      {PENGAJUAN_STEPS.map((step, idx) => {
        const isDone   = idx < currentIdx;
        const isActive = idx === currentIdx && !isRejected;
        const isFail   = isRejected && idx === currentIdx;
        return (
          <View key={step} style={tlStyles.step}>
            <View style={[
              tlStyles.dot,
              isDone   && tlStyles.dotDone,
              isActive && tlStyles.dotActive,
              isFail   && tlStyles.dotFail,
            ]} />
            {idx < PENGAJUAN_STEPS.length - 1 && (
              <View style={[tlStyles.line, isDone && tlStyles.lineDone, isFail && tlStyles.lineFail]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const tlStyles = StyleSheet.create({
  row:      { flexDirection: "row", alignItems: "center", marginTop: 10 },
  step:     { flexDirection: "row", alignItems: "center" },
  dot:      { width: 10, height: 10, borderRadius: 5, backgroundColor: "#DDD" },
  dotDone:  { backgroundColor: "#28A745" },
  dotActive:{ backgroundColor: "#4A90E2", width: 12, height: 12, borderRadius: 6 },
  dotFail:  { backgroundColor: "#DC3545" },
  line:     { width: 22, height: 2, backgroundColor: "#DDD" },
  lineDone: { backgroundColor: "#28A745" },
  lineFail: { backgroundColor: "#DC3545" },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function StatusScreen() {
  const router = useRouter();
  const [tab, setTab]               = useState<"pengajuan" | "pengaduan">("pengajuan");
  const [pengajuan, setPengajuan]   = useState<PengajuanItem[]>([]);
  const [pengaduan, setPengaduan]   = useState<PengaduanItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("semua");

  const fetchData = async () => {
    try {
      const [ajRes, aduRes] = await Promise.all([
        api.get("/api/pengajuan?per_page=50"),
        api.get("/api/pengaduan?per_page=50"),
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

  useFocusEffect(useCallback(() => { setLoading(true); setFilterStatus("semua"); fetchData(); }, []));

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  // Filter chips
  const PENGAJUAN_FILTERS = ["semua", "menunggu", "diproses", "selesai", "ditolak_staff", "ditolak_kepala"];
  const PENGADUAN_FILTERS = ["semua", "menunggu", "diproses", "selesai", "ditolak"];

  const filters = tab === "pengajuan" ? PENGAJUAN_FILTERS : PENGADUAN_FILTERS;

  const filteredPengajuan = filterStatus === "semua"
    ? pengajuan
    : pengajuan.filter((i) => i.status === filterStatus);

  const filteredPengaduan = filterStatus === "semua"
    ? pengaduan
    : pengaduan.filter((i) => i.status === filterStatus);

  return (
    <View style={styles.screen}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat & Status</Text>
        <Text style={styles.headerSub}>Pantau semua pengajuan & pengaduan</Text>
      </View>

      {/* ── Tab pengajuan / pengaduan ── */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "pengajuan" && styles.tabBtnActive]}
          onPress={() => { setTab("pengajuan"); setFilterStatus("semua"); }}
        >
          <Text style={[styles.tabBtnText, tab === "pengajuan" && styles.tabBtnTextActive]}>
            📄 Pengajuan Surat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "pengaduan" && styles.tabBtnActive]}
          onPress={() => { setTab("pengaduan"); setFilterStatus("semua"); }}
        >
          <Text style={[styles.tabBtnText, tab === "pengaduan" && styles.tabBtnTextActive]}>
            📢 Pengaduan
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Filter chips ── */}
      <FlatList
        data={filters}
        keyExtractor={(i) => i}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item: f }) => {
          const label = f === "semua" ? "Semua"
            : tab === "pengajuan"
              ? (PENGAJUAN_STATUS[f]?.label ?? f)
              : (PENGADUAN_STATUS[f]?.label ?? f);
          return (
            <TouchableOpacity
              style={[styles.filterChip, filterStatus === f && styles.filterChipActive]}
              onPress={() => setFilterStatus(f)}
            >
              <Text style={[styles.filterChipText, filterStatus === f && styles.filterChipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* ── List ── */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : tab === "pengajuan" ? (
        filteredPengajuan.length === 0 ? (
          <EmptyState icon="📄" text="Tidak ada pengajuan." />
        ) : (
          <FlatList
            data={filteredPengajuan}
            keyExtractor={(i) => String(i.id)}
            contentContainerStyle={{ padding: 16 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4A90E2" />}
            renderItem={({ item }) => {
              const cfg = PENGAJUAN_STATUS[item.status] ?? { warna: "#999", label: item.status, icon: "❓" };
              return (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => router.push(`/pengajuan/${item.id}` as any)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardTop}>
                    <Text style={styles.cardNo}>{item.no_pengajuan}</Text>
                    <View style={[styles.pill, { backgroundColor: cfg.warna + "22" }]}>
                      <Text style={[styles.pillText, { color: cfg.warna }]}>
                        {cfg.icon} {cfg.label}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.cardTitle}>{item.jenis_surat}</Text>
                  <Text style={styles.cardDate}>Diajukan: {item.tanggal}</Text>
                  <MiniTimeline status={item.status} />
                  {item.catatan ? (
                    <Text style={styles.catatan} numberOfLines={2}>📝 {item.catatan}</Text>
                  ) : null}
                </TouchableOpacity>
              );
            }}
          />
        )
      ) : (
        filteredPengaduan.length === 0 ? (
          <EmptyState icon="📢" text="Tidak ada pengaduan." />
        ) : (
          <FlatList
            data={filteredPengaduan}
            keyExtractor={(i) => String(i.id)}
            contentContainerStyle={{ padding: 16 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4A90E2" />}
            renderItem={({ item }) => {
              const cfg = PENGADUAN_STATUS[item.status] ?? { warna: "#999", label: item.status, icon: "❓" };
              return (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => router.push(`/pengaduan/${item.id}` as any)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardTop}>
                    <Text style={styles.cardNo}>Pengaduan #{item.id}</Text>
                    <View style={[styles.pill, { backgroundColor: cfg.warna + "22" }]}>
                      <Text style={[styles.pillText, { color: cfg.warna }]}>
                        {cfg.icon} {cfg.label}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.cardTitle}>{item.judul}</Text>
                  <Text style={styles.cardDate}>Dilaporkan: {item.tanggal}</Text>
                </TouchableOpacity>
              );
            }}
          />
        )
      )}
    </View>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.center}>
      <Text style={{ fontSize: 42, marginBottom: 10 }}>{icon}</Text>
      <Text style={{ fontSize: 14, color: "#aaa" }}>{text}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: "#F5F5F5" },
  center:  { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 60 },

  header: {
    backgroundColor: "#4A90E2",
    paddingTop: 52,
    paddingBottom: 18,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  headerSub:   { fontSize: 13, color: "#CCE4FF", marginTop: 2 },

  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: "#E8EEF6",
    borderRadius: 10,
    padding: 3,
  },
  tabBtn:         { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 8 },
  tabBtnActive:   { backgroundColor: "#fff", elevation: 2, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 3 },
  tabBtnText:     { fontSize: 12, fontWeight: "600", color: "#999" },
  tabBtnTextActive: { color: "#4A90E2" },

  filterRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  filterChipActive:    { backgroundColor: "#4A90E2", borderColor: "#4A90E2" },
  filterChipText:      { fontSize: 12, color: "#666", fontWeight: "600" },
  filterChipTextActive:{ color: "#fff" },

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
  catatan:   { fontSize: 12, color: "#666", marginTop: 6, fontStyle: "italic" },
  pill:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  pillText:  { fontSize: 11, fontWeight: "700" },
});
