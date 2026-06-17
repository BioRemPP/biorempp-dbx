# Output Interpretation

This page adapts the interpretation guidance of the older Web Service to the current Database Explorer context. Guided Analysis outputs are generated from the integrated BioRemPP database itself, not from user-uploaded samples, so the scientific framing must remain database-oriented and cautious.

## What Guided Outputs Represent

Guided outputs summarize relationships present in the current integrated database snapshot.

They may represent:

- annotation breadth across compounds, pathways, or genes
- predicted toxicity values retrieved from `toxicity_endpoint`
- regulatory-reference coverage derived from curated reference mappings
- pathway- or gene-level aggregates built from deduplicated relationship tables

They do not directly represent:

- measured biodegradation rates
- gene expression or enzyme activity in situ
- experimental toxicity outcomes
- jurisdiction-specific compliance decisions

## How to Read the Main UI Elements

### Summary cards

Summary cards condense the active scope and the primary metric used by the selected query. They should be read as scope descriptors for the current filtered run, not as release-wide totals unless the query is unfiltered.

### Execution metadata

The line under the query title can show:

- dataset identifier
- execution time in milliseconds
- threshold basis
- explicit x and y thresholds for scatter-oriented use cases

This metadata is especially important for UC3 because quadrant interpretation depends on the threshold basis.

### Tables

Guided tables are the main drill-down surface.

- values reflect the active filter scope
- rankings are query-specific
- pagination limits what is visible on a single page
- row clicks may route to compound, pathway, or gene detail views depending on the query

### Description and methods dialogs

The `View Use Case Description` accordion and `View Methods` modal provide the intended scientific framing for the current query. They should be read alongside the numeric outputs, not treated as optional decoration.

## Reading the Current Visualization Types

### Horizontal bar charts

Current use:

- UC1
- UC4
- UC5
- UC6
- UC7
- UC8

How to read them:

- longer bars indicate higher values for the ranking metric
- bar order is more important than color in the current implementation
- interpret them as comparative rankings within the active scope

### Heatmap matrices

Current use:

- UC2
- UC6

How to read them:

- color intensity maps the numeric toxicity value from lower to higher predictions
- endpoint headers are grouped by toxicity domain
- UC2 is compound-oriented, while UC6 is pathway-oriented
- blank or pale cells usually indicate missing or low values, not biological absence

### Scatter quadrant plot

Current use:

- UC3 only

How to read it:

- x-axis: `gene_count` on linear or `log10(gene_count + 1)` scale
- y-axis: selected toxicity metric
- point size: `pathway_count`
- point color: compound class
- threshold lines: currently computed from the filtered `P75` context

The top-right quadrant is the priority region returned in the UC3 table, but it is still a relative region defined by the current filters.

### Boxplots

Current use:

- UC8 only

How to read them:

- whiskers: minimum and maximum observed toxicity values
- box: first to third quartile
- center line: median
- overlay points: sampled underlying compound values

In UC8 the boxplot is page-scoped in the client so it stays aligned with the genes visible on the current table page.

## What Patterns May Suggest

- high annotation counts may suggest broader integrated evidence coverage
- high predicted-toxicity values may support prioritization for closer review
- pathway or gene concentration around toxic compounds may indicate useful follow-up targets for mechanism-oriented investigation
- regulatory-reference density may highlight compounds with broader curation attention

These are exploratory signals, not confirmations.

## What Should Not Be Inferred

- A high rank does not prove biodegradation efficacy.
- A high toxicity score does not confirm real-world toxicological outcome.
- A regulatory annotation does not, by itself, define current compliance status in a given jurisdiction.
- A missing annotation does not prove biological absence or safety.
- Cross-query comparisons are not automatically comparable unless the scope, endpoint context, and metric basis are also comparable.

## Suggested Downstream Validation

Guided Analysis is best used as the first stage of a broader validation workflow.

1. Confirm the relevant compound, pathway, or gene relationships in the corresponding explorer detail pages.
2. Compare the finding against source-specific context such as KEGG, HADEG, or regulatory annotations.
3. Review the primary literature or curated evidence for the top-ranked entities.
4. Where the question is biological, use experimental assays or orthogonal omics evidence before drawing mechanistic conclusions.
5. Where the question is toxicological, use domain-appropriate experimental or validated regulatory evidence before using the result in decision-making.

## Related Pages

- [Guided Analysis Overview](index.md)
- [Filters and Parameters](filters-and-parameters.md)
- [Query Recipes](query-recipes.md)
- [Visualizations Overview](../visualizations/index.md)
- [Toxicity Explorer](../explorers/toxicity.md)
- [Compounds Explorer](../explorers/compounds.md)
