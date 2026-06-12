// SADESA — Kepala Desa pages (white-sidebar UI, teal palette)
const { useState: useStateK2 } = React;

// dual-line chart (Surat Keterangan vs Layanan Umum)
function DualLineChart({ a, b, height = 280 }) {
  const w = 680, h = height, padL = 16, padB = 28, padT = 16, padR = 12;
  const max = Math.max(...a.map(d => d.v), ...b.map(d => d.v)) * 1.18;
  const ix = i => padL + (i * (w - padL - padR)) / (a.length - 1);
  const iy = v => padT + (1 - v / max) * (h - padT - padB);
  const line = arr => arr.map((d, i) => (i ? 'L' : 'M') + ix(i) + ' ' + iy(d.v)).join(' ');
  const areaA = line(a) + ` L ${ix(a.length-1)} ${h-padB} L ${ix(0)} ${h-padB} Z`;
  const grid = [0, 0.33, 0.66, 1].map(t => padT + t * (h - padT - padB));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height, display: 'block' }}>
      <defs><linearGradient id="kadesg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="var(--teal-500)" stopOpacity="0.16" /><stop offset="1" stopColor="var(--teal-500)" stopOpacity="0" /></linearGradient></defs>
      {grid.map((y, i) => <line key={i} x1={padL} y1={y} x2={w-padR} y2={y} stroke="var(--border)" strokeWidth="1" />)}
      <path d={areaA} fill="url(#kadesg)" />
      <path d={line(a)} fill="none" stroke="var(--teal-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={line(b)} fill="none" stroke="var(--gray-800)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {a.map((d, i) => <text key={i} x={ix(i)} y={h-9} textAnchor="middle" style={{ font: 'var(--meta)', fill: 'var(--fg3)' }}>{d.d}</text>)}
    </svg>
  );
}

function Donut({ data, total, size = 200 }) {
  const r = size / 2 - 16, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--gray-100)" strokeWidth="20" />
      {data.map((d, i) => {
        const len = (d.v / 100) * circ;
        const el = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth="20"
          strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-acc} transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt" />;
        acc += len; return el;
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" style={{ font: '700 30px/1 var(--font-sans)', fill: 'var(--fg1)' }}>{total}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" style={{ font: 'var(--label)', letterSpacing: '.04em', fill: 'var(--fg3)' }}>TOTAL ADUAN</text>
    </svg>
  );
}

// ========== 1 · DASHBOARD STATISTIK ==========
function KadesStat({ label, value, icon, iconTone, children }) {
  const tones = { teal: ['var(--teal-50)', 'var(--teal-600)'], warn: ['#fffbeb', '#d97706'], info: ['var(--info-bg)', 'var(--info-fg)'] };
  const [bg, fg] = tones[iconTone] || tones.teal;
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div><div style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)', whiteSpace: 'nowrap' }}>{label}</div>
          <div style={{ font: 'var(--stat-value)', color: 'var(--fg1)', marginTop: 8 }}>{value}</div></div>
        <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: bg, color: fg, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={icon} size={21} /></div>
      </div>
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}

