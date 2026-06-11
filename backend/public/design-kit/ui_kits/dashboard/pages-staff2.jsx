// SADESA — Staff pages part 2: Pelayanan Loket, Surat Siap Cetak, Tindak Lanjut Pengaduan
const { useState: useStateS2 } = React;

// ========== 3 · PELAYANAN LOKET (OFFLINE) ==========
function Stepper({ steps, current }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
      {steps.map((s, i) => {
        const on = i === current, done = i < current;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 11, padding: '16px 20px', borderBottom: on ? '2px solid var(--teal-600)' : '2px solid transparent', marginBottom: -1 }}>
            <span style={{ width: 26, height: 26, borderRadius: 999, display: 'grid', placeItems: 'center', font: '700 12px/1 var(--font-sans)', flex: 'none',
              background: on || done ? 'var(--teal-600)' : 'var(--gray-100)', color: on || done ? '#fff' : 'var(--fg3)' }}>{done ? '✓' : i + 1}</span>
            <span style={{ font: on ? 'var(--body-medium)' : 'var(--body)', color: on ? 'var(--fg1)' : 'var(--fg3)', whiteSpace: 'nowrap' }}>{s}</span>
          </div>
        );
      })}
    </div>
  );
}
function FormLabel({ children }) { return <label style={{ display: 'block', font: 'var(--body-medium)', color: 'var(--fg1)', marginBottom: 7 }}>{children}</label>; }
function Selectish({ children }) {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border-strong)', borderRadius: 'var(--r-md)', padding: '11px 13px', font: 'var(--body)', color: 'var(--fg2)', cursor: 'pointer' }}>{children}<Icon name="chevron-down" size={16} color="var(--fg3)" /></div>;
}
function SectionTitle({ icon, children }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}><Icon name={icon} size={18} color="var(--teal-600)" /><span style={{ font: 'var(--h2)', color: 'var(--fg1)', whiteSpace: 'nowrap' }}>{children}</span></div>;
}

