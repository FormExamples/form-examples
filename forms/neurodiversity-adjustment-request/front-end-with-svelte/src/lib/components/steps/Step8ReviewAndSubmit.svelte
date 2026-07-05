<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { requestStore } from '$lib/stores/result.svelte';
	import { calculateGrade } from '$lib/engine/grader';
	import {
		eligibilityLabel,
		eligibilityColor,
		impactLabel,
		impactColor,
		priorityTierLabel,
		priorityTierColor,
		recommendationLabel,
		recommendationColor
	} from '$lib/engine/utils';

	const d = requestStore.data;

	// Live preview of the four-axis grade as the request is edited.
	const preview = $derived(calculateGrade(d));
</script>

<Fieldset legend="8. Review and Submit">
	<p class="hint">Live four-axis grade, compliance-and-wellbeing flags, and the overall recommendation.</p>

	{#if preview.impactBand === 'high-risk'}
		<Alert type="error" heading="High wellbeing risk">
			<p>
				This request reports a high wellbeing risk (absence / burnout risk or severe impact). Handle
				as a priority and respond without unreasonable delay.
			</p>
		</Alert>
	{:else if preview.eligibilityBand === 'likely-covered'}
		<Alert type="warning" heading="Disability duty likely engaged">
			<p>
				The Equality Act 2010 duty to make reasonable adjustments is likely engaged. Treat this as a
				formal request.
			</p>
		</Alert>
	{/if}

	<div class="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis A — Eligibility</div>
			<Badge
				label={eligibilityLabel(preview.eligibilityBand)}
				color={eligibilityColor(preview.eligibilityBand)}
			/>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis B — Impact / wellbeing</div>
			<Badge label={impactLabel(preview.impactBand)} color={impactColor(preview.impactBand)} />
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis C — Completeness</div>
			<span class="text-lg font-bold text-base-content">{preview.completenessPercent}%</span>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis D — Priority</div>
			<Badge label={priorityTierLabel(preview.priorityTier)} color={priorityTierColor(preview.priorityTier)} />
			<div class="mt-1 text-xs text-base-content/60">{preview.targetTimeframe}</div>
		</div>
	</div>

	<div class="my-4 rounded-lg border border-base-300 p-3">
		<div class="mb-1 text-xs font-semibold text-base-content/60">Overall recommendation</div>
		<Badge
			label={recommendationLabel(preview.recommendation)}
			color={recommendationColor(preview.recommendation)}
		/>
	</div>

	<Field label="Notes" inputId="notes">
		<TextAreaInput
			id="notes"
			label="Notes"
			rows={3}
			placeholder="Free-text notes accompanying the request…"
			bind:value={d.notes}
		/>
	</Field>
</Fieldset>
