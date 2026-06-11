// SADESA — Admin & Staff dashboard screens
const { useState: useStateD } = React;

function Grid({ cols, gap = 16, children, style }) {
  return <div style={{ display: 'grid', gridTemplateColumns: cols, gap, ...style }}>{children}</div>;
}

function AdminDashboard() {
  const [period, setPeriod] = useStateD('Minggu Ini');
  const data = period === 'Minggu Ini' ? TREN_MINGGU : TREN_BULAN;
  return (
    <div>
      <PageHead title="Ringkasan Sistem" subtitle="Laporan performa dan statistik operasional desa hari ini." date={TODAY} />
      <Grid cols="repeat(4, 1fr)">
        <StatCard icon="users" label="Total Penduduk" value="8.421" tone="teal" badge={<Badge>+4,2%</Badge>} />
        <StatCard icon="user-check" label="Akun Warga" value="3.190" tone="teal" badge={<Badge>+1,8%</Badge>} />
        <StatCard icon="file-text" label="Permohonan Surat" value="128" tone="warn" badge={<Badge bg="var(--warn-bg)" fg="var(--warn-fg)">Pending</Badge>} />
        <StatCard icon="message-square-warning" label="Laporan Pengaduan" value="17" tone="danger" badge={<Badge bg="var(--danger-bg)" fg="var(--danger-fg)">Urgent</Badge>} />
      </Grid>
      <Grid cols="2fr 1fr" style={{ marginTop: 16 }}>
        <Card title="Tren Layanan Mingguan" action={<Toggle options={['Minggu Ini', 'Bulan Ini']} value={period} onChange={setPeriod} />}>
          <LineChart data={data} />
        </Card>
        <Card title="Log Aktivitas Terbaru">
          <ActivityLog items={ACTIVITY} />
          <div style={{ marginTop: 14 }}><Button variant="outline" size="sm" style={{ width: '100%', justifyContent: 'center' }}>Lihat Semua Log</Button></div>
        </Card>
      </Grid>
      <div style={{ marginTop: 16 }}>
        <Card title="Daftar Permohonan Terbaru" pad={false}
          action={<div style={{ display: 'flex', gap: 8 }}><IconButton icon="filter" /><IconButton icon="download" /></div>}>
          <PermohonanTable rows={PERMOHONAN} onRowAction={() => {}} />
          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <Button variant="ghost" size="sm">Tampilkan 121 data lainnya</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StaffDashboard({ onVerifikasi }) {
  const [tab, setTab] = useStateD('Semua');
  const menunggu = PERMOHONAN.filter(r => ['menunggu', 'diproses'].includes(r.status));
  const rows = tab === 'Semua' ? menunggu : menunggu.filter(r => r.status === tab.toLowerCase());
  return (
    <div>
      <PageHead title="Selamat Datang, Budi" subtitle={`Tugas hari ini — ${TODAY}`} />
      <Grid cols="repeat(3, 1fr)">
        <StatCard icon="file-clock" label="Pengajuan Menunggu" value="12" tone="warn" badge={<Badge bg="var(--warn-bg)" fg="var(--warn-fg)">Perlu Diproses</Badge>} />
        <StatCard icon="message-square-warning" label="Pengaduan Baru" value="2" tone="danger" badge={<Badge bg="var(--danger-bg)" fg="var(--danger-fg)">Belum Direspons</Badge>} />
        <StatCard icon="file-check" label="Surat Selesai Hari Ini" value="9" tone="teal" badge={<Badge>+3</Badge>} />
      </Grid>
      <Grid cols="2fr 1fr" style={{ marginTop: 16 }}>
        <Card title="Antrian Pengajuan Surat" pad={false}>
          <div style={{ padding: '0 20px' }}><Tabs options={['Semua', 'Menunggu', 'Diproses']} value={tab} onChange={setTab} /></div>
          <PermohonanTable rows={rows} actionLabel="Verifikasi" onRowAction={onVerifikasi} />
        </Card>
        <Card title="Pengaduan Masuk">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PENGADUAN.map(p => (
              <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{p.judul}</div>
                  {p.baru && <Badge bg="var(--danger-bg)" fg="var(--danger-fg)">BARU</Badge>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '9px 0 12px' }}>
                  <span style={{ font: 'var(--meta)', color: 'var(--teal-700)', background: 'var(--teal-50)', padding: '2px 8px', borderRadius: 999 }}>{p.kategori}</span>
                  <span style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>{p.waktu}</span>
                </div>
                <Button variant="outline" size="sm" style={{ width: '100%', justifyContent: 'center' }}>Respons</Button>
              </div>
            ))}
          </div>
        </Card>
      </Grid>
      <div style={{ marginTop: 16 }}>
        <Card title="Buku Tamu Hari Ini" action={<Button variant="ghost" size="sm">Lihat Semua</Button>} pad={false}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['Nama Tamu', 'Tujuan', 'Jam Masuk', 'Status'].map((h, i) => (
              <th key={i} style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)', textAlign: 'left', padding: '11px 20px', background: 'var(--gray-50)', borderBottom: '1px solid var(--border)' }}>{h}</th>))}</tr></thead>
            <tbody>{BUKU_TAMU.map((t, i) => (
              <tr key={i}><td style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', font: 'var(--body-medium)', color: 'var(--fg1)' }}>{t.nama}</td>
                <td style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', font: 'var(--body)', color: 'var(--fg2)' }}>{t.tujuan}</td>
                <td style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', font: 'var(--body)', color: 'var(--fg2)' }}>{t.jam} WIB</td>
                <td style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
                  <Badge bg={t.status === 'selesai' ? 'var(--success-bg)' : 'var(--info-bg)'} fg={t.status === 'selesai' ? 'var(--success-fg)' : 'var(--info-fg)'}>{t.status === 'selesai' ? 'SELESAI' : 'HADIR'}</Badge></td></tr>))}</tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { Grid, AdminDashboard, StaffDashboard });
