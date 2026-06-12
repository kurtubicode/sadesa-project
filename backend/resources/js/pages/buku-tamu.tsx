import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BukuTamu() {
    const { props } = usePage<{ flash?: { sukses?: string } }>();
    const [submitted, setSubmitted] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        nama_pengunjung: '',
        instansi:        '',
        keperluan:       '',
        no_hp:           '',
    });

    useEffect(() => {
        if (props.flash?.sukses) {
            setSubmitted(true);
            reset();
        }
    }, [props.flash?.sukses]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/buku-tamu');
    };

    return (
        <>
            <Head title="Buku Tamu Digital — SADESA" />

            <div className="min-h-screen bg-gray-50">
                {/* Nav */}
                <div className="border-b bg-white px-4 py-3 flex items-center gap-3">
                    <a
                        href="/"
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Kembali"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </a>
                    <span className="font-semibold text-gray-900">Buku Tamu</span>
                </div>

                <div className="mx-auto max-w-lg px-4 py-8">
                    {submitted ? (
                        /* ── Success ───────────────────────────────────── */
                        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
                                <CheckCircle className="h-9 w-9 text-teal-600" />
                            </div>
                            <h2 className="mb-2 text-lg font-bold text-gray-900">Terima Kasih!</h2>
                            <p className="mb-8 text-sm text-gray-500">
                                Data kunjungan Anda telah berhasil tercatat.
                                Silakan masuk ke loket pelayanan.
                            </p>
                            <button
                                type="button"
                                onClick={() => setSubmitted(false)}
                                className="w-full rounded-2xl bg-[#0050A7] py-3.5 text-sm font-bold text-white transition hover:bg-blue-800"
                            >
                                Isi Ulang (Tamu Lain)
                            </button>
                        </div>
                    ) : (
                        /* ── Form ─────────────────────────────────────── */
                        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                            {/* Heading */}
                            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                                Layanan Digital
                            </p>
                            <h1 className="mb-2 text-2xl font-bold text-gray-900">
                                Pendaftaran Kunjungan
                            </h1>
                            <p className="mb-7 text-sm text-gray-500">
                                Silakan isi formulir di bawah ini untuk mendata kunjungan Anda ke SADESA.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Nama */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nama_pengunjung}
                                        onChange={e => setData('nama_pengunjung', e.target.value)}
                                        placeholder="Masukkan nama lengkap"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    {errors.nama_pengunjung && (
                                        <p className="mt-1.5 text-xs text-red-500">{errors.nama_pengunjung}</p>
                                    )}
                                </div>

                                {/* Instansi */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Instansi / Asal Desa{' '}
                                        <span className="font-normal normal-case text-gray-400">(opsional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.instansi}
                                        onChange={e => setData('instansi', e.target.value)}
                                        placeholder="Masukkan nama instansi atau desa"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>

                                {/* Keperluan */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Tujuan Kunjungan <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={data.keperluan}
                                        onChange={e => setData('keperluan', e.target.value)}
                                        placeholder="Jelaskan tujuan kunjungan Anda"
                                        rows={3}
                                        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    {errors.keperluan && (
                                        <p className="mt-1.5 text-xs text-red-500">{errors.keperluan}</p>
                                    )}
                                </div>

                                {/* No HP */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Nomor HP{' '}
                                        <span className="font-normal normal-case text-gray-400">(opsional)</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.no_hp}
                                        onChange={e => setData('no_hp', e.target.value)}
                                        placeholder="cth: 08123456789"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    {errors.no_hp && (
                                        <p className="mt-1.5 text-xs text-red-500">{errors.no_hp}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0050A7] py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-60"
                                >
                                    {processing ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</>
                                    ) : (
                                        'Hadir / Submit'
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    <p className="mt-6 text-center text-xs text-gray-400">
                        © {new Date().getFullYear()} Desa Cirangkong — SADESA
                    </p>
                </div>
            </div>
        </>
    );
}
