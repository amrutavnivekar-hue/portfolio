# XML-First CMS Rollout

## Phase 1 - Foundation (Completed)
- Server-authenticated admin login with httpOnly cookie sessions.
- Middleware protection for `/admin/*` and `/api/admin/*`.
- RBAC-ready session model (`viewer`, `editor`, `admin`, `superadmin`).

## Phase 2 - Visual Content Editing (Completed)
- Section registry and dynamic field metadata in `lib/cms/registry.ts`.
- Dynamic section editor with autosave draft support.
- Section operations: edit, duplicate, delete, reorder.

## Phase 3 - Publishing + Preview (Completed)
- Draft/publish APIs and status tracking.
- Split editor + live preview panel with desktop/tablet/mobile toggles.

## Phase 4 - Governance (Completed)
- Revision snapshots for autosave/publish/restore actions.
- Activity log endpoint and history page.

## Backward Compatibility
- Existing public APIs remain intact for frontend rendering.
- XML remains source of truth for published content in `data/*.xml`.
- CMS draft data and metadata are isolated in `storage/cms/*`.

## Pilot Scope
- All existing XML sections are mapped through the CMS registry:
  `profile`, `experience`, `education`, `skills`, `certifications`, `projects`, `achievements`, `testimonials`, `contact`.
