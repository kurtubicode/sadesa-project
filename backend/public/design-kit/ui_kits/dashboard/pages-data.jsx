// SADESA — master-data admin pages + small shared helpers
const { useState: useStateMD } = React;

// ---- shared helpers (exported for other page files) ----
function TealPanel({ children, style }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--r-lg)', color: '#fff',
      background: 'linear-gradient(135deg, var(--teal-500), var(--teal-700))', boxShadow: 'var(--shadow-md)', ...style }}>
      {children}
    </div>
  );
}

function IconStat({ icon, tone = 'teal', label, value, valueSmall, sub, subColor = 'var(--fg3)' }) {
  const tones = { teal: ['var(--teal-50)', 'var(--teal-600)'], info: ['var(--info-bg)', 'var(--info-fg)'],
    warn: ['#fef3c7', '#b45309'], green: ['var(--success-bg)', 'var(--success-fg)'], gray: ['var(--gray-100)', 'var(--fg2)'] };
  const [bg, fg] = tones[tone] || tones.teal;
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 18, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ width: 42, height: 42, borderRadius: 'var(--r-md)', background: bg, color: fg, display: 'grid', placeItems: 'center', marginBottom: 14 }}>
        <Icon name={icon} size={21} /></div>
      <div style={{ font: 'var(--meta)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)' }}>{label}</div>
      <div style={{ font: valueSmall ? 'var(--h2)' : 'var(--stat-value)', color: 'var(--fg1)', marginTop: 4 }}>{value}</div>
      {sub && <div style={{ display: 'flex', alignItems: 'center', gap: 5, font: 'var(--meta)', color: subColor, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function MiniStat({ label, value, sub, subColor = 'var(--success)', dark, percent }) {
  if (dark) return (
    <DarkCard><div style={{ font: 'var(--meta)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--dark-card-sub)' }}>{label}</div>
      <div style={{ font: 'var(--stat-value)', color: '#fff', margin: '4px 0 12px' }}>{value}</div>
      <div style={{ height: 7, background: 'rgba(255,255,255,0.12)', borderRadius: 999 }}>
        <div style={{ width: percent + '%', height: '100%', background: 'var(--teal-500)', borderRadius: 999 }} /></div>
    </DarkCard>);
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 18, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ font: 'var(--meta)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)' }}>{label}</div>
      <div style={{ font: 'var(--stat-value)', color: 'var(--fg1)', margin: '4px 0 8px' }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, font: 'var(--meta)', color: subColor }}>
        {sub}</div>
    </div>
  );
}

function StatusDot({ color, children }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, font: 'var(--body-medium)', color: 'var(--fg1)' }}>
    <span style={{ width: 8, height: 8, borderRadius: 999, background: color }} />{children}</span>;
}

