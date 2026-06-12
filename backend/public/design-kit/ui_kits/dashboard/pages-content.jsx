// SADESA — content & communication pages: Berita, Broadcast WhatsApp, Form Builder
const { useState: useStateC } = React;

// ============ MANAJEMEN BERITA ============
function NewsImage({ hue, height = 150 }) {
  return (
    <div style={{ height, background: `linear-gradient(150deg, hsl(${hue} 38% 62%), hsl(${hue + 25} 42% 44%))`, position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 70% 10%, rgba(255,255,255,.22), transparent 60%)' }} />
    </div>
  );
}

function NewsCard({ a }) {
  const sb = a.status === 'DITERBITKAN' ? ['var(--success-bg)', 'var(--success-fg)'] : ['var(--warn-bg)', 'var(--warn-fg)'];
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative' }}>
        <NewsImage hue={a.hue} />
        <span style={{ position: 'absolute', top: 12, left: 12 }}><Badge bg={sb[0]} fg={sb[1]}>{a.status}</Badge></span>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
          <span style={{ font: 'var(--label)', letterSpacing: '.03em', color: 'var(--fg2)', background: 'var(--gray-100)', padding: '3px 8px', borderRadius: 'var(--r-sm)' }}>{a.kategori}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: 'var(--meta)', color: 'var(--fg3)' }}><Icon name="calendar" size={12} />{a.tanggal}</span>
        </div>
        <div style={{ font: 'var(--h3)', color: 'var(--fg1)', lineHeight: 1.35, marginBottom: 8, textWrap: 'pretty' }}>{a.judul}</div>
        <div style={{ font: 'var(--small)', color: 'var(--fg2)', marginBottom: 16 }}>{a.excerpt}</div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <Avatar name={a.author} size={26} />
          <span style={{ font: 'var(--meta)', color: 'var(--fg2)', whiteSpace: 'nowrap' }}>{a.author}</span>
          <div style={{ flex: 1 }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: 'var(--meta)', color: 'var(--fg3)' }}><Icon name="eye" size={13} />{a.views}</span>
          {a.comments > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: 'var(--meta)', color: 'var(--fg3)' }}><Icon name="message-square" size={13} />{a.comments}</span>}
        </div>
      </div>
    </div>
  );
}

function PentingCard() {
  const p = BERITA_PENTING;
  return (
    <div style={{ background: 'linear-gradient(135deg, var(--teal-500), var(--teal-700))', borderRadius: 'var(--r-lg)', padding: 18, color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Badge bg="#fff" fg="var(--teal-700)">PENTING</Badge>
        <Icon name="pin" size={16} color="rgba(255,255,255,0.8)" />
      </div>
      <div style={{ font: 'var(--label)', letterSpacing: '.04em', color: 'rgba(255,255,255,0.9)', margin: '16px 0 8px' }}>PENGUMUMAN RESMI</div>
      <div style={{ font: 'var(--h3)', color: '#fff', lineHeight: 1.35 }}>{p.judul}</div>
      <div style={{ font: 'var(--small)', color: 'var(--dark-card-sub)', margin: '10px 0 16px' }}>{p.isi}</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto', marginBottom: 14 }}>
        {[['TGL', p.tgl], ['BLN', p.bln]].map(([k, v]) => (
          <div key={k} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--r-sm)', padding: '8px 14px', textAlign: 'center' }}>
            <div style={{ font: '600 9px/1.4 var(--font-sans)', letterSpacing: '.06em', color: 'var(--dark-card-sub)' }}>{k}</div>
            <div style={{ font: 'var(--h3)', color: '#fff' }}>{v}</div></div>))}
      </div>
      <button style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--r-md)', padding: '10px', font: 'var(--body-medium)', cursor: 'pointer' }}>Lihat Detail Pengumuman</button>
    </div>
  );
}

