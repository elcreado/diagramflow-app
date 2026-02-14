import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export async function exportToPdf(
    element: HTMLElement,
    title: string = 'Diagrama'
): Promise<void> {
    const hiddenSelector =
        '.react-flow__controls, .react-flow__minimap, .react-flow__attribution, .react-flow__background';
    const hiddenElements = Array.from(element.querySelectorAll(hiddenSelector)) as HTMLElement[];
    const previousDisplays = new Map<HTMLElement, string>();
    const previousBackground = element.style.background;

    try {
        // Hide UI chrome and background pattern to keep export clean and transparent.
        hiddenElements.forEach((el) => {
            previousDisplays.set(el, el.style.display);
            el.style.display = 'none';
        });
        element.style.background = 'transparent';

        const dataUrl = await toPng(element, {
            pixelRatio: 2,
            backgroundColor: 'transparent',
            filter: (node) => {
                if (node.classList) {
                    return (
                        !node.classList.contains('react-flow__controls') &&
                        !node.classList.contains('react-flow__minimap') &&
                        !node.classList.contains('react-flow__attribution') &&
                        !node.classList.contains('react-flow__background')
                    );
                }
                return true;
            },
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
    } finally {
        hiddenElements.forEach((el) => {
            const previousDisplay = previousDisplays.get(el);
            el.style.display = previousDisplay ?? '';
        });
        element.style.background = previousBackground;
    }
}