function MapPlaceholder({ height = 240 }) {
  return (
    <div style={{ height, borderRadius: 'var(--r-md)', overflow: 'hidden', position: 'relative',
      background: 'linear-gradient(160deg,#dceccf,#bcd9b0 40%,#9ec79a 70%,#7bb3a0)', border: '1px solid var(--border)' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,rgba(0,0,0,.04) 0 1px,transparent 1px 26px),repeating-linear-gradient(90deg,rgba(0,0,0,.04) 0 1px,transparent 1px 26px)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#3f6151', textShadow: '0 1px 2px rgba(255,255,255,.4)' }}>
          <Icon name="map-pinned" size={28} color="#b91c1c" /><span style={{ font: 'var(--meta)' }}>Peta sebaran wilayah administratif</span></div>
      </div>
    </div>
  );
}

// ============ DATA KEPENDUDUKAN ============
function PendudukPage() {
  return (
    <div>
      <PageHead title="Data Master Penduduk" subtitle="Kelola seluruh data warga desa yang terdaftar dalam sistem." />
      <Grid cols="1.6fr 1fr" style={{ marginBottom: 16 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 40 }}>
              <div><div style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>Total Penduduk</div><div style={{ font: 'var(--stat-value)', color: 'var(--fg1)' }}>12,482</div></div>
              <div><div style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>Laki-laki</div><div style={{ font: 'var(--stat-value)', color: 'var(--teal-600)' }}>6,120</div></div>
              <div><div style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>Perempuan</div><div style={{ font: 'var(--stat-value)', color: '#e0654a' }}>6,362</div></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {['#475569', '#64748b', '#94a3b8'].map((c, i) => (
                <div key={i} style={{ width: 38, height: 38, borderRadius: 999, background: c, marginLeft: i ? -12 : 0, border: '2px solid #fff' }} />))}
              <div style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--gray-100)', marginLeft: -12, border: '2px solid #fff', display: 'grid', placeItems: 'center', font: '700 11px/1 var(--font-sans)', color: 'var(--fg2)' }}>+8k</div>
            </div>
          </div>
        </Card>
        <TealPanel style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
          <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: '#fff', color: 'var(--teal-700)', border: 'none', borderRadius: 'var(--r-md)', padding: '11px', font: 'var(--body-medium)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <Icon name="plus" size={17} />Tambah Warga</button>
          <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: 'rgba(255,255,255,0.14)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 'var(--r-md)', padding: '11px', font: 'var(--body-medium)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <Icon name="file-up" size={17} />Import Excel</button>
        </TealPanel>
      </Grid>
      <Card pad={false}>
        <TableToolbar placeholder="Cari NIK atau Nama warga...">
          <SelectChip icon="filter">Filter Wilayah</SelectChip>
          <SelectChip icon="arrow-up-down">Urutkan: Terbaru</SelectChip>
        </TableToolbar>
        <Table heads={['No', 'NIK', 'Nama Lengkap', 'Jenis Kelamin', 'Alamat / RT RW', 'Aksi']} aligns={['left', 'left', 'left', 'left', 'left', 'right']}>
          {PENDUDUK.map(p => (
            <Trow key={p.nik}>
              <Td muted>{p.no}</Td>
              <Td muted style={{ fontVariantNumeric: 'tabular-nums' }}>{p.nik}</Td>
              <Td><NameCell name={p.nama} /></Td>
              <Td>{p.jk === 'L'
                ? <Badge bg="var(--male-bg)" fg="var(--male-fg)">Laki-laki</Badge>
                : <Badge bg="var(--female-bg)" fg="var(--female-fg)">Perempuan</Badge>}</Td>
              <Td muted>{p.alamat}</Td>
              <Td align="right"><span style={{ display: 'inline-flex' }}><IconButton icon="eye" /></span></Td>
            </Trow>
          ))}
        </Table>
        <Pagination info="Menampilkan 1–5 dari 12,482 data" pages={[1, 2, 3]} current={1} tail={50} />
      </Card>
    </div>
  );
}

// ============ MANAJEMEN WILAYAH ============
function WilayahRow({ d }) {
  const [open, setOpen] = useStateMD(false);
  const has = d.children && d.children.length;
  return (
    <React.Fragment>
      <Trow>
        <Td>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <button onClick={() => has && setOpen(!open)} style={{ width: 26, height: 26, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: '#fff', cursor: has ? 'pointer' : 'default', display: 'grid', placeItems: 'center', color: 'var(--fg3)', flex: 'none' }}>
              <Icon name={open ? 'chevron-down' : 'chevron-right'} size={15} /></button>
            <div><div style={{ font: 'var(--h3)', color: 'var(--fg1)' }}>{d.dusun}</div>
              <div style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>Kepala Dusun: {d.kepala}</div></div>
          </div>
        </Td>
        <Td><Pill bg="var(--teal-50)" fg="var(--teal-700)">{d.rw}</Pill></Td>
        <Td><Pill bg="var(--teal-50)" fg="var(--teal-700)">{d.rt}</Pill></Td>
        <Td>{d.status === 'Aktif' ? <Badge>Aktif</Badge> : <Badge bg="var(--warn-bg)" fg="var(--warn-fg)">Non-Aktif</Badge>}</Td>
        <Td align="right"><a style={{ font: 'var(--body-medium)', color: 'var(--teal-700)', cursor: 'pointer' }}>Detail RW</a></Td>
      </Trow>
      {open && d.children.map((c, i) => (
        <tr key={i} style={{ background: 'var(--gray-50)' }}>
          <Td style={{ paddingLeft: 52 }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--fg2)', font: 'var(--body-medium)' }}><Icon name="corner-down-right" size={15} color="var(--fg3)" />{c.rw}</span></Td>
          <Td muted>—</Td>
          <Td muted>{c.rt}</Td>
          <Td><span style={{ font: 'var(--label)', letterSpacing: '.04em', color: 'var(--fg3)' }}>{c.status}</span></Td>
          <Td align="right"><a style={{ font: 'var(--body-medium)', color: 'var(--teal-700)', cursor: 'pointer' }}>Detail RW</a></Td>
        </tr>
      ))}
    </React.Fragment>
  );
}

