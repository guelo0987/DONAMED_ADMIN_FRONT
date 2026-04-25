export type ParsedListSearch =
    | { kind: "cedula"; digits: string }
    | { kind: "text"; text: string };

/**
 * Si el término parece solo cédula (dígitos y separadores comunes), devuelve kind "cedula".
 * Así el listado puede usar endpoint por cédula o query `cedula=`.
 */
export function parseCedulaOrTextSearch(raw: string): ParsedListSearch {
    const t = raw.trim();
    if (!t) return { kind: "text", text: "" };
    const digits = t.replace(/\D/g, "");
    const onlyCedulaChars = /^[\d\-\s.]+$/.test(t);
    if (onlyCedulaChars && digits.length >= 7 && digits.length <= 14) {
        return { kind: "cedula", digits };
    }
    return { kind: "text", text: t };
}
