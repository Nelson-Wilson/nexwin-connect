-- ═══════════════════════════════════════════════════════════════════════
--  Lista TODOS os proprietários com mais de uma loja "viva"
--  (deleted_at is null) — não só os dois emails já reportados. O erro que
--  apareceu ao criar o índice único confirma que há pelo menos um caso;
--  isto mostra se há outros.
-- ═══════════════════════════════════════════════════════════════════════

select
  au.email,
  b.id           as business_id,
  b.name         as business_name,
  b.slug,
  b.status,
  b.created_at,
  b.updated_at
from public.businesses b
join auth.users au on au.id = b.owner_id
where b.deleted_at is null
  and b.owner_id in (
    select owner_id
    from public.businesses
    where deleted_at is null
    group by owner_id
    having count(*) > 1
  )
order by au.email, b.updated_at desc;
