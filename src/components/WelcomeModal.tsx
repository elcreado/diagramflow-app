import { useRef } from 'react';
import { X, Command, Delete, ImagePlus, Maximize, MousePointer2 } from 'lucide-react';

type WelcomeModalProps = {
    onClose: () => void;
};

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-[fadeIn_250ms_ease]" onClick={handleBackdropClick}>
            <div className="bg-bg-secondary border border-border rounded-lg p-7 w-[420px] max-w-[90vw] shadow-lg animate-[slideUp_250ms_ease]" ref={modalRef}>
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-bold text-text-primary">Bienvenido a DiagramFlow</h2>
                    <button className="p-1 rounded-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-fast cursor-pointer" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <p className="text-[13px] text-text-secondary mb-5">Crea mapas conceptuales y mentales de forma rápida y sencilla.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-3 p-3 rounded-md bg-bg-tertiary border border-border">
                        <div className="w-8 h-8 rounded-sm bg-bg-surface flex items-center justify-center text-accent-primary shrink-0"><MousePointer2 size={18} /></div>
                        <div className="flex flex-col">
                            <strong className="text-xs text-text-primary font-semibold">Arrastrar nodos</strong>
                            <span className="text-[10px] text-text-muted">Desde la barra lateral</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-md bg-bg-tertiary border border-border">
                        <div className="w-8 h-8 rounded-sm bg-bg-surface flex items-center justify-center text-accent-primary shrink-0"><Command size={18} /></div>
                        <div className="flex flex-col">
                            <strong className="text-xs text-text-primary font-semibold">Shift + Seleccionar</strong>
                            <span className="text-[10px] text-text-muted">Selección múltiple</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-md bg-bg-tertiary border border-border">
                        <div className="w-8 h-8 rounded-sm bg-bg-surface flex items-center justify-center text-accent-primary shrink-0"><Delete size={18} /></div>
                        <div className="flex flex-col">
                            <strong className="text-xs text-text-primary font-semibold">Backspace / Supr</strong>
                            <span className="text-[10px] text-text-muted">Eliminar elementos</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-md bg-bg-tertiary border border-border">
                        <div className="w-8 h-8 rounded-sm bg-bg-surface flex items-center justify-center text-accent-primary shrink-0"><ImagePlus size={18} /></div>
                        <div className="flex flex-col">
                            <strong className="text-xs text-text-primary font-semibold">Imágenes</strong>
                            <span className="text-[10px] text-text-muted">Arrastra o sube archivos</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-md bg-bg-tertiary border border-border">
                        <div className="w-8 h-8 rounded-sm bg-bg-surface flex items-center justify-center text-accent-primary shrink-0"><Maximize size={18} /></div>
                        <div className="flex flex-col">
                            <strong className="text-xs text-text-primary font-semibold">Rueda del ratón</strong>
                            <span className="text-[10px] text-text-muted">Zoom y desplazamiento</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button className="px-[18px] py-2 rounded-sm text-[13px] font-medium cursor-pointer transition-fast bg-accent-primary text-white hover:bg-[#6d28d9] shadow-glow border-none" onClick={onClose}>
                        Comenzar
                    </button>
                </div>
            </div>
        </div>
    );
}
