export function normalizeHexColor(value?: string): string | null {
    if (!value) return null;
    const trimmed = value.trim();
    if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed)) {
        return null;
    }

    if (trimmed.length === 4) {
        const [_, r, g, b] = trimmed;
        return `#${r}${r}${g}${g}${b}${b}`;
    }

    return trimmed;
}

export function hexToRgba(hexColor: string, alpha: number): string {
    const normalized = normalizeHexColor(hexColor);
    if (!normalized) {
        return `rgba(124, 58, 237, ${alpha})`;
    }

    const r = parseInt(normalized.slice(1, 3), 16);
    const g = parseInt(normalized.slice(3, 5), 16);
    const b = parseInt(normalized.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getReadableTextColor(hexColor: string): string {
    const normalized = normalizeHexColor(hexColor);
    if (!normalized) return '#f8fafc';

    const r = parseInt(normalized.slice(1, 3), 16);
    const g = parseInt(normalized.slice(3, 5), 16);
    const b = parseInt(normalized.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? '#111827' : '#f8fafc';
}
