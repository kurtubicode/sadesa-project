import { Head } from '@inertiajs/react';
import { BarChart2, CheckCircle, Clock, TrendingUp, XCircle, FileText } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrendPoint {
    label: string;
    masuk: number;
    selesai: number;
    ditolak: number;
}

interface StatusPoint {
    label: string;
    tone: string;
    jumlah: number;
}

interface JenisPoint {
    label: string;
    jumlah: number;
}

interface Ringkasan {
    total: number;
    selesai: number;
    pending: number;
    ditolak: number;
    bulan_ini: number;
    tingkat_selesai: number;
}

interface Props {
    trend: TrendPoint[];
    status_breakdown: StatusPoint[];
    top_jenis_surat: JenisPoint[];
    ringkasan: Ringkasan;
}

// ─── Tone Map ─────────────────────────────────────────────────────────────────

const TONE: Record<string, { bg: string; text: string; bar: string }> = {
    yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', bar: 'bg-yellow-400' },
    blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',     text: 'text-blue-700 dark:text-blue-400',     bar: 'bg-blue-500'   },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', bar: 'bg-purple-500' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', bar: 'bg-orange-500' },
    teal:   { bg: 'bg-teal-50 dark:bg-teal-900/20',     text: 'text-teal-700 dark:text-teal-400',     bar: 'bg-teal-500'   },
    green:  { bg: 'bg-green-50 dark:bg-green-900/20',   text: 'text-green-700 dark:text-green-400',   bar: 'bg-green-500'  },
    red:    { bg: 'bg-red-50 dark:bg-red-900/20',       text: 'text-red-700 dark:text-red-400',       bar: 'bg-red-500'    },
};

// ─── Trend Chart ──────────────────────────────────────────────────────────────

