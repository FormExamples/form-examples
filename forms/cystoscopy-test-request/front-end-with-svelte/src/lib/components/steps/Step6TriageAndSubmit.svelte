<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { requestStore } from '#lib/stores/result.svelte.js';
	import { calculateGrade } from '#lib/engine/grader.js';
	import {
		appropriatenessLabel,
		appropriatenessColor,
		triageTierLabel,
		triageTierColor,
		riskBandLabel,
		riskBandColor,
		recommendationLabel,
		recommendationColor
	} from '#lib/engine/utils.js';

	const data = requestStore.data;
	const t = requestStore.data.triage;

	// Live preview of the four-axis vetting grade as the request is edited.
	const preview = $derived(calculateGrade(data));
</script>

<Fieldset legend="6. Triage and Submit">
	<p class="hint">Requested urgency and setting, plus a live four-axis vetting grade and recommendation.</p>

	<Field label="Requested urgency" inputId="urgency" required>
		<Select id="urgency" label="Requested urgency" bind:value={t.urgency} required>
			<option value="">Select…</option>
			<option value="routine">Routine</option>
			<option value="urgent">Urgent</option>
			<option value="two-week-wait">Two-week wait</option>
			<option value="emergency">Emergency</option>
		</Select>
	</Field>

	<Field label="Requested-by date" inputId="requestedByDate">
		<DateInput id="requestedByDate" label="Requested-by date" bind:value={t.requestedByDate} />
	</Field>

	<Field label="Care setting" inputId="setting">
		<Select id="setting" label="Care setting" bind:value={t.setting}>
			<option value="">Select…</option>
			<option value="outpatient">Outpatient</option>
			<option value="inpatient">Inpatient</option>
			<option value="community">Community</option>
			<option value="emergency">Emergency</option>
		</Select>
	</Field>

	{#if preview.triageTier === 'two-week-wait' || preview.twoWeekWaitEligible}
		<Alert type="warning" heading="Suspected-cancer two-week-wait">
			<p>
				This request meets a NICE NG12 suspected-cancer threshold. Book the cystoscopy on the
				two-week-wait pathway within 14 days.
			</p>
		</Alert>
	{/if}

	{#if preview.riskBand === 'high'}
		<Alert type="error" heading="High pre-procedure risk">
			<p>{preview.anticoagulantAction}</p>
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

	<Field label="Notes" inputId="notes">
		<TextAreaInput
			id="notes"
			label="Notes"
			rows={3}
			placeholder="Free-text notes accompanying the request…"
			bind:value={t.notes}
		/>
	</Field>
</Fieldset>
