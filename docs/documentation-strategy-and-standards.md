# Documentation Strategy and Standards

This documentation set combines authored pages in `docs/` with generated reference pages from the TypeScript codebase.

## Documentation Sources

- authored pages in `docs/`
- generated API reference in `docs/reference/source/generated/`
- generated release snippet in `docs/includes/app-release.md`

## Standards

- keep public release metadata centralized in `src/app/config/app-metadata.json`
- avoid hardcoding application release strings in individual Markdown pages
- keep dataset release metadata separate from application rollout metadata
- prefer generated or compiled outputs when the same value must appear in multiple documentation surfaces

## Build Flow

The documentation pipeline runs:

1. `npm run compile:app-metadata`
2. `npm run docs:reference`
3. `python -m mkdocs build -f mkdocs.yml --strict`

The release snippet is regenerated before TypeDoc and MkDocs so the documentation portal stays aligned with the current application release.
