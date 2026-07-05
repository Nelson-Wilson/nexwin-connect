-- ═══════════════════════════════════════════════════════════════════════
--  Simplificação das políticas de storage (product-images) — tentativa 2
--
--  A correção anterior (TO authenticated + (select auth.uid())) não
--  resolveu, apesar de sessão/UID/businessId confirmados corretos em
--  runtime. Para eliminar de vez qualquer interação estranha entre a RLS
--  de storage.objects e a RLS de public.businesses (o EXISTS() fazia join
--  com essa tabela), esta versão remove essa dependência por completo:
--  o caminho do ficheiro passa a incluir o próprio auth.uid() do
--  utilizador (stores/{ownerId}/{businessId}/{contexto}/ficheiro), e a
--  política compara-o diretamente, sem nenhuma subquery a outra tabela.
-- ═══════════════════════════════════════════════════════════════════════

drop policy if exists "product_images_owner_write" on storage.objects;
drop policy if exists "product_images_owner_update" on storage.objects;
drop policy if exists "product_images_owner_delete" on storage.objects;

create policy "product_images_owner_write"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );

create policy "product_images_owner_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );

create policy "product_images_owner_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );
