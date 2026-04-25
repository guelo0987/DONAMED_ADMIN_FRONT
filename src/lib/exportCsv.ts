function escapeCsvCell(cell: string): string {
    if (/[",\r\n]/.test(cell)) return `"${cell.replace(/"/g, '""')}"`;
    return cell;
}

/** Descarga un CSV con BOM UTF-8 para abrir bien en Excel. */
export function downloadCsv(filename: string, headers: string[], rows: string[][]): void {
    const lines = [
        headers.map(escapeCsvCell).join(","),
        ...rows.map((r) => r.map(escapeCsvCell).join(",")),
    ];
    const csv = `\uFEFF${lines.join("\n")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
