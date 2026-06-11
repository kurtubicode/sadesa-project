// SADESA — Staff role pages (white-sidebar UI, teal palette)
const { useState: useStateSt } = React;

// stat card with label+value left, icon tile top-right, status badge at bottom
function StaffStat({ icon, iconTone = 'teal', label, value, badge }) {
  const tones = { teal: ['var(--teal-50)', 'var(--teal-600)'], warn: ['#fff7ed', '#c2410c'], green: ['var(--success-bg)', 'var(--success-fg)'] };
  const [bg, fg] = tones[iconTone] || tones.teal;
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ font: 'var(--body)', color: 'var(--fg2)', whiteSpace: 'nowrap' }}>{label}</div>
          <div style={{ font: 'var(--stat-value)', color: 'var(--fg1)', marginTop: 6 }}>{value}</div>
        </div>
        <div style={{ width: 46, height: 46, borderRadius: 'var(--r-md)', background: bg, color: fg, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={icon} size={22} /></div>
      </div>
      <div style={{ marginTop: 16 }}>{badge}</div>
    </div>
  );
}

// ========== 1 · DASHBOARD UTAMA ==========
function StaffDashboard({ onVerifikasi, onDetail }) {
  const [tab, setTab] = useStateSt('Semua');
  return (
    <div>
      <PageHead title="Dashboard Utama" subtitle="Selamat datang kembali, Ahmad. Berikut ringkasan antrean hari ini."
        right={<div style={{ display: 'flex', gap: 10 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: 'var(--body-medium)', color: 'var(--fg2)', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '8px 14px', whiteSpace: 'nowrap' }}><Icon name="calendar" size={16} color="var(--teal-600)" />24 Okt 2023</span>
          <Button icon="plus">Input Antrean Manual</Button></div>} />
      <Grid cols="repeat(3, 1fr)">
        <StaffStat icon="calendar-clock" iconTone="teal" label="Menunggu Verifikasi" value="15"
          badge={<Badge bg="var(--warn-bg)" fg="var(--warn-fg)">! PERLU TINDAKAN</Badge>} />
        <StaffStat icon="file-pen-line" iconTone="warn" label="Revisi Warga" value="4"
          badge={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--label)', letterSpacing: '.03em', color: 'var(--fg3)' }}><Icon name="history" size={13} />DALAM PROSES</span>} />
        <StaffStat icon="printer" iconTone="teal" label="Siap Cetak" value="8"
          badge={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--label)', letterSpacing: '.03em', color: 'var(--success-fg)' }}><Icon name="check-circle" size={13} />SIAP DIAMBIL</span>} />
      </Grid>
      <div style={{ marginTop: 16 }}>
        <Card pad={false}
          title="Tabel Antrean Utama"
          action={<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Toggle options={['Semua', 'Terbaru', 'Prioritas']} value={tab} onChange={setTab} /><IconButton icon="filter" /></div>}>
          <div style={{ padding: '0 20px 4px', marginTop: -8, marginBottom: 4 }}><p style={{ font: 'var(--small)', color: 'var(--fg2)', margin: '0 0 8px' }}>Monitor dan proses permohonan surat masuk secara real-time.</p></div>
          <Table heads={['Waktu Masuk', 'Nama Warga', 'Jenis Surat', 'Status', 'Aksi']} aligns={['left', 'left', 'left', 'left', 'right']}>
            {STAF_ANTREAN.map(r => (
              <Trow key={r.no}>
                <Td><div style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{r.waktu}</div><div style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>{r.no}</div></Td>
                <Td><NameCell name={r.nama} sub={'NIK: ' + r.nik} /></Td>
                <Td muted>{r.jenis}</Td>
                <Td>{r.status === 'revisi'
                  ? <StatusDot color="var(--fg3)">Revisi Warga</StatusDot>
                  : <Badge bg="var(--warn-bg)" fg="var(--warn-fg)">Menunggu Verifikasi</Badge>}</Td>
                <Td align="right">{r.status === 'revisi'
                  ? <Button variant="outline" size="sm" icon="eye" onClick={() => onDetail && onDetail(r)}>Lihat Detail</Button>
                  : <Button size="sm" onClick={() => onVerifikasi && onVerifikasi(r)}>Proses Sekarang ›</Button>}</Td>
              </Trow>
            ))}
          </Table>
          <Pagination info="Menampilkan 1–10 dari 15 antrean aktif" pages={[1, 2]} current={1} />
        </Card>
      </div>
      <Grid cols="1.2fr 1fr" style={{ marginTop: 16 }}>
        <TealPanel style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          <Icon name="file-text" size={120} color="rgba(255,255,255,0.10)" style={{ position: 'absolute', right: 8, bottom: -10 }} />
          <div style={{ position: 'relative' }}>
            <div style={{ font: 'var(--h1)', color: '#fff' }}>Butuh Verifikasi Manual?</div>
            <p style={{ font: 'var(--body)', color: 'rgba(255,255,255,0.88)', margin: '8px 0 18px', maxWidth: 380 }}>Terdapat 3 dokumen fisik yang baru saja diserahkan di loket hari ini. Segera verifikasi agar dapat masuk ke antrean digital.</p>
            <button onClick={() => onVerifikasi && onVerifikasi(STAF_ANTREAN[0])} style={{ background: '#fff', color: 'var(--teal-700)', border: 'none', borderRadius: 'var(--r-md)', padding: '11px 18px', font: 'var(--body-medium)', cursor: 'pointer' }}>Mulai Verifikasi Loket</button>
          </div>
        </TealPanel>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div><div style={{ font: 'var(--h2)', color: 'var(--fg1)' }}>Performa Staf Hari Ini</div>
              <div style={{ font: 'var(--small)', color: 'var(--fg2)', marginTop: 3 }}>Rata-rata waktu pemrosesan per surat</div></div>
            <div style={{ font: '700 30px/1 var(--font-sans)', color: 'var(--teal-600)' }}>8m 20s</div>
          </div>
          <div style={{ height: 8, background: 'var(--gray-100)', borderRadius: 999, margin: '20px 0 10px' }}><div style={{ width: '78%', height: '100%', background: 'var(--teal-600)', borderRadius: 999 }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--meta)' }}>
            <span style={{ color: 'var(--fg3)' }}>Target: &lt; 10m</span>
            <span style={{ color: 'var(--success)' }}>+12% lebih cepat dari kemarin</span>
          </div>
        </Card>
      </Grid>
    </div>
  );
}

