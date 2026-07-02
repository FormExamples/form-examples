<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.diagnosis;
</script>

<Fieldset legend="Step 2 of 11 — Diagnosis and history">
	<p class="hint">Year of diagnosis, spirometric confirmation, and exposure history.</p>

	<Field label="Year of COPD diagnosis" inputId="diagnosis-diagnosisYear">
		<NumberInput
			id="diagnosis-diagnosisYear"
			label="Year of COPD diagnosis"
			min={1950}
			max={2100}
			step={1}
			placeholder="e.g. 2016"
			bind:value={d.diagnosisYear}
		/>
	</Field>

	<Field
		label="Diagnosis confirmed on spirometry (post-bronchodilator FEV₁/FVC &lt; 0.70)?"
		inputId="diagnosis-spirometryConfirmed"
	>
		<Select
			id="diagnosis-spirometryConfirmed"
			label="Diagnosis confirmed on spirometry"
			bind:value={d.spirometryConfirmed}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Occupational / environmental exposures" inputId="diagnosis-exposureNotes">
		<TextAreaInput
			id="diagnosis-exposureNotes"
			label="Occupational / environmental exposures"
			rows={2}
			placeholder="e.g. lifetime tobacco, coal dust, biomass smoke, occupational fumes."
			bind:value={d.exposureNotes}
		/>
	</Field>
</Fieldset>
