# Troubleshooting

This page provides structured resolution guidance for common technical issues encountered while using the BioRemPP Database Explorer.

---

## Scope

This guide covers:

- Explorer tables not loading or displaying incorrectly
- Search and filter not behaving as expected
- Entity detail pages failing or showing incomplete content
- Visualizations not rendering
- General browser and performance issues

**Out of scope:**

- Scientific interpretation of results (see [Interpretation Guide](interpretation-guide.md))
- Database download issues (see [Downloads](downloads.md))
- General usage questions (see [FAQ](../getting-started/faq.md))

---

## Explorer Table Issues

### Table not loading — blank or "Loading..." persists

**Symptoms:** The explorer table shows a persistent loading spinner or remains blank after several seconds.

**Checks:**

1. **JavaScript must be enabled** — the explorer tables are rendered by a React application and require JavaScript. Verify JavaScript is enabled in browser settings.
2. **Ad blockers or content blockers** may block API requests. Test in a private/incognito window to isolate extension interference.
3. **Network connectivity** — the explorer tables fetch data from the backend API. Verify your network connection is active.
4. **Backend availability** — if the application is running on an institutional server, the backend service may be temporarily unavailable. Contact your system administrator or check [Contact](../about/contact.md).

**Resolution steps:**

1. Refresh the page (`Ctrl+R` / `Cmd+R`)
2. Open browser developer tools (`F12`) → **Console tab** → check for network errors (`404`, `500`, `ERR_CONNECTION_REFUSED`)
3. Try in an incognito/private window without extensions
4. Try a different supported browser (Chrome, Firefox, Edge)

---

### Table loads but shows zero results

**Symptoms:** The table loads successfully but shows "0 results" or an empty state.

**Likely causes:**

1. **Active filters are too restrictive** — multiple filters combined with AND logic may return an empty intersection.
2. **Search term has no matching entities** — partial text search found no matches.
3. **Pathway Source filter (Pathways Explorer)** — the source toggle controls which database (KEGG or HADEG) is shown; if toggled to a source with no data, results appear empty.

**Resolution:**

1. Click **Clear Filters** to reset all active filter criteria
2. Clear the search bar text
3. In the Pathways Explorer, toggle the **Source** filter between KEGG and HADEG
4. Verify the search term — compound identifiers use KEGG CPD format (`C#####`); KO identifiers use format `K#####`

---

### Table columns appear truncated or misaligned

**Symptoms:** Column text is cut off or columns overlap.

**Checks:**

1. **Browser window too narrow** — expand the browser window to at least 1280px width
2. **Browser zoom level** — reset to 100% with `Ctrl+0` / `Cmd+0`
3. **Display scaling** — on Windows, system display scaling above 125% may affect table rendering

---

## Search and Filter Issues

### Search returns unexpected results

**Symptoms:** Results appear that do not seem to match the search term.

**Explanation:** Search performs **substring matching** — it returns all entities whose name or identifier contains the search term as a substring. For example, searching `"ene"` returns benzene, toluene, naphthalene, and any other compound containing those letters.

**For precise lookup:** Use a full compound identifier (e.g., `C00322`) rather than partial name text.

---

### Filter dropdown is empty or missing options

**Symptoms:** A filter dropdown shows no options or a very short list.

**Likely cause:** Dependent filter behavior. In the Toxicity Explorer, the **Label** filter depends on the **Endpoint** selection — if no Endpoint is selected, Label shows no options. Select an Endpoint first.

For the Compounds Explorer, the **Pathway** filter depends on the **Pathway Source** selection. Select a source (KEGG or HADEG) before the pathway list populates.

---

### Filters do not clear when clicking "Clear Filters"

**Symptoms:** After clicking Clear Filters, some filter values remain active.

**Note:** The **search bar** is independent from the filter panel. Clear Filters resets filter field values but does not clear the text in the search bar. Clear the search bar text separately.

---

## Entity Detail Page Issues

### Detail page shows blank content or partial load

**Symptoms:** The summary panel loads but tabs (Overview, Genes, Metadata) show blank content or loading spinners that do not resolve.

**Explanation:** Tab content is **lazy-loaded** — each tab fetches data independently when first accessed. A slow network connection or a temporary backend issue may cause individual tab loads to fail.

