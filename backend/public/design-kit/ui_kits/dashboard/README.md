# SADESA — Dashboard UI Kit

High-fidelity, interactive recreation of the SADESA web dashboard, built from
`SADESA_Dashboard_Design_Spec.md`. One product, three role views that share a
global layout (Sidebar 260px + Topbar + scrollable content).

## Run
Open `index.html`. A floating **role switcher** (bottom-center) toggles between
**Admin · Staff · Kepala Desa**. The dark sidebar is **routable** for the Admin
role — click any nav item to switch pages. Interactions are faked click-throughs.

### Admin pages (all 11, reachable from the sidebar)
| Nav | Screen |
|-----|--------|
| Dashboard | Ringkasan Sistem — stat cards, weekly trend chart, activity log, recent permohonan |
| Data Kependudukan | Data Master Penduduk — stats + action panel, searchable warga table |
| Manajemen Akun | Akun & Hak Akses — role tabs, user table, validation panel, footer stats |
| Wilayah | Manajemen Wilayah — expandable Dusun → RW rows, map placeholder, validation panel |
| Layanan Surat | Surat **Form Builder** — component palette + live letter preview + status bar |
| Kategori Pengaduan | Kategori Laporan — icon-coded categories with active toggles |
| Berita Desa | Pusat Informasi — article card grid, pinned PENTING card, add-article tile |
| Broadcast WhatsApp | Pengumuman Massal — composer + WhatsApp phone preview + quota + history |
| Antrean | Pantau Antrean — clickable status filter tabs + live queue table |
| Riwayat Kunjungan | Kunjungan Fisik — visit stats, recent-visitor table, security banner |
| Audit Log | Jejak Audit — action-tagged activity log with operator + IP |

### Staff (Staf Administrasi) — now fully routable
| Nav | Screen |
|-----|--------|
| Dashboard | Dashboard Utama — 3 stat cards (Menunggu Verifikasi / Revisi / Siap Cetak), Tabel Antrean Utama, "Butuh Verifikasi Manual" panel + Performa Staf |
| Antrean | Pantau Antrean (shared with Admin) |
| Pelayanan Loket | Buat Pengajuan Surat (Warga Offline) — 3-step form, NIK lookup, file upload |
| Verifikasi Berkas | Split-view: document preview (zoom/rotate) + Data Pemohon + Setujui/Minta Revisi |
| Surat Siap Cetak | Dokumen Menunggu Dicetak — stats + print-ready list (Cetak PDF) |
| Pengaduan Warga | Tindak Lanjut Pengaduan — foto bukti + info pelapor + response form |
| Buku Tamu | Guest log table |

Click **Proses Sekarang** on a dashboard queue row → Verifikasi Berkas screen.

### Kepala Desa — now fully routable
| Nav | Screen |
|-----|--------|
| Dashboard Statistik | Ringkasan Eksekutif — 3 KPI cards (Surat Disahkan / Kepuasan Warga / Aduan Diselesaikan), dual-line Tren Pelayanan chart, Kategori Pengaduan donut |
| Pengesahan Dokumen | Split-view: Antrean Pengesahan list + full letter preview + Tolak / Sahkan & Tanda Tangani |
| Laporan Bulanan | Generator Laporan Operasional — bulan/tahun/jenis selectors, Unduh PDF / Ekspor Excel, preview data table |

## Files
| File | Contents |
|------|----------|
| `index.html` | Loads React + Babel + Lucide, mounts `App` with role + page routing |
| `data.jsx` | Fake demo data for every page (penduduk, wilayah, antrean, audit, berita…) |
| `components.jsx` | `Icon`, `Avatar`, `StatusBadge`, `Badge`, `StatCard`, `Card`, `Button`, `IconButton`, `ActivityLog` |
| `parts.jsx` | `LineChart`, `BarChart`, `Toggle`, `Tabs`, `PermohonanTable`, `Progress` |
| `parts2.jsx` | `Table`, `Td`, `Trow`, `NameCell`, `Pill`, `Pagination`, `Breadcrumb`, `ToggleSwitch`, `FilterTab`, `DarkCard`, `TableToolbar`, `SelectChip` |
| `Shell.jsx` | Dark `Sidebar` (routable), `Topbar`, `Shell`, `PageHead`, role nav map (`NAV`) |
| `screens-admin-staff.jsx` | `Grid`, `AdminDashboard`, `StaffDashboard` |
| `screens-kades.jsx` | `KadesDashboard`, `VerifikasiDetail`, `PengesahanDetail` |
| `pages-data.jsx` | `PendudukPage`, `WilayahPage`, `PenggunaPage`, `KategoriPage` + `IconStat`/`MiniStat`/`TealPanel` helpers |
| `pages-ops.jsx` | `AntreanPage`, `KunjunganPage`, `AuditPage` |
| `pages-content.jsx` | `BeritaPage`, `BroadcastPage`, `SuratBuilderPage` |
| `pages-staff.jsx` | `StaffDashboard`, `VerifikasiBerkas` + `StaffStat` |
| `pages-staff2.jsx` | `PelayananLoket`, `SuratCetak`, `PengaduanDetail`, `BukuTamuPage` |
| `pages-kades.jsx` | `KadesDashboard`, `PengesahanDokumen`, `LaporanBulanan` + `DualLineChart`/`Donut` |

## Notes
- Icons are **Lucide** (CDN), matching the spec's icon names exactly.
- Font is **Outfit** (TailAdmin default), tokens from `../../colors_and_type.css`.
- The **dark navy sidebar** + page layouts were rebuilt to match the live
  prototype screenshots (`SADESA PROTYPE (7)`).
- Avatars are deterministic **initials** (the prototype uses photos) — a
  deliberate simplification so the kit needs no image assets.
- Components share scope via `window` assignment (Babel multi-file pattern).
- These are cosmetic recreations — no real data, routing, or persistence.
