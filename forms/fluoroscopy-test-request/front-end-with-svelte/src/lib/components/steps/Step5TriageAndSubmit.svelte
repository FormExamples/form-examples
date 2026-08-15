<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { request } from '#lib/stores/request.svelte.js';
	import { calculateGrade } from '#lib/engine/grader.js';
	import {
		appropriatenessLabel,
		appropriatenessColor,
		safetyLabel,
		safetyColor,
		radiationDoseLabel,
		radiationDoseColor,
		triageTierLabel,
		triageTierColor,
		recommendationLabel,
		recommendationColor
	} from '#lib/engine/utils.js';

	const d = request.data.triage;

	// Live preview of the four-axis vetting grade as the request is edited.
	const preview = $derived(calculateGrade(request.data));
</script>

<Fieldset legend="5. Triage and Submit">
	<p class="hint">Requested urgency and setting, plus the live four-axis vetting grade.</p>

	<Field label="Requested urgency" inputId="urgency" required>
		<Select id="urgency" label="Requested urgency" bind:value={d.urgency} required>
			<option value="">Select…</option>
			<option value="routine">Routine</option>
			<option value="urgent">Urgent</option>
			<option value="emergency">Emergency</option>
		</Select>
	</Field>

	<Field label="Requested-by date" inputId="requestedByDate" description="Optional target date.">
		<DateInput id="requestedByDate" label="Requested-by date" bind:value={d.requestedByDate} />
	</Field>

	<Field label="Care setting" inputId="setting">
		<Select id="setting" label="Care setting" bind:value={d.setting}>
			<option value="">Select…</option>
			<option value="outpatient">Outpatient</option>
			<option value="inpatient">Inpatient</option>
			<option value="community">Community</option>
			<option value="emergency">Emergency</option>
		</Select>
	</Field>

	{#if preview.triageTier === 'emergency'}
		<Alert type="error" heading="Emergency triage">
			<p>This request escalates to emergency triage (e.g. suspected perforation). Expedite vetting.</p>
		</Alert>
	{:else if preview.safetyBand === 'contraindicated'}
		<Alert type="warning" heading="Safety contraindication">
			<p>
				This request fired a safety contraindication and will be referred back to the requester or
				redirected to a safer study.
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
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis B — Safety</div>
			<Badge label={safetyLabel(preview.safetyBand)} color={safetyColor(preview.safetyBand)} />
			<div class="mt-1">
				<Badge
					label={`Dose: ${radiationDoseLabel(preview.radiationDoseBand)}`}
					color={radiationDoseColor(preview.radiationDoseBand)}
				/>
			</div>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis C — Completeness</div>
			<span class="text-lg font-bold text-base-content">{preview.completenessPercent}%</span>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis D — Triage</div>
			<Badge
				label={triageTierLabel(preview.triageTier)}
				color={triageTierColor(preview.triageTier)}
			/>
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
