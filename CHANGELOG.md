# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with Next.js, TypeScript, Tailwind CSS, and Shadcn UI
- Prisma database integration
- Development standards and workflow documentation (AGENTS.md)
- GitHub repository "JUMBO-GO" created and initialized
- Initial commit with documentation files pushed to main branch
- Supabase integration (@supabase/supabase-js, @supabase/ssr)
- Supabase database schema (8 tables: users, vehicles, drivers, bookings, booking_locations, payments, reviews, notifications)
- Supabase RLS policies for security
- Supabase client utilities (client-side, server-side, admin)
- Auth utilities (sign up, sign in, sign out, verification code)
- Verification code system (แทน OTP)
- Google OAuth integration
- Seed data script for initial database population
- Documentation (SCREEN-INVENTORY, DESIGN-SYSTEM, DATABASE-SCHEMA, AI prompts)
- API routes (bookings, drivers)
- Supabase Realtime enabled (bookings, drivers, notifications)
- Supabase Storage policies (avatars, kyc-documents)

### Changed
- Migrated from Prisma + SQLite to Supabase PostgreSQL
- Changed OTP system to verification code system (ในระบบเอง)
- Removed DATABASE_URL from .env (เนื่องจากใช้ Supabase แล้ว)

### Deprecated
- Prisma database (ใช้ Supabase แทน)
- OTP SMS system (ใช้ verification code แทน)

### Removed
- DATABASE_URL from .env (เนื่องจากใช้ Supabase แล้ว)

### Fixed
- Added dotenv config to seed script for environment variables loading

### Security
- Added Google OAuth secrets to .env
- Configured RLS policies for all database tables
- Added environment variables for Supabase and Google OAuth