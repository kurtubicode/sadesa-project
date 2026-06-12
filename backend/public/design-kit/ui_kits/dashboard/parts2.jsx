// SADESA — shared table & control primitives for admin pages
const { useState: useState2 } = React;

function Table({ heads, aligns = [], children }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr>
          {heads.map((h, i) => (
            <th key={i} style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em',
              color: 'var(--fg3)', textAlign: aligns[i] || 'left', padding: '12px 16px', whiteSpace: 'nowrap',
              background: 'var(--gray-50)', borderBottom: '1px solid var(--border)' }}>{h}</th>
          ))}
        </tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Td({ children, align = 'left', muted, strong, style }) {
  return (
    <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', textAlign: align, verticalAlign: 'middle',
      font: strong ? 'var(--body-medium)' : 'var(--body)', color: muted ? 'var(--fg2)' : 'var(--fg1)', ...style }}>{children}</td>
  );
}

function Trow({ children }) {
  const [h, setH] = useState2(false);
  return <tr onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: h ? 'var(--gray-50)' : '#fff' }}>{children}</tr>;
}

function NameCell({ name, sub, size = 34 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <Avatar name={name} size={size} />
      <div style={{ minWidth: 0 }}>
        <div style={{ font: 'var(--body-medium)', color: 'var(--fg1)', whiteSpace: 'nowrap' }}>{name}</div>
        {sub && <div style={{ font: 'var(--meta)', color: 'var(--fg3)', whiteSpace: 'nowrap' }}>{sub}</div>}
      </div>
    </div>
  );
}

function Pill({ children, bg = 'var(--gray-100)', fg = 'var(--fg1)', mono }) {
  return (
    <span style={{ display: 'inline-block', font: mono ? '600 12.5px/1.4 var(--font-mono)' : 'var(--body-medium)',
      padding: '5px 11px', borderRadius: 'var(--r-sm)', background: bg, color: fg, whiteSpace: 'nowrap' }}>{children}</span>
  );
}

function Pagination({ info, pages = [1, 2, 3], current = 1, tail }) {
  const btn = (active) => ({ minWidth: 34, height: 34, borderRadius: 'var(--r-md)', border: '1px solid ' + (active ? 'var(--teal-600)' : 'var(--border)'),
    background: active ? 'var(--teal-600)' : '#fff', color: active ? '#fff' : 'var(--fg2)', font: 'var(--body-medium)', cursor: 'pointer', padding: '0 8px' });
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 20px', flexWrap: 'wrap' }}>
      <span style={{ font: 'var(--small)', color: 'var(--fg3)' }}>{info}</span>
      <div style={{ display: 'flex', gap: 6 }}>
        <button style={btn(false)}><Icon name="chevron-left" size={15} /></button>
        {pages.map(p => <button key={p} style={btn(p === current)}>{p}</button>)}
        {tail && <React.Fragment><span style={{ alignSelf: 'flex-end', color: 'var(--fg3)', padding: '0 2px' }}>…</span><button style={btn(false)}>{tail}</button></React.Fragment>}
        <button style={btn(false)}><Icon name="chevron-right" size={15} /></button>
      </div>
    </div>
  );
}

function Breadcrumb({ items }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6, font: 'var(--small)' }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Icon name="chevron-right" size={13} color="var(--fg3)" />}
          <span style={{ color: i === items.length - 1 ? 'var(--teal-700)' : 'var(--fg3)', fontWeight: i === items.length - 1 ? 600 : 400, whiteSpace: 'nowrap' }}>{it}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

function ToggleSwitch({ on: initial = true }) {
  const [on, setOn] = useState2(initial);
  return (
    <button onClick={() => setOn(!on)} style={{ width: 42, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer',
      background: on ? 'var(--teal-500)' : 'var(--gray-300)', position: 'relative', transition: 'background .18s', padding: 0 }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: 999, background: '#fff',
        boxShadow: 'var(--shadow-xs)', transition: 'left .18s' }} />
    </button>
  );
}

// clickable stat filter (Antrean): dot + label + big number, teal-fill when active
function FilterTab({ label, value, dotColor, active, onClick }) {
  return (
    <button onClick={onClick} style={{ textAlign: 'left', border: '1px solid ' + (active ? 'var(--teal-600)' : 'var(--border)'),
      background: active ? 'var(--teal-600)' : '#fff', borderRadius: 'var(--r-lg)', padding: '16px 18px', cursor: 'pointer',
      boxShadow: 'var(--shadow-sm)', minWidth: 0, fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <span style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em', color: active ? 'rgba(255,255,255,.85)' : 'var(--fg3)' }}>{label}</span>
        {dotColor && <span style={{ width: 8, height: 8, borderRadius: 999, background: active ? '#fff' : dotColor }} />}
      </div>
      <div style={{ font: 'var(--stat-value)', color: active ? '#fff' : 'var(--fg1)' }}>{value}</div>
    </button>
  );
}

// teal accent card (single-emphasis tiles: Cakupan Luas, Status Petugas, etc.)
function DarkCard({ icon, label, value, sub, children, style }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, var(--teal-500), var(--teal-700))', borderRadius: 'var(--r-lg)',
      padding: 18, color: '#fff', boxShadow: 'var(--shadow-md)', ...style }}>
      {icon && <div style={{ width: 42, height: 42, borderRadius: 'var(--r-md)', background: 'rgba(255,255,255,0.18)',
        display: 'grid', placeItems: 'center', marginBottom: 14 }}><Icon name={icon} size={21} color="#fff" /></div>}
      {label && <div style={{ font: 'var(--meta)', color: 'rgba(255,255,255,0.85)' }}>{label}</div>}
      {value && <div style={{ font: 'var(--stat-value)', color: '#fff', marginTop: 2 }}>{value}</div>}
      {sub && <div style={{ font: 'var(--small)', color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>{sub}</div>}
      {children}
    </div>
  );
}

// search + trailing controls bar that sits above a table
function TableToolbar({ placeholder, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 1, minWidth: 220, background: 'var(--gray-50)',
        border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '0 12px' }}>
        <Icon name="search" size={16} color="var(--fg3)" />
        <input placeholder={placeholder} style={{ border: 'none', background: 'transparent', outline: 'none', font: 'var(--body)', color: 'var(--fg1)', padding: '9px 0', width: '100%' }} />
      </div>
      {children}
    </div>
  );
}

function SelectChip({ icon, children }) {
  return (
    <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, font: 'var(--body-medium)', color: 'var(--fg2)',
      background: '#fff', border: '1px solid var(--border-strong)', borderRadius: 'var(--r-md)', padding: '8px 13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
      {icon && <Icon name={icon} size={15} />}{children}
    </button>
  );
}

Object.assign(window, { Table, Td, Trow, NameCell, Pill, Pagination, Breadcrumb, ToggleSwitch, FilterTab, DarkCard, TableToolbar, SelectChip });
