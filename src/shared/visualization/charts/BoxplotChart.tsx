/**
 * @packageDocumentation
 *
 * Shared SVG boxplot chart with optional raw-point overlays for guided-analysis visualizations.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { GuidedBoxplotGroup } from '@/features/guided-analysis/types';

/**
 * Props accepted by the shared boxplot chart.
 */
interface BoxplotChartProps {
	/** Ordered boxplot groups to render. */
	groups: GuidedBoxplotGroup[];
	/** Message shown when the chart has no groups. */
	emptyMessage: string;
	/** Optional formatter used for axis-adjacent and tooltip numeric values. */
	valueFormatter?: (value: number) => string;
	/** Optional label shown above the chart for the y-axis metric. */
	yLabel?: string;
}

/**
 * Renders a responsive SVG boxplot chart with quartiles, whiskers, and optional point overlays.
 *
 * @param props Boxplot groups, empty-state message, and optional formatting controls.
 * @returns A responsive boxplot chart, or an empty-state message when no groups are available.
 *
 * @remarks
 * The component measures its container width with `ResizeObserver` when available so horizontal
 * spacing can scale with the number of groups while preserving a minimum readable width.
 */
export function BoxplotChart({
	groups,
	emptyMessage,
	valueFormatter = (value) => value.toFixed(3),
	yLabel,
}: BoxplotChartProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [containerWidth, setContainerWidth] = useState(0);
	const palette = useMemo(
		() => ['#6bc1c9', '#f2a1a1', '#f0d16d', '#e7d09f', '#cab9ea', '#99b7ef', '#9ddfbe', '#f3b37a'],
		[]
	);
	const ticks = useMemo(() => [1, 0.75, 0.5, 0.25, 0], []);

	useEffect(() => {
		const node = containerRef.current;
		if (!node) {
			return;
		}

		const measure = () => {
			setContainerWidth(Math.floor(node.clientWidth));
		};

		measure();

		if (typeof ResizeObserver === 'undefined') {
			return;
		}

		const observer = new ResizeObserver(() => {
			measure();
		});
		observer.observe(node);

		return () => {
			observer.disconnect();
		};
	}, []);

	if (groups.length === 0) {
		return <p className="text-sm text-gray-500">{emptyMessage}</p>;
	}

	const chartModel = useMemo(() => {
		const chartHeight = 340;
		const axisLeft = 46;
		const axisTop = 12;
		const axisBottom = 62;
		const axisHeight = chartHeight - axisTop - axisBottom;
		const minAxisWidth = Math.max(640, groups.length * 68);
		const horizontalPadding = 16;
		const availableAxisWidth = Math.max(0, containerWidth - axisLeft - 10 - horizontalPadding);
		const axisWidth = Math.max(minAxisWidth, availableAxisWidth);
		const svgWidth = axisLeft + axisWidth + 10;
		const svgHeight = chartHeight;

		const toY = (value: number) => axisTop + (1 - Math.max(0, Math.min(1, value))) * axisHeight;

		const tickRows = ticks.map((tick) => ({
			key: `tick-${tick}`,
			label: tick.toFixed(2),
			y: toY(tick),
		}));

		const groupRows = groups.map((group, idx) => {
			const spacing = axisWidth / Math.max(1, groups.length);
			const centerX = axisLeft + spacing * idx + spacing / 2;
			const boxWidth = Math.min(26, Math.max(12, spacing * 0.52));
			const color = palette[idx % palette.length];
			const pointValues = Array.isArray(group.points) ? group.points : [];
			const pointJitter = Math.max(3, boxWidth * 0.42);

			const points = pointValues.map((point, pointIdx) => {
				const phase = (pointIdx + 1) * 12.9898 + (idx + 1) * 78.233;
				const compoundLabel =
					point.compoundname && point.compoundname.trim() !== ''
						? `${point.cpd} (${point.compoundname})`
						: point.cpd;
				const endpointLabel = point.endpoint || 'selected endpoint';

				return {
					cx: centerX + Math.sin(phase) * pointJitter,
					cy: toY(point.toxicity_value),
					key: `${group.id}-pt-${pointIdx}`,
					tooltip: `${group.label} | ${compoundLabel} | ${endpointLabel}: ${valueFormatter(point.toxicity_value)}`,
				};
			});

			return {
				boxWidth,
				centerX,
				color,
				id: group.id,
				maxY: toY(group.max),
				medianY: toY(group.median),
				minY: toY(group.min),
				q1Y: toY(group.q1),
				q3Y: toY(group.q3),
				points,
				shortLabel: group.label.length > 12 ? `${group.label.slice(0, 12)}...` : group.label,
				tooltip: `${group.label} | n=${group.count} | min=${valueFormatter(group.min)} q1=${valueFormatter(group.q1)} median=${valueFormatter(group.median)} q3=${valueFormatter(group.q3)} max=${valueFormatter(group.max)}`,
			};
		});

		return {
			axisHeight,
			axisLeft,
			axisTop,
			groupRows,
			svgHeight,
			svgWidth,
			tickRows,
		};
	}, [containerWidth, groups, palette, ticks, valueFormatter]);

	return (
		<div className="space-y-3">
			{yLabel ? <p className="text-xs text-gray-600">{yLabel}</p> : null}

			<div ref={containerRef} className="overflow-x-auto rounded border border-gray-200 bg-white p-2">
				<svg
					role="img"
					aria-label="Boxplot chart"
					width={chartModel.svgWidth}
					height={chartModel.svgHeight}
					viewBox={`0 0 ${chartModel.svgWidth} ${chartModel.svgHeight}`}
				>
					{chartModel.tickRows.map((tick) => {
						return (
							<g key={tick.key}>
								<line x1={chartModel.axisLeft} x2={chartModel.svgWidth - 10} y1={tick.y} y2={tick.y} stroke="#e5e7eb" strokeWidth="1" />
								<text x={chartModel.axisLeft - 8} y={tick.y + 4} textAnchor="end" fontSize="10" fill="#6b7280">
									{tick.label}
								</text>
							</g>
						);
					})}

					<line x1={chartModel.axisLeft} x2={chartModel.axisLeft} y1={chartModel.axisTop} y2={chartModel.axisTop + chartModel.axisHeight} stroke="#9ca3af" strokeWidth="1.2" />
					<line
						x1={chartModel.axisLeft}
						x2={chartModel.svgWidth - 10}
						y1={chartModel.axisTop + chartModel.axisHeight}
						y2={chartModel.axisTop + chartModel.axisHeight}
						stroke="#9ca3af"
						strokeWidth="1.2"
					/>

					<text
						x={14}
						y={chartModel.axisTop + chartModel.axisHeight / 2}
						textAnchor="middle"
						transform={`rotate(-90 14 ${chartModel.axisTop + chartModel.axisHeight / 2})`}
						fontSize="11"
						fill="#374151"
					>
						Score
					</text>

					{chartModel.groupRows.map((group) => {
						return (
							<g key={group.id}>
								<title>{group.tooltip}</title>

								<line x1={group.centerX} x2={group.centerX} y1={group.maxY} y2={group.q3Y} stroke="#6b7280" strokeWidth="1.2" />
								<line x1={group.centerX} x2={group.centerX} y1={group.q1Y} y2={group.minY} stroke="#6b7280" strokeWidth="1.2" />

								<line x1={group.centerX - 8} x2={group.centerX + 8} y1={group.maxY} y2={group.maxY} stroke="#6b7280" strokeWidth="1.2" />
								<line x1={group.centerX - 8} x2={group.centerX + 8} y1={group.minY} y2={group.minY} stroke="#6b7280" strokeWidth="1.2" />

								<rect
									x={group.centerX - group.boxWidth / 2}
									y={group.q3Y}
									width={group.boxWidth}
									height={Math.max(1, group.q1Y - group.q3Y)}
									fill={group.color}
									fillOpacity="0.45"
									stroke={group.color}
									strokeWidth="1.3"
									rx="2"
								/>

								<line
									x1={group.centerX - group.boxWidth / 2}
									x2={group.centerX + group.boxWidth / 2}
									y1={group.medianY}
									y2={group.medianY}
									stroke="#374151"
									strokeWidth="1.5"
								/>

								{group.points.map((point) => {
									return (
										<circle
											key={point.key}
											cx={point.cx}
											cy={point.cy}
											r={2.2}
											fill={group.color}
											fillOpacity="0.6"
											stroke="#4b5563"
											strokeWidth="0.35"
										>
											<title>{point.tooltip}</title>
										</circle>
									);
								})}

								<text
									x={group.centerX}
									y={chartModel.axisTop + chartModel.axisHeight + 20}
									textAnchor="middle"
									fontSize="11"
									fill="#4b5563"
								>
									{group.shortLabel}
								</text>
							</g>
						);
					})}
				</svg>
			</div>

			<p className="text-[11px] text-gray-500">Classic boxplot with overlay points: whiskers (min/max), box (Q1-Q3), center line (median), dots (sampled data values).</p>
		</div>
	);
}
