<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { request } from '$lib/stores/request.svelte';
	import { calculateGrade } from '$lib/engine/grader';
	import {
		appropriatenessLabel,
		appropriatenessColor,
		consentLabel,
		consentColor,
		triageTierLabel,
		triageTierColor,
		recommendationLabel,
		recommendationColor
	} from '$lib/engine/utils';

	const d = request.data;

	// Live preview of the four-axis vetting grade as the request is edited.
	const preview = $derived(calculateGrade(d));
</script>

<Fieldset legend="6. Specimen and Triage">
	<p class="hint">
		The specimen, requested urgency, and care setting, then the live four-axis vetting grade.
	</p>

	<Field label="Specimen type" inputId="specimenType">
		<Select id="specimenType" label="Specimen type" bind:value={d.triage.specimenType}>
			<option value="">Select…</option>
			<option value="blood">Blood (EDTA)</option>
			<option value="saliva">Saliva</option>
			<option value="buccal">Buccal swab</option>
			<option value="tissue">Tissue</option>
			<option value="prenatal">Prenatal (amniotic fluid / CVS)</option>
			<option value="extracted-dna">Extracted DNA</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field
		label="Requested urgency"
		inputId="urgency"
		description="Prenatal requests are auto-escalated to urgent and treated as time-critical."
	>
		<Select id="urgency" label="Requested urgency" bind:value={d.triage.urgency}>
			<option value="">Select…</option>
			<option value="routine">Routine</option>
			<option value="urgent">Urgent</option>
		</Select>
	</Field>

	<Field label="Care setting" inputId="setting">
		<Select id="setting" label="Care setting" bind:value={d.triage.setting}>
			<option value="">Select…</option>
			<option value="clinical-genetics">Clinical genetics</option>
			<option value="oncology">Oncology / cancer genetics</option>
			<option value="paediatrics">Paediatrics</option>
			<option value="primary-care">Primary care / mainstreaming</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	{#if preview.consentCounsellingBand === 'not-met'}
		<Alert type="error" heading="Consent not met — blocking">
			<p>
				Predictive / presymptomatic testing without documented consent and counselling. The request
				will be rejected until both are recorded.
			</p>
		</Alert>
	{:else if preview.triageTier === 'urgent' && preview.targetTimeframe.startsWith('Time-critical')}
		<Alert type="warning" heading="Time-critical request">
			<p>This request is prenatal and time-critical; expedite specimen receipt and analysis.</p>
		</Alert>
	{/if}

	<div class="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis A — Appropriateness</div>
			<Badge
				label={appropriatenessLabel(preview.appropriatenessBand)}
				color={appropriatenessColor(preview.appropriatenessBand)}
			/>
			<div class="mt-1 text-xs text-base-content/60">Score {preview.appropriatenessScore} / 9</div>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis B — Consent</div>
			<Badge
				label={consentLabel(preview.consentCounsellingBand)}
				color={consentColor(preview.consentCounsellingBand)}
			/>
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
			bind:value={d.triage.notes}
		/>
	</Field>
</Fieldset>
