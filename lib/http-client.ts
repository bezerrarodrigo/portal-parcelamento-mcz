import axios from 'axios';

// Permite sobrescrever a URL base por ambiente (ex: homologação) via env var.
export const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_SIAT_API_BASE_URL ??
    'https://siat-r.campogrande.ms.gov.br/dsf_cgr_gtm/api',
  timeout: 15000,
});
