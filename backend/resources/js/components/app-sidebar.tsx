import { Link, usePage } from '@inertiajs/react';
import {
    BarChart2,
    BookOpen,
    ClipboardList,
    ConciergeBell,
    FileBadge,
    FileCheck,
    FileText,
    History,
    LayoutDashboard,
    ListOrdered,
    Map,
    Megaphone,
    Newspaper,
    NotebookPen,
    Printer,
    ScrollText,
    Send,
    Settings,
    ShieldCheck,
    Star,
    UserCheck,
    UserCog,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import type { Auth } from '@/types/auth';

// ─── Nav items per role ────────────────────────────────────────────────────────

const adminNavItems: NavItem[] = [
    { title: 'Dashboard',            href: dashboard(),                  icon: LayoutDashboard },
    { title: 'Pengajuan Surat',      href: '/admin/pengajuan',           icon: FileText },
    { title: 'Pengaduan',            href: '/admin/pengaduan',           icon: Megaphone },
    { title: 'Antrean',              href: '/admin/pengajuan',           icon: ListOrdered },
    { title: 'Master Surat',         href: '/admin/master-surat',        icon: ClipboardList },
    { title: 'Data Kependudukan',    href: '/admin/verifikasi-warga',    icon: Users },
    { title: 'Pengguna Sistem',      href: '/admin/users',               icon: UserCog },
    { title: 'Wilayah & Data',       href: '/admin/data-master',         icon: Map },
    { title: 'Berita Desa',          href: '/admin/konten',              icon: Newspaper },
    { title: 'Buku Tamu',            href: '/admin/buku-tamu',           icon: NotebookPen },
    { title: 'Audit Log',            href: '/admin/audit-log',           icon: ShieldCheck },
    { title: 'Pengaturan Desa',      href: '/admin/pengaturan',          icon: Settings },
];

const staffNavItems: NavItem[] = [
    { title: 'Dashboard',            href: dashboard(),                          icon: LayoutDashboard },
    { title: 'Antrean',              href: '/staff/pengajuan',                   icon: ListOrdered },
    { title: 'Pelayanan Loket',      href: '/staff/loket',                       icon: ConciergeBell },
    { title: 'Verifikasi Berkas',    href: '/staff/pengajuan?status=menunggu',   icon: FileCheck },
    { title: 'Surat Siap Cetak',     href: '/staff/pengajuan?status=disetujui',    icon: Printer },
    { title: 'Pengaduan Warga',      href: '/staff/pengaduan',                   icon: Megaphone },
    { title: 'Buku Tamu',            href: '/staff/buku-tamu',                   icon: BookOpen },
];

const kepalDesaNavItems: NavItem[] = [
    { title: 'Dashboard',            href: dashboard(),                  icon: LayoutDashboard },
    { title: 'Pengesahan Dokumen',   href: '/kepala-desa/pengajuan',     icon: FileBadge },
    { title: 'Statistik Layanan',    href: '/kepala-desa/statistik',     icon: BarChart2 },
    { title: 'Penilaian Layanan',    href: '/kepala-desa/penilaian',     icon: Star },
];

const wargaNavItems: NavItem[] = [
    { title: 'Dashboard',            href: dashboard(),                  icon: LayoutDashboard },
    { title: 'Informasi Desa',       href: '/informasi',                 icon: Newspaper },
    { title: 'Pengajuan Surat',      href: '/warga/pengajuan',           icon: FileText },
    { title: 'Pengaduan',            href: '/warga/pengaduan',           icon: Megaphone },
    { title: 'Data Kependudukan',    href: '/warga/data-diri',           icon: UserCheck },
];

const footerNavItems: NavItem[] = [];

// ─── Component ────────────────────────────────────────────────────────────────

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const role = auth?.user?.role ?? 'warga';

    const navItems =
        role === 'admin'       ? adminNavItems      :
        role === 'kepala_desa' ? kepalDesaNavItems  :
        role === 'staff'       ? staffNavItems      :
                                 wargaNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
