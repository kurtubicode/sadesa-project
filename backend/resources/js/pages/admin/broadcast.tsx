import { Head, useForm, usePage } from '@inertiajs/react';
import { Bell, CheckCircle, Megaphone, Send, Users } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Broadcast Notifikasi', href: '/admin/broadcast' },
];

const TARGET_OPTIONS = [
    { value: 'semua',       label: 'Semua Pengguna',  desc: 'Warga, Staff, dan Kepala Desa' },
    { value: 'warga',       label: 'Warga',           desc: 'Hanya akun warga terdaftar'    },
    { value: 'staff',       label: 'Staff',           desc: 'Hanya akun staff pelayanan'    },
    { value: 'kepala_desa', label: 'Kepala Desa',     desc: 'Hanya akun kepala desa'        },
];

interface BroadcastItem {
    id: number;
    judul: string;
    pesan: string;
    target_role: string;
    created_at: string;
    admin: { name: string } | null;
}

interface Paginator {
    data: BroadcastItem[];
    total: number;
}

interface Props {
    riwayat: Paginator;
}

export default function AdminBroadcast({ riwayat }: Props) {
    const page   = usePage<{ flash?: { success?: string } }>();
    const flash  = page.props.flash;

    const { data, setData, post, processing, errors, reset } = useForm({
        judul:       '',
        pesan:       '',
        target_role: 'semua',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/broadcast', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Broadcast Notifikasi | Admin SADESA" />

            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-xl font-bold text-foreground">Broadcast Notifikasi</h1>
                    <p className="text-sm text-muted-foreground">Kirim notifikasi massal ke pengguna sistem</p>
                </div>

                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        {flash.success}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-5">
                    {/* ── Form ── */}
                    <form onSubmit={handleSubmit} className="lg:col-span-3 flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-2 border-b pb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50">
                                <Megaphone className="h-5 w-5 text-teal-600" />
                            </div>
                            <p className="font-semibold text-foreground">Buat Notifikasi Baru</p>
                        </div>

                        {/* Target */}
                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Target Penerima
                            </label>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {TARGET_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setData('target_role', opt.value)}
                                        className={`flex flex-col rounded-xl border p-3 text-left transition ${data.target_role === opt.value ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-border bg-muted/40 hover:bg-muted'}`}
                                    >
                                        <Users className="mb-1 h-4 w-4" />
                                        <span className="text-xs font-semibold">{opt.label}</span>
                                        <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Judul */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Judul Notifikasi <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.judul}
                                onChange={e => setData('judul', e.target.value)}
                                placeholder="Contoh: Pengumuman Libur Pelayanan"
                                maxLength={200}
                                className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            {errors.judul && <p className="mt-1 text-xs text-red-500">{errors.judul}</p>}
                        </div>

                        {/* Pesan */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Isi Pesan <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={data.pesan}
                                onChange={e => setData('pesan', e.target.value)}
                                placeholder="Tulis isi pesan notifikasi di sini..."
                                rows={5}
                                maxLength={1000}
                                className="w-full resize-none rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <div className="mt-1 flex justify-between">
                                {errors.pesan
                                    ? <p className="text-xs text-red-500">{errors.pesan}</p>
                                    : <span />
                                }
                                <span className="text-xs text-muted-foreground">{data.pesan.length}/1000</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
                        >
                            <Send className="h-4 w-4" />
                            {processing ? 'Mengirim...' : 'Kirim Notifikasi'}
                        </button>
                    </form>

                    {/* ── Info ── */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <div className="rounded-2xl border bg-card p-5 shadow-sm">
                            <div className="mb-3 flex items-center gap-2">
                                <Bell className="h-4 w-4 text-teal-600" />
                                <p className="text-sm font-semibold text-foreground">Cara Kerja</p>
                            </div>
                            <ul className="space-y-2 text-xs text-muted-foreground">
                                <li className="flex gap-2"><span className="text-teal-500 font-bold">1.</span> Pilih target penerima notifikasi</li>
                                <li className="flex gap-2"><span className="text-teal-500 font-bold">2.</span> Isi judul dan isi pesan</li>
                                <li className="flex gap-2"><span className="text-teal-500 font-bold">3.</span> Notifikasi masuk ke bell icon dashboard dan aplikasi mobile penerima</li>
                                <li className="flex gap-2"><span className="text-teal-500 font-bold">4.</span> Riwayat broadcast tersimpan di bawah</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ── Riwayat ── */}
                <div className="rounded-2xl border bg-card shadow-sm">
                    <div className="border-b px-6 py-4">
                        <p className="font-semibold text-foreground">Riwayat Broadcast ({riwayat.total})</p>
                    </div>
                    {riwayat.data.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground text-sm">Belum ada broadcast yang dikirim.</div>
                    ) : (
                        <div className="divide-y">
                            {riwayat.data.map(item => (
                                <div key={item.id} className="flex items-start gap-4 px-6 py-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                                        <Bell className="h-4 w-4 text-teal-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-semibold text-foreground">{item.judul}</p>
                                            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground capitalize">
                                                {item.target_role === 'semua' ? 'Semua' : item.target_role}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{item.pesan}</p>
                                        <p className="mt-1 text-[10px] text-muted-foreground/60">
                                            Dikirim oleh {item.admin?.name ?? '—'} · {item.created_at}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
