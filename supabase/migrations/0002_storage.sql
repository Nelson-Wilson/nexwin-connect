-- ═══════════════════════════════════════════════════════════════════════
--  Supabase Storage — bucket para imagens de produtos (substitui Cloudinary)
--  Aplicado na Fase 3 do plano de migração, criado já agora para não haver
--  dependências cruzadas entre fases.
-- ═══════════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 10485760, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;

-- Leitura pública de qualquer imagem (equivalente a "allow read: if true" no storage.rules atual)
create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Escrita: apenas utilizadores autenticados, e apenas dentro da pasta
-- correspondente ao seu próprio businessId — path esperado (uniforme para
-- todos os negócios, incluindo o catálogo legado desde a unificação do
-- schema): stores/{businessId}/{context}/{ficheiro}
create policy "product_images_owner_write"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
    and exists (
      select 1 from public.businesses b
      where b.id::text = (storage.foldername(name))[2]
        and b.owner_id = auth.uid()
    )
  );

create policy "product_images_owner_update"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

create policy "product_images_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );
