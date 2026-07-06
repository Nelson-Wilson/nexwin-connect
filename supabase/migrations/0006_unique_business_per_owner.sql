-- ═══════════════════════════════════════════════════════════════════════
--  Bloqueio definitivo a "lojas duplicadas por conta"
--
--  Bug observado: em condições de rede lentas, o ensureProfile() do
--  AuthContext podia correr duas vezes em paralelo no primeiro login de
--  um utilizador (ver correcção em authService.subscribe), e cada
--  execução criava uma loja (businesses) nova. A última a terminar
--  "ganhava" e ficava associada ao utilizador (users.business_id), deixando
--  a loja que o utilizador realmente configurou/publicou órfã — ainda
--  acessível pelo link público (que só depende do slug), mas invisível no
--  painel, que passava a mostrar sempre o assistente de configuração.
--
--  Este índice único impede a raiz do problema: nunca mais do que uma
--  loja "viva" (não apagada) por proprietário. Se uma segunda tentativa
--  de criação acontecer, o INSERT falha com "duplicate key" e o código em
--  businessService.createDraftForOwner() passa a apanhar esse erro e
--  devolver a loja já existente, em vez de criar outra.
-- ═══════════════════════════════════════════════════════════════════════

create unique index if not exists businesses_owner_id_active_unique_idx
  on public.businesses (owner_id)
  where deleted_at is null;
