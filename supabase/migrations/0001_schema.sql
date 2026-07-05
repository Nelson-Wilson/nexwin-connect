-- ═══════════════════════════════════════════════════════════════════════
--  Schema unificado — Plataforma SaaS de Catálogo Digital (Supabase/Postgres)
--
--  Substitui a versão anterior (0001_init.sql), que mantinha duas famílias
--  de tabelas em paralelo (catálogo legado single-tenant + tabelas "store_*"
--  multiempresa). Este ficheiro consolida tudo num único modelo
--  multiempresa: TODAS as tabelas de conteúdo relacionam-se com
--  `businesses` através de `business_id`, incluindo o catálogo que antes
--  era single-tenant.
--
--  Tabelas: businesses, users, categories, products, promotions,
--           testimonials, banners, settings
--
--  Convenções:
--   - Chaves primárias: uuid, geradas com gen_random_uuid()
--   - created_at / updated_at: timestamptz, updated_at mantido por trigger
--   - Soft delete: coluna deleted_at (timestamptz null) em todas as tabelas
--     de conteúdo — nunca se usa DELETE físico nestas tabelas a partir da
--     aplicação; usa-se UPDATE ... SET deleted_at = now()
--   - Índices: business_id em todas as tabelas-filho, mais índices parciais
--     "WHERE deleted_at IS NULL" para as queries do dia-a-dia (que só
--     olham para registos ativos)
-- ═══════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ───────────────────────────────────────────────────────────────────────
-- Função utilitária: mantém updated_at sempre atualizado em qualquer UPDATE
-- ───────────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ───────────────────────────────────────────────────────────────────────
-- 1) BUSINESSES — tabela raiz do multi-tenant
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.businesses (
  id              uuid primary key default gen_random_uuid(),
  -- Anulável: o negócio "Malambe & Moda" (catálogo legado) é gerido pelo
  -- login de administrador único, não por um dono self-service da SaaS.
  -- Depois de criares esse utilizador no Supabase Auth Dashboard, atualiza
  -- esta linha com o UID real (ver secção de seed, no fim do ficheiro) —
  -- sem isso, a política de RLS de escrita nunca permitirá updates.
  owner_id        uuid references auth.users(id) on delete cascade,
  name            text not null,
  slug            text not null,
  business_type   text not null default 'outros'
                  check (business_type in ('moda','restaurante','padaria','sorvetes','farmacia','papelaria','eletronicos','outros')),
  logo            text,
  banner          text,
  description     text,
  theme           text not null default 'azul'
                  check (theme in ('azul','verde','preto','roxo','vermelho')),
  primary_color   text,
  secondary_color text,
  whatsapp        text,
  instagram       text,
  facebook        text,
  email           text,
  address         text,
  status          text not null default 'onboarding' check (status in ('onboarding','active','suspended')),
  plan            text not null default 'free' check (plan in ('free','pro')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz
);

-- slug só precisa de ser único entre negócios ainda ativos
create unique index if not exists businesses_slug_active_uidx
  on public.businesses (slug) where deleted_at is null;
create index if not exists businesses_owner_id_idx on public.businesses (owner_id);
create index if not exists businesses_status_idx   on public.businesses (status) where deleted_at is null;
create index if not exists businesses_deleted_at_idx on public.businesses (deleted_at);

create trigger trg_businesses_updated_at
  before update on public.businesses
  for each row execute function public.set_updated_at();

-- ───────────────────────────────────────────────────────────────────────
-- 2) USERS — perfil de plataforma (1:1 com auth.users), ligado a um business
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  name        text not null,
  email       text not null,
  role        text not null default 'owner' check (role in ('owner','staff')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create index if not exists users_business_id_idx on public.users (business_id);
create index if not exists users_email_idx       on public.users (email);
create index if not exists users_deleted_at_idx  on public.users (deleted_at);

create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- ───────────────────────────────────────────────────────────────────────
-- 3) CATEGORIES
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name        text not null,
  icon        text,
  color       text,
  "order"     integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create index if not exists categories_business_id_idx on public.categories (business_id);
