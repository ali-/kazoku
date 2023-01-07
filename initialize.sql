CREATE TABLE users (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid uuid UNIQUE,
    email character varying(50) UNIQUE,
    password character varying(64),
    firstname character varying(30),
    lastname character varying(30),
    birthday date,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
CREATE UNIQUE INDEX users_pkey ON users(id int4_ops);
CREATE UNIQUE INDEX users_uuid_key ON users(uuid uuid_ops);
CREATE UNIQUE INDEX users_email_key ON users(email text_ops);


CREATE TABLE albums (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid uuid UNIQUE,
    user_id integer REFERENCES users(id),
    title character varying(50),
    private boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
CREATE UNIQUE INDEX albums_pkey ON albums(id int4_ops);
CREATE UNIQUE INDEX albums_uuid_key ON albums(uuid uuid_ops);


CREATE TABLE photos (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid uuid UNIQUE,
    user_id integer REFERENCES users(id),
    album_id integer,
    date date,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
CREATE UNIQUE INDEX photos_pkey ON photos(id int4_ops);
CREATE UNIQUE INDEX photos_uuid_key ON photos(uuid uuid_ops);

CREATE TABLE photo_favorites (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id integer REFERENCES users(id),
    photo_id integer REFERENCES photos(id),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
CREATE UNIQUE INDEX photo_favorites_pkey ON photo_favorites(id int4_ops);

CREATE TABLE photo_comments (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id integer REFERENCES users(id),
    photo_id integer REFERENCES photos(id),
    comment character varying(300),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
CREATE UNIQUE INDEX photo_comments_pkey ON photo_comments(id int4_ops);


CREATE TABLE threads (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id integer REFERENCES users(id),
    title character varying(50),
    content text,
    locked boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
CREATE UNIQUE INDEX threads_pkey ON threads(id int4_ops);

CREATE TABLE thread_favorites (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id integer REFERENCES users(id),
    thread_id integer REFERENCES threads(id),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
CREATE UNIQUE INDEX thread_favorites_pkey ON thread_favorites(id int4_ops);

CREATE TABLE thread_posts (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id integer REFERENCES users(id),
    thread_id integer REFERENCES threads(id),
    content text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
CREATE UNIQUE INDEX thread_posts_pkey ON thread_posts(id int4_ops);


CREATE TABLE session (
    sid character varying PRIMARY KEY,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);
CREATE UNIQUE INDEX session_pkey ON session(sid text_ops);
CREATE INDEX "IDX_session_expire" ON session(expire timestamp_ops);
