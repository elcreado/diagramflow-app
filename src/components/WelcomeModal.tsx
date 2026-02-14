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
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal welcome-modal" ref={modalRef}>
                <div className="modal-header">
                    <h2>Bienvenido a DiagramFlow</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <p>Crea mapas conceptuales y mentales de forma rápida y sencilla.</p>

                <div className="shortcuts-grid">
                    <div className="shortcut-item">
                        <div className="shortcut-icon"><MousePointer2 size={18} /></div>
                        <div className="shortcut-desc">
                            <strong>Arrastrar nodes</strong>
                            <span>Desde la barra lateral</span>
                        </div>
                    </div>
                    <div className="shortcut-item">
                        <div className="shortcut-icon"><Command size={18} /></div>
                        <div className="shortcut-desc">
                            <strong>Shift + Seleccionar</strong>
                            <span>Selección múltiple</span>
                        </div>
                    </div>
                    <div className="shortcut-item">
                        <div className="shortcut-icon"><Delete size={18} /></div>
                        <div className="shortcut-desc">
                            <strong>Backspace / Supr</strong>
                            <span>Eliminar elementos</span>
                        </div>
                    </div>
                    <div className="shortcut-item">
                        <div className="shortcut-icon"><ImagePlus size={18} /></div>
                        <div className="shortcut-desc">
                            <strong>Imágenes</strong>
                            <span>Arrastra o sube archivos</span>
                        </div>
                    </div>
                    <div className="shortcut-item">
                        <div className="shortcut-icon"><Maximize size={18} /></div>
                        <div className="shortcut-desc">
                            <strong>Rueda del ratón</strong>
                            <span>Zoom y desplazamiento</span>
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="modal-btn primary" onClick={onClose}>
                        Comenzar
                    </button>
                </div>
            </div>
        </div>
    );
}