function KadesDashboard() {
  return (
    <div>
      <PageHead title="Ringkasan Eksekutif" subtitle={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Icon name="calendar" size={15} color="var(--fg3)" />Selasa, 24 Mei 2024</span>}
        right={<Button icon="download">Unduh Laporan Tahunan</Button>} />
      <Grid cols="repeat(3, 1fr)">
        <KadesStat label="Surat Disahkan Bulan Ini" value="128" icon="shield-check" iconTone="teal">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--meta)', color: 'var(--success)' }}><Icon name="trending-up" size={14} />12% dibanding bln lalu</span>
        </KadesStat>
        <KadesStat label="Tingkat Kepuasan Warga" value="4.8/5.0" icon="star" iconTone="warn">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: 'var(--meta)', color: 'var(--fg3)' }}>
            <span style={{ color: '#f59e0b', letterSpacing: 1 }}>★★★★★</span>Total 452 ulasan</span>
        </KadesStat>
        <KadesStat label="Aduan Diselesaikan" value="95%" icon="check-circle" iconTone="info">
          <div style={{ height: 7, background: 'var(--gray-100)', borderRadius: 999, margin: '0 0 8px' }}><div style={{ width: '95%', height: '100%', background: 'var(--success)', borderRadius: 999 }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--meta)', color: 'var(--fg3)' }}><span>Selesai: 190</span><span>Pending: 10</span></div>
        </KadesStat>
      </Grid>
      <Grid cols="1.5fr 1fr" style={{ marginTop: 16 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
            <div><div style={{ font: 'var(--h2)', color: 'var(--fg1)' }}>Tren Pelayanan Surat</div>
              <div style={{ font: 'var(--small)', color: 'var(--fg2)', marginTop: 2 }}>Data kumulatif 6 bulan terakhir</div></div>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--meta)', color: 'var(--fg2)' }}><span style={{ width: 9, height: 9, borderRadius: 999, background: 'var(--teal-600)' }} />Surat Keterangan</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--meta)', color: 'var(--fg2)' }}><span style={{ width: 9, height: 9, borderRadius: 999, background: 'var(--gray-800)' }} />Layanan Umum</span>
            </div>
          </div>
          <DualLineChart a={KADES_TREN.keterangan} b={KADES_TREN.umum} />
        </Card>
        <Card>
          <div style={{ font: 'var(--h2)', color: 'var(--fg1)' }}>Kategori Pengaduan</div>
          <div style={{ font: 'var(--small)', color: 'var(--fg2)', marginTop: 2, marginBottom: 12 }}>Distribusi aduan masuk</div>
          <div style={{ display: 'grid', placeItems: 'center', marginBottom: 16 }}><Donut data={KADES_PENGADUAN} total="200" /></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {KADES_PENGADUAN.map(c => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 11, height: 11, borderRadius: 3, background: c.color, flex: 'none' }} />
                <span style={{ font: 'var(--body)', color: 'var(--fg2)', flex: 1 }}>{c.label}</span>
                <span style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{c.v}%</span>
              </div>
            ))}
          </div>
        </Card>
      </Grid>
    </div>
  );
}

// ========== 2 · PENGESAHAN DOKUMEN ==========
function AntreanItem({ it, active, onClick }) {
  const [h, setH] = useStateK2(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: 'relative', textAlign: 'left', width: '100%', border: 'none', cursor: 'pointer', padding: '15px 18px',
        borderBottom: '1px solid var(--border)', background: active ? 'var(--teal-50)' : (h ? 'var(--gray-50)' : '#fff') }}>
      {active && <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--teal-600)' }} />}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Pill bg="var(--teal-50)" fg="var(--teal-700)" mono>{it.tipe}</Pill>
        <span style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>{it.waktu}</span>
      </div>
      <div style={{ font: 'var(--h3)', color: 'var(--fg1)' }}>{it.nama}</div>
      <div style={{ font: 'var(--small)', color: 'var(--fg2)', marginTop: 1 }}>{it.jenis}</div>
      {it.verified && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--meta)', color: 'var(--teal-700)', marginTop: 9 }}><Icon name="badge-check" size={14} color="var(--teal-600)" />Data Terverifikasi Sistem</div>}
    </button>
  );
}

function LetterPreview() {
  return (
    <div style={{ background: '#fff', boxShadow: 'var(--shadow-lg)', borderRadius: 4, padding: '40px 52px', maxWidth: 560, margin: '0 auto', position: 'relative' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><Icon name="landmark" size={40} color="var(--fg1)" /></div>
        <div style={{ font: '700 17px/1.3 var(--font-sans)', color: 'var(--fg1)' }}>PEMERINTAH KABUPATEN BANDUNG</div>
        <div style={{ font: '700 15px/1.3 var(--font-sans)', color: 'var(--fg1)' }}>KECAMATAN CILEUNYI — DESA CIMEKAR</div>
        <div style={{ font: 'var(--meta)', color: 'var(--fg2)', marginTop: 4 }}>Jl. Raya Cimekar No. 123, Bandung 40623 · www.cimekar.desa.id</div>
      </div>
      <div style={{ borderBottom: '3px solid var(--fg1)', margin: '14px 0 26px' }} />
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ font: 'var(--h3)', color: 'var(--fg1)', textDecoration: 'underline', textUnderlineOffset: 4 }}>SURAT KETERANGAN USAHA</div>
        <div style={{ font: 'var(--small)', color: 'var(--fg2)', marginTop: 4 }}>Nomor: 503/042/SKU/XI/2023</div>
      </div>
      <p style={{ font: 'var(--body)', color: 'var(--fg1)', margin: '0 0 18px', lineHeight: 1.7 }}>Yang bertanda tangan di bawah ini Kepala Desa Cimekar Kecamatan Cileunyi Kabupaten Bandung, dengan ini menerangkan bahwa:</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, paddingLeft: 30, marginBottom: 18 }}>
        {[['Nama Lengkap', 'Ahmad Subarjo', true], ['NIK', '3204123456780001'], ['Jenis Kelamin', 'Laki-laki'], ['Pekerjaan', 'Wiraswasta'], ['Alamat Domisili', 'Dusun II RT 03 RW 08 Desa Cimekar']].map(([k, v, b], i) => (
          <div key={i} style={{ display: 'flex', font: 'var(--body)', color: 'var(--fg1)' }}>
            <span style={{ width: 150, color: 'var(--fg2)' }}>{k}</span><span style={{ whiteSpace: 'nowrap' }}>:&nbsp;<span style={{ fontWeight: b ? 700 : 400 }}>{v}</span></span>
          </div>
        ))}
      </div>
      <p style={{ font: 'var(--body)', color: 'var(--fg1)', margin: 0, lineHeight: 1.7 }}>Berdasarkan pendataan kami, adalah benar yang bersangkutan memiliki usaha di bidang Perdagangan Alat Pertanian yang berlokasi di wilayah Desa Cimekar dan telah berjalan sejak tahun 2018.</p>
    </div>
  );
}

