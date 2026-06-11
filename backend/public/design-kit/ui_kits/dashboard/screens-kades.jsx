// SADESA — Kepala Desa dashboard + detail screens (verifikasi / pengesahan)
const { useState: useStateK } = React;

function KadesDashboard({ onSahkan }) {
  const [period, setPeriod] = useStateK('Bulan Ini');
  const siap = PERMOHONAN.filter(r => r.status === 'terverifikasi');
  return (
    <div>
      <PageHead title="Selamat Datang, Bapak Endang" subtitle="Ringkasan kinerja pelayanan Desa Cirangkong" date={TODAY} />
      <Grid cols="repeat(4, 1fr)">
        <StatCard icon="file-badge" label="Menunggu Pengesahan" value="6" tone="danger" badge={<Badge bg="var(--danger-bg)" fg="var(--danger-fg)">Perlu Tindakan</Badge>} />
        <StatCard icon="file-check" label="Surat Disahkan Bulan Ini" value="214" tone="teal" badge={<Badge>+12%</Badge>} />
        <StatCard icon="check-circle" label="Pengaduan Selesai" value="38" tone="teal" badge={<Badge>Tuntas</Badge>} />
        <StatCard icon="users" label="Total Warga Terdaftar" value="3.190" tone="info" badge={<Badge bg="var(--info-bg)" fg="var(--info-fg)">Info</Badge>} />
      </Grid>
      <div style={{ marginTop: 16 }}>
        <Card title="Pengajuan Siap Disahkan" pad={false}>
          <PermohonanTable rows={siap} actionLabel="Tinjau & Sahkan" onRowAction={onSahkan} showVerif />
        </Card>
      </div>
      <Grid cols="2fr 1fr" style={{ marginTop: 16 }}>
        <Card title="Statistik Layanan Bulanan" action={<Toggle options={['Bulan Ini', '3 Bulan', 'Tahun Ini']} value={period} onChange={setPeriod} />}>
          <BarChart data={SURAT_JENIS} />
        </Card>
        <Card title="Ringkasan Cepat">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Quick label="Surat terbanyak diajukan" value="Surat Domisili" />
            <Quick label="Rata-rata waktu proses" value="1,4 hari" />
            <Progress label="Tingkat penyelesaian" value={92} />
            <Button variant="outline" icon="download" style={{ width: '100%', justifyContent: 'center' }}>Cetak Laporan Bulanan</Button>
          </div>
        </Card>
      </Grid>
    </div>
  );
}

function Quick({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
      <span style={{ font: 'var(--small)', color: 'var(--fg2)' }}>{label}</span>
      <span style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{value}</span>
    </div>
  );
}

function BackLink({ onBack }) {
  return (
    <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent',
      cursor: 'pointer', font: 'var(--body-medium)', color: 'var(--fg2)', padding: 0, marginBottom: 14 }}>
      <Icon name="arrow-left" size={17} />Kembali
    </button>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ font: 'var(--small)', color: 'var(--fg3)' }}>{label}</span>
      <span style={{ font: 'var(--body-medium)', color: 'var(--fg1)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function DocItem({ name, ok }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', border: '1px solid var(--border)', borderRadius: 'var(--r-md)' }}>
      <div style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', background: 'var(--teal-50)', color: 'var(--teal-600)', display: 'grid', placeItems: 'center', flex: 'none' }}>
        <Icon name="file-text" size={17} /></div>
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{name}</div>
        <div style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>PDF · 240 KB</div></div>
      <Icon name={ok ? 'check-circle' : 'circle'} size={18} color={ok ? 'var(--success)' : 'var(--fg3)'} />
      <IconButton icon="download" />
    </div>
  );
}

