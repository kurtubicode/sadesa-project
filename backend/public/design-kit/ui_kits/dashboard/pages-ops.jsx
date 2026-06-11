// SADESA — operational admin pages: Antrean, Riwayat Kunjungan, Audit Log
const { useState: useStateOps } = React;

// ============ MONITOR ANTREAN ============
function AntreanPage() {
  const [active, setActive] = useStateOps('semua');
  const rows = active === 'semua' ? ANTREAN : ANTREAN.filter(r => r.status === active);
  return (
    <div style={{ position: 'relative' }}>
      <PageHead title="Pantau Antrean" subtitle="Monitoring status pengajuan surat dan dokumen warga secara real-time."
        right={<div style={{ display: 'flex', gap: 10 }}><Button variant="outline" icon="sliders-horizontal">Filter Lanjutan</Button><Button variant="outline" icon="download">Ekspor Laporan</Button></div>} />
      <Grid cols="repeat(5, 1fr)">
        {ANTREAN_STATS.map(s => (
          <FilterTab key={s.key} label={s.label} value={s.value} dotColor={s.dot} active={active === s.key} onClick={() => setActive(s.key)} />
        ))}
      </Grid>
      <div style={{ marginTop: 16 }}>
        <Card title="Daftar Antrean Aktif" pad={false}
          action={<span style={{ font: 'var(--meta)', color: 'var(--teal-700)', background: 'var(--teal-50)', padding: '5px 11px', borderRadius: 999 }}>Terakhir diperbarui: 2 menit yang lalu</span>}>
          <Table heads={['Nomor Antrean', 'Nama Pemohon', 'Jenis Layanan', 'Waktu Pengajuan', 'Status', 'Aksi']} aligns={['left', 'left', 'left', 'left', 'left', 'right']}>
            {rows.map(r => {
              const m = ANTREAN_STATUS[r.status];
              return (
                <Trow key={r.no}>
                  <Td><Pill mono>{r.no}</Pill></Td>
                  <Td><NameCell name={r.nama} sub={'NIK: ' + r.nik} /></Td>
                  <Td>{r.layanan}</Td>
                  <Td muted>{r.waktu}</Td>
                  <Td><Badge bg={m.bg} fg={m.fg}>{m.label}</Badge></Td>
                  <Td align="right"><span style={{ display: 'inline-flex' }}><IconButton icon="eye" /></span></Td>
                </Trow>
              );
            })}
          </Table>
          <Pagination info={`Menampilkan ${rows.length} dari 128 data antrean`} pages={[1, 2, 3]} current={1} tail={12} />
        </Card>
      </div>
      <button title="Tambah antrean" style={{ position: 'fixed', right: 32, bottom: 32, width: 56, height: 56, borderRadius: 999, border: 'none',
        background: 'var(--teal-600)', color: '#fff', boxShadow: 'var(--shadow-lg)', cursor: 'pointer', display: 'grid', placeItems: 'center', zIndex: 20 }}>
        <Icon name="plus" size={24} /></button>
    </div>
  );
}

