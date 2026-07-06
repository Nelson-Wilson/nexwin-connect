-- ═══════════════════════════════════════════════════════════════════════
--  CORRECÇÃO — liga cada conta à loja com status = 'active' mais recente
--  (a que passou pelo assistente de configuração e ficou publicada).
--
--  Corre isto depois de veres o resultado do diagnóstico e confirmares
--  que cada email só tem UMA loja com status = 'active'. Se um email
--  tiver mais do que uma loja 'active' ao mesmo tempo (não devia
--  acontecer, mas por segurança), este script escolhe sempre a mais
--  recentemente actualizada.
-- ═══════════════════════════════════════════════════════════════════════

with target as (
  select
    au.id as uid,
    b.id  as business_id,
    row_number() over (partition by au.id order by b.updated_at desc) as rn
  from auth.users au
  join public.businesses b
    on b.owner_id = au.id
   and b.status = 'active'
   and b.deleted_at is null
  where au.email in ('nelsondzimba07@gmail.com', 'nelsonwilsonwork07@gmail.com')
)
update public.users u
set business_id = t.business_id,
    updated_at  = now()
from target t
where u.id = t.uid
  and t.rn = 1
returning u.id, u.business_id, u.email;

-- ───────────────────────────────────────────────────────────────────────
-- Opcional — depois de confirmares no painel que tudo está certo, podes
-- arquivar (soft delete) os rascunhos órfãos que ficaram por trás,
-- para não aparecerem em lado nenhum. NÃO apaga nada de forma definitiva
-- — só marca deleted_at, exactamente como o resto da aplicação faz.
-- Descomenta e corre só quando tiveres confiança de que não precisas mais
-- desses rascunhos.
-- ───────────────────────────────────────────────────────────────────────

-- update public.businesses b
-- set deleted_at = now()
-- where b.owner_id in (
--   select id from auth.users
--   where email in ('nelsondzimba07@gmail.com', 'nelsonwilsonwork07@gmail.com')
-- )
-- and b.status = 'onboarding'
-- and b.deleted_at is null;