function WilayahPage() {
  return (
    <div>
      <PageHead title="Manajemen Wilayah Desa" subtitle="Kelola struktur hierarki Dusun, RW, hingga RT di wilayah desa."
        right={<Button icon="plus">Tambah Data Wilayah</Button>} />
      <Grid cols="repeat(4, 1fr)">
        <IconStat icon="map-pin" tone="teal" label="Total Dusun" value="12" />
        <IconStat icon="building-2" tone="info" label="Total RW" value="48" />
        <IconStat icon="home" tone="warn" label="Total RT" value="142" />
        <DarkCard icon="map" label="Cakupan Luas" value="450.2 Ha" />
      </Grid>
      <div style={{ marginTop: 16 }}>
        <Card title="Daftar Wilayah Administratif" pad={false}
          action={<div style={{ display: 'flex', gap: 10 }}><Button variant="outline" size="sm" icon="download">Export Excel</Button><Button variant="outline" size="sm" icon="printer">Print PDF</Button></div>}>
          <Table heads={['Nama Dusun', 'Jumlah RW', 'Jumlah RT', 'Status', 'Aksi']} aligns={['left', 'left', 'left', 'left', 'right']}>
            {WILAYAH.map((d, i) => <WilayahRow key={i} d={d} />)}
          </Table>
          <Pagination info="Menampilkan 3 dari 12 Dusun" pages={[1, 2, 3]} current={1} />
        </Card>
      </div>
      <Grid cols="1.7fr 1fr" style={{ marginTop: 16 }}>
        <Card title="Visualisasi Geografis">
          <p style={{ font: 'var(--small)', color: 'var(--fg2)', margin: '0 0 14px' }}>Peta sebaran wilayah administratif yang telah terdaftar dalam sistem digital.</p>
          <MapPlaceholder />
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TealPanel style={{ padding: 20 }}>
            <Icon name="shield-check" size={26} color="#fff" />
            <div style={{ font: 'var(--h2)', color: '#fff', margin: '12px 0 6px' }}>Validasi Data Wilayah</div>
            <p style={{ font: 'var(--small)', color: 'rgba(255,255,255,0.85)', margin: '0 0 16px' }}>Pastikan seluruh data RT dan RW telah diverifikasi oleh Ketua Dusun sebelum diterbitkan ke profil publik desa.</p>
            <button style={{ width: '100%', background: 'rgba(255,255,255,0.16)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 'var(--r-md)', padding: '11px', font: 'var(--body-medium)', cursor: 'pointer' }}>Verifikasi Sekarang</button>
          </TealPanel>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
              <Icon name="history" size={18} color="var(--fg3)" />
              <div><div style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)' }}>Terakhir Diperbarui</div>
                <div style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>Hari ini, 14:20 WIB</div></div>
            </div>
            <InfoLine label="Update oleh" value="Admin_Suhartono" />
            <InfoLine label="Status Sistem" value={<StatusDot color="var(--success)">Sinkron</StatusDot>} last />
          </Card>
        </div>
      </Grid>
    </div>
  );
}

function InfoLine({ label, value, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: last ? 'none' : '1px solid var(--border)' }}>
      <span style={{ font: 'var(--small)', color: 'var(--fg3)' }}>{label}</span>
      <span style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{value}</span>
    </div>
  );
}

