import { usePage } from '@inertiajs/react';
import { Bell, HelpCircle, Search, CheckCheck, FileText, Megaphone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import type { Auth } from '@/types/auth';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_LABEL: Record<string, string> = {
    admin:       'Administrator',
    staff:       'Staff Pelayanan',
    kepala_desa: 'Kepala Desa',
    warga:       'Warga',
};

const AVATAR_COLORS = [
    ['#ccfbf1','#0f766e'], ['#dbeafe','#1d4ed8'], ['#fef9c3','#a16207'],
    ['#fce7f3','#9d174d'], ['#ede9fe','#6d28d9'], ['#dcfce7','#15803d'],
];

function avatarStyle(name: string) {
    const idx = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % AVATAR_COLORS.length;
    return AVATAR_COLORS[idx];
}

function getInitials(name: string): string {
    return name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase();
}

interface NotifItem {
    id: string;
    title: string;
    body: string;
    type: string;
    action_url: string | null;
    created_at: string;
}

// ─── NotificationBell ─────────────────────────────────────────────────────────

function NotificationBell({ role }: { role: string }) {
    const [open, setOpen]   = useState(false);
    const [count, setCount] = useState(0);
    const [items, setItems] = useState<NotifItem[]>([]);
    const prevCount         = useRef(0);
    const dropRef           = useRef<HTMLDivElement>(null);

    const fetchNotifs = async () => {
        try {
            const res = await axios.get('/notifications/unread');
            const newCount: number = res.data.count;

            // Tampilkan browser notification jika ada notif baru
            if (newCount > prevCount.current && prevCount.current > 0) {
                const latest: NotifItem = res.data.data[0];
                if (latest && 'Notification' in window && Notification.permission === 'granted') {
                    new Notification(latest.title, {
                        body: latest.body,
                        icon: '/images/logo-cirangkong-icon.png',
                    });
                }
            }
            prevCount.current = newCount;
            setCount(newCount);
            setItems(res.data.data);
        } catch { /* silent */ }
    };

    useEffect(() => {
        if (!['admin', 'staff'].includes(role)) return;

        // Minta izin notifikasi browser
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        fetchNotifs();
        const interval = setInterval(fetchNotifs, 30_000);
        return () => clearInterval(interval);
    }, [role]);

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const markRead = async (id: string) => {
        await axios.post(`/notifications/${id}/read`);
        setItems(prev => prev.filter(n => n.id !== id));
        setCount(prev => Math.max(0, prev - 1));
    };

    const markAllRead = async () => {
        await axios.post('/notifications/read-all');
        setItems([]);
        setCount(0);
    };

    return (
        <div className="relative" ref={dropRef}>
            <button
                onClick={() => setOpen(v => !v)}
                className="relative flex h-8 w-8 items-center justify-center rounded-lg border bg-card text-muted-foreground transition-colors hover:bg-muted"
            >
                <Bell className="h-4 w-4" />
                {count > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-[0_0_0_2px_white]">
                        {count > 99 ? '99+' : count}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-10 z-50 w-80 rounded-2xl border bg-card shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <p className="text-sm font-semibold text-foreground">Notifikasi</p>
                        {count > 0 && (
                            <button
                                onClick={markAllRead}
                                className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700"
                            >
                                <CheckCheck className="h-3 w-3" /> Tandai semua dibaca
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-72 overflow-y-auto divide-y">
                        {items.length === 0 ? (
                            <div className="py-10 text-center">
                                <Bell className="mx-auto mb-2 h-6 w-6 text-muted-foreground/40" />
                                <p className="text-xs text-muted-foreground">Tidak ada notifikasi baru</p>
                            </div>
                        ) : items.map(n => (
                            <div
                                key={n.id}
                                className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-muted/50"
                                onClick={() => {
                                    markRead(n.id);
                                    if (n.action_url) window.location.href = n.action_url;
                                    setOpen(false);
                                }}
                            >
                                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.type === 'pengajuan' ? 'bg-teal-50 text-teal-600' : 'bg-orange-50 text-orange-600'}`}>
                                    {n.type === 'pengajuan'
                                        ? <FileText className="h-4 w-4" />
                                        : <Megaphone className="h-4 w-4" />
                                    }
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold leading-snug text-foreground">{n.title}</p>
                                    <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">{n.body}</p>
                                    <p className="mt-1 text-[10px] text-muted-foreground/60">{n.created_at}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const user      = auth?.user;
    const name      = user?.name ?? '';
    const role      = user?.role ?? 'warga';
    const initials  = name ? getInitials(name) : '?';
    const [avBg, avFg] = avatarStyle(name);

    return (
        <header
            className="flex shrink-0 items-center gap-4 border-b bg-card px-7"
            style={{ height: 68 }}
        >
            {/* Left: sidebar trigger + breadcrumbs */}
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
                <div className="hidden min-w-0 sm:block">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>

            {/* Search */}
            <div className="hidden flex-1 items-center gap-2 rounded-lg border bg-muted/60 px-3 py-2 text-sm text-muted-foreground md:flex"
                style={{ maxWidth: 400 }}>
                <Search className="h-4 w-4 shrink-0" />
                <span className="flex-1 select-none text-[14px]">
                    Cari data warga, surat, atau laporan...
                </span>
            </div>

            {/* Right actions */}
            <div className="flex shrink-0 items-center gap-3">

                {/* Notification Bell */}
                <NotificationBell role={role} />

                {/* Help */}
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border bg-card text-muted-foreground transition-colors hover:bg-muted">
                    <HelpCircle className="h-4 w-4" />
                </button>

                {/* Divider */}
                <div className="h-7 w-px bg-border" />

                {/* User */}
                <div className="flex items-center gap-2.5">
                    <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                        style={{ background: avBg, color: avFg }}
                    >
                        {initials}
                    </div>
                    <div className="hidden sm:block">
                        <p className="max-w-[130px] truncate text-sm font-semibold text-foreground">
                            {name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {ROLE_LABEL[role] ?? role}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
