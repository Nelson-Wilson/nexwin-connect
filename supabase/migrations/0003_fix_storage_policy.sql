-- ═══════════════════════════════════════════════════════════════════════
--  Correção das políticas de storage (product-images)
--
--  Diagnóstico: sessão, UID e business_id foram confirmados corretos em
--  runtime (logs de debug), mas o INSERT continuava a falhar com "new row
--  violates row-level security policy". As políticas antigas validavam a
--  role via `auth.role() = 'authenticated'` dentro do WITH CHECK, sem a
--  cláusula `TO authenticated`. A documentação atual do Supabase usa
--  sempre `TO authenticated` explícito nos exemplos de storage, e
--  recomenda `(select auth.uid())` em vez de `auth.uid()` direto. Esta
--  migration recria as políticas de escrita seguindo exatamente esse
--  padrão.
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
    and exists (
      select 1 from public.businesses b
      where b.id::text = (storage.foldername(name))[2]
        and b.owner_id = (select auth.uid())
    )
  );

create policy "product_images_owner_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and exists (
      select 1 from public.businesses b
      where b.id::text = (storage.foldername(name))[2]
        and b.owner_id = (select auth.uid())
    )
  );

create policy "product_images_owner_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and exists (
      select 1 from public.businesses b
      where b.id::text = (storage.foldername(name))[2]
        and b.owner_id = (select auth.uid())
    )
  );
