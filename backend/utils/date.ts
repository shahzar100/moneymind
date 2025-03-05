export function parseDateFromCSV(dateStr: string): Date {
    const parts = dateStr && dateStr.split("/");

    if (!parts || parts.length !== 3) {
        return new Date(dateStr); // fallback if unexpected format
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JavaScript months are zero-indexed
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
}
