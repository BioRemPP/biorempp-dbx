# Application Release Metadata

--8<-- "includes/app-release.md"

The public-facing application release is centralized in `src/app/config/app-metadata.json`.

## Source of Truth

This file is the canonical location for:

- brand title and short title used by the application shell
- public release stage such as `beta`
- semantic version used in the UI and documentation

## Current Consumers

The release metadata is propagated to:

- the React application header badge
- the application footer copy
- the browser document title
- the MkDocs portal through `docs/includes/app-release.md`

## Update Workflow

1. Edit `src/app/config/app-metadata.json`.
2. Run `npm run compile:configs` or any documentation command.
3. Verify the header, footer, and documentation pages render the updated release.

## Boundary With Dataset Versioning

Application release metadata is intentionally separate from dataset release metadata:

- app release: `src/app/config/app-metadata.json`
- download artifacts and Zenodo versions: `src/content/editorial/downloads/downloads.zenodo.yaml`
- database schema editorial source: `src/content/editorial/databases/*.yaml`
- database schema parsed catalog: `src/content/databases/catalog.ts`

This separation prevents UI rollout state such as `Beta 1.0.0` from being confused with data release identifiers such as `v1.0.0` or `v1.1.0`.
