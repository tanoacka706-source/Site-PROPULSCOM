-- Propuls Com : schéma PostgreSQL (Supabase), issu du MCD du rapport (Merise).
-- À exécuter une fois dans Supabase > SQL Editor.

create table if not exists public.client (
  id_clie    bigint generated always as identity primary key,
  nom_clie   text not null,
  pren_clie  text not null,
  cont_clie  text not null unique,           -- téléphone normalisé (+225XXXXXXXXXX)
  email_clie text,
  ad_clie    text,
  created_at timestamptz not null default now()
);

create table if not exists public.modele (
  id_mod     bigint generated always as identity primary key,
  slug       text not null unique,           -- identifiant stable utilisé par le site
  nom_mod    text not null,
  categorie  text,
  ap_mod     text                            -- aperçu (chemin ou URL d'image)
);

create table if not exists public.infographe (
  id_info    bigint generated always as identity primary key,
  nom_info   text not null,
  pren_info  text not null,
  cont_info  text,
  ad_info    text
);

create table if not exists public.demande (
  num_dem         text primary key,          -- ex. PC-2610-K7M4
  stat_dem        text not null default 'recue'
                  check (stat_dem in ('recue', 'transmise', 'en_cours', 'terminee', 'annulee')),
  date_dem        date not null default current_date,
  created_at      timestamptz not null default now(),
  id_clie         bigint not null references public.client (id_clie),
  type_support    text not null,
  format_dem      text,
  style_dem       text,
  description_dem text not null,
  delai_souhaite  date
);

-- Association « inspirer » : une demande est inspirée d'un ou plusieurs modèles.
create table if not exists public.inspirer (
  num_dem text   not null references public.demande (num_dem) on delete cascade,
  id_mod  bigint not null references public.modele (id_mod),
  primary key (num_dem, id_mod)
);

-- Maquettes produites par les infographes pour une demande (utilisées par le futur espace de suivi).
create table if not exists public.maquette (
  mat_maq     text primary key,
  num_dem     text   not null references public.demande (num_dem) on delete cascade,
  id_info     bigint references public.infographe (id_info),
  vrs_maq     int    not null default 1,
  stat_maq    text   not null default 'envoyee'
              check (stat_maq in ('envoyee', 'validee', 'a_modifier')),
  fichier_url text,
  created_at  timestamptz not null default now()
);

create index if not exists demande_client_idx on public.demande (id_clie);
create index if not exists maquette_demande_idx on public.maquette (num_dem);

-- Sécurité : RLS activée sans aucune politique = aucun accès avec les clés publiques (anon / authenticated).
-- Seul le serveur du site, avec la clé service_role, lit et écrit dans ces tables.
alter table public.client      enable row level security;
alter table public.modele      enable row level security;
alter table public.infographe  enable row level security;
alter table public.demande     enable row level security;
alter table public.inspirer    enable row level security;
alter table public.maquette    enable row level security;

revoke all on public.client, public.modele, public.infographe,
              public.demande, public.inspirer, public.maquette from anon, authenticated;
