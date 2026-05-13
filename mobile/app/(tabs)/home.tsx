import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getUser, UserData } from "@/lib/userStorage";
import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MasterSurat {
  id: number;
  nama: string;
  kode: string;
}

interface InformasiItem {
  id: number;
  judul: string;
  slug: string;
  tipe: string;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function maskNIK(nik: string | null | undefined): string {
  if (!nik || nik.length < 8) return nik ?? "—";
  return nik.slice(0, 4) + " •••• •••• " + nik.slice(-4);
}

function formatTgl(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ─── Sub-komponen ─────────────────────────────────────────────────────────────

function LayananCard({ nama, kode, onPress }: { nama: string; kode: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.layananCard} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.layananIconBox}>
        <Text style={styles.layananIcon}>📄</Text>
      </View>
      <Text style={styles.layananKode}>{kode}</Text>
      <Text style={styles.layananNama} numberOfLines={2}>{nama}</Text>
    </TouchableOpacity>
  );
}

function InformasiCard({ item, onPress }: { item: InformasiItem; onPress: () => void }) {
  const isBerita = item.tipe === "berita";
  return (
    <TouchableOpacity style={styles.infoCard} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.infoBadge, { backgroundColor: isBerita ? "#EBF4FD" : "#FFF8E6" }]}>
        <Text style={[styles.infoBadgeText, { color: isBerita ? "#2078D4" : "#B07A00" }]}>
          {isBerita ? "📰 Berita" : "📢 Pengumuman"}
        </Text>
      </View>
      <Text style={styles.infoJudul} numberOfLines={2}>{item.judul}</Text>
      <Text style={styles.infoTgl}>{formatTgl(item.created_at)}</Text>
    </TouchableOpacity>
  );
}

// ─── Screen utama ─────────────────────────────────────────────────────────────

