import { Head, router, usePage } from '@inertiajs/react';
import { Star } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UlasanItem {
    id: number;
    rating: number;
    komentar: string | null;
    created_at: string;
    user?: { id: number; name: string } | null;
    pengajuan?: {
        id: number;
        no_pengajuan: string;
        master_surat?: { nama_surat: string } | null;
    } | null;
}

interface Paginated {
    data: UlasanItem[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

interface Stats {
    total: number;
    rata_rata: number;
    bintang5: number;
    bintang4: number;
    bintang3: number;
    bintang2: number;
    bintang1: number;
}

interface Props {
    ulasan: Paginated;
    stats: Stats;
    filter: { rating?: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRow({ rating, max = 5 }: { rating: number; max?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: max }).map((_, i) => (
                <Star
                    key={i}
                    className={`h-4 w-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/30'}`}
                />
            ))}
        </div>
    );
}

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Penilaian Layanan', href: '/kepala-desa/penilaian' },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PenilaianLayanan({ ulasan, stats, filter }: Props) {
    const bulanRows: [string, keyof Stats][] = [
        ['5 Bintang', 'bintang5'],
        ['4 Bintang', 'bintang4'],
        ['3 Bintang', 'bintang3'],
        ['2 Bintang', 'bintang2'],
        ['1 Bintang', 'bintang1'],
    ];

    function filterRating(val: string) {
        router.get('/kepala-desa/penilaian', { rating: val === filter.rating ? '' : val }, { preserveState: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Penilaian Layanan | SADESA" />

            <div className="flex flex-col gap-6 p-4">

                {/* ── Header ─────────────────────────────────────────────── */}
                <div>
                    <h1 className="flex items-center gap-2 text-xl font-black text-foreground">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        Penilaian Layanan
                    </h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        Ulasan & rating kepuasan warga terhadap layanan surat desa
                    </p>
                </div>

                {/* ── Overview ───────────────────────────────────────────── */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                    {/* Rating besar */}
                    <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-6 shadow-sm">
                        <p className="text-6xl font-black tabular-nums text-amber-500">{stats.rata_rata}</p>
                        <div className="mt-2 flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-5 w-5 ${i < Math.round(stats.rata_rata) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/30'}`} />
                            ))}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{stats.total} ulasan</p>
                    </div>

                    {/* Distribusi bintang */}
                    <div className="rounded-2xl border bg-card p-5 shadow-sm xl:col-span-2">
                        <p className="mb-4 text-sm font-semibold text-foreground">Distribusi Penilaian</p>
                        <div className="space-y-2">
                            {bulanRows.map(([label, key]) => {
                                const val = stats[key] as number;
                                const pct = stats.total > 0 ? Math.round((val / stats.total) * 100) : 0;
                                const bintang = parseInt(key.replace('bintang', ''));
                                const active = filter.rating === String(bintang);
                                return (
                                    <button
                                        key={key}
                                        onClick={() => filterRating(String(bintang))}
                                        className={`flex w-full items-center gap-3 rounded-lg px-2 py-1 transition hover:bg-muted/60 ${active ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`}
                                    >
                                        <span className="w-16 shrink-0 text-left text-xs font-medium text-muted-foreground">{label}</span>
                                        <div className="flex-1 overflow-hidden rounded-full bg-muted h-2">
                                            <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="w-8 shrink-0 text-right text-xs font-bold tabular-nums text-foreground">{val}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {filter.rating && (
                            <button
                                onClick={() => filterRating('')}
                                className="mt-3 text-xs font-semibold text-teal-600 hover:underline"
                            >
                                Tampilkan semua →
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Tabel Ulasan ───────────────────────────────────────── */}
                <div className="rounded-2xl border bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b px-6 py-4">
                        <h3 className="font-semibold text-foreground">
                            Daftar Ulasan
                            {filter.rating && (
                                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                                    {filter.rating} bintang
                                </span>
                            )}
                        </h3>
                        <span className="text-xs text-muted-foreground">{ulasan.total} ulasan</span>
                    </div>

                    {ulasan.data.length === 0 ? (
                        <div className="py-16 text-center">
                            <Star className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
                            <p className="text-sm font-medium text-foreground">Belum ada ulasan</p>
                            <p className="text-xs text-muted-foreground">Ulasan akan muncul setelah warga menyelesaikan layanan</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {ulasan.data.map(u => (
                                <div key={u.id} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-start sm:gap-4">
                                    {/* Avatar */}
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                                        {(u.user?.name ?? '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-semibold text-foreground">{u.user?.name ?? '—'}</span>
                                            <StarRow rating={u.rating} />
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        {u.pengajuan && (
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {u.pengajuan.master_surat?.nama_surat ?? '—'} · {u.pengajuan.no_pengajuan}
                                            </p>
                                        )}
                                        {u.komentar && (
                                            <p className="mt-2 text-sm leading-relaxed text-foreground/80">"{u.komentar}"</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {ulasan.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-6 py-3">
                            <p className="text-xs text-muted-foreground">
                                Halaman {ulasan.current_page} dari {ulasan.last_page}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    disabled={ulasan.current_page === 1}
                                    onClick={() => router.get('/kepala-desa/penilaian', { ...filter, page: ulasan.current_page - 1 })}
                                    className="rounded-lg border px-3 py-1.5 text-xs font-semibold disabled:opacity-40 hover:bg-muted"
                                >
                                    ← Sebelumnya
                                </button>
                                <button
                                    disabled={ulasan.current_page === ulasan.last_page}
                                    onClick={() => router.get('/kepala-desa/penilaian', { ...filter, page: ulasan.current_page + 1 })}
                                    className="rounded-lg border px-3 py-1.5 text-xs font-semibold disabled:opacity-40 hover:bg-muted"
                                >
                                    Berikutnya →
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}