function TrendChart({ data }: { data: TrendPoint[] }) {
    const max = Math.max(...data.flatMap(d => [d.masuk, d.selesai, d.ditolak]), 1);
    return (
        <div>
            <div className="flex items-end gap-2" style={{ height: 160 }}>
                {data.map((d, i) => (
                    <div key={i} className="group flex flex-1 flex-col items-center gap-0.5">
                        <div className="flex w-full items-end justify-center gap-0.5" style={{ height: 130 }}>
                            <div className="w-full rounded-t bg-teal-500 transition-all hover:bg-teal-400"
                                style={{ height: `${Math.max((d.masuk / max) * 100, d.masuk > 0 ? 4 : 0)}%` }}
                                title={`Masuk: ${d.masuk}`} />
                            <div className="w-full rounded-t bg-emerald-400 transition-all hover:bg-emerald-300"
                                style={{ height: `${Math.max((d.selesai / max) * 100, d.selesai > 0 ? 4 : 0)}%` }}
                                title={`Selesai: ${d.selesai}`} />
                            <div className="w-full rounded-t bg-red-400 transition-all hover:bg-red-300"
                                style={{ height: `${Math.max((d.ditolak / max) * 100, d.ditolak > 0 ? 4 : 0)}%` }}
                                title={`Ditolak: ${d.ditolak}`} />
                        </div>
                        <span className="text-[9px] font-medium text-muted-foreground">{d.label}</span>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm bg-teal-500 inline-block" /> Masuk</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm bg-emerald-400 inline-block" /> Selesai</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm bg-red-400 inline-block" /> Ditolak</span>
            </div>
        </div>
    );
}

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Statistik Layanan', href: '/kepala-desa/statistik' },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function StatistikLayanan({ trend, status_breakdown, top_jenis_surat, ringkasan }: Props) {
    const maxJenis = Math.max(...top_jenis_surat.map(j => j.jumlah), 1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Statistik Layanan | SADESA" />

            <div className="flex flex-col gap-6 p-4">

                {/* ── Header ─────────────────────────────────────────────── */}
                <div>
                    <h1 className="flex items-center gap-2 text-xl font-black text-foreground">
                        <BarChart2 className="h-5 w-5 text-teal-600" />
                        Statistik Layanan
                    </h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        Rekap seluruh pengajuan surat — data akumulatif & tren bulanan
                    </p>
                </div>

                {/* ── Ringkasan Cards ─────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
                    {[
                        { label: 'Total Pengajuan', value: ringkasan.total,    icon: FileText,    bg: 'bg-blue-50 dark:bg-blue-900/20',   text: 'text-blue-600' },
                        { label: 'Selesai',         value: ringkasan.selesai,  icon: CheckCircle, bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600' },
                        { label: 'Sedang Proses',   value: ringkasan.pending,  icon: Clock,       bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-600' },
                        { label: 'Ditolak/Batal',   value: ringkasan.ditolak,  icon: XCircle,     bg: 'bg-red-50 dark:bg-red-900/20',     text: 'text-red-600' },
                        { label: 'Bulan Ini',       value: ringkasan.bulan_ini,icon: TrendingUp,  bg: 'bg-teal-50 dark:bg-teal-900/20',   text: 'text-teal-600' },
                    ].map((s, i) => (
                        <div key={i} className="rounded-xl border bg-card p-4 shadow-sm">
                            <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${s.bg}`}>
                                <s.icon className={`h-4 w-4 ${s.text}`} />
                            </div>
                            <p className="text-xs text-muted-foreground">{s.label}</p>
                            <p className="mt-0.5 text-2xl font-black tabular-nums text-foreground">{s.value.toLocaleString('id-ID')}</p>
                        </div>
                    ))}
                </div>

                {/* ── Tingkat Penyelesaian ─────────────────────────────────── */}
                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">Tingkat Penyelesaian (All-time)</p>
                        <span className="text-lg font-black text-teal-600">{ringkasan.tingkat_selesai}%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${ringkasan.tingkat_selesai}%` }} />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                        {ringkasan.selesai.toLocaleString('id-ID')} selesai dari {ringkasan.total.toLocaleString('id-ID')} total pengajuan
                    </p>
                </div>

                {/* ── Trend 12 Bulan ──────────────────────────────────────── */}
                <div className="rounded-2xl border bg-card shadow-sm">
                    <div className="border-b px-6 py-4">
                        <h3 className="font-semibold text-foreground">Tren Pengajuan 12 Bulan Terakhir</h3>
                    </div>
                    <div className="px-6 pb-6 pt-4">
                        {trend.every(d => d.masuk === 0) ? (
                            <p className="py-10 text-center text-sm text-muted-foreground">Belum ada data.</p>
                        ) : (
                            <TrendChart data={trend} />
                        )}
                    </div>
                </div>

                {/* ── Status Breakdown + Top Jenis ────────────────────────── */}
                <div className="grid gap-4 xl:grid-cols-2">

                    {/* Status breakdown */}
                    <div className="rounded-2xl border bg-card shadow-sm">
                        <div className="border-b px-6 py-4">
                            <h3 className="font-semibold text-foreground">Breakdown Status Pengajuan</h3>
                            <p className="text-xs text-muted-foreground">Data akumulatif semua waktu</p>
                        </div>
                        <div className="space-y-2 p-4">
                            {status_breakdown.map((s, i) => {
                                const t = TONE[s.tone] ?? TONE.teal;
                                const total = status_breakdown.reduce((a, b) => a + b.jumlah, 0) || 1;
                                const pct = Math.round((s.jumlah / total) * 100);
                                return (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="w-32 shrink-0 text-xs font-medium text-muted-foreground">{s.label}</span>
                                        <div className="flex-1 overflow-hidden rounded-full bg-muted h-2">
                                            <div className={`h-full rounded-full ${t.bar} transition-all`} style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className={`w-8 shrink-0 text-right text-sm font-bold tabular-nums ${t.text}`}>{s.jumlah}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Top jenis surat */}
                    <div className="rounded-2xl border bg-card shadow-sm">
                        <div className="border-b px-6 py-4">
                            <h3 className="font-semibold text-foreground">Top 10 Jenis Surat</h3>
                            <p className="text-xs text-muted-foreground">Berdasarkan jumlah pengajuan</p>
                        </div>
                        <div className="space-y-2 p-4">
                            {top_jenis_surat.length === 0 ? (
                                <p className="py-6 text-center text-sm text-muted-foreground">Belum ada data.</p>
                            ) : top_jenis_surat.map((j, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="w-5 shrink-0 text-center text-xs font-bold text-muted-foreground">{i + 1}</span>
                                    <span className="flex-1 truncate text-xs font-medium text-foreground" title={j.label}>{j.label}</span>
                                    <div className="w-24 overflow-hidden rounded-full bg-muted h-2">
                                        <div className="h-full rounded-full bg-teal-500 transition-all"
                                            style={{ width: `${(j.jumlah / maxJenis) * 100}%` }} />
                                    </div>
                                    <span className="w-8 shrink-0 text-right text-sm font-bold tabular-nums text-teal-700 dark:text-teal-400">{j.jumlah}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
