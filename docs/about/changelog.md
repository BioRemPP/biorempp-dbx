# Changelog

All notable changes to the BioRemPP DBX Service are documented in this file.

This changelog tracks the public application surface of the **BioRemPP Database Explorer**:
interface behavior, guided workflows, runtime delivery, and public documentation.
It does **not** replace the canonical version history of the BioRemPP database release,
which remains documented separately in the downloads, schema, and technical-information pages.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the application release stream follows a beta-first communication model until the
associated article is published.

---

## [1.0.0-beta] - 2026-06-17

##### First public beta release of the BioRemPP Database Explorer. The interface remains in beta until article publication, while the underlying database and citation artifacts continue to be versioned separately.

### Added

#### Application Shell and Navigation

- Centralized application release metadata driving the header badge, footer label, browser title, and public documentation release snippet.
- Dedicated public pages for **User Guide**, **Scientific Overview**, **Technical Information**, **Documentation**, **FAQ**, and database-specific schema/detail views.
- Subpath-aware navigation for institutional deployments under `/bioremppdbx/`.
- Shell-level maintenance and offline-aware status messaging for degraded runtime conditions.

#### Homepage and Editorial Surfaces

- YAML-driven homepage editorial content instead of hardcoded text blocks.
- Hero section with application framing, launch and citation actions, a structured scientific-overview callout, and a dedicated terms-of-use entry point.
- Database downloads organized around the runtime SQLite package, supporting release artifacts, and clearer Zenodo redirection/disclaimer messaging.
- Structured **Scope and Limitations** teaser connected to a richer interpretation modal.

#### Explorers and Detail Views

- Shared explorer scaffolds across the main entity-browsing surfaces to standardize filters, summary bars, tables, exports, and pagination behavior.
- Shared detail shells for entity pages, including consistent headers, tabs, status panels, metadata wrappers, and lazy tab loading.
- Compound detail navigation from associated genes into the canonical Gene / KO detail route using KO-backed links.
- Canonical external KEGG entry navigation from the compound structure card.

#### Guided Analysis

- **Eight public use cases (UC1-UC8)** spanning compound, pathway, and gene / KO questions.
- Guided runtime organized around dedicated executors and helper modules for ranking, pathway analysis, gene analysis, scatter views, parsing, response building, and option derivation.
- Use-case presentation with overview shells, interpretation framing, methods dialogs, and consistent visualization/output scaffolds.
- Guided execution behavior hardened for interactive filtering and auto-execution stability.

#### Documentation and Support Pages

- YAML-driven, route-aware FAQ centered on end users.
- Standalone **User Guide** page as a dedicated application route, separate from the functional Guided Analysis module.
- Standalone **Scientific Overview** page describing scientific foundations, FAIR framing, and interoperability concepts behind the DBX interface.
- Long-form **Terms of Use** and structured interpretation guidance rendered through reusable editorial surfaces.

#### Runtime, Deployment, and Delivery

- Production runtime stack based on **Node/Express + SQLite + NGINX**, aligned to the current `prod` profile.
- Environment-aware delivery for rate limits, KEGG image caching, and base-path behavior.
- Local production validation through proxy-backed health checks and Dockerized runtime delivery.
- Canonical subpath handling for both development and production-style access patterns.

#### Public Documentation and Release Framing

- MkDocs portal, README, support pages, and release-facing application docs aligned to the current DBX product framing.
- Published Read the Docs integration for public documentation access.
- Explicit distinction between:
  - **Beta 1.0.0** for the DBX application UI
  - **1.1.0** for the current canonical database release where technically applicable

### Beta Scope Notes

- This beta release represents the current public state of the DBX interface and documentation surface.
- Database release artifacts, schema pages, and technical-information pages remain the authoritative source for dataset-level versioning and provenance.
- DOI-linked software and database citations are available, but the application itself remains communicated as a beta interface until article publication.

### Support

- GitHub Issues: [BioRemPP Database Explorer Issues](https://github.com/BioRemPP/biorempp-dbx/issues)
- Email: biorempp@gmail.com

### Contributing

Contributions are welcome through the project repository, with preference for changes that preserve the current separation between application release metadata, editorial YAML sources, and canonical database-release documentation.

---

**Last Updated:** 2026-06-17
