import { Link, usePage } from '@inertiajs/react';
import {
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Menu,
    Phone,
    X,
    Youtube,
    ChevronRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { dashboard, login, register } from '@/routes';

interface PageProps {
    auth: { user: { name: string } | null };
    canRegister?: boolean;
}

export default function PublicLayout({ children, title }: { children: React.ReactNode; title?: string }) {
    const { auth, canRegister } = usePage<any>().props;
    const user = auth?.user ?? null;

    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    const navLinks = [
        { href: '/#beranda', label: 'Beranda' },
        { href: '/#tentang', label: 'Tentang' },
        { href: '/#fitur', label: 'Layanan' },
        { href: '/informasi', label: 'Berita' },
        { href: '/#kontak', label: 'Kontak' },
        { href: '/buku-tamu', label: 'Buku Tamu' },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-sans antialiased">
            {/* Navbar */}
            <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-md backdrop-blur-sm dark:bg-gray-900/95' : 'bg-white/80 backdrop-blur-sm dark:bg-gray-900/80'}`}>
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 shadow">
                            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                <polyline strokeLinecap="round" strokeLinejoin="round" points="9 22 9 12 15 12 15 22" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-lg font-bold leading-none text-gray-900 dark:text-white">SADESA</span>
                            <p className="text-xs leading-none text-teal-600 dark:text-teal-400 font-semibold">Pemerintah Desa Cirangkong</p>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden items-center gap-6 lg:flex">
                        {navLinks.map(l => (
                            <Link key={l.label} href={l.href}
                                className="text-sm font-medium transition-colors hover:text-teal-600 text-gray-700 dark:text-gray-200">
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="hidden items-center gap-3 lg:flex">
                        {user ? (
                            <Link href={dashboard()}
                                className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-teal-700">
                                Portal Layanan <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        ) : (
                            <>
                                <Link href={login()}
                                    className="text-sm font-medium transition-colors hover:text-teal-600 text-gray-700 dark:text-gray-200">
                                    Masuk
                                </Link>
                                {canRegister && (
                                    <Link href={register()}
                                        className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-teal-700">
                                        Daftar
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button onClick={() => setOpen(v => !v)}
                        className="rounded-lg p-2 lg:hidden text-gray-700 dark:text-gray-200">
                        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {open && (
                    <div className="border-t bg-white px-4 py-4 shadow-lg dark:border-gray-700 dark:bg-gray-900 lg:hidden">
                        <div className="flex flex-col gap-3">
                            {navLinks.map(l => (
                                <Link key={l.label} href={l.href} onClick={() => setOpen(false)}
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 dark:text-gray-200 dark:hover:bg-teal-900/20">
                                    {l.label}
                                </Link>
                            ))}
                            <hr className="dark:border-gray-700" />
                            {user ? (
                                <Link href={dashboard()} className="rounded-xl bg-teal-600 px-4 py-2 text-center text-sm font-semibold text-white">
                                    Portal Layanan
                                </Link>
                            ) : (
                                <div className="flex gap-2">
                                    <Link href={login()} className="flex-1 rounded-xl border border-teal-600 px-4 py-2 text-center text-sm font-semibold text-teal-600">Masuk</Link>
                                    {canRegister && (
                                        <Link href={register()} className="flex-1 rounded-xl bg-teal-600 px-4 py-2 text-center text-sm font-semibold text-white">Daftar</Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="pt-20">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300">
                <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Brand */}
                        <div className="lg:col-span-1">
                            <div className="mb-4 flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600">
                                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                        <polyline strokeLinecap="round" strokeLinejoin="round" points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                </div>
                                <span className="text-lg font-bold text-white">SADESA</span>
                            </div>
                            <p className="text-sm leading-relaxed text-gray-400">
                                Sahabat Digital Desa Cirangkong — Platform layanan administrasi dan informasi publik resmi Pemerintah Desa Cirangkong, Kecamatan Cijambe, Kabupaten Subang.
                            </p>
                        </div>

                        {/* Kontak */}
                        <div className="lg:col-span-1 text-sm space-y-4">
                            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Hubungi Kami</p>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                                <p>Jl. Lempar - Cirangkong KM. 08, Desa Cirangkong, Cijambe, Subang 41286</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-teal-600 shrink-0" />
                                <p>(0260) xxxx-xxxx</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-teal-600 shrink-0" />
                                <p>desacirangkong@subang.go.id</p>
                            </div>
                        </div>

                        {/* Layanan */}
                        <div>
                            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Layanan Populer</p>
                            <ul className="space-y-2 text-sm">
                                {['Surat Keterangan Domisili', 'Surat Pengantar Nikah', 'Surat Keterangan Usaha', 'Pengaduan Infrastruktur'].map(l => (
                                    <li key={l}><Link href="/dashboard" className="text-gray-400 transition hover:text-teal-400">{l}</Link></li>
                                ))}
                            </ul>
                        </div>

                        {/* Sosmed */}
                        <div>
                            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">Media Sosial</p>
                            <div className="flex gap-3">
                                {[
                                    { Icon: Facebook, href: '#', label: 'Facebook' },
                                    { Icon: Instagram, href: '#', label: 'Instagram' },
                                    { Icon: Youtube, href: '#', label: 'YouTube' },
                                ].map(({ Icon, href, label }) => (
                                    <a key={label} href={href}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700 bg-gray-800 text-gray-400 transition hover:border-teal-500 hover:bg-teal-900/20 hover:text-teal-400">
                                        <Icon className="h-5 w-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <hr className="my-10 border-gray-800" />

                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p className="text-xs text-gray-500">
                            © {new Date().getFullYear()} Pemerintah Desa Cirangkong. Seluruh Hak Cipta Dilindungi.
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span>SADESA v1.0</span>
                            <span className="h-4 w-px bg-gray-800"></span>
                            <span>Kecamatan Cijambe, Subang</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
