# Supabase SQL Schema for Marketing AI Assistant

This folder contains the SQL schema for the Supabase tables used by the app.

## Tables
- `tasks`
- `content_posts`
- `approval_items`
- `campaign_events`
- `leads`
- `ads_reports`

## How to apply
1. Open Supabase Studio.
2. Go to Database > SQL editor.
3. Paste the contents of `schema.sql`.
4. Run the script.

## Notes
- All tables use `text` primary keys and timestamp audit columns.
- `hashtags` and `warnings` are stored as `text[]` arrays.
- `row level security` is enabled by default.
