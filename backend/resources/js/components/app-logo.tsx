export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <img
                src="/images/logo-cirangkong-icon.png"
                alt="Logo Desa Cirangkong"
                className="size-[38px] shrink-0 object-contain"
            />
            <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-[17px] font-bold tracking-[0.5px] text-foreground">
                    SADESA
                </span>
                <span className="truncate text-[10.5px] font-medium text-muted-foreground">
                    Sahabat Digital Desa
                </span>
            </div>
        </div>
    );
}
