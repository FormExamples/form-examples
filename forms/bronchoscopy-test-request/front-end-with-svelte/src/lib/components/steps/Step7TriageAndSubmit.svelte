<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { requestStore } from '$lib/stores/result.svelte';
	import { calculateGrade } from '$lib/engine/grader';
	import {
		appropriatenessLabel,
		appropriatenessColor,
		triageTierLabel,
		triageTierColor,
		riskBandLabel,
		riskBandColor,
		recommendationLabel,
		recommendationColor
	} from '$lib/engine/utils';

	const d = requestStore.data.triage;

	// Live preview of the four-axis vetting grade as the request is edited.
	const preview = $derived(calculateGrade(requestStore.data));
</script>

<Fieldset legend="7. Triage and Submit">
	<p class="hint">The requested urgency, the requested-by date, and the care setting.</p>

	<Field
		label="Requested urgency"
		inputId="urgency"
		description="The engine may escalate this if a red flag is present, but will not lower it."
	>
		<Select id="urgency" label="Requested urgency" bind:value={d.urgency}>
			<option value="">Select…</option>
			<option value="routine">Routine</option>
			<option value="urgent">Urgent</option>
			<option value="two-week-wait">Two-week-wait</option>
			<option value="emergency">Emergency</option>
		</Select>
	</Field>

	<Field label="Requested-by date" inputId="requestedByDate" description="Date by which the procedure should be done.">
		<DateInput id="requestedByDate" label="Requested-by date" bind:value={d.requestedByDate} />
	</Field>

	<Field label="Care setting" inputId="setting">
		<Select id="setting" label="Care setting" bind:value={d.setting}>
			<option value="">Select…</option>
			<option value="outpatient">Outpatient</option>
			<option value="day-case">Day-case</option>
			<option value="inpatient">Inpatient</option>
			<option value="community">Community</option>
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

	<p class="hint mt-6">Live four-axis vetting grade, safety flags, and the overall recommendation.</p>

	{#if preview.triageTier === 'emergency'}
		<Alert type="error" heading="Emergency triage">
			<p>
				This request contains an emergency red flag (massive haemoptysis, instability, or stridor).
				Arrange immediate assessment; do not wait for routine booking.
			</p>
		</Alert>
	{:else if preview.triageTier === 'two-week-wait'}
		<Alert type="info" heading="Two-week-wait pathway">
			<p>This request meets NICE NG12 suspected-cancer criteria and has been placed on the two-week-wait pathway.</p>
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
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis B — Cancer-pathway urgency</div>
			<Badge label={triageTierLabel(preview.triageTier)} color={triageTierColor(preview.triageTier)} />
			<div class="mt-1 text-xs text-base-content/60">{preview.targetTimeframe}</div>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis C — Completeness</div>
			<span class="text-lg font-bold text-base-content">{preview.completenessPercent}%</span>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis D — Pre-procedure risk</div>
			<Badge label={riskBandLabel(preview.riskBand)} color={riskBandColor(preview.riskBand)} />
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
