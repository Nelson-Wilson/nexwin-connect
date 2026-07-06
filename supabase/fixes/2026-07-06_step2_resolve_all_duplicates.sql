-- ═══════════════════════════════════════════════════════════════════════
--  Resolve TODAS as duplicações de uma vez:
--   1) Para cada owner_id com mais de uma loja viva, escolhe a "melhor"
--      (status = 'active' tem prioridade; se houver mais que uma active,
--      ou nenhuma, escolhe a mais recentemente actualizada).
--   2) Liga public.users.business_id a essa loja escolhida.
--   3) Arquiva (soft delete) todas as outras lojas desse owner.
--
--  Corre os três blocos por ordem, um a seguir ao outro.
-- ═══════════════════════════════════════════════════════════════════════

-- 1) e 2): escolher a loja certa por owner e relinkar a conta
with ranked as (
  select
    b.id,
    b.owner_id,
    row_number() over (
      partition by b.owner_id
      order by (b.status = 'active') desc, b.updated_at desc
    ) as rn
  from public.businesses b
  where b.deleted_at is null
),
kept as (
  select owner_id, id as business_id
  from ranked
  where rn = 1
)
update public.users u
set business_id = k.business_id,
    updated_at  = now()
from kept k
where u.id = k.owner_id
  and u.business_id is distinct from k.business_id
returning u.id, u.email, u.business_id;

-- 3) arquivar (soft delete) todas as lojas que NÃO foram escolhidas
with ranked as (
  select
    b.id,
    b.owner_id,
    row_number() over (
      partition by b.owner_id
      order by (b.status = 'active') desc, b.updated_at desc
    ) as rn
  from public.businesses b
  where b.deleted_at is null
)
update public.businesses b
set deleted_at = now()
from ranked r
where b.id = r.id
  and r.rn > 1
returning b.id, b.owner_id, b.slug, b.status;
