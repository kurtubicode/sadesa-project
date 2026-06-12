// SADESA — shared UI components (Lucide-backed)
const { useRef, useEffect, useState } = React;

function Icon({ name, size = 18, color, stroke = 1.75, style }) {
  const ref = useRef(null);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    host.appendChild(i);
    if (window.lucide) window.lucide.createIcons();
    const svg = host.querySelector('svg');
    if (svg) {
      svg.setAttribute('width', size); svg.setAttribute('height', size);
      svg.style.strokeWidth = stroke;
      if (color) svg.style.color = color;
    }
  });
  return <span ref={ref} style={{ display: 'inline-flex', width: size, height: size, flex: 'none', ...style }} />;
}

function Avatar({ name, size = 34 }) {
  const [bg, fg] = avatarColor(name);
  return (
    <div style={{ width: size, height: size, borderRadius: 999, background: bg, color: fg,
      display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: size * 0.38, flex: 'none' }}>
      {initials(name)}
    </div>
  );
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.menunggu;
  return (
    <span style={{ font: 'var(--label)', letterSpacing: '.03em', padding: '4px 10px',
      borderRadius: 999, background: m.bg, color: m.fg, whiteSpace: 'nowrap' }}>{m.label}</span>
  );
}

function Badge({ children, bg = 'var(--success-bg)', fg = 'var(--success-fg)' }) {
  return <span style={{ font: 'var(--label)', letterSpacing: '.03em', padding: '3px 9px', borderRadius: 999, background: bg, color: fg, whiteSpace: 'nowrap' }}>{children}</span>;
}

function StatCard({ icon, label, value, badge, tone = 'teal' }) {
  const tones = {
    teal:   ['var(--teal-50)', 'var(--teal-600)'],
    warn:   ['var(--warn-bg)', 'var(--warn-fg)'],
    danger: ['var(--danger-bg)', 'var(--danger-fg)'],
    info:   ['var(--info-bg)', 'var(--info-fg)'],
  };
  const [ibg, ifg] = tones[tone] || tones.teal;
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)',
      padding: 18, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 'var(--r-md)', background: ibg, color: ifg, display: 'grid', placeItems: 'center' }}>
          <Icon name={icon} size={21} />
        </div>
        {badge}
      </div>
      <div style={{ font: 'var(--meta)', color: 'var(--fg2)' }}>{label}</div>
      <div style={{ font: 'var(--stat-value)', color: 'var(--fg1)', marginTop: 2 }}>{value}</div>
    </div>
  );
}

function Card({ title, action, children, pad = true, style }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', overflow: 'hidden', ...style }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ font: 'var(--h2)', color: 'var(--fg1)', margin: 0, whiteSpace: 'nowrap' }}>{title}</h2>
          {action}
        </div>
      )}
      <div style={{ padding: pad ? 20 : 0 }}>{children}</div>
    </div>
  );
}

function Button({ children, variant = 'primary', size = 'md', icon, onClick, style }) {
  const base = { fontFamily: 'inherit', fontWeight: 600, borderRadius: 'var(--r-md)', display: 'inline-flex',
    alignItems: 'center', gap: 7, cursor: 'pointer', border: '1px solid transparent', whiteSpace: 'nowrap',
    fontSize: size === 'sm' ? 13 : 14, padding: size === 'sm' ? '6px 12px' : '9px 16px', transition: 'background var(--dur)' };
  const variants = {
    primary: { background: 'var(--teal-600)', color: '#fff' },
    outline: { background: '#fff', color: 'var(--fg1)', border: '1px solid var(--border-strong)' },
    ghost:   { background: 'transparent', color: 'var(--teal-700)' },
    danger:  { background: 'var(--danger-bg)', color: 'var(--danger-fg)' },
  };
  const hover = {
    primary: 'var(--teal-700)', outline: 'var(--gray-50)', ghost: 'var(--teal-50)', danger: '#fecaca',
  };
  const [h, setH] = useState(false);
  const v = variants[variant];
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ ...base, ...v, background: h ? hover[variant] : v.background, ...style }}>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}{children}
    </button>
  );
}

function IconButton({ icon, onClick, title }) {
  const [h, setH] = useState(false);
  return (
    <button title={title} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: 32, height: 32, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)',
        background: h ? 'var(--gray-50)' : '#fff', color: 'var(--fg2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
      <Icon name={icon} size={16} />
    </button>
  );
}

function ActivityLog({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '11px 0', borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
          <span style={{ width: 9, height: 9, borderRadius: 999, marginTop: 6, flex: 'none', background: it.color }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{it.title}</div>
            <div style={{ font: 'var(--small)', color: 'var(--fg2)', marginTop: 1 }}>{it.desc}</div>
          </div>
          <span style={{ font: 'var(--meta)', color: 'var(--fg3)', marginLeft: 'auto', flex: 'none', whiteSpace: 'nowrap' }}>{it.time}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Icon, Avatar, StatusBadge, Badge, StatCard, Card, Button, IconButton, ActivityLog });
