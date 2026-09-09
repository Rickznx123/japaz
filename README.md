# Japaz Sushi

Cardápio digital público e painel administrativo conectado ao Supabase.

## Configuração

1. Copie `.env.example` para `.env.local`.
2. Preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no projeto Supabase.
3. Execute as migrations em `supabase/migrations/0001_japaz_schema.sql` e `supabase/migrations/0002_seed_catalog.sql` pelo SQL Editor do Supabase.
4. Crie o usuário administrativo em **Authentication > Users**.
5. Adicione o mesmo UUID em `admin_profiles`:

```sql
insert into public.admin_profiles (id, display_name, role)
values ('UUID_DO_USUARIO', 'Equipe Japaz', 'admin');
```

6. Rode `npm run dev` e acesse `/admin/login`.

## Rotas

- `/festivais`: cardápio público, carregado do Supabase quando as variáveis estão presentes.
- `/admin/login`: autenticação Supabase Auth.
- `/admin`: dashboard.
- `/admin/landing`: conteúdo editável da landing.
- `/admin/festivais`: CRUD de festivais e preços numéricos.
- `/admin/festivais/[slug]/itens`: categorias e itens do festival.
- `/admin/categorias`: visão das categorias relacionadas.
- `/admin/imagens`: upload para Supabase Storage.

Sem variáveis do Supabase, a página pública usa o catálogo oficial local como fallback para desenvolvimento visual. O painel não grava dados nesse modo.