// ============ MANAJEMEN AKUN ============
function PenggunaPage() {
  const [tab, setTab] = useStateMD('Warga');
  return (
    <div>
      <PageHead title="Manajemen Akun & Hak Akses" subtitle="Kelola seluruh pengguna sistem, perizinan, dan status validasi identitas."
        right={<Button icon="user-plus">Buat Akun Baru</Button>} />
      <Grid cols="1fr 1fr" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}><Toggle options={['Warga', 'Staf', 'Kades']} value={tab} onChange={setTab} /></div>
        <TealPanel style={{ padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Icon name="shield-check" size={24} color="#fff" />
            <div><div style={{ font: 'var(--h3)', color: '#fff' }}>Validasi 5 Akun Warga Baru</div>
              <div style={{ font: 'var(--small)', color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>Ada pengajuan akun yang memerlukan verifikasi dokumen identitas.</div></div>
          </div>
          <button style={{ background: '#fff', color: 'var(--teal-700)', border: 'none', borderRadius: 'var(--r-md)', padding: '10px 16px', font: 'var(--body-medium)', cursor: 'pointer', whiteSpace: 'nowrap', flex: 'none' }}>Proses Sekarang</button>
        </TealPanel>
      </Grid>
      <Card pad={false}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
          <SelectChip icon="filter">Filter</SelectChip>
          <span style={{ font: 'var(--body-medium)', color: 'var(--fg2)' }}>Menampilkan 48 {tab}</span>
          <div style={{ flex: 1 }} />
          <IconButton icon="download" /><IconButton icon="printer" />
        </div>
        <Table heads={['Nama Lengkap', 'Username', 'Role', 'Status Akun', 'Aksi']} aligns={['left', 'left', 'left', 'left', 'right']}>
          {PENGGUNA.map((u, i) => (
            <Trow key={i}>
              <Td><NameCell name={u.nama} sub={'ID: ' + u.id} /></Td>
              <Td muted style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{u.username}</Td>
              <Td><Pill>{u.role}</Pill></Td>
              <Td>{u.status === 'Aktif'
                ? <StatusDot color="var(--success)">Aktif</StatusDot>
                : <StatusDot color="var(--danger)">Terblokir</StatusDot>}</Td>
              <Td align="right"><div style={{ display: 'inline-flex', gap: 6 }}>
                <IconButton icon="pencil" /><IconButton icon="eye" />
                <IconButton icon={u.status === 'Aktif' ? 'ban' : 'lock'} /></div></Td>
            </Trow>
          ))}
        </Table>
        <Pagination info="Menampilkan 1–10 dari 48 akun" pages={[1, 2, 3]} current={1} tail={5} />
      </Card>
      <Grid cols="repeat(4, 1fr)" style={{ marginTop: 16 }}>
        <MiniStat label="Total Pengguna" value="1,248" sub={<React.Fragment><Icon name="trending-up" size={13} />+12% Bulan ini</React.Fragment>} />
        <MiniStat label="Akun Aktif" value="1,120" sub={<React.Fragment><span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--success)' }} />90% Keseluruhan</React.Fragment>} />
        <MiniStat label="Butuh Validasi" value="5" subColor="var(--warning)" sub={<React.Fragment>! Tindakan diperlukan</React.Fragment>} />
        <MiniStat dark label="Kapasitas Server" value="42%" percent={42} />
      </Grid>
    </div>
  );
}

// ============ KATEGORI PENGADUAN ============
function KategoriPage() {
  return (
    <div>
      <PageHead breadcrumb={['Master Data', 'Kategori Pengaduan']} title="Kategori Laporan Masyarakat"
        subtitle="Kelola kategori pengaduan untuk mempermudah klasifikasi laporan dari warga."
        right={<Button icon="plus">Kategori Baru</Button>} />
      <Grid cols="repeat(4, 1fr)">
        <IconStat icon="layers" tone="info" label="Total Kategori" value="12" valueSmall />
        <IconStat icon="circle-check" tone="green" label="Kategori Aktif" value="10" valueSmall />
        <IconStat icon="clipboard-list" tone="warn" label="Perlu Review" value="2" valueSmall />
        <IconStat icon="history" tone="gray" label="Update Terakhir" value="Hari ini, 09:45" valueSmall />
      </Grid>
      <div style={{ marginTop: 16 }}>
        <Card title="Daftar Kategori" pad={false}
          action={<div style={{ display: 'flex', gap: 8 }}><IconButton icon="filter" /><IconButton icon="download" /></div>}>
          <Table heads={['No', 'Nama Kategori', 'Deskripsi', 'Status Aktif', 'Aksi']} aligns={['left', 'left', 'left', 'center', 'right']}>
            {KATEGORI.map(k => (
              <Trow key={k.no}>
                <Td muted>{k.no}</Td>
                <Td><div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: k.bg, color: k.fg, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={k.icon} size={18} /></div>
                  <span style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{k.nama}</span></div></Td>
                <Td muted>{k.desc}</Td>
                <Td align="center"><span style={{ display: 'inline-flex' }}><ToggleSwitch on={k.on} /></span></Td>
                <Td align="right"><div style={{ display: 'inline-flex', gap: 6 }}><IconButton icon="pencil" /><IconButton icon="trash-2" /></div></Td>
              </Trow>
            ))}
          </Table>
          <Pagination info="Menampilkan 5 dari 12 kategori" pages={[1, 2, 3]} current={1} />
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { TealPanel, IconStat, MiniStat, StatusDot, MapPlaceholder, InfoLine, PendudukPage, WilayahPage, PenggunaPage, KategoriPage });
