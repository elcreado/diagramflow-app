import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export async function exportToPdf(
    element: HTMLElement,
    title: string = 'Diagrama'
): Promise<void> {
    try {
        // Hide controls and minimap for clean export
        const controls = element.querySelectorAll(
            '.react-flow__controls, .react-flow__minimap'
        );
        controls.forEach((el) => {
            (el as HTMLElement).style.display = 'none';
        });

        const dataUrl = await toPng(element, {
            backgroundColor: '#0f0f14',
            pixelRatio: 2,
            filter: (node) => {
                // Filter out attribution and controls
                if (node.classList) {
                    return (
                        !node.classList.contains('react-flow__controls') &&
                        !node.classList.contains('react-flow__minimap') &&
                        !node.classList.contains('react-flow__attribution')
                    );
                }
                return true;
            },
        });

        // Restore visibility
        controls.forEach((el) => {
            (el as HTMLElement).style.display = '';
        });

        const img = new Image();
        img.src = dataUrl;

        await new Promise<void>((resolve) => {
            img.onload = () => {
                const imgWidth = img.width;
                const imgHeight = img.height;

                // Determine orientation based on aspect ratio
                const isLandscape = imgWidth > imgHeight;
                const pdf = new jsPDF({
                    orientation: isLandscape ? 'landscape' : 'portrait',
                    unit: 'px',
                    format: [imgWidth / 2, imgHeight / 2],
                });

                pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth / 2, imgHeight / 2);
                pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);
                resolve();
            };
        });
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        throw error;
    }
}
