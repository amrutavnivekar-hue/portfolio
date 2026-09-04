-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor
-- Adds: contact_submissions, visitor_logs, reply_templates, admin_settings
-- ============================================================

CREATE TABLE IF NOT EXISTS contact_submissions (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    message    TEXT NOT NULL,
    read       BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS visitor_logs (
    id         SERIAL PRIMARY KEY,
    path       VARCHAR(500) NOT NULL,
    referrer   VARCHAR(500),
    user_agent VARCHAR(500),
    ip         VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reply_templates (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    subject    VARCHAR(500) NOT NULL,
    body       TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Key-value store for admin settings (mail config etc.)
CREATE TABLE IF NOT EXISTS admin_settings (
    key        VARCHAR(255) PRIMARY KEY,
    value      TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_sub_created  ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created ON visitor_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_path    ON visitor_logs(path);
