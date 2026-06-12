// SADESA — app shell: dark Sidebar + Topbar, role-aware & routable
const { useState: useStateS } = React;

const NAV = {
  admin: {
    user: { name: 'Admin Sistem', role: 'Administrator', av: 'Admin Sistem' },
    items: [
      { icon: 'layout-dashboard', label: 'Dashboard', page: 'dashboard' },
      { icon: 'users', label: 'Data Kependudukan', page: 'penduduk' },
      { icon: 'user-cog', label: 'Manajemen Akun', page: 'pengguna' },
      { icon: 'map', label: 'Wilayah', page: 'wilayah' },
      { icon: 'file-text', label: 'Layanan Surat', page: 'surat' },
      { icon: 'megaphone', label: 'Kategori Pengaduan', page: 'kategori' },
      { icon: 'newspaper', label: 'Berita Desa', page: 'berita' },
      { icon: 'send', label: 'Broadcast WhatsApp', page: 'broadcast' },
      { icon: 'list-ordered', label: 'Antrean', page: 'antrean' },
      { icon: 'history', label: 'Riwayat Kunjungan', page: 'kunjungan' },
      { icon: 'scroll-text', label: 'Audit Log', page: 'audit' },
    ],
  },
  staff: {
    user: { name: 'Ahmad Fauzi', role: 'Staf Administrasi', av: 'Ahmad Fauzi' },
    items: [
      { icon: 'layout-dashboard', label: 'Dashboard', page: 'dashboard' },
      { icon: 'list-ordered', label: 'Antrean', page: 'antrean' },
      { icon: 'concierge-bell', label: 'Pelayanan Loket', page: 'loket' },
      { icon: 'file-check', label: 'Verifikasi Berkas', page: 'verifikasi' },
      { icon: 'printer', label: 'Surat Siap Cetak', page: 'cetak' },
      { icon: 'megaphone', label: 'Pengaduan Warga', page: 'pengaduan' },
      { icon: 'book-open', label: 'Buku Tamu', page: 'bukutamu' },
    ],
  },
  kades: {
    user: { name: 'H. Dadang Sudrajat', role: 'Kepala Desa', av: 'Dadang Sudrajat' },
    items: [
      { icon: 'layout-dashboard', label: 'Dashboard Statistik', page: 'dashboard' },
      { icon: 'file-badge', label: 'Pengesahan Dokumen', page: 'pengesahan' },
      { icon: 'bar-chart-2', label: 'Laporan Bulanan', page: 'laporan' },
    ],
  },
};

function SideItem({ it, on, onClick }) {
  const [h, setH] = useStateS(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
        borderRadius: 'var(--r-md)', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
        font: on ? 'var(--body-medium)' : 'var(--body)',
        background: on ? 'var(--teal-50)' : (h ? 'var(--gray-50)' : 'transparent'),
        color: on ? 'var(--teal-700)' : (h ? 'var(--fg1)' : 'var(--fg2)'),
        transition: 'background .15s, color .15s' }}>
      <Icon name={it.icon} size={18} stroke={on ? 2 : 1.75} color={on ? 'var(--teal-600)' : undefined} />
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</span>
      {on && <span style={{ position: 'absolute', right: 0, top: 8, bottom: 8, width: 3, borderRadius: 3, background: 'var(--teal-600)' }} />}
    </button>
  );
}

function Sidebar({ role, active, onNavigate }) {
  const { items } = NAV[role];
  return (
    <aside style={{ width: 'var(--sidebar-w)', flex: 'none', background: '#fff', borderRight: '1px solid var(--border)',
      height: '100vh', position: 'sticky', top: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 'var(--topbar-h)', display: 'flex', alignItems: 'center', gap: 11, padding: '0 22px', flex: 'none', borderBottom: '1px solid var(--border)' }}>
        <img src="../../assets/logomark.svg" width="36" height="36" alt="" />
        <div><div style={{ font: '700 18px/1 var(--font-sans)', letterSpacing: '.5px', color: 'var(--fg1)' }}>SADESA</div>
          <div style={{ font: '500 10.5px/1.5 var(--font-sans)', color: 'var(--fg3)' }}>Sahabat Digital Desa</div></div>
      </div>
      <nav style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
        {items.map((it, i) => (
          <SideItem key={i} it={it} on={active === it.label} onClick={() => onNavigate && onNavigate(it)} />
        ))}
      </nav>
      <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 3, flex: 'none' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 'var(--r-md)', border: 'none', background: 'transparent', color: 'var(--fg2)', cursor: 'pointer', font: 'var(--body)' }}>
          <Icon name="settings" size={18} />Pengaturan</button>
        <button style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 'var(--r-md)', border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', font: 'var(--body)' }}>
          <Icon name="log-out" size={18} />Keluar</button>
      </div>
    </aside>
  );
}

function Topbar({ role }) {
  const { user } = NAV[role];
  return (
    <header style={{ height: 'var(--topbar-h)', flex: 'none', background: '#fff', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', position: 'sticky', top: 0, zIndex: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 1, maxWidth: 460, background: 'var(--gray-50)',
        border: '1px solid var(--border)', borderRadius: 999, padding: '0 16px' }}>
        <Icon name="search" size={16} color="var(--fg3)" />
        <input placeholder="Cari data warga, surat, atau laporan..." style={{ border: 'none', background: 'transparent',
          outline: 'none', font: 'var(--body)', color: 'var(--fg1)', padding: '9px 0', width: '100%' }} />
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ position: 'relative' }}>
        <IconButton icon="bell" />
        <span style={{ position: 'absolute', top: -3, right: -3, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999,
          background: 'var(--danger)', color: '#fff', font: '700 10px/16px var(--font-sans)', textAlign: 'center', boxShadow: '0 0 0 2px #fff' }}>5</span>
      </div>
      <IconButton icon="help-circle" />
      <div style={{ width: 1, height: 30, background: 'var(--border)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={user.av} size={38} />
        <div style={{ whiteSpace: 'nowrap' }}>
          <div style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{user.name}</div>
          <div style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>{user.role}</div></div>
        <Icon name="chevron-down" size={16} color="var(--fg3)" />
      </div>
    </header>
  );
}

function Shell({ role, active, onNavigate, children }) {
  return (
    <div className="ds-scope" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      <Sidebar role={role} active={active} onNavigate={onNavigate} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar role={role} />
        <main style={{ padding: 28, flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}

function PageHead({ title, subtitle, breadcrumb, date, right }) {
  const rightNode = right || (date && (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--body-medium)', color: 'var(--fg2)',
      background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '8px 14px', whiteSpace: 'nowrap', flex: 'none' }}>
      <Icon name="calendar" size={16} color="var(--teal-600)" />{date}</div>));
  return (
    <div style={{ marginBottom: 22 }}>
      {breadcrumb && <Breadcrumb items={breadcrumb} />}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0, flex: '1 1 360px' }}>
          <h1 style={{ font: 'var(--display)', color: 'var(--fg1)', letterSpacing: '-.02em', margin: 0 }}>{title}</h1>
          {subtitle && <p style={{ font: 'var(--body)', color: 'var(--fg2)', margin: '6px 0 0' }}>{subtitle}</p>}
        </div>
        {rightNode}
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar, Shell, PageHead, NAV });
