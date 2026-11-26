-- Read-only checks after Lovable applies a reviewed migration. Not executed yet.
select tablename, rowsecurity from pg_tables where schemaname='public' order by tablename;
select tablename, policyname, roles, cmd from pg_policies where schemaname='public' order by tablename,policyname;
select table_name, privilege_type, grantee from information_schema.table_privileges where table_schema='public' and grantee in ('anon','authenticated') order by table_name,grantee,privilege_type;
select commission_bps,free_cancel_minutes,no_show_minutes,cancellation_fee_minor,absence_fee_minor from public.platform_settings;
-- Additional mandatory integration tests with two isolated test identities:
-- A cannot see B's private data; neither can assign roles, approve a driver,
-- change settings, write wallet entries or move ride state directly.
-- Verify column grants: own name only, own application only, status defaults pending.
-- Verify private storage access before adding document upload.
-- Privileged operations, accounting transaction and SMS verification remain to implement.
