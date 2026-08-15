<script lang="ts">
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { request } from '#lib/stores/request.svelte.js';
	import { calculateGrade } from '#lib/engine/grader.js';
	import {
		appropriatenessLabel,
		appropriatenessColor,
		triageTierLabel,
		triageTierColor,
		priorityLabel,
		priorityBandColor,
		recommendationLabel,
		recommendationColor
	} from '#lib/engine/utils.js';

	const d = request.data;

	// Live preview of the four-axis vetting grade as the request is edited.
	const preview = $derived(calculateGrade(d));
</script>

<Fieldset legend="8. Review and Submit">
	<p class="hint">Live four-axis vetting grade, safety flags, and the overall recommendation.</p>

	{#if preview.triageTier === 'emergency'}
		<Alert type="error" heading="Emergency triage">
			<p>
				This request contains an acute red flag. Arrange an emergency / inpatient echo now; do not
				wait for a routine clinic.
			</p>
		</Alert>
	{:else if preview.flags.length > 0}
		<Alert type="warning" heading="Flags raised">
			<p>This request has raised one or more safety or data-quality flags for the vetting desk.</p>
		</Alert>
	{/if}

	<div class="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis A — Appropriateness</div>
			<Badge
				label={appropriatenessLabel(preview.appropriatenessBand)}
				color={appropriatenessColor(preview.appropriatenessBand)}
			/>
			<div class="mt-1 text-xs text-base-content/60">Score {preview.appropriatenessScore}/9</div>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis B — Urgency</div>
			<Badge label={triageTierLabel(preview.triageTier)} color={triageTierColor(preview.triageTier)} />
			<div class="mt-1 text-xs text-base-content/60">{preview.targetTimeframe}</div>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis C — Completeness</div>
			<span class="text-lg font-bold text-base-content">{preview.completenessPercent}%</span>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis D — Clinical priority</div>
			<Badge label={priorityLabel(preview.priorityBand)} color={priorityBandColor(preview.priorityBand)} />
		</div>
	</div>

	<div class="my-4 rounded-lg border border-base-300 p-3">
		<div class="mb-1 text-xs font-semibold text-base-content/60">Overall recommendation</div>
		<Badge
			label={recommendationLabel(preview.recommendation)}
			color={recommendationColor(preview.recommendation)}
		/>
	</div>
</Fieldset>
