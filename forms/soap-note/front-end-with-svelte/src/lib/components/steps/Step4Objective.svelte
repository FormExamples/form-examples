<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const o = assessment.data.objective;
</script>

<Fieldset legend="Step 4 of 7 — Objective (O)">
	<p class="hint">
		Examination findings, vital signs, and investigation results. Any one satisfies the Objective
		section.
	</p>

	<Field label="Examination findings" inputId="objective-examinationFindings">
		<TextAreaInput
			id="objective-examinationFindings"
			label="Examination findings"
			rows={3}
			placeholder="Relevant examination findings."
			bind:value={o.examinationFindings}
		/>
	</Field>

	<Field label="Vital signs" inputId="objective-vitalSigns">
		<TextAreaInput
			id="objective-vitalSigns"
			label="Vital signs"
			rows={2}
			placeholder="e.g. HR 96, BP 148/92, RR 20, SpO2 97%, Temp 37.1C"
			bind:value={o.vitalSigns}
		/>
	</Field>

	<Field
		label="Abnormal vital signs present?"
		description="Yes raises a flag if abnormal vitals are not addressed in the Assessment or Plan."
		inputId="objective-abnormalVitalsPresent"
	>
		<Select
			id="objective-abnormalVitalsPresent"
			label="Abnormal vital signs present?"
			bind:value={o.abnormalVitalsPresent}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Investigation results" inputId="objective-investigationResults">
		<TextAreaInput
			id="objective-investigationResults"
			label="Investigation results"
			rows={2}
			placeholder="e.g. ECG, bloods, imaging, point-of-care tests."
			bind:value={o.investigationResults}
		/>
	</Field>
</Fieldset>
