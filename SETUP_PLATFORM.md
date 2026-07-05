# 🚀 Guia de Deploy — Plataforma SaaS

Este guia cobre a configuração de infraestrutura da plataforma, já migrada de
Firebase + Cloudinary para **Supabase** (Auth + Postgres + Storage).

---

## 1. Criar o projeto Supabase

1. Cria uma conta grátis em [supabase.com](https://supabase.com)
2. Cria um novo projeto (escolhe uma região próxima dos teus utilizadores)
3. **Project Settings → API** → copia o **Project URL** e a **anon public key**
4. Preenche no `.env.local` / Vercel:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=a-tua-anon-key
   ```

Sem isto configurado, a app corre em modo de desenvolvimento com um simulador
local (dados em memória) — não falha silenciosamente, mas nada é persistido.

---

## 2. Aplicar o schema e as políticas de segurança (RLS)

Todo o schema (tabelas do catálogo legado + tabelas da plataforma SaaS,
unificadas num único modelo relacionado por `business_id`) e as políticas
de Row Level Security estão em `supabase/migrations/`:

```bash
# Opção A — Supabase CLI (recomendado)
npx supabase login
npx supabase link --project-ref o-teu-project-ref
npx supabase db push

# Opção B — colar manualmente no SQL Editor do Dashboard
# (por esta ordem: 0001_schema.sql, depois 0002_storage.sql)
```

⚠️ **Passo manual obrigatório após aplicar `0001_schema.sql`:** o catálogo
legado ("Malambe & Moda") é criado pelo seed como um `business` com
`owner_id = null`, porque o utilizador de administração ainda não existe no
Supabase Auth nesse momento. Sem este passo, a política de RLS de escrita
nunca vai autorizar updates/inserts nas tabelas do catálogo:

1. **Supabase Dashboard → Authentication → Users → Add user** — cria o
   utilizador que vais usar para entrar no painel de admin (email + senha)
2. Copia o **UID** desse utilizador
3. No SQL Editor, corre:
   ```sql
   update public.businesses
   set owner_id = '<uid-copiado-no-passo-2>'
   where id = '11111111-1111-1111-1111-111111111111';
   ```

Nenhum índice composto adicional é necessário além dos já incluídos nas
migrations — todas as queries da plataforma filtram por `business_id`.

---

## 3. Storage (upload de imagens)

O upload de imagens (logo, banners, produtos, categorias, depoimentos) usa o
**Supabase Storage**, bucket `product-images` — substitui o Cloudinary usado
anteriormente. O bucket e as políticas de acesso já são criados pela migration
`0002_storage.sql`:

- Leitura pública (qualquer imagem do bucket é acessível por URL)
- Escrita apenas por utilizadores autenticados donos do respetivo negócio

Não há nenhuma variável de ambiente adicional para o storage — usa as mesmas
`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` do passo 1.

---

## 4. Deploy do frontend (Vercel)

Sem alterações — `vercel --prod` ou ligação ao GitHub. O `vercel.json`
existente trata do essencial para uma SPA multi-rota:

- Reescreve todos os caminhos para `index.html` (sem isto, `/painel` ou
  `/loja/bianca` dariam 404 ao atualizar a página)
- Cabeçalhos de segurança (`X-Frame-Options`, `nosniff`, etc.)
- Cache imutável para `/assets` e `/icons`

Lembra-te de configurar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (e
`VITE_APP_URL`) nas variáveis de ambiente do projeto na Vercel.

---

## 5. PWA por inquilino

Cada loja (`/loja/{slug}`) troca dinamicamente o `<link rel="manifest">` por
um manifesto gerado na hora (nome, logo, cor do tema, `start_url` a apontar
para essa loja específica) — implementado em `useStoreManifest`. Cada loja
pode ser instalada como a sua própria app, sem precisares de gerar manifestos
no servidor.

O botão "Instalar" aparece automaticamente no cabeçalho da loja quando o
browser suporta a instalação (Chrome/Edge/Android). No Safari/iOS, "Adicionar
ao ecrã principal" a partir do menu de partilha já funciona graças ao
manifesto e aos ícones.

O service worker (`public/sw.js`) cobre a app toda (cache-first para assets,
network-first para navegação).

---

## 6. SEO

**Automatizado**, por loja, via `useStoreMeta`:
- `<title>` e Open Graph (`og:title`, `og:description`, `og:image`)
- `<link rel="canonical">`
- JSON-LD (`schema.org/Store`) com nome, morada, telefone

`api/sitemap.xml.ts` é uma função serverless da Vercel que consulta as lojas
com `status: 'active'` no Supabase e gera o XML no próprio pedido, juntando as
URLs estáticas do sitemap original. Usa o mesmo par `VITE_SUPABASE_URL` /
`VITE_SUPABASE_ANON_KEY` do frontend (a tabela `businesses` já tem uma
política RLS de leitura pública, por isso não precisa de uma chave de
serviço à parte).

**Resiliência:** se o Supabase falhar por qualquer razão, a função não
rebenta — cai para as URLs estáticas e regista o erro (`api/sitemap.xml.test.ts`
cobre este caminho). Depois do deploy, confirma o caminho com dados reais:
```bash
curl https://o-teu-dominio.vercel.app/sitemap.xml
```

---

## 7. Segurança de dados — Row Level Security (Postgres)

As políticas RLS substituem o antigo `firestore.rules`/`storage.rules` e
estão definidas em `supabase/migrations/0001_schema.sql` (tabelas) e
`0002_storage.sql` (bucket de imagens):

- Catálogo legado (`products`, `banners`, `testimonials`, `promotions`,
  `legacy_categories`, `legacy_settings`): leitura pública, escrita só para
  utilizadores autenticados
- Plataforma SaaS (`businesses`, `store_products`, `store_categories`,
  `store_banners`, `store_testimonials`, `store_promotions`): leitura
  pública (para a loja pública `/loja/:slug`), escrita restrita ao dono do
  respetivo `business_id`
- `platform_users`: cada utilizador só lê/escreve o seu próprio perfil

Para verificar as políticas com dados reais, o mais fiável é testá-las
diretamente no SQL Editor do Supabase (`set role authenticated; set
request.jwt.claim.sub = '...';`) ou com um projeto de staging — este
ambiente de desenvolvimento não tem acesso de rede a um Supabase real para
correr esse tipo de teste de integração.

---

## 8. Testes automatizados

```bash
npm test          # corre a suite uma vez
npm run test:watch  # modo watch, durante o desenvolvimento
```

30 testes cobrindo lógica pura e o endpoint do sitemap:
- `slugify` — acentos, maiúsculas, caracteres especiais, espaços duplicados
- `filterAndSortProducts` — filtro por categoria, preço, pesquisa, e cada modo de ordenação
- Integridade dos dados — todo `BusinessType` tem etiqueta, todo `ThemeColor` tem cor válida
- `getCategoryIcon` — resolve ícones conhecidos e cai para o ícone padrão
- Um teste de componente (`PageHeader`) com `@testing-library/react`
- `api/sitemap.xml.ts` — caminho de resiliência (fallback quando o Supabase está inacessível)

---

## ✅ Checklist

- [x] `vercel.json` — rewrites SPA + headers
- [x] `.env.local` com `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
- [x] `supabase/migrations/0001_schema.sql` + `0002_storage.sql` aplicadas ao projeto
- [x] `robots.txt` atualizado (rotas privadas desautorizadas)
- [x] Manifesto PWA dinâmico por loja + botão de instalação
- [x] Meta tags, canonical e JSON-LD por loja
- [x] Sitemap dinâmico (`api/sitemap.xml.ts`) migrado para Supabase — caminho de resiliência testado, caminho com dados reais por confirmar em produção
- [x] 30 testes automatizados, `npm test` a passar
- [x] `tsc --noEmit` e `vite build` sem erros
- [ ] Confirmar em produção (com projeto Supabase real): login/signup, CRUD do painel, upload de imagens, loja pública por slug
