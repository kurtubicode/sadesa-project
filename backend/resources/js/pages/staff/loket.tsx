import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle, ConciergeBell, FileText, IdCard, Info, Loader2, Search, Send, User, X } from 'lucide-react';
import { useRef, useState } from 'react';
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
}

const STEPS = ['Identifikasi Warga', 'Pilih Layanan', 'Detail & Konfirmasi'];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Layanan Publik', href: '/staff/pengajuan' },
    { title: 'Pelayanan Loket', href: '/staff/loket' },
];

export default function StaffLoket({ masterSurat }: Props) {
    const { errors } = usePage<{ errors: Record<string, string> }>().props;

    const [step, setStep] = useState(0);
    const [nik, setNik] = useState('');
    const [warga, setWarga] = useState<WargaData | null>(null);
    const [nikError, setNikError] = useState<string | null>(null);
    const [searching, setSearching] = useState(false);
    const [masterSuratId, setMasterSuratId] = useState('');
    const [keperluan, setKeperluan] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const nikRef = useRef<HTMLInputElement>(null);

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

    function clearWarga() { setWarga(null); setNik(''); setNikError(null); setTimeout(() => nikRef.current?.focus(), 50); }

    function handleSubmit() {
        setSubmitting(true);
        router.post('/staff/loket', {
            nik,
            master_surat_id: masterSuratId,
            keperluan,
        }, {
            onError: () => setSubmitting(false),
        });
    }

    const selectedSurat = masterSurat.find(s => String(s.id) === masterSuratId);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pelayanan Loket" />

            <div className="mx-auto max-w-3xl space-y-6 py-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Buat Pengajuan Surat (Warga Offline)</h1>
                        <p className="mt-1 text-sm text-gray-500">Gunakan formulir ini untuk memproses permohonan surat bagi warga yang datang langsung ke kantor desa.</p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                        <span className="h-2 w-2 rounded-full bg-green-500" />MODE OFFLINE
                    </span>
                </div>

                {/* Stepper */}
                <div className="rounded-xl border bg-white shadow-sm">
                    <div className="flex border-b">
                        {STEPS.map((s, i) => (
                            <div key={i} className={`flex flex-1 items-center gap-2.5 px-5 py-4 text-sm ${i === step ? 'border-b-2 border-teal-600' : 'border-b-2 border-transparent'}`} style={{ marginBottom: -1 }}>
                                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${i <= step ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    {i < step ? <CheckCircle size={14} strokeWidth={3} /> : i + 1}
                                </span>
                                <span className={i === step ? 'font-medium text-gray-900' : 'text-gray-400'}>{s}</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-6">
                        {/* ── Step 0: Identifikasi Warga ─────────────── */}
                        {step === 0 && (
                            <div className="space-y-5">
                                <div>
                                    <div className="mb-1 flex items-center gap-2 text-base font-semibold text-gray-900">
                                        <IdCard size={18} className="text-teal-600" /> Cari Data Warga
                                    </div>
                                    <p className="mb-4 text-sm text-gray-500">Masukkan Nomor Induk Kependudukan (NIK) untuk menarik data dari database kependudukan desa.</p>

                                    {!warga ? (
                                        <div className="space-y-2">
                                            <div className="flex gap-3">
                                                <div className="relative flex-1">
                                                    <IdCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                                                <Button onClick={cariNik} disabled={searching || nik.length !== 16} className="gap-2 bg-teal-600 hover:bg-teal-700">
                                                    {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                                                    Cari NIK
                                                </Button>
                                            </div>
                                            {nikError && <p className="text-sm text-red-600">{nikError}</p>}
                                            {!nikError && (
                                                <div className="rounded-lg border border-dashed bg-gray-50 p-4 text-center text-sm text-gray-400">
                                                    Data warga akan tampil secara otomatis setelah NIK ditemukan
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-600 text-white">
                                                        <User size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">{warga.name}</div>
                                                        <div className="font-mono text-sm text-gray-500">{warga.nik}</div>
                                                        {warga.phone && <div className="text-sm text-gray-500">{warga.phone}</div>}
                                                    </div>
                                                </div>
                                                <button onClick={clearWarga} className="rounded p-1 text-gray-400 hover:text-gray-600">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button onClick={() => setStep(1)} disabled={!warga} className="bg-teal-600 hover:bg-teal-700">
                                        Lanjut
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* ── Step 1: Pilih Layanan ──────────────────── */}
                        {step === 1 && (
                            <div className="space-y-5">
                                <div>
                                    <div className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
                                        <FileText size={18} className="text-teal-600" /> Pilih Jenis Surat
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="mb-1.5 block">Layanan Administrasi <span className="text-red-500">*</span></Label>
                                            <Select value={masterSuratId} onValueChange={setMasterSuratId}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Jenis Surat..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {masterSurat.map(s => (
                                                        <SelectItem key={s.id} value={String(s.id)}>
                                                            {s.nama_surat} <span className="text-gray-400">({s.kode})</span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {selectedSurat?.persyaratan && selectedSurat.persyaratan.length > 0 && (
                                            <div className="rounded-lg border bg-amber-50 p-4">
                                                <div className="mb-2 text-sm font-semibold text-amber-800">Persyaratan Surat:</div>
                                                <ul className="space-y-1">
                                                    {selectedSurat.persyaratan.map((p, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                                                            <span className="mt-0.5 font-bold">•</span> {p}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between pt-2">
                                    <Button variant="outline" onClick={() => setStep(0)}>Kembali</Button>
                                    <Button onClick={() => setStep(2)} disabled={!masterSuratId} className="bg-teal-600 hover:bg-teal-700">
                                        Lanjut
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* ── Step 2: Detail & Konfirmasi ────────────── */}
                        {step === 2 && (
                            <div className="space-y-5">
                                <div>
                                    <div className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
                                        <ConciergeBell size={18} className="text-teal-600" /> Detail & Konfirmasi
                                    </div>

                                    {/* Summary */}
                                    <div className="mb-4 rounded-xl border bg-gray-50 p-4 text-sm">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">Nama Warga</div>
                                                <div className="mt-1 font-medium text-gray-900">{warga?.name}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">NIK</div>
                                                <div className="mt-1 font-mono font-medium text-gray-900">{warga?.nik}</div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">Jenis Surat</div>
                                                <div className="mt-1 font-medium text-gray-900">{selectedSurat?.nama_surat}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="mb-1.5 block">Keperluan Surat</Label>
                                        <Textarea
                                            rows={3}
                                            value={keperluan}
                                            onChange={e => setKeperluan(e.target.value)}
                                            placeholder="Contoh: Digunakan untuk persyaratan pendaftaran beasiswa sekolah anak..."
                                        />
                                    </div>

                                    {errors.nik && <p className="text-sm text-red-600">{errors.nik}</p>}
                                    {errors.master_surat_id && <p className="text-sm text-red-600">{errors.master_surat_id}</p>}
                                </div>

                                <div className="flex justify-between pt-2">
                                    <Button variant="outline" onClick={() => setStep(1)}>Kembali</Button>
                                    <Button onClick={handleSubmit} disabled={submitting} className="gap-2 bg-teal-600 hover:bg-teal-700">
                                        {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                        Submit Pengajuan
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer note */}
                    <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-3">
                        <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Info size={14} /> Pastikan seluruh data yang diinput telah sesuai dengan dokumen asli fisik warga.
                        </span>
                    </div>
                </div>

                {/* Info banner */}
                <div className="flex items-center gap-4 rounded-xl bg-teal-700 p-5 text-white">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/20">
                        <CheckCircle size={22} />
                    </div>
                    <div>
                        <div className="text-sm font-semibold">Integritas Data Terjamin</div>
                        <div className="mt-0.5 text-xs text-teal-100">Setiap pengajuan offline tetap akan tercatat secara digital di server SADESA.</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
