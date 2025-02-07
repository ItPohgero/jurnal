import { BeforeInstallPromptEvent } from '@/types/pwa.type';
import { useState, useEffect } from 'react';

interface UsePWAInstallReturn {
    isInstallable: boolean;
    isInstallPromptVisible: boolean;
    hideInstallPrompt: () => void;
    handleInstallClick: () => Promise<void>;
}

export const usePWAInstall = (): UsePWAInstallReturn => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallPromptVisible, setIsInstallPromptVisible] = useState<boolean>(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();

            // Verify and store the event
            if (isPWAInstallPromptEvent(e)) {
                setDeferredPrompt(e);
                setIsInstallPromptVisible(true);
            }
        };

        const isPWAInstallPromptEvent = (e: Event): e is BeforeInstallPromptEvent => {
            return 'prompt' in e && 'userChoice' in e;
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const hideInstallPrompt = (): void => {
        setIsInstallPromptVisible(false);
    };

    const handleInstallClick = async (): Promise<void> => {
        if (!deferredPrompt) return;

        try {
            // Show the install prompt
            await deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            const choiceResult = await deferredPrompt.userChoice;

            if (choiceResult.outcome === 'accepted') {
                setIsInstallPromptVisible(false);
            }

            // Clear the deferredPrompt for the next time
            setDeferredPrompt(null);
        } catch (error) {
            console.error('Error during PWA installation:', error);
        }
    };

    return {
        isInstallable: !!deferredPrompt,
        isInstallPromptVisible,
        hideInstallPrompt,
        handleInstallClick,
    };
};