export default function AppLogoIcon({ className }: { className?: string }) {
    return (
        <img
            src="/images/logo-cirangkong-icon.png"
            alt="Logo Desa Cirangkong"
            className={className}
            style={{ objectFit: 'contain' }}
        />
    );
}