function WargaField({ label, value, accent }) {
  return (
    <div>
      <div style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)', marginBottom: 3 }}>{label}</div>
      <div style={{ font: 'var(--body-medium)', color: accent ? 'var(--teal-700)' : 'var(--fg1)' }}>{value}</div>
    </div>
  );
}

function WargaDetailPanel({ w, onClose }) {
  return (
    <div style={{ width: 340, flex: 'none', background: '#fff', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 18px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: 'var(--h3)', color: 'var(--fg1)' }}><Icon name="user-round" size={18} color="var(--teal-600)" />Detail Warga</span>
        <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--fg3)' }}><Icon name="x" size={15} /></button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingBottom: 18, borderBottom: '1px solid var(--border)', marginBottom: 18 }}>
          <Avatar name={w.nama} size={64} />
          <div style={{ font: 'var(--h2)', color: 'var(--fg1)', marginTop: 10 }}>{w.nama}</div>
          <div style={{ font: 'var(--meta)', color: 'var(--fg3)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>NIK {w.nik}</div>
          {w.verified && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--meta)', color: 'var(--teal-700)', background: 'var(--teal-50)', padding: '4px 10px', borderRadius: 999, marginTop: 10 }}><Icon name="badge-check" size={13} />Data Terverifikasi Sistem</div>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
          <WargaField label="Tempat, Tgl Lahir" value={w.ttl} />
          <WargaField label="Jenis Kelamin" value={w.jk} />
          <WargaField label="Pekerjaan" value={w.pekerjaan} />
          <WargaField label="Agama" value={w.agama} />
          <WargaField label="Status Kawin" value={w.status} />
          <WargaField label="No. WhatsApp" value={w.wa} accent />
        </div>
        <div style={{ marginBottom: 18 }}><WargaField label="Alamat Domisili" value={w.alamat} /></div>
        <div style={{ background: 'var(--gray-50)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 14, marginBottom: 16 }}>
          <div style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)', marginBottom: 5 }}>Keperluan Surat</div>
          <div style={{ font: 'var(--body)', color: 'var(--fg1)' }}>{w.keperluan}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 'var(--r-md)' }}>
          <Avatar name={w.verifBy} size={34} />
          <div><div style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>Diverifikasi oleh</div>
            <div style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{w.verifBy}</div></div>
        </div>
      </div>
    </div>
  );
}

function PengesahanDokumen() {
  const [sel, setSel] = useStateK2(0);
  const [showWarga, setShowWarga] = useStateK2(true);
  const w = KADES_ANTREAN[sel];
  return (
    <div style={{ margin: -28, display: 'flex', height: 'calc(100vh - var(--topbar-h))' }}>
      <div style={{ width: 340, flex: 'none', background: '#fff', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ font: 'var(--h2)', color: 'var(--fg1)' }}>Antrean Pengesahan</span>
            <Badge bg="var(--teal-50)" fg="var(--teal-700)">5 Menunggu</Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--gray-50)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '0 12px' }}>
            <Icon name="search" size={16} color="var(--fg3)" /><input placeholder="Cari penduduk atau nomor surat..." style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', font: 'var(--body)', color: 'var(--fg1)', padding: '10px 0' }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {KADES_ANTREAN.map((it, i) => <AntreanItem key={i} it={it} active={sel === i} onClick={() => setSel(i)} />)}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--gray-50)' }}>
        <div style={{ height: 64, flex: 'none', background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <Icon name="file-text" size={20} color="var(--fg3)" />
            <div style={{ minWidth: 0 }}><div style={{ font: 'var(--body-medium)', color: 'var(--fg1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>503/042/{w.tipe}/XI/2023 — {w.nama}</div>
              <div style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>Diunggah 24 Mei 2024 pukul 14:20 WIB</div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 'none' }}>
            <Button variant={showWarga ? 'primary' : 'outline'} size="sm" icon="user-round" onClick={() => setShowWarga(!showWarga)}>Detail Warga</Button>
            <div style={{ display: 'flex', gap: 14, color: 'var(--fg2)' }}><Icon name="zoom-in" size={19} /><Icon name="printer" size={19} /><Icon name="download" size={19} /></div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: 32, minWidth: 0 }}><LetterPreview /></div>
          {showWarga && <WargaDetailPanel w={w} onClose={() => setShowWarga(false)} />}
        </div>
        <div style={{ flex: 'none', background: '#fff', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 12, padding: 18 }}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: 'var(--r-md)', padding: '12px 20px', font: 'var(--body-medium)', cursor: 'pointer', whiteSpace: 'nowrap' }}><Icon name="x-circle" size={17} />Tolak Pengajuan</button>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--teal-600)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', padding: '12px 22px', font: 'var(--body-medium)', cursor: 'pointer', whiteSpace: 'nowrap' }}><Icon name="badge-check" size={17} />Sahkan &amp; Tanda Tangani</button>
        </div>
      </div>
    </div>
  );
}

