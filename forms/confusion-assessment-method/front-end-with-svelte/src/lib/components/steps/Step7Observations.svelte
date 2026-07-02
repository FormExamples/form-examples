<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCamGrade } from '$lib/engine/cam-grader';
	import { classificationLabel, classificationColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const o = assessment.data.observations;
	const grade = $derived(calculateCamGrade(assessment.data));
</script>

<Fieldset legend="Step 7 of 8 — Motoric subtype and observations">
	<p class="hint">
		Psychomotor subtype and additional observations. The live CAM classification updates below as
		the features are entered.
	</p>

	<Field
		label="Psychomotor (motoric) subtype"
		description="Hypoactive delirium is the most frequently missed and carries the worst prognosis."
		inputId="observations-motoricSubtype"
	>
		<Select
			id="observations-motoricSubtype"
			label="Psychomotor (motoric) subtype"
			bind:value={o.motoricSubtype}
		>
			<option value="">— Select —</option>
			<option value="hypoactive">Hypoactive (quiet, withdrawn, drowsy)</option>
			<option value="hyperactive">Hyperactive (restless, agitated)</option>
			<option value="mixed">Mixed</option>
			<option value="normal">Normal psychomotor activity</option>
		</Select>
	</Field>

	<Field label="Hallucinations observed">
		<label class="inline-flex items-center gap-2">
			<CheckboxInput
				id="observations-hallucinations"
				label="Hallucinations observed"
				bind:checked={o.hallucinations}
			/>
			<span class="text-sm text-base-content/80">Hallucinations observed</span>
		</label>
	</Field>

	<Field label="Delusions observed">
		<label class="inline-flex items-center gap-2">
			<CheckboxInput
				id="observations-delusions"
				label="Delusions observed"
				bind:checked={o.delusions}
			/>
			<span class="text-sm text-base-content/80">Delusions observed</span>
		</label>
	</Field>

	<Field label="Sleep-wake cycle disturbance observed">
		<label class="inline-flex items-center gap-2">
			<CheckboxInput
				id="observations-sleepWakeDisturbance"
				label="Sleep-wake cycle disturbance observed"
				bind:checked={o.sleepWakeDisturbance}
			/>
			<span class="text-sm text-base-content/80">Sleep-wake cycle disturbance observed</span>
		</label>
	</Field>

	<Field label="Recent deliriogenic medication (anticholinergic, benzodiazepine, opioid)">
		<label class="inline-flex items-center gap-2">
			<CheckboxInput
				id="observations-deliriogenicMedication"
				label="Recent deliriogenic medication"
				bind:checked={o.deliriogenicMedication}
			/>
			<span class="text-sm text-base-content/80"
				>Recent deliriogenic medication (anticholinergic, benzodiazepine, opioid)</span
			>
		</label>
	</Field>

	<Field label="Deliriogenic medication detail" inputId="observations-deliriogenicMedicationDetail">
		<TextAreaInput
			id="observations-deliriogenicMedicationDetail"
			label="Deliriogenic medication detail"
			rows={2}
			placeholder="Name the high-risk medication(s) recently started or increased."
			bind:value={o.deliriogenicMedicationDetail}
		/>
	</Field>

	<Field label="Live CAM classification">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {classificationColor(
					grade.classification
				)}"
			>
				{classificationLabel(grade.classification)}
			</span>
			<span class="text-sm text-base-content/70">
				{grade.positiveFeatures.length
					? `Positive features: ${grade.positiveFeatures.join(', ')}`
					: 'No positive features recorded yet.'}
			</span>
		</span>
	</Field>
</Fieldset>