create index if not exists categories_active_idx
  on public.categories (business_id, "order") where deleted_at is null;
create index if not exists categories_deleted_at_idx on public.categories (deleted_at);

create trigger trg_categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ───────────────────────────────────────────────────────────────────────
-- 4) PRODUCTS
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  business_id     uuid not null references public.businesses(id) on delete cascade,
  name            text not null,
  -- Texto livre (não FK): cada negócio tem as suas próprias categorias em
  -- `categories.name`, e este campo referencia esse nome livremente — tal
  -- como já acontecia no modelo StoreProduct antes desta unificação.
  -- Não é FK para permitir filtrar/ordenar sem joins e para não partir se
  -- uma categoria for renomeada ou removida (o produto mantém o texto).
  category        text not null,
  subcategory     text,
  price           numeric(12,2) not null check (price >= 0),
  original_price  numeric(12,2) check (original_price >= 0),
  description     text,
  status          text not null default 'disponivel' check (status in ('disponivel', 'esgotado')),
  images          text[] not null default '{}',
  featured        boolean not null default false,
  bestseller      boolean not null default false,
  news            boolean not null default false,
  nutritional_info jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz
);

create index if not exists products_business_id_idx on public.products (business_id);
create index if not exists products_category_idx on public.products (business_id, category);
create index if not exists products_active_idx
  on public.products (business_id, created_at desc) where deleted_at is null;
create index if not exists products_featured_idx
  on public.products (business_id) where deleted_at is null and featured = true;
create index if not exists products_deleted_at_idx on public.products (deleted_at);

create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ───────────────────────────────────────────────────────────────────────
-- 5) PROMOTIONS
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.promotions (
  id            uuid primary key default gen_random_uuid(),
  business_id   uuid not null references public.businesses(id) on delete cascade,
  title         text not null,
  discount      text not null,
  description   text,
  banner_image  text,
  code          text,
  active        boolean not null default true,
  starts_at     timestamptz,
  ends_at       timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index if not exists promotions_business_id_idx on public.promotions (business_id);
create index if not exists promotions_active_idx
  on public.promotions (business_id) where deleted_at is null and active = true;
create index if not exists promotions_deleted_at_idx on public.promotions (deleted_at);

create trigger trg_promotions_updated_at
  before update on public.promotions
  for each row execute function public.set_updated_at();

-- ───────────────────────────────────────────────────────────────────────
-- 6) TESTIMONIALS
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name        text not null,
  role        text,
  comment     text not null,
  rating      smallint not null check (rating between 1 and 5),
  photo       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create index if not exists testimonials_business_id_idx on public.testimonials (business_id);
create index if not exists testimonials_active_idx
  on public.testimonials (business_id, created_at desc) where deleted_at is null;
create index if not exists testimonials_deleted_at_idx on public.testimonials (deleted_at);

create trigger trg_testimonials_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ───────────────────────────────────────────────────────────────────────
-- 7) BANNERS
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.banners (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  title       text not null,
  subtitle    text,
  image       text not null,
  link        text,
  active      boolean not null default true,
  "order"     integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create index if not exists banners_business_id_idx on public.banners (business_id);
create index if not exists banners_active_idx
  on public.banners (business_id, "order") where deleted_at is null and active = true;
create index if not exists banners_deleted_at_idx on public.banners (deleted_at);

create trigger trg_banners_updated_at
  before update on public.banners
  for each row execute function public.set_updated_at();

-- ───────────────────────────────────────────────────────────────────────
-- 8) SETTINGS — uma linha de configuração por negócio
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.settings (
  id                uuid primary key default gen_random_uuid(),
  business_id       uuid not null references public.businesses(id) on delete cascade,
  whatsapp_number   text,
  catalog_title     text,
  maintenance_mode  boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  deleted_at        timestamptz
);