// ============ RIWAYAT KUNJUNGAN ============
function KunjunganPage() {
  return (
    <div>
      <PageHead breadcrumb={['Beranda', 'Riwayat Kunjungan']} title="Riwayat Kunjungan Fisik"
        subtitle="Daftar pengunjung harian yang datang langsung ke kantor desa."
        right={<div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <SelectChip icon="calendar">01 Oct 2023 – 31 Oct 2023</SelectChip>
          <Button variant="outline" icon="file-spreadsheet">Excel</Button>
          <Button variant="outline" icon="file-text">PDF</Button></div>} />
      <Grid cols="repeat(4, 1fr)">
        <IconStat icon="user-plus" tone="teal" label="Total Kunjungan" value="1,284" sub={<React.Fragment><Icon name="trending-up" size={13} color="var(--success)" /><span style={{ color: 'var(--success)' }}>12.5% vs bulan lalu</span></React.Fragment>} />
        <IconStat icon="timer" tone="warn" label="Rata-rata Durasi" value="14 Menit" sub="Konsultasi Admin" />
        <IconStat icon="id-card" tone="info" label="Kebutuhan Terbanyak" value="Legalisir" valueSmall sub="42% dari total kunjungan" />
        <DarkCard label="Status Petugas" value="3 Counter Aktif">
          <div style={{ display: 'flex', marginTop: 14 }}>
            {['Andi Wijaya', 'Rina Mawar', 'Slamet R'].map((n, i) => (
              <div key={i} style={{ marginLeft: i ? -10 : 0, border: '2px solid var(--dark-card-bg)', borderRadius: 999 }}><Avatar name={n} size={32} /></div>))}
          </div>
        </DarkCard>
      </Grid>
      <div style={{ marginTop: 16 }}>
        <Card title="Pengunjung Terkini" action={<a style={{ font: 'var(--body-medium)', color: 'var(--teal-700)', cursor: 'pointer', whiteSpace: 'nowrap' }}>Lihat Semua Kunjungan</a>} pad={false}>
          <Table heads={['Nama Pengunjung', 'Tujuan / Keperluan', 'Kategori', 'Loket / Ruang', 'Waktu Datang']} aligns={['left', 'left', 'left', 'left', 'left']}>
            {KUNJUNGAN.map((k, i) => (
              <Trow key={i}>
                <Td><NameCell name={k.nama} sub={k.asal} /></Td>
                <Td>{k.tujuan}</Td>
                <Td><Badge bg={k.katBg} fg={k.katFg}>{k.kat}</Badge></Td>
                <Td muted>{k.loket}</Td>
                <Td><div style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{k.jam}</div><div style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>Hari ini, 24 Okt</div></Td>
              </Trow>
            ))}
          </Table>
          <Pagination info="Menampilkan 5 dari 124 kunjungan hari ini" pages={[1, 2, 3]} current={1} />
        </Card>
      </div>
      <DarkCard style={{ marginTop: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="shield-check" size={24} color="#fff" /></div>
            <div><div style={{ font: 'var(--h2)', color: '#fff' }}>Sistem Keamanan Terintegrasi</div>
              <div style={{ font: 'var(--small)', color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>Data kunjungan fisik secara otomatis tervalidasi dengan sistem kependudukan pusat desa (SADESA Central).</div></div>
          </div>
          <button style={{ background: '#fff', color: 'var(--teal-700)', border: 'none', borderRadius: 'var(--r-md)', padding: '11px 18px', font: 'var(--body-medium)', cursor: 'pointer', whiteSpace: 'nowrap', flex: 'none' }}>Verifikasi Data Masal</button>
        </div>
      </DarkCard>
      <div style={{ textAlign: 'center', font: 'var(--meta)', color: 'var(--fg3)', marginTop: 24 }}>© 2023 SADESA Dashboard System · Versi 2.4.1</div>
    </div>
  );
}

// ============ AUDIT LOG ============
function AuditStat({ icon, iconColor, label, value, sub, subColor, percent }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 18, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)', whiteSpace: 'nowrap' }}>{label}</span>
        <Icon name={icon} size={18} color={iconColor || 'var(--fg3)'} />
      </div>
      <div style={{ font: 'var(--stat-value)', color: 'var(--fg1)', margin: '8px 0 6px' }}>{value}</div>
      {percent != null
        ? <div style={{ height: 7, background: 'var(--gray-100)', borderRadius: 999, marginTop: 8 }}><div style={{ width: percent + '%', height: '100%', background: 'var(--warning)', borderRadius: 999 }} /></div>
        : <div style={{ display: 'flex', alignItems: 'center', gap: 5, font: 'var(--meta)', color: subColor || 'var(--fg3)', whiteSpace: 'nowrap' }}>{sub}</div>}
    </div>
  );
}

function AuditPage() {
  return (
    <div>
      <PageHead title="Jejak Audit" subtitle="Log sistem dan riwayat aktivitas administrator secara real-time."
        right={<div style={{ display: 'flex', gap: 10 }}><Button variant="outline" icon="sliders-horizontal">Filter Lanjut</Button>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--teal-600)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', padding: '9px 16px', font: 'var(--body-medium)', cursor: 'pointer', whiteSpace: 'nowrap' }}><Icon name="download" size={16} />Ekspor Log</button></div>} />
      <Grid cols="repeat(4, 1fr)">
        <AuditStat icon="database" label="Total Aktivitas" value="12,482" subColor="var(--success)" sub={<React.Fragment><Icon name="trending-up" size={13} />+12% bln ini</React.Fragment>} />
        <AuditStat icon="alert-octagon" iconColor="var(--danger)" label="Error Terdeteksi" value="3" subColor="var(--success)" sub={<React.Fragment><Icon name="check-circle" size={13} />Status Aman</React.Fragment>} />
        <AuditStat icon="scan-face" iconColor="var(--info)" label="Login Hari Ini" value="42" sub="Operator Aktif" />
        <AuditStat icon="hard-drive" iconColor="var(--warning)" label="Penyimpanan Log" value="1.2 GB" percent={62} />
      </Grid>
      <div style={{ marginTop: 16 }}>
        <Card pad={false}>
          <Table heads={['Aksi', 'Deskripsi Aktivitas', 'Operator', 'Waktu', 'Alamat IP', 'Detail']} aligns={['left', 'left', 'left', 'left', 'left', 'right']}>
            {AUDIT.map((a, i) => (
              <Trow key={i}>
                <Td><Badge bg={a.aksiBg} fg={a.aksiFg}>{a.aksi}</Badge></Td>
                <Td><div style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{a.judul}</div>
                  <div style={{ font: 'var(--meta)', color: 'var(--fg3)', marginTop: 2 }}>{a.detail}</div></Td>
                <Td><NameCell name={a.operator} size={30} /></Td>
                <Td><div style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{a.tgl}</div>
                  <div style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>{a.jam}</div></Td>
                <Td><Pill mono bg="var(--gray-100)" fg="var(--fg2)">{a.ip}</Pill></Td>
                <Td align="right"><span style={{ display: 'inline-flex' }}><IconButton icon="eye" /></span></Td>
              </Trow>
            ))}
          </Table>
          <Pagination info="Menampilkan 1–10 dari 12,482 aktivitas" pages={[1, 2, 3]} current={1} tail={1248} />
        </Card>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, paddingTop: 16, borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 10 }}>
        <span style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>© 2023 SADESA · Sistem Administrasi Desa Digital. Hak Cipta Dilindungi.</span>
        <div style={{ display: 'flex', gap: 18 }}><a style={{ font: 'var(--meta)', color: 'var(--fg3)', cursor: 'pointer' }}>Kebijakan Privasi</a><a style={{ font: 'var(--meta)', color: 'var(--fg3)', cursor: 'pointer' }}>Syarat &amp; Ketentuan</a></div>
      </div>
    </div>
  );
}

Object.assign(window, { AntreanPage, KunjunganPage, AuditPage });