function AddArticleCard() {
  return (
    <div style={{ border: '2px dashed var(--border-strong)', borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, minHeight: 280, textAlign: 'center' }}>
      <div style={{ width: 52, height: 52, borderRadius: 999, border: '1px solid var(--border-strong)', display: 'grid', placeItems: 'center', color: 'var(--teal-600)' }}><Icon name="plus" size={24} /></div>
      <div style={{ font: 'var(--h3)', color: 'var(--fg1)' }}>Tambah Artikel Baru</div>
      <div style={{ font: 'var(--meta)', color: 'var(--fg3)', maxWidth: 180 }}>Gunakan editor WYSIWYG untuk membuat konten menarik</div>
    </div>
  );
}

function BeritaPage() {
  return (
    <div style={{ position: 'relative' }}>
      <PageHead title="Pusat Informasi &amp; Berita" subtitle="Kelola publikasi, pengumuman, dan artikel untuk warga desa."
        right={<div style={{ display: 'flex', gap: 10 }}><Button variant="outline" icon="filter">Filter</Button><Button icon="pen-line">Tulis Artikel Baru</Button></div>} />
      <Grid cols="repeat(4, 1fr)">
        <IconStat icon="file-text" tone="teal" label="Total Artikel" value="128" valueSmall />
        <IconStat icon="eye" tone="teal" label="Total Tayangan" value="12.4K" valueSmall />
        <IconStat icon="clipboard-list" tone="warn" label="Draft Tertunda" value="14" valueSmall />
        <IconStat icon="share-2" tone="info" label="Dibagikan" value="892" valueSmall />
      </Grid>
      <Grid cols="repeat(4, 1fr)" style={{ marginTop: 16 }}>
        <NewsCard a={BERITA[0]} /><NewsCard a={BERITA[1]} /><NewsCard a={BERITA[2]} /><PentingCard />
        <NewsCard a={BERITA[3]} /><AddArticleCard />
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, flexWrap: 'wrap', gap: 10 }}>
        <span style={{ font: 'var(--small)', color: 'var(--fg3)' }}>Menampilkan 5 dari 128 artikel</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2].map(p => <button key={p} style={{ minWidth: 34, height: 34, borderRadius: 'var(--r-md)', border: '1px solid ' + (p === 1 ? 'var(--teal-600)' : 'var(--border)'), background: p === 1 ? 'var(--teal-600)' : '#fff', color: p === 1 ? '#fff' : 'var(--fg2)', font: 'var(--body-medium)', cursor: 'pointer' }}>{p}</button>)}
          <button style={{ minWidth: 34, height: 34, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: '#fff', color: 'var(--fg2)', cursor: 'pointer' }}><Icon name="chevron-right" size={15} /></button>
        </div>
      </div>
    </div>
  );
}