export default function BerandaScreen() {
  const router = useRouter();
  const [user, setUser]                   = useState<UserData | null>(null);
  const [masterSurat, setMasterSurat]     = useState<MasterSurat[]>([]);
  const [informasi, setInformasi]         = useState<InformasiItem[]>([]);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);

  const loadData = async () => {
    const u = await getUser();
    if (!u) { router.replace("/"); return; }
    setUser(u);

    try {
      const [suratRes, infoRes] = await Promise.all([
        api.get("/api/master-surat"),
        api.get("/api/informasi?per_page=3"),
      ]);
      setMasterSurat(suratRes.data.data ?? suratRes.data ?? []);
      setInformasi(infoRes.data.data ?? []);
    } catch {
      // gagal fetch, tampilkan data kosong
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { setLoading(true); loadData(); }, []));

  const onRefresh = () => { setRefreshing(true); loadData(); };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Memuat beranda…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4A90E2" />}
    >
      {/* ── Hero ── */}
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroGreeting}>Halo, {user?.name?.split(" ")[0]} 👋</Text>
            <Text style={styles.heroSubtitle}>Selamat datang di SADESA</Text>
          </View>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>🏛️</Text>
          </View>
        </View>

        {/* NIK card */}
        <View style={styles.nikCard}>
          <Text style={styles.nikLabel}>NIK</Text>
          <Text style={styles.nikValue}>{maskNIK(user?.nik)}</Text>
          <Text style={styles.nikDesc}>Desa Cirangkong · Kec. Cijambe</Text>
        </View>
      </View>

      {/* ── Aksi cepat ── */}
      <View style={styles.aksiRow}>
        <TouchableOpacity
          style={[styles.aksiCard, { backgroundColor: "#4A90E2" }]}
          onPress={() => router.push("/pengajuan/buat")}
          activeOpacity={0.85}
        >
          <Text style={styles.aksiIcon}>📝</Text>
          <Text style={styles.aksiLabel}>Ajukan Surat</Text>
          <Text style={styles.aksiSub}>Buat pengajuan baru</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.aksiCard, { backgroundColor: "#E07B39" }]}
          onPress={() => router.push("/pengaduan/buat")}
          activeOpacity={0.85}
        >
          <Text style={styles.aksiIcon}>📢</Text>
          <Text style={styles.aksiLabel}>Buat Pengaduan</Text>
          <Text style={styles.aksiSub}>Sampaikan laporan</Text>
        </TouchableOpacity>
      </View>

      {/* ── Layanan tersedia ── */}
      {masterSurat.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Layanan Surat</Text>
            <TouchableOpacity onPress={() => router.push("/pengajuan/buat")}>
              <Text style={styles.sectionMore}>Ajukan →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={masterSurat}
            keyExtractor={(item) => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
            renderItem={({ item }) => (
              <LayananCard
                nama={item.nama}
                kode={item.kode}
                onPress={() => router.push("/pengajuan/buat")}
              />
            )}
          />
        </View>
      )}

      {/* ── Informasi desa ── */}
      <View style={[styles.section, { paddingBottom: 32 }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informasi Desa</Text>
          <TouchableOpacity onPress={() => router.push("/informasi" as any)}>
            <Text style={styles.sectionMore}>Lihat semua →</Text>
          </TouchableOpacity>
        </View>

        {informasi.length === 0 ? (
          <View style={styles.emptyInfo}>
            <Text style={styles.emptyInfoText}>Belum ada informasi terbaru.</Text>
          </View>
        ) : (
          <View style={styles.infoList}>
            {informasi.map((item) => (
              <InformasiCard
                key={item.id}
                item={item}
                onPress={() => router.push(`/informasi/${item.slug}` as any)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen:           { flex: 1, backgroundColor: "#F5F5F5" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F5" },
  loadingText:      { marginTop: 12, color: "#888", fontSize: 14 },

  // Hero
  hero: {
    backgroundColor: "#4A90E2",
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  heroGreeting: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  heroSubtitle: { fontSize: 13, color: "#CCE4FF", marginTop: 2 },
  logoBox:      { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  logoText:     { fontSize: 22 },

  nikCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  nikLabel: { fontSize: 11, color: "#CCE4FF", fontWeight: "600", letterSpacing: 1, marginBottom: 4 },
  nikValue: { fontSize: 18, color: "#fff", fontWeight: "700", letterSpacing: 2, marginBottom: 2 },
  nikDesc:  { fontSize: 12, color: "#a8ccf0" },

  // Aksi cepat
  aksiRow: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  aksiCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  aksiIcon:  { fontSize: 28, marginBottom: 8 },
  aksiLabel: { fontSize: 14, fontWeight: "700", color: "#fff", marginBottom: 2 },
  aksiSub:   { fontSize: 11, color: "rgba(255,255,255,0.8)" },

  // Section
  section:       { marginTop: 20 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle:  { fontSize: 16, fontWeight: "700", color: "#222" },
  sectionMore:   { fontSize: 13, color: "#4A90E2", fontWeight: "600" },

  // Layanan card
  layananCard: {
    width: 110,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  layananIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EBF4FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  layananIcon: { fontSize: 20 },
  layananKode: { fontSize: 10, color: "#4A90E2", fontWeight: "700", marginBottom: 2 },
  layananNama: { fontSize: 11, color: "#444", textAlign: "center", lineHeight: 14 },

  // Informasi
  infoList:      { paddingHorizontal: 16, gap: 10 },
  emptyInfo:     { marginHorizontal: 16, padding: 16, backgroundColor: "#fff", borderRadius: 12, alignItems: "center" },
  emptyInfoText: { color: "#aaa", fontSize: 13 },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoBadge:     { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 8 },
  infoBadgeText: { fontSize: 11, fontWeight: "700" },
  infoJudul:     { fontSize: 14, fontWeight: "600", color: "#222", lineHeight: 20, marginBottom: 4 },
  infoTgl:       { fontSize: 12, color: "#999" },
});
