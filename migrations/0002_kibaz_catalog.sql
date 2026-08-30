-- Public Kibaz catalog (places, shops, circle). Unowned on purpose — no
-- personal names, tickets, or carts. Collect tickets stay on-device until
-- sign-in exists.
create table if not exists kibaz_catalog (
  kind    text not null,
  id      text not null,
  payload jsonb not null,
  primary key (kind, id)
);

create index if not exists kibaz_catalog_kind_idx on kibaz_catalog (kind);
