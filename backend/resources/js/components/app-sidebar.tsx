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
    LogOut,
    Map,
    Megaphone,
    Newspaper,
    NotebookPen,
    Printer,
    ScrollText,
    Send,
    Settings,
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

// ─── Nav items per role (matching design kit NAV spec) ────────────────────────

const adminNavItems: NavItem[] = [
    { title: 'Dashboard',            href: dashboard(),                  icon: LayoutDashboard },
    { title: 'Data Kependudukan',    href: '/admin/verifikasi-warga',    icon: Users },
    { title: 'Manajemen Akun',       href: '/admin/users',               icon: UserCog },
    { title: 'Wilayah',              href: '/admin/data-master',         icon: Map },
    { title: 'Layanan Surat',        href: '/admin/master-surat',        icon: FileText },
    { title: 'Kategori Pengaduan',   href: '/admin/pengaduan',           icon: Megaphone },
    { title: 'Berita Desa',          href: '/admin/konten',              icon: Newspaper },
    { title: 'Broadcast WhatsApp',   href: '/admin/pengaturan',          icon: Send },
    { title: 'Antrean',              href: '/admin/pengajuan',           icon: ListOrdered },
    { title: 'Riwayat Kunjungan',    href: '/admin/buku-tamu',           icon: History },
    { title: 'Audit Log',            href: '/admin/audit-log',           icon: ScrollText },
];

const staffNavItems: NavItem[] = [
    { title: 'Dashboard',            href: dashboard(),                  icon: LayoutDashboard },
    { title: 'Antrean',              href: '/staff/pengajuan',           icon: ListOrdered },
    { title: 'Pelayanan Loket',      href: '/staff/pengajuan',           icon: ConciergeBell },
    { title: 'Verifikasi Berkas',    href: '/staff/pengajuan',           icon: FileCheck },
    { title: 'Surat Siap Cetak',     href: '/staff/pengajuan',           icon: Printer },
    { title: 'Pengaduan Warga',      href: '/staff/pengaduan',           icon: Megaphone },
    { title: 'Buku Tamu',            href: '/admin/buku-tamu',           icon: BookOpen },
];

const kepalDesaNavItems: NavItem[] = [
    { title: 'Dashboard Statistik',  href: dashboard(),                  icon: LayoutDashboard },
    { title: 'Pengesahan Dokumen',   href: '/kepala-desa/pengajuan',     icon: FileBadge },
    { title: 'Laporan Bulanan',      href: '/settings',                  icon: BarChart2 },
];

const wargaNavItems: NavItem[] = [
    { title: 'Dashboard',            href: dashboard(),                  icon: LayoutDashboard },
    { title: 'Informasi Desa',       href: '/informasi',                 icon: Newspaper },
    { title: 'Pengajuan Surat',      href: '/warga/pengajuan',           icon: FileText },
    { title: 'Pengaduan',            href: '/warga/pengaduan',           icon: Megaphone },
    { title: 'Verifikasi Identitas', href: '/verifikasi',                icon: UserCheck },
];

const footerNavItems: NavItem[] = [];

// ─── Component ────────────────────────────────────────────────────────────────

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const role = auth?.user?.role ?? 'staff';

    const navItems =
        role === 'admin'       ? adminNavItems      :
        role === 'kepala_desa' ? kepalDesaNavItems   :
        role === 'staff'       ? staffNavItems       :
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