// ========== 3 · LAPORAN BULANAN (rincian / breakdown on-screen) ==========
function LapMetric({ icon, tone, label, value, sub, subColor }) {
  const tones = { teal: ['var(--teal-50)', 'var(--teal-600)'], green: ['var(--success-bg)', 'var(--success-fg)'], warn: ['#fffbeb', '#d97706'], info: ['var(--info-bg)', 'var(--info-fg)'] };
  const [bg, fg] = tones[tone] || tones.teal;
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 18, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)' }}>{label}</div>
        <div style={{ width: 34, height: 34, borderRadius: 'var(--r-md)', background: bg, color: fg, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={icon} size={17} /></div>
      </div>
      <div style={{ font: 'var(--stat-value)', color: 'var(--fg1)', margin: '8px 0 4px' }}>{value}</div>
      <div style={{ font: 'var(--meta)', color: subColor || 'var(--fg3)' }}>{sub}</div>
    </div>
  );
}

// horizontal proportion bar (selesai vs sisa)
function SplitBar({ selesai, masuk }) {
  const pct = Math.round(selesai / masuk * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 150 }}>
      <div style={{ flex: 1, height: 7, background: 'var(--gray-100)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', background: 'var(--teal-600)', borderRadius: 999 }} />
      </div>
      <span style={{ font: 'var(--meta)', color: 'var(--fg2)', width: 34, textAlign: 'right', flex: 'none' }}>{pct}%</span>
    </div>
  );
}

