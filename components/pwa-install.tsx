
// components/PWAInstallPrompt.tsx
import { usePWAInstall } from '@/hooks/usePWAInstall';
import React from 'react';
interface InstallButtonProps {
    onClick: () => Promise<void>;
    className?: string;
}

interface DismissButtonProps {
    onClick: () => void;
    className?: string;
}

const InstallButton: React.FC<InstallButtonProps> = ({ onClick, className }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${className}`}
    >
        Install App
    </button>
);

const DismissButton: React.FC<DismissButtonProps> = ({ onClick, className }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors ${className}`}
    >
        Not Now
    </button>
);

export const PWAInstallPrompt: React.FC = () => {
    const {
        isInstallable,
        isInstallPromptVisible,
        hideInstallPrompt,
        handleInstallClick,
    } = usePWAInstall();

    if (!isInstallable || !isInstallPromptVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t z-50" role="dialog" aria-labelledby="pwa-prompt-title">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between">
                <div className="flex-1">
                    <h3 id="pwa-prompt-title" className="text-lg font-semibold">
                        Install Our App
                    </h3>
                    <p className="text-gray-600">
                        Get the best experience by installing our app on your device
                    </p>
                </div>
                <div className="flex gap-2">
                    <DismissButton onClick={hideInstallPrompt} />
                    <InstallButton onClick={handleInstallClick} />
                </div>
            </div>
        </div>
    );
};

export default PWAInstallPrompt;