// ========== 2 · VERIFIKASI BERKAS ==========
function ZoomCtl({ icon }) {
  return <span style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: '#fff', display: 'grid', placeItems: 'center', color: 'var(--fg2)', cursor: 'pointer' }}><Icon name={icon} size={16} /></span>;
}
function DataField({ label, value, copy, accent }) {
  return (
    <div>
      <div style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)', marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, font: 'var(--body-medium)', color: accent ? 'var(--teal-700)' : 'var(--fg1)' }}>
        {accent === 'wa' && <Icon name="message-circle" size={15} color="var(--success)" />}
        {value}{copy && <Icon name="copy" size={14} color="var(--fg3)" style={{ cursor: 'pointer' }} />}
      </div>
    </div>
  );
}
function VerifikasiBerkas({ onBack }) {
  return (
    <div style={{ margin: -28, display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-h))' }}>
      <div style={{ height: 68, background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flex: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--fg2)' }}><Icon name="arrow-left" size={18} /></button>
          <div><div style={{ font: 'var(--h2)', color: 'var(--fg1)' }}>Verifikasi Berkas Pemohon</div>
            <div style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>ID Permohonan: <span style={{ color: 'var(--teal-700)', fontWeight: 600 }}>SRT-2023-8821</span></div></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Badge bg="var(--warn-bg)" fg="var(--warn-fg)">● MENUNGGU VERIFIKASI</Badge>
          <Icon name="help-circle" size={20} color="var(--fg3)" />
        </div>
      </div>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1.3, background: 'var(--gray-50)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', borderBottom: '1px solid var(--border)', background: '#fff' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: 'var(--body-medium)', color: 'var(--fg1)' }}><Icon name="image" size={17} color="var(--teal-600)" />Preview Berkas: Kartu Keluarga</span>
            <div style={{ display: 'flex', gap: 8 }}><ZoomCtl icon="zoom-in" /><ZoomCtl icon="zoom-out" /><ZoomCtl icon="rotate-cw" /><ZoomCtl icon="maximize" /></div>
          </div>
          <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 30 }}>
            <div style={{ width: 280, height: 380, background: 'var(--gray-400)', borderRadius: 4, boxShadow: 'var(--shadow-lg)' }} />
          </div>
          <div style={{ textAlign: 'center', padding: '12px', font: 'var(--small)', color: 'var(--fg2)' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--success)' }} />Gambar Terbaca Jelas</span></div>
        </div>
        <div style={{ flex: 1, background: '#fff', display: 'flex', flexDirection: 'column', minWidth: 380 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 22 }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--r-md)', background: 'var(--teal-50)', color: 'var(--teal-600)', display: 'grid', placeItems: 'center' }}><Icon name="file-text" size={20} /></div>
              <span style={{ font: 'var(--h1)', color: 'var(--fg1)' }}>Data Pemohon</span>
            </div>
            <div style={{ marginBottom: 18 }}><DataField label="Nama Lengkap Sesuai Dokumen" value="AHMAD NUR HIDAYAT" /></div>
            <Grid cols="1fr 1fr" style={{ marginBottom: 18 }}>
              <DataField label="NIK (Nomor Induk Kependudukan)" value="3204123456780001" copy accent />
              <DataField label="Tempat, Tanggal Lahir" value="BANDUNG, 12-05-1992" />
            </Grid>
            <Grid cols="1fr 1fr" style={{ marginBottom: 18 }}>
              <DataField label="Jenis Kelamin" value="Laki-Laki" />
              <DataField label="No. WhatsApp / Kontak" value="0812-3456-7890" accent="wa" />
            </Grid>
            <div style={{ marginBottom: 22 }}>
              <div style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)', marginBottom: 6 }}>Tujuan / Keperluan Permohonan</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Pill bg="var(--teal-50)" fg="var(--teal-700)">PELAYANAN ADM</Pill>
                <span style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>Penerbitan Surat Keterangan Pindah (SKP)</span>
              </div>
            </div>
            <div style={{ background: 'var(--gray-50)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 'var(--r-sm)', background: '#fff7ed', color: '#c2410c', display: 'grid', placeItems: 'center' }}><Icon name="file-pen-line" size={16} /></div>
                <span style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>Catatan Internal Staff</span>
              </div>
              <textarea rows="3" placeholder="Berikan alasan spesifik jika meminta revisi atau instruksi tambahan untuk pencetakan berkas..." style={{ width: '100%', boxSizing: 'border-box', border: '1px solid var(--border-strong)', borderRadius: 'var(--r-md)', padding: 12, font: 'var(--body)', color: 'var(--fg1)', outline: 'none', resize: 'vertical', background: '#fff' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, padding: 20, borderTop: '1px solid var(--border)', flex: 'none' }}>
            <button onClick={onBack} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: 'var(--r-md)', padding: '12px', font: 'var(--body-medium)', cursor: 'pointer' }}><Icon name="file-x" size={17} />Minta Revisi</button>
            <button onClick={onBack} style={{ flex: 1.4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--teal-600)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', padding: '12px', font: 'var(--body-medium)', cursor: 'pointer' }}><Icon name="check-circle" size={17} />Setujui &amp; Teruskan ke Desa</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { StaffStat, StaffDashboard, VerifikasiBerkas });
