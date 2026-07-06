-- ═══════════════════════════════════════════════════════════════════════
--  DIAGNÓSTICO — corre isto primeiro, não altera nada.
--
--  Mostra, para cada email, todas as lojas (businesses) que existem para
--  esse owner_id, e qual loja está actualmente ligada à conta em
--  public.users. Serve para identificar:
--    a) qual business_id é a loja REAL (a que tem o slug que publicaste,
--       normalmente com status = 'active')
--    b) qual business_id é o rascunho órfão (status = 'onboarding', sem
--       produtos, criado por engano pelo bug)
-- ═══════════════════════════════════════════════════════════════════════

select
  au.email,
  b.id                as business_id,
  b.name              as business_name,
  b.slug,
  b.status,
  b.created_at,
  b.updated_at,
  (u.business_id = b.id) as "é_esta_a_liga_à_conta_agora"
from auth.users au
join public.businesses b on b.owner_id = au.id
left join public.users u on u.id = au.id
where au.email in ('nelsondzimba07@gmail.com', 'nelsonwilsonwork07@gmail.com')
  and b.deleted_at is null
order by au.email, b.created_at;
