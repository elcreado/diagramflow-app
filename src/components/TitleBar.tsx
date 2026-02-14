import { Network } from 'lucide-react';

export default function TitleBar() {
    return (
        <div className="title-bar">
            <div className="title-bar-icon">
                <Network size={14} />
            </div>
            <div className="title-bar-text">DiagramFlow</div>
        </div>
    );
}
