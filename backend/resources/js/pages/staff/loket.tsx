import { Head, router, usePage } from '@inertiajs/react';
import { ConciergeBell, IdCard, Loader2, Search, Send, User, Users, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { BreadcrumbItem } from '@/types';

interface MasterSurat {
    id: number;
    kode: string;
    nama_surat: string;
    persyaratan: string[] | null;
}

interface WargaData {
    id: number;
    name: string;
    nik: string;
    email: string | null;
    phone: string | null;
}

interface Props {
    masterSurat: MasterSurat[];
    wargaList: WargaData[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Layanan Publik', href: '/staff/pengajuan' },
    { title: 'Pelayanan Loket', href: '/staff/loket' },
];

export default function StaffLoket({ masterSurat, wargaList }: Props) {
    const { errors } = usePage<{ errors: Record<string, string> }>().props;

    // Mode: 'nik' = cari by NIK, 'list' = pilih dari daftar
    const [mode, setMode] = useState<'nik' | 'list'>('nik');

    // NIK search state
    const [nik, setNik] = useState('');
    const [nikError, setNikError] = useState<string | null>(null);
    const [searching, setSearching] = useState(false);
    const nikRef = useRef<HTMLInputElement>(null);

    // Warga list search state
    const [listSearch, setListSearch] = useState('');

    // Selected warga
    const [warga, setWarga] = useState<WargaData | null>(null);

    // Form state
    const [masterSuratId, setMasterSuratId] = useState('');
    const [keperluan, setKeperluan] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function cariNik() {
        if (nik.length !== 16) { setNikError('NIK harus 16 digit.'); return; }
        setNikError(null);
        setSearching(true);
        try {
            const res = await fetch(`/staff/loket/cari-nik?nik=${nik}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
            });
            const json = await res.json();
            if (res.ok) {
                setWarga(json.data);
            } else {
                setNikError(json.message ?? 'NIK tidak ditemukan.');
                setWarga(null);
            }
        } catch {
            setNikError('Gagal menghubungi server. Coba lagi.');
        } finally {
            setSearching(false);
        }
    }

    function clearWarga() {
        setWarga(null);
        setNik('');
        setNikError(null);
        setListSearch('');
        setTimeout(() => nikRef.current?.focus(), 50);
    }

    function selectWarga(w: WargaData) {
        setWarga(w);
        setNik(w.nik);
    }

    function handleSubmit() {
        setSubmitting(true);
        router.post('/staff/loket', {
            nik: warga?.nik ?? nik,
            master_surat_id: masterSuratId,
            keperluan,
        }, {
            onError: () => setSubmitting(false),
        });
    }

    const filteredWarga = useMemo(() => {
        const q = listSearch.toLowerCase();
        if (!q) return wargaList;
        return wargaList.filter(w =>
            w.name.toLowerCase().includes(q) ||
            w.nik.includes(q)
        );
    }, [wargaList, listSearch]);

    const selectedSurat = masterSurat.find(s => String(s.id) === masterSuratId);
    const canSubmit = !!warga && !!masterSuratId;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pelayanan Loket" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Pelayanan Loket</h1>
                        <p className="text-sm text-muted-foreground">Buat pengajuan surat untuk warga yang datang langsung ke kantor desa.</p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <span className="h-2 w-2 rounded-full bg-green-500" /> MODE OFFLINE
                    </span>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Kiri: form input */}
                    <div className="space-y-5 lg:col-span-2">

                        {/* Identifikasi Warga */}
                        <div className="rounded-xl border bg-card shadow-sm">
                            {/* Tab mode */}
                            <div className="flex border-b">
                                <button
                                    onClick={() => { setMode('nik'); clearWarga(); }}
                                    className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                                        mode === 'nik'
                                            ? 'border-b-2 border-teal-600 text-teal-600'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <IdCard className="h-4 w-4" /> Cari NIK
                                </button>
                                <button
                                    onClick={() => { setMode('list'); clearWarga(); }}
                                    className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                                        mode === 'list'
                                            ? 'border-b-2 border-teal-600 text-teal-600'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <Users className="h-4 w-4" /> Pilih dari Daftar
                                </button>
                            </div>

                            <div className="p-5">
                                {/* Warga terpilih */}
                                {warga ? (
                                    <div className="flex items-center justify-between rounded-lg border border-teal-200 bg-teal-50 p-4 dark:border-teal-800 dark:bg-teal-900/20">
                                        <div className="flex items-center gap-3">
                                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-600 text-white">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">{warga.name}</p>
                                                <p className="font-mono text-sm text-muted-foreground">{warga.nik}</p>
                                                {warga.phone && <p className="text-xs text-muted-foreground">{warga.phone}</p>}
                                            </div>
                                        </div>
                                        <button onClick={clearWarga} className="rounded p-1 text-muted-foreground hover:text-foreground">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Mode: Cari NIK */}
                                        {mode === 'nik' && (
                                            <div className="space-y-2">
                                                <div className="flex gap-3">
                                                    <div className="relative flex-1">
                                                        <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                        <Input
                                                            ref={nikRef}
                                                            value={nik}
                                                            onChange={e => { setNik(e.target.value.replace(/\D/g, '').slice(0, 16)); setNikError(null); }}
                                                            onKeyDown={e => e.key === 'Enter' && cariNik()}
                                                            placeholder="Masukkan 16 digit NIK..."
                                                            className="pl-9 font-mono"
                                                            maxLength={16}
                                                        />
                                                    </div>
                                                    <Button
                                                        onClick={cariNik}
                                                        disabled={searching || nik.length !== 16}
                                                        className="gap-2 bg-teal-600 hover:bg-teal-700"
                                                    >
                                                        {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                                        Cari
                                                    </Button>
                                                </div>
                                                {nikError && <p className="text-sm text-red-600">{nikError}</p>}
                                            </div>
                                        )}

                                        {/* Mode: Pilih dari Daftar */}
                                        {mode === 'list' && (
                                            <div className="space-y-3">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        value={listSearch}
                                                        onChange={e => setListSearch(e.target.value)}
                                                        placeholder="Cari nama atau NIK..."
                                                        className="pl-9"
                                                    />
                                                </div>

                                                <div className="h-64 overflow-y-auto rounded-lg border">
                                                    {filteredWarga.length === 0 ? (
                                                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                                            Tidak ada warga ditemukan
                                                        </div>
                                                    ) : (
                                                        <ul className="divide-y">
                                                            {filteredWarga.map(w => (
                                                                <li key={w.id}>
                                                                    <button
                                                                        onClick={() => selectWarga(w)}
                                                                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors"
                                                                    >
                                                                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                                                                            <User className="h-4 w-4" />
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <p className="truncate text-sm font-medium text-foreground">{w.name}</p>
                                                                            <p className="font-mono text-xs text-muted-foreground">{w.nik}</p>
                                                                        </div>
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>

                                                <p className="text-xs text-muted-foreground">
                                                    {filteredWarga.length} dari {wargaList.length} warga
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}

                                {errors.nik && <p className="mt-2 text-sm text-red-600">{errors.nik}</p>}
                            </div>
                        </div>

                        {/* Jenis Surat & Keperluan */}
                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                                <ConciergeBell className="h-4 w-4 text-teal-600" /> Jenis Surat & Keperluan
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <Label className="mb-1.5 block">
                                        Layanan Administrasi <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={masterSuratId} onValueChange={setMasterSuratId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jenis surat..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {masterSurat.map(s => (
                                                <SelectItem key={s.id} value={String(s.id)}>
                                                    {s.nama_surat} <span className="text-muted-foreground">({s.kode})</span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.master_surat_id && <p className="mt-1 text-sm text-red-600">{errors.master_surat_id}</p>}
                                </div>

                                {selectedSurat?.persyaratan && selectedSurat.persyaratan.length > 0 && (
                                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                                        <p className="mb-2 text-sm font-semibold text-amber-800 dark:text-amber-300">Persyaratan:</p>
                                        <ul className="space-y-1">
                                            {selectedSurat.persyaratan.map((p, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400">
                                                    <span className="mt-0.5 font-bold">•</span> {p}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div>
                                    <Label className="mb-1.5 block">
                                        Keperluan Surat <span className="text-xs text-muted-foreground">(opsional)</span>
                                    </Label>
                                    <Textarea
                                        rows={3}
                                        value={keperluan}
                                        onChange={e => setKeperluan(e.target.value)}
                                        placeholder="Contoh: Digunakan untuk persyaratan pendaftaran beasiswa..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kanan: ringkasan & submit */}
                    <div className="space-y-4">
                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <h2 className="mb-4 font-semibold text-foreground">Ringkasan Pengajuan</h2>

                            <dl className="space-y-3 text-sm">
                                <div>
                                    <dt className="text-xs text-muted-foreground">Nama Warga</dt>
                                    <dd className="mt-0.5 font-medium text-foreground">{warga?.name ?? '—'}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-muted-foreground">NIK</dt>
                                    <dd className="mt-0.5 font-mono font-medium text-foreground">{warga?.nik ?? '—'}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-muted-foreground">Jenis Surat</dt>
                                    <dd className="mt-0.5 font-medium text-foreground">{selectedSurat?.nama_surat ?? '—'}</dd>
                                </div>
                                {keperluan && (
                                    <div>
                                        <dt className="text-xs text-muted-foreground">Keperluan</dt>
                                        <dd className="mt-0.5 text-foreground">{keperluan}</dd>
                                    </div>
                                )}
                            </dl>

                            <div className="my-4 border-t" />

                            <Button
                                onClick={handleSubmit}
                                disabled={!canSubmit || submitting}
                                className="w-full gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                Submit Pengajuan
                            </Button>

                            {!warga && (
                                <p className="mt-2 text-center text-xs text-muted-foreground">Pilih warga terlebih dahulu</p>
                            )}
                            {warga && !masterSuratId && (
                                <p className="mt-2 text-center text-xs text-muted-foreground">Pilih jenis surat terlebih dahulu</p>
                            )}
                        </div>

                        <p className="text-center text-xs text-muted-foreground">
                            Setiap pengajuan offline tetap dicatat secara digital di sistem SADESA.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
