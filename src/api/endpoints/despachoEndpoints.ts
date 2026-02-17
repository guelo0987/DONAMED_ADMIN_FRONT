export const DESPACHO_ENDPOINTS = {
    despachos: "/admin/despachos",
    despachoById: (id: number) => `/admin/despachos/${id}`,
} as const;