-- Um negócio só pode ter uma linha de settings ativa
create unique index if not exists settings_business_id_active_uidx
  on public.settings (business_id) where deleted_at is null;
create index if not exists settings_deleted_at_idx on public.settings (deleted_at);

create trigger trg_settings_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
--  (não pedido explicitamente no enunciado, mas indispensável assim que
--  o anon key é exposto no frontend — sem isto, qualquer utilizador
--  autenticado conseguiria ler/escrever nos dados de OUTRO negócio)
-- ═══════════════════════════════════════════════════════════════════════

alter table public.businesses   enable row level security;
alter table public.users        enable row level security;
alter table public.categories   enable row level security;
alter table public.products     enable row level security;
alter table public.promotions   enable row level security;
alter table public.testimonials enable row level security;
alter table public.banners      enable row level security;
alter table public.settings     enable row level security;

-- businesses: leitura pública (loja pública por slug), escrita só pelo dono
create policy "businesses_public_read" on public.businesses
  for select using (deleted_at is null);
create policy "businesses_owner_write" on public.businesses
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- users: cada utilizador só vê/edita o seu próprio perfil
create policy "users_self_rw" on public.users
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Tabelas de conteúdo: leitura pública (montra da loja), escrita restrita
-- ao dono do business_id correspondente.
do $$
declare
  t text;
begin
  foreach t in array array['categories','products','promotions','testimonials','banners','settings']
  loop
    execute format(
      'create policy "%1$s_public_read" on public.%1$s for select using (deleted_at is null);', t
    );
    execute format(
      'create policy "%1$s_owner_write" on public.%1$s for all
         using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()))
         with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));',
      t
    );
  end loop;
end $$;

-- ═══════════════════════════════════════════════════════════════════════
--  SEED — catálogo legado como "apenas mais um negócio"
--
--  O catálogo single-tenant original ("Malambe & Moda", montado em "/")
--  passa a ser tratado como um `business` normal, com um id fixo e
--  conhecido, para que o código da aplicação (src/supabase/database.ts)
--  possa filtrar sempre por este `business_id`.
--
--  ⚠️ PASSO MANUAL PENDENTE: `owner_id` fica NULL neste seed porque o
--  utilizador de administração ainda não existe no Supabase Auth. Depois
--  de criares esse utilizador (Dashboard → Authentication → Users → Add
--  user, com o email/senha que o admin vai usar para entrar), corre:
--
--    update public.businesses
--    set owner_id = '<uid-do-utilizador-criado>'
--    where id = '11111111-1111-1111-1111-111111111111';
--
--  Sem este passo, a política de RLS de escrita nunca vai autorizar
--  updates/inserts nas tabelas do catálogo legado.
-- ═══════════════════════════════════════════════════════════════════════

insert into public.businesses (id, owner_id, name, slug, business_type, theme, status, plan)
values (
  '11111111-1111-1111-1111-111111111111',
  null,
  'Malambe & Moda',
  'malambe-e-moda',
  'moda',
  'azul',
  'active',
  'free'
)
on conflict (id) do nothing;

insert into public.categories (business_id, name, "order")
select '11111111-1111-1111-1111-111111111111', v.name, v.ord
from (values ('vestuario', 0), ('calcados', 1), ('sorvete', 2)) as v(name, ord)
where not exists (
  select 1 from public.categories c
  where c.business_id = '11111111-1111-1111-1111-111111111111'
    and c.name = v.name
    and c.deleted_at is null
);

insert into public.settings (business_id, whatsapp_number, catalog_title, maintenance_mode)
select '11111111-1111-1111-1111-111111111111', '+258866473065', 'Malambe & Moda', false
where not exists (
  select 1 from public.settings s
  where s.business_id = '11111111-1111-1111-1111-111111111111'
    and s.deleted_at is null
);
