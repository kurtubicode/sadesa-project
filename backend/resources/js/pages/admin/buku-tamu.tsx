import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, CalendarDays, Download, QrCode, Search, Users } from 'lucide-react';
import { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Entry {
    id: number;
    nama_pengunjung: string;
    instansi: string | null;
    keperluan: string;
    no_hp: string | null;
    waktu_kunjungan: string;
}

interface Paginator {
    data: Entry[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Stats {
    hari_ini: number;
    bulan_ini: number;
    total: number;
}

interface Props {
    entries: Paginator;
    filters: { tanggal: string; search: string };
    stats: Stats;
}

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Buku Tamu', href: '/admin/buku-tamu' },
];

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ title, value, icon, color }: {
    title: string; value: number; icon: React.ReactNode; color: string;
}) {
    return (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="mb-1 text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold text-foreground">{value}</p>
                </div>
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

// ─── QR Card (inline) ─────────────────────────────────────────────────────────

function QrCard() {
    const formUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/buku-tamu`
        : '/buku-tamu';

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(formUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePrint = () => {
        const win = window.open('', '_blank', 'width=480,height=640');
        if (!win) return;
        win.document.write(`
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8" />
                <title>QR Buku Tamu — SADESA</title>
                <style>
                    body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: sans-serif; background: #fff; }
                    .wrap { text-align: center; padding: 40px; }
                    .label { font-size: 22px; font-weight: 700; margin-bottom: 6px; color: #0f1a2b; }
                    .sub { font-size: 13px; color: #666; margin-bottom: 24px; }
                    .url { font-size: 11px; color: #888; margin-top: 20px; word-break: break-all; }
                    @media print { body { -webkit-print-color-adjust: exact; } }
                </style>
            </head>
            <body>
                <div class="wrap">
                    <div class="label">Buku Tamu Digital</div>
                    <div class="sub">Scan QR untuk mengisi buku tamu kunjungan</div>
                    <div id="qr"></div>
                    <div class="url">${formUrl}</div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"><\/script>
                <script>
                    QRCode.toCanvas(document.createElement('canvas'), '${formUrl}', { width: 256, margin: 2 }, function(err, canvas) {
                        if (!err) {
                            document.getElementById('qr').appendChild(canvas);
                            setTimeout(() => window.print(), 400);
                        }
                    });
                <\/script>
            </body>
            </html>
        `);
        win.document.close();
    };

    return (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                <div className="flex shrink-0 items-center justify-center rounded-2xl bg-white p-3 shadow-sm ring-1 ring-border">
                    <QRCodeSVG value={formUrl} size={140} level="M" />
                </div>
                <div className="flex flex-1 flex-col gap-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <QrCode className="h-4 w-4 text-teal-600" />
                            <span className="font-semibold text-foreground">QR Code Buku Tamu</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Print dan tempel di meja resepsionis. Pengunjung scan untuk mengisi form kunjungan.
                        </p>
                    </div>
                    <div className="rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground break-all font-mono">
                        {formUrl}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
                        >
                            <Download className="h-4 w-4" />
                            Print QR
                        </button>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted/50"
                        >
                            {copied ? 'Tersalin!' : 'Salin Link'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminBukuTamu({ entries, filters, stats }: Props) {
    const [search, setSearch]   = useState(filters.search);
    const [tanggal, setTanggal] = useState(filters.tanggal);
    const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyFilter = (newFilters: Partial<{ tanggal: string; search: string }>) => {
        router.get('/admin/buku-tamu', { tanggal, search, ...newFilters }, {
            preserveState: true, replace: true,
        });
    };

    const handleSearch = (val: string) => {
        setSearch(val);
        if (searchRef.current) clearTimeout(searchRef.current);
        searchRef.current = setTimeout(() => applyFilter({ search: val }), 400);
    };

    const handleTanggal = (val: string) => {
        setTanggal(val);
        applyFilter({ tanggal: val });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buku Tamu | Admin SADESA" />

            <div className="flex flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Buku Tamu Digital</h1>
                        <p className="text-sm text-muted-foreground">Rekap seluruh kunjungan ke Kantor Desa Cirangkong</p>
                    </div>
                    <a
                        href="/buku-tamu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-2xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-teal-700"
                    >
                        <BookOpen className="h-4 w-4" />
                        Buka Form Tamu
                    </a>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        title="Tamu Hari Ini"
                        value={stats.hari_ini}
                        icon={<Users className="h-7 w-7" />}
                        color="bg-teal-600 text-white"
                    />
                    <StatCard
                        title={`Tamu ${new Date().toLocaleString('id-ID', { month: 'long' })} Ini`}
                        value={stats.bulan_ini}
                        icon={<CalendarDays className="h-7 w-7" />}
                        color="bg-blue-600 text-white"
                    />
                    <StatCard
                        title="Total Semua Kunjungan"
                        value={stats.total}
                        icon={<BookOpen className="h-7 w-7" />}
                        color="bg-emerald-600 text-white"
                    />
                </div>

                {/* QR Code */}
                <QrCard />

                {/* Filter + Tabel */}
                <div className="rounded-2xl border bg-card shadow-sm">
                    <div className="flex flex-wrap items-center gap-3 border-b px-6 py-4">
                        <h3 className="mr-auto font-semibold text-foreground">Data Kunjungan</h3>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => handleSearch(e.target.value)}
                                placeholder="Cari nama / keperluan..."
                                className="h-9 rounded-xl border bg-muted/40 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:bg-muted/20 w-48 sm:w-56"
                            />
                        </div>

                        <input
                            type="date"
                            value={tanggal}
                            onChange={e => handleTanggal(e.target.value)}
                            className="h-9 rounded-xl border bg-muted/40 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:bg-muted/20"
                        />

                        {tanggal !== '' && (
                            <button
                                type="button"
                                onClick={() => handleTanggal('')}
                                className="h-9 rounded-xl border px-3 text-xs text-muted-foreground hover:bg-muted/50"
                            >
                                Semua Tanggal
                            </button>
                        )}
                    </div>

                    <div className="p-6">
                        {entries.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                                <p className="font-medium text-foreground">Belum ada data</p>
                                <p className="text-sm text-muted-foreground">
                                    {tanggal ? 'Tidak ada kunjungan pada tanggal tersebut.' : 'Belum ada data kunjungan.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left">
                                                <th className="pb-3 font-medium text-muted-foreground">No</th>
                                                <th className="pb-3 font-medium text-muted-foreground">Nama Pengunjung</th>
                                                <th className="pb-3 font-medium text-muted-foreground">Instansi / Asal</th>
                                                <th className="pb-3 font-medium text-muted-foreground">Keperluan</th>
                                                <th className="pb-3 font-medium text-muted-foreground">No HP</th>
                                                <th className="pb-3 font-medium text-muted-foreground">Waktu Kunjungan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entries.data.map((item, idx) => (
                                                <tr key={item.id} className="border-b last:border-0">
                                                    <td className="py-3 text-muted-foreground">
                                                        {(entries.current_page - 1) * entries.per_page + idx + 1}
                                                    </td>
                                                    <td className="py-3 font-medium text-foreground">{item.nama_pengunjung}</td>
                                                    <td className="py-3 text-muted-foreground">
                                                        {item.instansi ?? <span className="italic text-muted-foreground/50">—</span>}
                                                    </td>
                                                    <td className="py-3 max-w-xs text-muted-foreground">
                                                        <p className="line-clamp-2">{item.keperluan}</p>
                                                    </td>
                                                    <td className="py-3 text-muted-foreground">
                                                        {item.no_hp ?? <span className="italic text-muted-foreground/50">—</span>}
                                                    </td>
                                                    <td className="py-3 text-muted-foreground whitespace-nowrap">
                                                        {new Date(item.waktu_kunjungan).toLocaleString('id-ID', {
                                                            dateStyle: 'short', timeStyle: 'short',
                                                        })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {entries.last_page > 1 && (
                                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                                        <p>Menampilkan {entries.data.length} dari {entries.total} data</p>
                                        <div className="flex gap-1">
                                            {entries.links.map((link, i) => (
                                                link.url ? (
                                                    <Link
                                                        key={i}
                                                        href={link.url}
                                                        className={`rounded-lg px-3 py-1.5 text-xs transition ${link.active ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-muted'}`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ) : (
                                                    <span
                                                        key={i}
                                                        className="rounded-lg px-3 py-1.5 text-xs opacity-40"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