function LaporanBulanan() {
  const totMasuk = LAPORAN_REKAP_SURAT.reduce((s, r) => s + r.masuk, 0);
  const totSelesai = LAPORAN_REKAP_SURAT.reduce((s, r) => s + r.selesai, 0);
  const totTolak = LAPORAN_REKAP_SURAT.reduce((s, r) => s + r.tolak, 0);
  const adMasuk = LAPORAN_PENGADUAN.reduce((s, r) => s + r.masuk, 0);
  const adSelesai = LAPORAN_PENGADUAN.reduce((s, r) => s + r.selesai, 0);
  const maxHarian = Math.max(...LAPORAN_HARIAN.map(d => d.v));
  return (
    <div>
      <PageHead title="Laporan Bulanan" subtitle="Rincian kegiatan administrasi & pelayanan desa — Periode Mei 2024."
        right={<div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <SelectChip icon="calendar">Mei 2024</SelectChip>
          <SelectChip icon="shapes">Semua Layanan</SelectChip>
          <Button variant="outline" icon="file-down">Unduh PDF</Button>
          <Button icon="table">Ekspor Excel</Button></div>} />

      {/* metric overview */}
      <Grid cols="repeat(4, 1fr)">
        <LapMetric icon="file-text" tone="teal" label="Total Permohonan" value={totMasuk} sub="surat masuk bulan ini" />
        <LapMetric icon="check-circle" tone="green" label="Selesai Terbit" value={totSelesai} subColor="var(--success)" sub={`${Math.round(totSelesai/totMasuk*100)}% tingkat penyelesaian`} />
        <LapMetric icon="timer" tone="warn" label="Rata-rata Proses" value="1,4 hari" sub="per permohonan surat" />
        <LapMetric icon="megaphone" tone="info" label="Pengaduan Masuk" value={adMasuk} sub={`${adSelesai} selesai · ${adMasuk-adSelesai} proses`} />
      </Grid>

      {/* detail layanan persuratan */}
      <div style={{ marginTop: 16 }}>
        <Card title="Rincian Layanan Persuratan" pad={false}
          action={<span style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>6 jenis layanan</span>}>
          <Table heads={['Jenis Surat', 'Masuk', 'Selesai', 'Ditolak', 'Penyelesaian']} aligns={['left', 'center', 'center', 'center', 'left']}>
            {LAPORAN_REKAP_SURAT.map(r => (
              <Trow key={r.no}>
                <Td strong>{r.jenis}</Td>
                <Td align="center" muted>{r.masuk}</Td>
                <Td align="center"><span style={{ color: 'var(--success-fg)', fontWeight: 600 }}>{r.selesai}</span></Td>
                <Td align="center"><span style={{ color: r.tolak ? 'var(--danger)' : 'var(--fg3)', fontWeight: r.tolak ? 600 : 400 }}>{r.tolak}</span></Td>
                <Td><SplitBar selesai={r.selesai} masuk={r.masuk} /></Td>
              </Trow>
            ))}
            <tr style={{ background: 'var(--gray-50)' }}>
              <Td strong>Total</Td>
              <Td align="center" strong>{totMasuk}</Td>
              <Td align="center"><span style={{ color: 'var(--success-fg)', fontWeight: 700 }}>{totSelesai}</span></Td>
              <Td align="center"><span style={{ color: 'var(--danger)', fontWeight: 700 }}>{totTolak}</span></Td>
              <Td><SplitBar selesai={totSelesai} masuk={totMasuk} /></Td>
            </tr>
          </Table>
        </Card>
      </div>

      {/* breakdown row: weekly volume + pengaduan */}
      <Grid cols="1.3fr 1fr" style={{ marginTop: 16 }}>
        <Card title="Volume Permohonan per Minggu">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, height: 180, padding: '8px 4px 0' }}>
            {LAPORAN_HARIAN.map(d => (
              <div key={d.d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{d.v}</span>
                <div style={{ width: '100%', maxWidth: 64, height: `${(d.v/maxHarian)*100}%`, background: 'linear-gradient(180deg, var(--teal-500), var(--teal-600))', borderRadius: '6px 6px 0 0' }} />
                <span style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>{d.d}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Rincian Pengaduan">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {LAPORAN_PENGADUAN.map((p, i) => {
              const colors = ['#2563eb', '#16a34a', '#ea9a16', '#dc2626'];
              return (
                <div key={p.no}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: 'var(--body)', color: 'var(--fg1)' }}><span style={{ width: 9, height: 9, borderRadius: 3, background: colors[i] }} />{p.kategori}</span>
                    <span style={{ font: 'var(--meta)', color: 'var(--fg2)' }}>{p.selesai}/{p.masuk} selesai</span>
                  </div>
                  <div style={{ height: 7, background: 'var(--gray-100)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${p.selesai/p.masuk*100}%`, height: '100%', background: colors[i], borderRadius: 999 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </Grid>

      {/* kinerja petugas + keuangan */}
      <Grid cols="1.3fr 1fr" style={{ marginTop: 16 }}>
        <Card title="Kinerja Petugas Pelayanan" pad={false}>
          <Table heads={['Petugas', 'Surat Diproses', 'Rata-rata Waktu']} aligns={['left', 'center', 'right']}>
            {LAPORAN_PETUGAS.map((p, i) => (
              <Trow key={i}>
                <Td><NameCell name={p.nama} sub="Staf Administrasi" /></Td>
                <Td align="center" strong>{p.diproses}</Td>
                <Td align="right" muted>{p.rata}</Td>
              </Trow>
            ))}
          </Table>
        </Card>
        <Card title="Ringkasan Keuangan">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {LAPORAN_KEUANGAN.map((k, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 14, borderBottom: i < LAPORAN_KEUANGAN.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div><div style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{k.label}</div>
                  <div style={{ font: 'var(--meta)', color: 'var(--fg3)', marginTop: 2 }}>{k.sub}</div></div>
                <div style={{ font: 'var(--h2)', color: 'var(--teal-700)', whiteSpace: 'nowrap' }}>{k.value}</div>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--teal-50)', borderRadius: 'var(--r-md)', padding: '11px 13px', font: 'var(--small)', color: 'var(--teal-800)' }}>
              <Icon name="info" size={15} color="var(--teal-600)" />Dokumen laporan lengkap & siap tanda tangan tersedia saat Unduh PDF.
            </div>
          </div>
        </Card>
      </Grid>
    </div>
  );
}

Object.assign(window, { KadesDashboard, PengesahanDokumen, LaporanBulanan });
