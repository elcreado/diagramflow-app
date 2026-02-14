import { Network } from 'lucide-react';

export default function TitleBar() {
    return (
        <div className="h-[38px] bg-bg-primary flex items-center px-4 gap-3 border-b border-border select-none shrink-0 z-50 nav-drag">
            <div className="text-accent-primary flex items-center">
                <Network size={14} />
            </div>
            <div className="font-semibold text-xs text-text-primary tracking-wide">DiagramFlow</div>
        </div>
    );
}