// ============ BROADCAST WHATSAPP ============
function PhoneMock() {
  return (
    <div style={{ background: '#0b141a', borderRadius: 34, padding: 10, boxShadow: 'var(--shadow-lg)', width: 280, margin: '0 auto' }}>
      <div style={{ borderRadius: 26, overflow: 'hidden', background: '#0b141a' }}>
        <div style={{ background: '#075e54', color: '#fff', padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center' }}><Icon name="user" size={17} color="#fff" /></div>
          <div style={{ flex: 1 }}><div style={{ font: 'var(--body-medium)', color: '#fff' }}>Admin Desa SADESA</div><div style={{ font: '400 10px/1.4 var(--font-sans)', color: '#b9e8d6' }}>online</div></div>
          <Icon name="video" size={16} color="#fff" /><Icon name="phone" size={15} color="#fff" /><Icon name="more-vertical" size={16} color="#fff" />
        </div>
        <div style={{ background: '#0b141a', backgroundImage: 'linear-gradient(rgba(11,20,26,.92),rgba(11,20,26,.92))', height: 360, padding: 14, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'flex-end' }}>
          <div style={{ alignSelf: 'flex-start', maxWidth: '85%', background: '#1f2c34', color: '#e9edef', borderRadius: '0 8px 8px 8px', padding: '9px 11px', font: '400 11.5px/1.5 var(--font-sans)' }}>
            Halo Bapak/Ibu <b>Budi Setiawan</b>, kami menginformasikan bahwa akan diadakan <b>Musyawarah Desa</b> pada hari Minggu pukul 08.00 WIB di Kantor Desa. Kehadiran Bapak sangat diharapkan.</div>
          <div style={{ alignSelf: 'flex-start', maxWidth: '70%', background: '#1f2c34', color: '#e9edef', borderRadius: '8px', padding: '9px 11px', font: '400 11.5px/1.5 var(--font-sans)' }}>Terima kasih.</div>
        </div>
      </div>
    </div>
  );
}

function BroadcastPage() {
  return (
    <div>
      <PageHead breadcrumb={['Dashboard', 'Broadcast WhatsApp']} title="Pengumuman Massal WhatsApp"
        subtitle="Kirim pesan informasi ke seluruh warga desa secara instan dan efisien."
        right={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, font: 'var(--label)', letterSpacing: '.03em', color: 'var(--success-fg)', background: 'var(--success-bg)', padding: '7px 13px', borderRadius: 999 }}><span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--success)' }} />SERVER TERHUBUNG</span>} />
      <Grid cols="1.4fr 1fr">
        <Card>
          <div style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)', marginBottom: 8 }}>Pilih Target Penerima</div>
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', font: 'var(--body-medium)', color: 'var(--fg1)', background: '#fff', border: '1px solid var(--border-strong)', borderRadius: 'var(--r-md)', padding: '12px 14px', cursor: 'pointer', marginBottom: 20 }}>
            Seluruh Warga Desa (3,420 Kontak)<Icon name="chevrons-up-down" size={16} color="var(--fg3)" /></button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)' }}>Isi Pesan Pengumuman</span>
            <span style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>0 / 2000 Karakter</span></div>
          <div style={{ position: 'relative', border: '1px solid var(--border-strong)', borderRadius: 'var(--r-md)', padding: 14, marginBottom: 14 }}>
            <textarea rows="5" placeholder="Ketik pesan yang ingin Anda sampaikan kepada warga..." style={{ width: '100%', border: 'none', outline: 'none', resize: 'vertical', font: 'var(--body)', color: 'var(--fg1)', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, color: 'var(--fg3)' }}><Icon name="image" size={17} /><Icon name="paperclip" size={17} /><Icon name="sparkles" size={17} color="var(--teal-600)" /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {['{nama_warga}', '{alamat_rt}', '{tanggal_hari_ini}'].map(v => (
              <span key={v} style={{ font: '500 12px/1.4 var(--font-mono)', color: 'var(--fg2)', background: 'var(--gray-100)', padding: '5px 10px', borderRadius: 'var(--r-sm)', cursor: 'pointer' }}>{v}</span>))}
            <span style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>Klik untuk memasukkan variabel</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25d366', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', padding: '13px', font: 'var(--body-medium)', cursor: 'pointer', whiteSpace: 'nowrap' }}><Icon name="send" size={17} />Kirim Sekarang</button>
            <button style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--teal-600)', color: '#fff', border: 'none', borderRadius: 'var(--r-md)', padding: '13px', font: 'var(--body-medium)', cursor: 'pointer', whiteSpace: 'nowrap' }}><Icon name="clock" size={17} />Jadwalkan</button>
          </div>
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <PhoneMock />
          <Card>
            <div style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)', marginBottom: 12 }}>Ringkasan Kuota</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--small)', color: 'var(--fg2)', marginBottom: 7 }}><span>Pesan Terkirim Bulan Ini</span><span style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>12,450 / 25,000</span></div>
            <div style={{ height: 8, background: 'var(--gray-100)', borderRadius: 999, marginBottom: 18 }}><div style={{ width: '50%', height: '100%', background: 'var(--teal-600)', borderRadius: 999 }} /></div>
            <Grid cols="1fr 1fr">
              <div><div style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)' }}>Rata-rata Terbaca</div><div style={{ font: 'var(--h1)', color: 'var(--teal-600)' }}>92%</div></div>
              <div><div style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--fg3)' }}>Status Server</div><div style={{ font: 'var(--h1)', color: 'var(--success)' }}>AKTIF</div></div>
            </Grid>
          </Card>
        </div>
      </Grid>
      <div style={{ marginTop: 16 }}>
        <Card title="Riwayat Broadcast Terbaru" action={<a style={{ font: 'var(--body-medium)', color: 'var(--teal-700)', cursor: 'pointer', whiteSpace: 'nowrap' }}>Lihat Semua Laporan</a>} pad={false}>
          <Table heads={['Tanggal & Waktu', 'Target', 'Pesan', 'Terkirim', 'Status', 'Aksi']} aligns={['left', 'left', 'left', 'left', 'left', 'right']}>
            {BROADCAST.map((b, i) => (
              <Trow key={i}>
                <Td><div style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{b.tgl}</div><div style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>{b.jam}</div></Td>
                <Td><Pill bg={b.targetBg} fg={b.targetFg}>{b.target}</Pill></Td>
                <Td muted style={{ maxWidth: 280 }}>{b.pesan}</Td>
                <Td strong style={{ fontVariantNumeric: 'tabular-nums' }}>{b.terkirim}</Td>
                <Td>{b.status === 'selesai'
                  ? <StatusDot color="var(--success)">Selesai</StatusDot>
                  : <StatusDot color="var(--warning)">Terjadwal</StatusDot>}</Td>
                <Td align="right"><span style={{ display: 'inline-flex' }}><IconButton icon={b.status === 'terjadwal' ? 'pencil' : 'eye'} /></span></Td>
              </Trow>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  );
}

// ============ FORM BUILDER (Layanan Surat) ============
function FieldRow({ label, value, placeholder, active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: active ? 10 : '6px 0', position: 'relative',
      border: active ? '1.5px dashed var(--teal-500)' : 'none', borderRadius: active ? 'var(--r-sm)' : 0, background: active ? 'var(--teal-50)' : 'transparent' }}>
      <span style={{ font: 'var(--label)', letterSpacing: '.03em', color: active ? 'var(--teal-700)' : 'var(--fg2)', width: 150, flex: 'none' }}>{label}</span>
      <span style={{ color: 'var(--fg3)' }}>:</span>
      {placeholder
        ? <input placeholder={placeholder} style={{ flex: 1, border: '1px solid var(--border-strong)', borderRadius: 'var(--r-sm)', padding: '7px 10px', font: 'var(--body)', color: 'var(--fg2)', outline: 'none' }} />
        : <span style={{ font: '500 14px/1.5 var(--font-mono)', color: 'var(--fg2)' }}>{value}</span>}
      {active && <div style={{ position: 'absolute', right: -52, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ width: 28, height: 28, borderRadius: 'var(--r-sm)', background: 'var(--danger-bg)', color: 'var(--danger-fg)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Icon name="trash-2" size={14} /></span>
        <span style={{ width: 28, height: 28, borderRadius: 'var(--r-sm)', background: 'var(--teal-600)', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Icon name="copy" size={14} /></span></div>}
    </div>
  );
}

function SuratBuilderPage() {
  return (
    <div style={{ margin: -28, display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - var(--topbar-h))' }}>
      <div style={{ height: 64, background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flex: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Icon name="file-pen-line" size={20} color="var(--teal-600)" /><span style={{ font: 'var(--h2)', color: 'var(--fg1)' }}>Rancang Template Surat Baru</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Button variant="ghost" icon="eye">Pratinjau</Button><Button icon="save">Simpan</Button></div>
      </div>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div style={{ width: 320, flex: 'none', background: '#fff', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 22, flex: 1, overflowY: 'auto' }}>
            <h2 style={{ font: 'var(--h2)', color: 'var(--fg1)', margin: 0 }}>Komponen Input</h2>
            <p style={{ font: 'var(--small)', color: 'var(--fg2)', margin: '6px 0 18px' }}>Klik atau geser komponen untuk menambahkan ke kanvas preview.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SURAT_KOMPONEN.map(k => (
                <div key={k.label} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '12px 14px', cursor: 'grab', background: '#fff' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'var(--gray-100)', color: 'var(--fg2)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={k.icon} size={18} /></div>
                  <div><div style={{ font: 'var(--body-medium)', color: 'var(--fg1)', whiteSpace: 'nowrap' }}>{k.label}</div><div style={{ font: '600 10px/1.4 var(--font-sans)', letterSpacing: '.06em', color: 'var(--fg3)' }}>{k.sub}</div></div>
                </div>))}
            </div>
          </div>
          <div style={{ padding: 18, borderTop: '1px solid var(--border)', flex: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>Auto-Save</span><ToggleSwitch on /></div>
            <div style={{ font: 'var(--meta)', color: 'var(--fg3)', marginTop: 6 }}>Terakhir diperbarui hari ini pukul 14:30 WIB</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: 36, overflowY: 'auto', background: 'var(--gray-50)' }}>
          <div style={{ maxWidth: 620, margin: '0 auto', background: '#fff', boxShadow: 'var(--shadow-lg)', borderRadius: 4, padding: '44px 56px' }}>
            <div style={{ textAlign: 'center', lineHeight: 1.4 }}>
              <div style={{ font: 'var(--label)', letterSpacing: '.04em', color: 'var(--fg2)' }}>PEMERINTAH DAERAH</div>
              <div style={{ font: '700 22px/1.2 var(--font-sans)', color: 'var(--fg1)' }}>KABUPATEN SUBANG</div>
              <div style={{ font: 'var(--h3)', color: 'var(--fg1)' }}>DESA CIRANGKONG</div>
              <div style={{ font: 'var(--meta)', color: 'var(--fg2)', marginTop: 4 }}>Jln. Raya Lempar - Cirangkong Km. 08 Cijambe - Subang</div>
            </div>
            <div style={{ borderBottom: '3px solid var(--fg1)', margin: '14px 0 28px' }} />
            <div style={{ textAlign: 'center', marginBottom: 26 }}>
              <div style={{ font: 'var(--h3)', color: 'var(--fg1)', textDecoration: 'underline', textUnderlineOffset: 4 }}>SURAT KETERANGAN USAHA</div>
              <div style={{ font: 'var(--small)', color: 'var(--fg2)', marginTop: 4 }}>Nomor: 510 / ____ / DESA / 2023</div>
            </div>
            <p style={{ font: 'var(--body)', color: 'var(--fg1)', margin: '0 0 22px' }}>Yang bertanda tangan di bawah ini Kepala Desa Sadesa menerangkan dengan sebenarnya bahwa:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingLeft: 20, marginBottom: 22 }}>
              <FieldRow label="NAMA LENGKAP" value="{{nama_lengkap}}" />
              <FieldRow label="TEMPAT/TGL LAHIR" value="{{tempat_tgl_lahir}}" />
              <FieldRow label="JENIS USAHA" placeholder="Contoh: Warung Sembako..." active />
            </div>
            <p style={{ font: 'var(--body)', color: 'var(--fg1)', margin: '0 0 40px' }}>Berdasarkan keterangan yang bersangkutan benar memiliki usaha tersebut di atas yang berlokasi di wilayah Desa Sadesa. Surat keterangan ini diberikan untuk persyaratan pengajuan Kredit Usaha Rakyat (KUR).</p>
            <div style={{ textAlign: 'center', marginLeft: 'auto', width: 240 }}>
              <div style={{ font: 'var(--body)', color: 'var(--fg1)' }}>Sadesa, 24 Mei 2024</div>
              <div style={{ font: 'var(--body-medium)', color: 'var(--fg1)', marginBottom: 10 }}>Kepala Desa Cirangkong</div>
              <div style={{ border: '1.5px dashed var(--border-strong)', borderRadius: 'var(--r-sm)', padding: '22px 0', font: 'var(--meta)', color: 'var(--fg3)', marginBottom: 10 }}>E-Signature Placeholder</div>
              <div style={{ font: 'var(--body-medium)', color: 'var(--fg1)', textDecoration: 'underline', textUnderlineOffset: 3 }}>Asep Sutia</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: 46, background: '#fff', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 24, padding: '0 24px', flex: 'none' }}>
        {[['file', '1 Halaman'], ['layout-list', '12 Komponen Aktif'], ['shield-check', 'Validasi E-Sign Aktif']].map(([ic, t]) => (
          <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, font: 'var(--meta)', color: 'var(--fg2)' }}><Icon name={ic} size={14} color="var(--fg3)" />{t}</span>))}
      </div>
    </div>
  );
}

Object.assign(window, { BeritaPage, BroadcastPage, SuratBuilderPage });
