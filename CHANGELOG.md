# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-09-23

### Added
- **Supabase Database Blueprint & Engineering Docs:**
  - `docs/requirements.md`: Comprehensive requirement analysis of all JUMBO GO UI pages, data fields, and entity relationships
  - `docs/architecture.md`: 3-tier architecture, complete ASCII ERD diagram, security model, and data flow
  - `docs/technical-spec.md`: Full PostgreSQL data contract, tables, constraints, RLS policies, and REST/TypeScript interfaces
  - `docs/tasks.md`: Tracer bullet tickets (T-001 to T-007) with DoD and testing gates
- **Supabase Production DDL & Seed Scripts:**
  - `supabase/schema.sql`: Production DDL with 13 tables (users, drivers, driver_kyc, vehicle_types, vehicles, bookings, booking_locations, job_timeline, payments, transactions, reviews, notifications, saved_locations, system_settings) and comprehensive RLS policies
  - `supabase/seed.sql`: Seed dataset matching all UI mockup entities (Somchai, Wandee, Somying, Isuzu D-Max, Hino 500, Revo Jumbo, jobs JG-2025-00108, transactions TXN-5021, and 24 role-based notifications)
- **Supabase Integration & Repository:**
  - `src/lib/supabase/client.ts`: Client-side singleton Supabase client
  - `src/lib/supabase/server.ts`: Server-side singleton Supabase client using Service Role
  - `src/lib/supabase/types.ts`: Comprehensive TypeScript database types
  - `src/lib/supabase/repository.ts`: Typed data access repository
- **Live Sync & Testing Script:**
  - `scripts/live-supabase-sync.ts`: Automated sync and validation script that created real auth accounts, verified foreign key constraints, and verified live database counts

### Changed
- Installed `@supabase/supabase-js` in `package.json`