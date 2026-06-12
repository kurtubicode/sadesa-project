// SADESA — charts, table, and composite parts
const { useState: useStateP } = React;

function LineChart({ data, color = 'var(--teal-600)', height = 220 }) {
  const w = 640, h = height, padL = 30, padB = 26, padT = 14, padR = 8;
  const max = Math.max(...data.map(d => d.v)) * 1.15;
  const ix = i => padL + (i * (w - padL - padR)) / (data.length - 1);
  const iy = v => padT + (1 - v / max) * (h - padT - padB);
  const pts = data.map((d, i) => [ix(i), iy(d.v)]);
  const path = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ');
  const area = path + ` L ${pts[pts.length-1][0]} ${h-padB} L ${pts[0][0]} ${h-padB} Z`;
  const grid = [0, 0.25, 0.5, 0.75, 1].map(t => padT + t * (h - padT - padB));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height, display: 'block' }}>
      <defs><linearGradient id="lcg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="var(--teal-500)" stopOpacity="0.18" />
        <stop offset="1" stopColor="var(--teal-500)" stopOpacity="0" />
      </linearGradient></defs>
      {grid.map((y, i) => <line key={i} x1={padL} y1={y} x2={w-padR} y2={y} stroke="var(--border)" strokeWidth="1" />)}
      <path d={area} fill="url(#lcg)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#fff" stroke={color} strokeWidth="2" />)}
      {data.map((d, i) => <text key={i} x={ix(i)} y={h-8} textAnchor="middle" style={{ font: 'var(--meta)', fill: 'var(--fg3)' }}>{d.d}</text>)}
    </svg>
  );
}

function BarChart({ data, height = 230 }) {
  const max = Math.max(...data.map(d => d.v)) * 1.1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 4 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 96, font: 'var(--small)', color: 'var(--fg2)', textAlign: 'right', flex: 'none' }}>{d.label}</div>
          <div style={{ flex: 1, height: 22, background: 'var(--gray-100)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ width: `${(d.v / max) * 100}%`, height: '100%', background: 'var(--teal-600)', borderRadius: 6 }} />
          </div>
          <div style={{ width: 36, font: 'var(--body-medium)', color: 'var(--fg1)', flex: 'none', fontVariantNumeric: 'tabular-nums' }}>{d.v}</div>
        </div>
      ))}
    </div>
  );
}

function Toggle({ options, value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', background: 'var(--gray-100)', borderRadius: 'var(--r-md)', padding: 3, gap: 2 }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
          border: 'none', cursor: 'pointer', padding: '5px 12px', borderRadius: 6,
          background: value === o ? '#fff' : 'transparent', color: value === o ? 'var(--fg1)' : 'var(--fg3)',
          boxShadow: value === o ? 'var(--shadow-xs)' : 'none' }}>{o}</button>
      ))}
    </div>
  );
}

function Tabs({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)' }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{ fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600,
          border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px 12px',
          color: value === o ? 'var(--teal-700)' : 'var(--fg3)',
          borderBottom: value === o ? '2px solid var(--teal-600)' : '2px solid transparent', marginBottom: -1 }}>{o}</button>
      ))}
    </div>
  );
}

// DataTable for permohonan-style rows
function PermohonanTable({ rows, onRowAction, actionLabel, showVerif }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Pemohon', 'Jenis Surat', showVerif ? 'Diverifikasi' : 'Tanggal', 'Status', 'Aksi'].map((h, i) => (
              <th key={i} style={{ font: 'var(--label)', textTransform: 'uppercase', letterSpacing: '.04em',
                color: 'var(--fg3)', textAlign: i === 4 ? 'right' : 'left', padding: '11px 14px',
                background: 'var(--gray-50)', borderBottom: '1px solid var(--border)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <Row key={r.id} r={r} onRowAction={onRowAction} actionLabel={actionLabel} showVerif={showVerif} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ r, onRowAction, actionLabel, showVerif }) {
  const [h, setH] = useStateP(false);
  return (
    <tr onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: h ? 'var(--gray-50)' : '#fff' }}>
      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <Avatar name={r.nama} />
          <div><div style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{r.nama}</div>
            <div style={{ font: 'var(--meta)', color: 'var(--fg3)' }}>NIK {r.nik}</div></div>
        </div>
      </td>
      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', font: 'var(--body)', color: 'var(--fg1)' }}>{r.jenis}</td>
      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', font: 'var(--body)', color: 'var(--fg2)' }}>
        {showVerif ? (r.verifBy || '—') : r.tanggal}</td>
      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}><StatusBadge status={r.status} /></td>
      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>
        {actionLabel
          ? <Button size="sm" onClick={() => onRowAction(r)}>{actionLabel}</Button>
          : <span style={{ display: 'inline-flex' }}><IconButton icon="eye" title="Detail" onClick={() => onRowAction && onRowAction(r)} /></span>}
      </td>
    </tr>
  );
}

function Progress({ value, label }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ font: 'var(--small)', color: 'var(--fg2)' }}>{label}</span>
        <span style={{ font: 'var(--body-medium)', color: 'var(--fg1)' }}>{value}%</span>
      </div>
      <div style={{ height: 8, background: 'var(--gray-100)', borderRadius: 999 }}>
        <div style={{ width: `${value}%`, height: '100%', background: 'var(--teal-600)', borderRadius: 999 }} />
      </div>
    </div>
  );
}

Object.assign(window, { LineChart, BarChart, Toggle, Tabs, PermohonanTable, Progress });
