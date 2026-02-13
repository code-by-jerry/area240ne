import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-transparent p-1 shadow-sm ring-1 ring-zinc-200">
                <img
                    src="https://ik.imagekit.io/area24onestorage/Area24%20one%20logos/main%20logo.png"
                    alt="Area 24 One"
                    className="h-full w-full object-contain"
                />
            </div>
        </div>
    );
}
