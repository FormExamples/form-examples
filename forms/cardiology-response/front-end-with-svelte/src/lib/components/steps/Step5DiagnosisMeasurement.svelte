<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Diagnosis & Measurement">
	<p class="hint">The diagnosis answering the referral question and the key LV ejection fraction.</p>

	<Field label="Primary diagnosis category" inputId="primaryDiagnosisCategory">
		<Select
			id="primaryDiagnosisCategory"
			label="Primary diagnosis category"
			bind:value={d.primaryDiagnosisCategory}
		>
			<option value="">Select…</option>
			<option value="coronary-artery-disease">Coronary artery disease</option>
			<option value="heart-failure">Heart failure</option>
			<option value="arrhythmia">Arrhythmia</option>
			<option value="valve-disease">Valve disease</option>
			<option value="hypertension">Hypertension</option>
			<option value="cardiomyopathy">Cardiomyopathy</option>
			<option value="non-cardiac">Non-cardiac</option>
			<option value="no-abnormality">No abnormality</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Diagnosis narrative" inputId="diagnosisNarrative">
		<TextAreaInput
			id="diagnosisNarrative"
			label="Diagnosis narrative"
			rows={4}
			placeholder="Narrative diagnosis answering the referral clinical question…"
			bind:value={d.diagnosisNarrative}
		/>
	</Field>

	<Field
		label="LV ejection fraction (%)"
		inputId="lvEjectionFractionPercent"
		description="Left-ventricular ejection fraction (0–100). LVEF < 40 % indicates HFrEF."
	>
		<NumberInput
			id="lvEjectionFractionPercent"
			label="LV ejection fraction (%)"
			min={0}
			max={100}
			step={0.1}
			bind:value={d.lvEjectionFractionPercent}
		/>
	</Field>
</Fieldset>
