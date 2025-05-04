# FURIA Chat

## Descrição

FURIA Chat é um **chat em tempo real** desenvolvido para os fãs do time de CS:GO da FURIA. Permite:

- Troca de mensagens instantâneas entre usuários  
- Simulação de torcida com comandos especiais (`/cheer`, `/vote`)  
- Mensagens automáticas “bot” personalizadas   

## Funcionalidades

- **Chat em tempo real**: mensagens enviadas aparecem instantaneamente em todas as abas/usuários  
- **Simulador de torcida**: comandos especiais reconhecidos no cliente (_ex.:_ `/cheer`, `/vote`, `1`, `2`)  
- **Mensagens automáticas**: o servidor ou bot podem enviar atualizações de jogo  
- **Estilização temática**: cores e branding FURIA, bolhas diferenciadas por tipo de mensagem  

## Tech Stack

- **Next.js** 15.3.1 (App Router)  
- **React** 19.x + **TypeScript** 5.x  
- **Socket.IO** 4.8.x (server e client)  
- **Tailwind CSS** 4.x  
- **ESLint** + `eslint-config-next`  


## Como usar

1. Abra o navegador e acesse `http://localhost:3000` (ou seu domínio de produção).  
2. Informe seu nome e confirme (caso tenha implementado autenticação).  
3. No campo de texto, digite:  
   - `/cheer` para ver a mensagem de torcida animada  
   - `/vote` para iniciar enquete (digite `1` para FURIA ou `2` para Team Liquid)  
   - Qualquer outro texto será enviado como mensagem normal no chat em tempo real  
4. Pressione **Enter** ou clique em **Enviar**.  
5. Observe as mensagens aparecerem instantaneamente em todas as abas/janelas.  
6. Para simular múltiplos usuários, abra outra aba ou navegador e repita o envio.  


---

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
