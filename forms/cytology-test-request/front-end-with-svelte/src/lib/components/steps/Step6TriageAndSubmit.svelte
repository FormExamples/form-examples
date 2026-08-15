<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { request } from '#lib/stores/request.svelte.js';
	import { calculateGrade } from '#lib/engine/grader.js';
	import {
		appropriatenessLabel,
		appropriatenessColor,
		preanalyticalLabel,
		preanalyticalColor,
		triageTierLabel,
		triageTierColor,
		recommendationLabel,
		recommendationColor
	} from '#lib/engine/utils.js';

	const d = request.data;

	// Live preview of the four-axis vetting grade as the request is edited.
	const preview = $derived(calculateGrade(d));
</script>

<Fieldset legend="6. Triage and Submit">
	<p class="hint">
		Requested urgency, setting, and notes. Submit to compute the four-axis grade and flags.
	</p>

	<Field label="Requested urgency" inputId="urgency" required>
		<Select id="urgency" label="Requested urgency" bind:value={d.triage.urgency} required>
			<option value="">Select…</option>
			<option value="routine">Routine</option>
			<option value="urgent">Urgent</option>
			<option value="two-week-wait">Two-week-wait</option>
		</Select>
	</Field>

	<Field label="Requested-by date" inputId="requestedByDate">
		<DateInput id="requestedByDate" label="Requested-by date" bind:value={d.triage.requestedByDate} />
	</Field>

	<Field label="Care setting" inputId="setting">
		<Select id="setting" label="Care setting" bind:value={d.triage.setting}>
			<option value="">Select…</option>
			<option value="outpatient">Outpatient</option>
			<option value="inpatient">Inpatient</option>
			<option value="community">Community</option>
			<option value="emergency">Emergency</option>
		</Select>
	</Field>

	<Field label="Notes" inputId="notes">
		<TextAreaInput id="notes" label="Notes" rows={3} bind:value={d.triage.notes} />
	</Field>

	{#if preview.triageTier === 'two-week-wait'}
		<Alert type="error" heading="Two-week-wait pathway">
			<p>
				This request carries a suspected-cancer indication or a previous high-grade cytology result.
				Route on the NICE NG12 two-week-wait pathway; do not delay for routine booking.
			</p>
		</Alert>
	{/if}

	<div class="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis A — Appropriateness</div>
			<Badge
				label={appropriatenessLabel(preview.appropriatenessBand)}
				color={appropriatenessColor(preview.appropriatenessBand)}
			/>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis B — Specimen adequacy</div>
			<Badge
				label={preanalyticalLabel(preview.preanalyticalBand)}
				color={preanalyticalColor(preview.preanalyticalBand)}
			/>
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