function VerifikasiDetail({ row, onBack }) {
  const r = row || PERMOHONAN[0];
  return (
    <div style={{ maxWidth: 1000 }}>
      <BackLink onBack={onBack} />
      <h1 style={{ font: 'var(--h1)', color: 'var(--fg1)', margin: '0 0 18px' }}>Verifikasi Pengajuan — {r.jenis}</h1>
      <Grid cols="1fr 1fr">
        <Card title="Info Pemohon">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Avatar name={r.nama} size={48} />
            <div><div style={{ font: 'var(--h3)', color: 'var(--fg1)' }}>{r.nama}</div>
              <div style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>NIK {r.nik}</div></div>
          </div>
          <InfoRow label="Alamat" value="Dusun Sukamaju RT 03/02" />
          <InfoRow label="Tanggal Pengajuan" value={`${r.tanggal} · ${r.waktu}`} />
          <InfoRow label="Keperluan" value="Administrasi kependudukan" />
          <InfoRow label="Status" value={<StatusBadge status={r.status} />} />
        </Card>
        <Card title="Dokumen Persyaratan">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <DocItem name="Kartu Tanda Penduduk" ok />
            <DocItem name="Kartu Keluarga" ok />
            <DocItem name="Surat Pengantar RT/RW" ok />
          </div>
        </Card>
      </Grid>
      <div style={{ marginTop: 16 }}>
        <Card title="Catatan Staff">
          <textarea rows="3" placeholder="Tulis catatan verifikasi (opsional)..." style={{ width: '100%', boxSizing: 'border-box',
            fontFamily: 'inherit', fontSize: 14, color: 'var(--fg1)', padding: 12, border: '1px solid var(--border-strong)', borderRadius: 'var(--r-md)', outline: 'none', resize: 'vertical' }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button variant="danger" icon="x" onClick={onBack}>Tolak</Button>
            <Button variant="primary" icon="check" onClick={onBack}>Setujui &amp; Teruskan</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function PengesahanDetail({ row, onBack }) {
  const r = row || PERMOHONAN.find(x => x.status === 'terverifikasi');
  return (
    <div style={{ maxWidth: 1000 }}>
      <BackLink onBack={onBack} />
      <h1 style={{ font: 'var(--h1)', color: 'var(--fg1)', margin: '0 0 18px' }}>Pengesahan — {r.jenis}</h1>
      <Grid cols="1fr 1fr">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card title="Data Pemohon">
            <InfoRow label="Nama" value={r.nama} />
            <InfoRow label="NIK" value={r.nik} />
            <InfoRow label="Keperluan" value="Administrasi kependudukan" />
          </Card>
          <Card title="Riwayat Verifikasi">
            <div style={{ display: 'flex', gap: 11 }}>
              <Avatar name={r.verifBy || 'Budi Santoso'} size={38} />
              <div><div style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{r.verifBy || 'Budi Santoso'}</div>
                <div style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>Staff Pelayanan · {r.tanggal}</div>
                <div style={{ font: 'var(--small)', color: 'var(--fg2)', marginTop: 6, background: 'var(--gray-50)', padding: '8px 10px', borderRadius: 'var(--r-sm)' }}>
                  "Dokumen lengkap dan sesuai. Siap untuk disahkan."</div></div>
            </div>
          </Card>
        </div>
        <Card title="Preview Surat" pad={false}>
          <div style={{ background: 'var(--gray-100)', height: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--fg3)' }}>
            <Icon name="file-text" size={40} color="var(--fg3)" />
            <div style={{ font: 'var(--small)' }}>Pratinjau {r.jenis}.pdf</div>
            <Button variant="outline" size="sm" icon="external-link">Buka Dokumen</Button>
          </div>
        </Card>
      </Grid>
      <div style={{ marginTop: 16 }}>
        <Card title="Catatan Kepala Desa">
          <textarea rows="2" placeholder="Catatan (opsional)..." style={{ width: '100%', boxSizing: 'border-box',
            fontFamily: 'inherit', fontSize: 14, color: 'var(--fg1)', padding: 12, border: '1px solid var(--border-strong)', borderRadius: 'var(--r-md)', outline: 'none', resize: 'vertical' }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <Button variant="danger" icon="x" onClick={onBack}>Tolak</Button>
            <Button variant="primary" icon="pen-tool" onClick={onBack}>Sahkan &amp; Tanda Tangani</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { KadesDashboard, VerifikasiDetail, PengesahanDetail });
