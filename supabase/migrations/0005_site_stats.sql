-- ═══════════════════════════════════════════════════════════════════════
--  Estatísticas reais da homepage institucional (NexWin Connect)
--
--  A homepage deixou de mostrar números inventados. Em vez disso:
--    - "Lojas criadas"      -> count(*) em public.businesses
--    - "Produtos publicados" -> count(*) em public.products
--    - "Visualizações"       -> contador em public.site_stats, incrementado
--                               a cada visita à homepage e a cada novo
--                               registo (ver increment_page_view() abaixo)
--
--  page_views é incrementado através de uma função SECURITY DEFINER para
--  permitir que visitantes anónimos (sem sessão) aumentem o contador sem
--  precisarem de permissão de UPDATE direta na tabela.
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists public.site_stats (
  id          smallint primary key default 1,
  page_views  bigint not null default 0,
  updated_at  timestamptz not null default now(),
  constraint site_stats_singleton check (id = 1)
);

insert into public.site_stats (id, page_views)
values (1, 0)
on conflict (id) do nothing;

alter table public.site_stats enable row level security;

-- Qualquer pessoa pode LER o contador (mostrado publicamente na homepage).
drop policy if exists "site_stats_public_read" on public.site_stats;
create policy "site_stats_public_read" on public.site_stats
  for select using (true);

-- Ninguém escreve directamente na tabela — só através da função abaixo.
create or replace function public.increment_page_view()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count bigint;
begin
  update public.site_stats
  set page_views = page_views + 1,
      updated_at = now()
  where id = 1
  returning page_views into new_count;

  return new_count;
end;
$$;

grant execute on function public.increment_page_view() to anon, authenticated;