**Resolution:**

1. Click the tab again to re-trigger the load
2. Refresh the page and navigate back to the detail page
3. Check browser console for specific API error codes

---

### Navigating to a detail page returns "Not Found"

**Symptoms:** A detail page URL (e.g., `/compounds/C99999`) shows a "Not Found" or error page.

**Likely cause:** The entity identifier in the URL does not match any record in the current database version. KEGG CPD identifiers use the format `C#####` (5 digits); KO identifiers use `K#####`.

**Verify:** Navigate to the Compounds or Genes explorer, search for the entity, and click the row to ensure the correct URL is used.

---

### Genes tab in compound detail shows "No data"

**Symptoms:** The Genes tab in a compound detail page loads but shows an empty table.

**Likely cause:** The compound has no gene associations in the current database version. Some compounds have toxicity predictions and regulatory annotations but no linked KO entries. This is an expected database state, not an error.

---

## Visualization Issues

### Charts not displaying — blank panels

**Essential checks:**

1. **JavaScript enabled** — all visualizations require JavaScript
2. **Browser version** — use Chrome 90+, Firefox 88+, Edge 90+, or Safari 14+
3. **Browser zoom** — reset to 100%
4. **Extensions** — test in private/incognito mode

**Advanced troubleshooting:**

1. Open browser console (`F12`) → Console tab → look for JavaScript errors related to chart rendering
2. Try a different supported browser
3. Reload the page with cache cleared (`Ctrl+Shift+R` / `Cmd+Shift+R`)

---

### Charts render but labels overlap or are cut off

**Symptoms:** Chart axis labels, bar labels, or legend text overlaps or is truncated.

**Cause:** Chart dimensions are responsive to the browser window. Very small windows or non-standard zoom levels can cause layout crowding.

**Resolution:**

1. Maximize the browser window
2. Reset zoom to 100% (`Ctrl+0`)
3. Use hover tooltips — hovering over chart elements displays exact values in tooltips regardless of label visibility

---

### Toxicity heatmap is empty for a compound

**Symptoms:** The toxicity heatmap panel on a compound or gene detail page shows no data.

**Likely cause:** The compound has no ToxCSM predictions in the current database version. Not all compounds have toxicity prediction coverage. This is an expected database state.

---

## General Performance Issues

### Slow page load

**Recommended steps:**

1. Check your network connection (>5 Mbps recommended)
2. Close unused browser tabs to free memory
3. Clear browser cache: `Ctrl+Shift+Del` (Chrome/Firefox)
4. Disable browser extensions temporarily
5. Try during off-peak hours if the application is on a shared institutional server

---

### Page becomes unresponsive after repeated navigation

**Symptom:** The application slows or freezes after navigating through many explorer pages or detail pages.

**Resolution:**

1. Refresh the page (`Ctrl+R` / `Cmd+R`) — this resets the React application state without losing navigation context (the URL preserves your current location)
2. If on a low-memory device, limit concurrent browser tabs

---

## When to Contact Support

Contact the BioRemPP team if:

- A technical issue persists across multiple supported browsers and network connections
- An entity detail page consistently fails to load for a valid identifier
- Data displayed in the explorer appears inconsistent with what is documented in the [Database Schemas](../database-schemas/index.md)
- You suspect a database integrity issue

**When contacting support, provide:**

1. The specific route or URL where the issue occurs (e.g., `/compounds/C00322`)
2. Browser name and version
3. Operating system
4. Description of steps leading to the issue
5. Browser console output (`F12` → Console tab) if any errors are visible
6. Screenshot of the issue if relevant

**Contact:** [biorempp@gmail.com](mailto:biorempp@gmail.com) or [GitHub Issues](https://github.com/DougFelipe/biorempp_database_explorer/issues)

---

## Related Pages

- [Database Navigation](database-navigation.md) — routes and navigation structure
- [Explorer Pages](explorer-pages.md) — expected behavior of search, filters, and tables
- [Entity Detail Pages](entity-detail-pages.md) — expected content of detail page tabs
- [FAQ](../getting-started/faq.md) — common questions
- [Contact](../about/contact.md) — support and bug reports
