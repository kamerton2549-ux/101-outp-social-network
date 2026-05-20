CREATE TABLE IF NOT EXISTS t_p17442137_101_outp_social_netw.gallery_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS t_p17442137_101_outp_social_netw.gallery_photos (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES t_p17442137_101_outp_social_netw.gallery_categories(id),
    url TEXT NOT NULL,
    caption VARCHAR(300),
    uploaded_by VARCHAR(100) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS t_p17442137_101_outp_social_netw.member_photos (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES t_p17442137_101_outp_social_netw.members(id),
    url TEXT NOT NULL,
    caption VARCHAR(300),
    created_at TIMESTAMPTZ DEFAULT now()
);
