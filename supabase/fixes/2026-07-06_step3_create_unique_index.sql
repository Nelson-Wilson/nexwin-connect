-- Corre isto só depois do passo 2 ter resolvido as duplicadas.
create unique index if not exists businesses_owner_id_active_unique_idx
  on public.businesses (owner_id)
  where deleted_at is null;
