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

O `Dockerfile` foi padronizado para aceitar variaveis futuras com pares `ARG` + `ENV` nos estagios `builder` e `runner`.

- `NEXT_PUBLIC_*`: afeta o frontend do Next.js e precisa estar disponivel no build.
- Variaveis server-side: podem ficar apenas no estagio `runner`.

### Build da imagem com variavel publica

```bash
docker build \
	--build-arg NEXT_PUBLIC_BASE_URL=https://exemplo.gov.br \
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

1. Adicione `ARG NOME_DA_VARIAVEL` no estagio necessario.
2. Adicione `ENV NOME_DA_VARIAVEL=${NOME_DA_VARIAVEL}` no mesmo estagio.
3. Passe o valor no `docker build` com `--build-arg` quando for necessario no build.
4. Para variaveis apenas de runtime, forneca no `docker run -e`.
