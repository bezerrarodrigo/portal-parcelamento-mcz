import axios from 'axios';

// Cliente usado apenas no servidor (route handlers) para chamar o SIAT diretamente.
// Permite sobrescrever a URL base por ambiente (ex: homologação) via env var.
export const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_SIAT_API_BASE_URL ??
    'https://siat-r.campogrande.ms.gov.br/dsf_cgr_gtm/api',
  timeout: 15000,
});

// Cliente usado no navegador para chamar as rotas internas do Next.js,
// que fazem o proxy para o SIAT e evitam erro de CORS.
export const internalApiClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
});
