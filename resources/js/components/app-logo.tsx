import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-white p-1 shadow-sm ring-1 ring-zinc-200">
                <img
                    src="/image/Area 24 one logo black.png"
                    alt="Area 24 One"
                    className="h-full w-full object-contain"
                />
            </div>
            <div className="flex flex-col text-left text-sm">
                <span className="truncate leading-none font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
                    Area 24 <span className="font-medium text-zinc-500">one</span>
                </span>
            </div>
        </div>
    );
}