function PelayananLoket() {
  return (
    <div>
      <PageHead breadcrumb={['Layanan Publik', 'Pelayanan Loket']} title="Buat Pengajuan Surat (Warga Offline)"
        subtitle="Gunakan formulir ini untuk memproses permohonan surat bagi warga yang datang langsung ke kantor desa."
        right={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, font: 'var(--label)', letterSpacing: '.03em', color: 'var(--success-fg)', background: 'var(--success-bg)', padding: '7px 13px', borderRadius: 999, whiteSpace: 'nowrap' }}><span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--success)' }} />MODE OFFLINE</span>} />
      <Card pad={false}>
        <Stepper steps={['Identifikasi Warga', 'Pilih Layanan', 'Detail & Berkas']} current={0} />
        <div style={{ padding: 26 }}>
          <SectionTitle icon="user-search">Cari Data Warga</SectionTitle>
          <p style={{ font: 'var(--small)', color: 'var(--fg2)', margin: '-6px 0 14px' }}>Masukkan Nomor Induk Kependudukan (NIK) untuk menarik data dari database kependudukan desa.</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9, border: '1px solid var(--border-strong)', borderRadius: 'var(--r-md)', padding: '0 13px' }}>
              <Icon name="id-card" size={17} color="var(--fg3)" /><input placeholder="Masukkan 16 digit NIK..." style={{ flex: 1, border: 'none', outline: 'none', font: 'var(--body)', color: 'var(--fg1)', padding: '12px 0' }} /></div>
            <Button icon="search">Cari NIK Warga</Button>
          </div>
          <div style={{ marginTop: 12, border: '1px dashed var(--border-strong)', borderRadius: 'var(--r-md)', padding: '14px', textAlign: 'center', font: 'var(--small)', color: 'var(--fg3)', background: 'var(--gray-50)' }}>Data warga akan tampil secara otomatis setelah NIK ditemukan</div>

          <div style={{ height: 1, background: 'var(--border)', margin: '28px 0' }} />
          <SectionTitle icon="file-text">Pilih Jenis Surat</SectionTitle>
          <Grid cols="1fr 1fr">
            <div><FormLabel>Layanan Administrasi</FormLabel><Selectish>Pilih Jenis Surat...</Selectish></div>
            <div><FormLabel>Prioritas Pengajuan</FormLabel><Selectish>Normal (Standar)</Selectish></div>
          </Grid>

          <div style={{ height: 1, background: 'var(--border)', margin: '28px 0' }} />
          <SectionTitle icon="file-pen-line">Data Tambahan &amp; Lampiran</SectionTitle>
          <FormLabel>Keperluan Surat</FormLabel>
          <textarea rows="3" placeholder="Contoh: Digunakan untuk persyaratan pendaftaran beasiswa sekolah anak..." style={{ width: '100%', boxSizing: 'border-box', border: '1px solid var(--border-strong)', borderRadius: 'var(--r-md)', padding: 12, font: 'var(--body)', color: 'var(--fg1)', outline: 'none', resize: 'vertical', marginBottom: 18 }} />
          <FormLabel>Upload Dokumen Fisik (Scan)</FormLabel>
          <div style={{ border: '1.5px dashed var(--border-strong)', borderRadius: 'var(--r-md)', padding: '34px', textAlign: 'center', background: 'var(--gray-50)' }}>
            <div style={{ width: 52, height: 52, borderRadius: 999, background: '#fff', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', margin: '0 auto 12px', color: 'var(--teal-600)' }}><Icon name="upload-cloud" size={24} /></div>
            <div style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>Klik untuk pilih file atau seret file ke sini</div>
            <div style={{ font: 'var(--meta)', color: 'var(--fg3)', margin: '4px 0 12px' }}>PDF, JPG, atau PNG (Max 5MB per file)</div>
            <Button variant="outline" size="sm">Pilih Dokumen</Button>
          </div>
          <Grid cols="1fr 1fr" style={{ marginTop: 14 }}>
            {LOKET_FILES.map(f => (
              <div key={f.nama} style={{ display: 'flex', alignItems: 'center', gap: 11, border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '11px 13px' }}>
                <Icon name="paperclip" size={17} color="var(--fg3)" />
                <div style={{ flex: 1 }}><div style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{f.nama}</div><div style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>{f.size}</div></div>
                <Icon name="x" size={16} color="var(--fg3)" style={{ cursor: 'pointer' }} />
              </div>
            ))}
          </Grid>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 26px', borderTop: '1px solid var(--border)', background: 'var(--gray-50)', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, font: 'var(--small)', color: 'var(--fg3)' }}><Icon name="info" size={15} />Pastikan seluruh data yang diinput telah sesuai dengan dokumen asli fisik warga.</span>
          <div style={{ display: 'flex', gap: 12 }}><Button variant="outline">Batalkan</Button><Button icon="send">Submit Pengajuan</Button></div>
        </div>
      </Card>
      <TealPanel style={{ marginTop: 16, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="shield-check" size={22} color="#fff" /></div>
          <div><div style={{ font: 'var(--h3)', color: '#fff' }}>Integritas Data Terjamin</div><div style={{ font: 'var(--small)', color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>Setiap pengajuan offline tetap akan tercatat secara digital di server Sadesa Pusat.</div></div>
        </div>
        <button style={{ background: '#fff', color: 'var(--teal-700)', border: 'none', borderRadius: 'var(--r-md)', padding: '10px 16px', font: 'var(--body-medium)', cursor: 'pointer', whiteSpace: 'nowrap', flex: 'none' }}>Pelajari Lebih Lanjut</button>
      </TealPanel>
    </div>
  );
}

// ========== 4 · SURAT SIAP CETAK ==========
function CetakStat({ icon, label, value, badge, tone = 'gray' }) {
  const tones = { teal: ['var(--teal-50)', 'var(--teal-600)'], info: ['var(--info-bg)', 'var(--info-fg)'], warn: ['#fff7ed', '#c2410c'], gray: ['var(--gray-100)', 'var(--fg2)'] };
  const [bg, fg] = tones[tone];
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 18, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ width: 42, height: 42, borderRadius: 'var(--r-md)', background: bg, color: fg, display: 'grid', placeItems: 'center' }}><Icon name={icon} size={21} /></div>
        {badge}
      </div>
      <div style={{ font: 'var(--meta)', color: 'var(--fg2)', marginTop: 14 }}>{label}</div>
      <div style={{ font: 'var(--stat-value)', color: 'var(--fg1)', marginTop: 2 }}>{value}</div>
    </div>
  );
}
function SuratCetak() {
  return (
    <div>
      <PageHead title="Dokumen Menunggu Dicetak" subtitle="Kelola dan cetak surat yang telah disetujui oleh Kepala Desa."
        right={<div style={{ display: 'flex', gap: 10 }}><SelectChip icon="calendar">Hari Ini</SelectChip><Button variant="outline" icon="filter">Filter</Button></div>} />
      <Grid cols="repeat(4, 1fr)">
        <CetakStat icon="calendar-clock" tone="teal" label="Total Menunggu" value="24" badge={<Badge bg="var(--teal-50)" fg="var(--teal-700)">HARI INI</Badge>} />
        <CetakStat icon="file-text" tone="info" label="SKU (Usaha)" value="12" />
        <CetakStat icon="map-pin" tone="teal" label="SKP (Domisili)" value="8" />
        <CetakStat icon="more-horizontal" tone="warn" label="Lainnya" value="4" />
      </Grid>
      <div style={{ marginTop: 16 }}>
        <Card title="Daftar Surat" pad={false} action={<div style={{ display: 'flex', gap: 8 }}><IconButton icon="download" /><IconButton icon="more-vertical" /></div>}>
          <Table heads={['Nama Penduduk', 'Jenis Surat', 'No. Pengajuan', 'Status', 'Aksi']} aligns={['left', 'left', 'left', 'left', 'right']}>
            {SURAT_CETAK.map(s => (
              <Trow key={s.no}>
                <Td><NameCell name={s.nama} sub={s.nik} /></Td>
                <Td muted>{s.jenis}</Td>
                <Td><span style={{ font: '500 13px/1.4 var(--font-mono)', color: 'var(--fg2)' }}>{s.no}</span></Td>
                <Td><StatusDot color="var(--success)">Disahkan Kades</StatusDot></Td>
                <Td align="right"><Button size="sm" icon="printer">Cetak PDF</Button></Td>
              </Trow>
            ))}
          </Table>
          <Pagination info="Menampilkan 1–10 dari 48 dokumen" pages={[1, 2, 3]} current={1} />
        </Card>
      </div>
    </div>
  );
}

// ========== 5 · TINDAK LANJUT PENGADUAN ==========
function PengaduanField({ label, value, icon, iconColor }) {
  return (
    <div>
      <div style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)', marginBottom: 5 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, font: 'var(--body-medium)', color: 'var(--fg1)' }}>{icon && <Icon name={icon} size={16} color={iconColor || 'var(--teal-600)'} />}{value}</div>
    </div>
  );
}
function PengaduanDetail({ onBack }) {
  const t = PENGADUAN_TIKET;
  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 20 }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--fg2)' }}><Icon name="arrow-left" size={18} /></button>
        <h1 style={{ font: 'var(--h1)', color: 'var(--fg1)', margin: 0 }}>Tindak Lanjut Pengaduan</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, background: '#f0fdf9', border: '1px solid var(--teal-100)', borderRadius: 'var(--r-lg)', padding: '14px 18px', marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <Icon name="clipboard-list" size={20} color="var(--teal-600)" />
          <div><div style={{ font: 'var(--body-medium)', color: 'var(--teal-800)' }}>TIKET {t.id}</div>
            <div style={{ font: 'var(--meta)', color: 'var(--fg2)' }}>Status Saat Ini: <span style={{ color: 'var(--warning)', fontWeight: 600 }}>{t.status}</span></div></div>
        </div>
        <Pill bg="var(--gray-100)" fg="var(--fg2)">KATEGORI: {t.kategori}</Pill>
      </div>
      <Grid cols="1fr 1fr">
        <Card title="Foto Bukti Kejadian">
          <div style={{ position: 'relative', height: 360, background: 'var(--gray-300)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
            <button style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '8px 14px', font: 'var(--body-medium)', color: 'var(--fg1)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}><Icon name="maximize" size={15} />Perbesar Foto</button>
          </div>
        </Card>
        <Card title="Informasi Pelapor">
          <Grid cols="1fr 1fr" style={{ marginBottom: 18 }}>
            <PengaduanField label="Nama Pelapor" value={t.pelapor} />
            <PengaduanField label="Tanggal Laporan" value={t.tanggal} />
          </Grid>
          <div style={{ marginBottom: 18 }}><PengaduanField label="Lokasi" value={t.lokasi} icon="map-pin" iconColor="var(--danger)" /></div>
          <div style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)', marginBottom: 7 }}>Deskripsi Keluhan</div>
          <div style={{ background: 'var(--gray-50)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 14, font: 'var(--body)', fontStyle: 'italic', color: 'var(--fg2)', lineHeight: 1.6 }}>"{t.deskripsi}"</div>
        </Card>
      </Grid>
      <div style={{ marginTop: 16 }}>
        <Card pad={false}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: 'var(--h2)', color: 'var(--fg1)' }}><Icon name="file-pen-line" size={18} color="var(--teal-600)" />Form Tanggapan &amp; Tindak Lanjut</span>
            <span style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>* Wajib diisi untuk menutup tiket pengaduan</span>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)', marginBottom: 8 }}>Hasil Tindak Lanjut Petugas</div>
            <div style={{ border: '1px solid var(--border-strong)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: 6, padding: '8px 12px', borderBottom: '1px solid var(--border)', background: 'var(--gray-50)', color: 'var(--fg2)' }}>
                {['bold', 'italic', 'list', 'link'].map(ic => <span key={ic} style={{ width: 28, height: 28, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Icon name={ic} size={15} /></span>)}
              </div>
              <textarea rows="4" placeholder="Ketik hasil tindak lanjut petugas di sini..." style={{ width: '100%', boxSizing: 'border-box', border: 'none', outline: 'none', padding: 14, font: 'var(--body)', color: 'var(--fg1)', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginTop: 18, flexWrap: 'wrap' }}>
              <div>
                <div style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)', marginBottom: 8 }}>Sertakan Foto Perbaikan</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 78, height: 78, borderRadius: 'var(--r-md)', border: '1.5px dashed var(--border-strong)', display: 'grid', placeItems: 'center', color: 'var(--fg3)', cursor: 'pointer', background: 'var(--gray-50)' }}><div style={{ textAlign: 'center' }}><Icon name="camera" size={20} /><div style={{ font: '600 9px/1.4 var(--font-sans)', marginTop: 3 }}>UPLOAD FOTO</div></div></div>
                  <div style={{ font: 'var(--meta)', color: 'var(--fg3)', lineHeight: 1.7 }}>Ketentuan Foto:<br />Maksimal 3 file (Format JPG, PNG)<br />Ukuran maksimal 5MB per file<br />Pastikan foto terang dan jelas</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Button variant="outline">Simpan Draft</Button>
                <Button icon="send">Kirim Tanggapan &amp; Tutup Tiket</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Buku Tamu — simple reuse table page
function BukuTamuPage() {
  return (
    <div>
      <PageHead title="Buku Tamu" subtitle="Catatan kunjungan tamu ke kantor desa hari ini." right={<Button icon="user-plus">Tamu Baru</Button>} />
      <Card pad={false}>
        <Table heads={['Nama Tamu', 'Tujuan', 'Jam Masuk', 'Status']} aligns={['left', 'left', 'left', 'left']}>
          {BUKU_TAMU.map((t, i) => (
            <Trow key={i}>
              <Td><NameCell name={t.nama} /></Td>
              <Td muted>{t.tujuan}</Td>
              <Td muted>{t.jam} WIB</Td>
              <Td>{t.status === 'selesai' ? <Badge>SELESAI</Badge> : <Badge bg="var(--info-bg)" fg="var(--info-fg)">HADIR</Badge>}</Td>
            </Trow>
          ))}
        </Table>
      </Card>
    </div>
  );
}

Object.assign(window, { PelayananLoket, SuratCetak, PengaduanDetail, BukuTamuPage });
