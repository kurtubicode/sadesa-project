import { Head } from '@inertiajs/react';
import { CheckCircle, Clock, FileCheck, Printer, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AntreanRow {
    no_pengajuan: string;
    nama: string;
    jenis_surat: string;
    status: string;
    tanggal: string;
    waktu: string;
}

interface Stats {
    menunggu: number;
    diproses: number;
    menunggu_pengesahan: number;
    siap_diambil: number;
}

interface Props {
    antrean: AntreanRow[];
    stats: Stats;
}

const STATUS_CFG: Record<string, { label: string; bg: string; fg: string }> = {
    menunggu:            { label: 'Menunggu',          bg: '#FEF3C7', fg: '#92400E' },
    diproses:            { label: 'Diproses',          bg: '#DBEAFE', fg: '#1E40AF' },
    diverifikasi:        { label: 'Diverifikasi',      bg: '#EDE9FE', fg: '#5B21B6' },
    menunggu_pengesahan: { label: 'Menunggu Pengesahan', bg: '#F3E8FF', fg: '#6B21A8' },
    disetujui:           { label: 'Disetujui',         bg: '#FEF3C7', fg: '#92400E' },
    siap_diambil:        { label: 'Siap Diambil ✓',   bg: '#CCFBF1', fg: '#0F766E' },
};

const FILTER_TABS = [
    { key: 'semua',            label: 'Semua' },
    { key: 'menunggu',         label: 'Menunggu' },
    { key: 'diproses',         label: 'Diproses' },
    { key: 'menunggu_pengesahan', label: 'Menunggu Pengesahan' },
    { key: 'siap_diambil',     label: 'Siap Diambil' },
];

export default function PantauAntrean({ antrean, stats }: Props) {
    const [filter, setFilter] = useState('semua');
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(t);
    }, []);

    const filtered = filter === 'semua'
        ? antrean
        : antrean.filter(r => {
            if (filter === 'diproses') return ['diproses', 'diverifikasi'].includes(r.status);
            if (filter === 'menunggu_pengesahan') return ['menunggu_pengesahan', 'disetujui'].includes(r.status);
            return r.status === filter;
        });

    return (
        <>
            <Head title="Pantau Antrean — SADESA" />

            <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: '100vh', background: '#f0fdfa' }}>
                {/* Top bar */}
                <header style={{ background: '#0d9488', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)', borderRadius: 8, display: 'grid', placeItems: 'center' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        </div>
                        <div>
                            <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, lineHeight: 1 }}>SADESA</div>
                            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>Sahabat Digital Desa</div>
                        </div>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <RefreshCw size={14} />
                        {now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </div>
                </header>

                <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
                    {/* Page title */}
                    <div style={{ marginBottom: 28 }}>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>Pantau Antrean Layanan</h1>
                        <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>Status pengajuan surat warga secara real-time di Kantor Desa.</p>
                    </div>

                    {/* Stat cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                        {[
                            { label: 'Menunggu',          value: stats.menunggu,            icon: <Clock size={20} />,      bg: '#FEF3C7', fg: '#92400E' },
                            { label: 'Diproses',          value: stats.diproses,            icon: <RefreshCw size={20} />,  bg: '#DBEAFE', fg: '#1E40AF' },
                            { label: 'Menunggu Pengesahan', value: stats.menunggu_pengesahan, icon: <FileCheck size={20} />, bg: '#F3E8FF', fg: '#6B21A8' },
                            { label: 'Siap Diambil',      value: stats.siap_diambil,        icon: <Printer size={20} />,   bg: '#CCFBF1', fg: '#0F766E' },
                        ].map(c => (
                            <div key={c.label} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }}>
                                <div style={{ width: 40, height: 40, borderRadius: 8, background: c.bg, color: c.fg, display: 'grid', placeItems: 'center', marginBottom: 12 }}>
                                    {c.icon}
                                </div>
                                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{c.label}</div>
                                <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{c.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Filter tabs */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                        {FILTER_TABS.map(t => (
                            <button key={t.key} onClick={() => setFilter(t.key)}
                                style={{ padding: '7px 16px', borderRadius: 999, border: '1px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', transition: 'all .15s',
                                    background: filter === t.key ? '#0d9488' : '#fff',
                                    color: filter === t.key ? '#fff' : '#374151',
                                    borderColor: filter === t.key ? '#0d9488' : '#d1d5db',
                                }}>
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Table */}
                    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 600, fontSize: 15, color: '#0f172a' }}>Daftar Antrean Aktif</span>
                            <span style={{ fontSize: 12, color: '#0f766e', background: '#f0fdfa', padding: '4px 10px', borderRadius: 999 }}>
                                {filtered.length} antrian ditampilkan
                            </span>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ background: '#f9fafb' }}>
                                        {['No. Pengajuan', 'Nama Pemohon', 'Jenis Layanan', 'Tanggal', 'Status'].map(h => (
                                            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
                                                <CheckCircle size={32} style={{ margin: '0 auto 8px', display: 'block', color: '#d1d5db' }} />
                                                Tidak ada antrian dengan status ini.
                                            </td>
                                        </tr>
                                    ) : filtered.map((r, i) => {
                                        const cfg = STATUS_CFG[r.status] ?? { label: r.status, bg: '#f3f4f6', fg: '#6b7280' };
                                        return (
                                            <tr key={r.no_pengajuan} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                                                <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>{r.no_pengajuan}</td>
                                                <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0f172a' }}>{r.nama}</td>
                                                <td style={{ padding: '12px 16px', color: '#374151' }}>{r.jenis_surat}</td>
                                                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{r.tanggal} <span style={{ fontSize: 11 }}>{r.waktu}</span></td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span style={{ background: cfg.bg, color: cfg.fg, padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                                                        {cfg.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 24, letterSpacing: '0.05em', fontWeight: 600 }}>
                        SADESA — SAHABAT DIGITAL DESA
                    </p>
                </main>
            </div>

            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </>
    );
}
