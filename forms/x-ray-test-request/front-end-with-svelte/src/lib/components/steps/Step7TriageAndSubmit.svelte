<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { requestStore } from '$lib/stores/request.svelte';
	import { calculateGrade } from '$lib/engine/grader';
	import {
		appropriatenessLabel,
		appropriatenessColor,
		radiationSafetyLabel,
		radiationSafetyColor,
		radiationDoseLabel,
		radiationDoseColor,
		triageTierLabel,
		triageTierColor,
		recommendationLabel,
		recommendationColor
	} from '$lib/engine/utils';

	const d = requestStore.data.triage;

	// Live preview of the four-axis vetting grade as the request is edited.
	const preview = $derived(calculateGrade(requestStore.data));
</script>

<Fieldset legend="7. Triage and Submit">
	<p class="hint">Requested urgency and notes — submit to compute the four-axis grade and flags.</p>

	<Field label="Requested urgency" inputId="urgency" required>
		<Select id="urgency" label="Requested urgency" bind:value={d.urgency} required>
			<option value="">Select…</option>
			<option value="routine">Routine</option>
			<option value="urgent">Urgent</option>
			<option value="emergency">Emergency</option>
		</Select>
	</Field>

	<Field label="Notes" inputId="notes">
		<TextAreaInput
			id="notes"
			label="Notes"
			rows={3}
			placeholder="Free-text notes accompanying the request…"
			bind:value={d.notes}
		/>
	</Field>

	{#if preview.radiationSafetyBand === 'contraindicated'}
		<Alert type="error" heading="Contraindicated exposure">
			<p>
				A radiation-safety rule (e.g. a pregnancy with a moderate/high-dose region) has forced the
				contraindicated band. The exposure should not proceed without specialist justification.
			</p>
		</Alert>
	{:else if preview.triageTier === 'emergency'}
		<Alert type="warning" heading="Emergency triage">
			<p>This request has been auto-escalated to emergency triage; expedite the examination.</p>
		</Alert>
	{/if}

	<div class="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis A — Appropriateness</div>
			<Badge
				label={appropriatenessLabel(preview.appropriatenessBand)}
				color={appropriatenessColor(preview.appropriatenessBand)}
			/>
			<div class="mt-1 text-xs text-base-content/60">{preview.appropriatenessScore} / 9</div>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis B — Radiation safety</div>
			<Badge
				label={radiationSafetyLabel(preview.radiationSafetyBand)}
				color={radiationSafetyColor(preview.radiationSafetyBand)}
			/>
			{#if preview.radiationDoseBand}
				<span class="ml-1 inline-block">
					<Badge
						label={radiationDoseLabel(preview.radiationDoseBand)}
						color={radiationDoseColor(preview.radiationDoseBand)}
					/>
				</span>
			{/if}
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis C — Completeness</div>
			<span class="text-lg font-bold text-base-content">{preview.completenessPercent}%</span>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis D — Triage</div>
			<Badge label={triageTierLabel(preview.triageTier)} color={triageTierColor(preview.triageTier)} />
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
</Fieldset>
