This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Docker e Variaveis de Ambiente

O endpoint do SIAT e configurado pela variavel `NEXT_PUBLIC_SIAT_API_BASE_URL`. Para desenvolvimento local, defina essa variavel no arquivo `.env`.

No Docker, a variavel precisa estar disponivel no build do Next.js e tambem no estagio `runner`. O Dockerfile usa o endpoint de producao como valor padrao.

### Build da imagem com endpoint personalizado

```bash
docker build \
	--build-arg NEXT_PUBLIC_SIAT_API_BASE_URL=https://exemplo.gov.br/api \
	-t siat-cgr:latest .
```

### Execucao do container com variaveis de runtime

```bash
docker run --rm -p 3000:3000 \
	-e NODE_ENV=production \
	-e PORT=3000 \
	siat-cgr:latest
```

### Como adicionar novas variaveis

1. Para variaveis publicas do Next.js (`NEXT_PUBLIC_*`), disponibilize-as no estagio `builder` e passe o valor no `docker build` com `--build-arg`.
2. Para variaveis necessarias durante a execucao do servidor, disponibilize-as tambem no estagio `runner` ou forneca no `docker run -e`.
