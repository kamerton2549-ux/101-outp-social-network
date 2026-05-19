CREATE TABLE t_p17442137_101_outp_social_netw.members (
  id          SERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),

  -- Личные данные
  full_name   VARCHAR(200) NOT NULL,
  birth_year  SMALLINT,
  hometown    VARCHAR(200),
  email       VARCHAR(200),
  phone       VARCHAR(50),

  -- Служебные данные
  rank        VARCHAR(100),
  years_from  SMALLINT,
  years_to    SMALLINT,
  battalion   VARCHAR(50),
  company     VARCHAR(100),
  role        VARCHAR(150),
  tanks       TEXT[],
  location    VARCHAR(100) DEFAULT 'Дрезден',

  -- Доп. информация
  awards      TEXT,
  bio         TEXT,
  photo_url   TEXT,

  -- Статус модерации
  status      VARCHAR(20) DEFAULT 'pending'
);

CREATE INDEX ON t_p17442137_101_outp_social_netw.members (status);
CREATE INDEX ON t_p17442137_101_outp_social_netw.members (battalion);
CREATE INDEX ON t_p17442137_101_outp_social_netw.members (years_from, years_to);
