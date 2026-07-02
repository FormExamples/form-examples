<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const s = assessment.data.symptoms;
</script>

<Fieldset legend="Step 4 of 11 — Symptom burden">
	<p class="hint">
		MRC / mMRC dyspnoea grades and CAT score feed the symptom axis of the ABE group.
	</p>

	<Field
		label="MRC dyspnoea grade"
		inputId="symptoms-mrcGrade"
		description="MRC 1-5. Grade ≥ 3 is a pulmonary-rehabilitation trigger."
	>
		<NumberInput
			id="symptoms-mrcGrade"
			label="MRC dyspnoea grade"
			min={1}
			max={5}
			step={1}
			bind:value={s.mrcGrade}
		/>
	</Field>

	<Field
		label="mMRC dyspnoea grade"
		inputId="symptoms-mmrcGrade"
		description="mMRC 0-4. Grade ≥ 2 drives the high symptom axis."
	>
		<NumberInput
			id="symptoms-mmrcGrade"
			label="mMRC dyspnoea grade"
			min={0}
			max={4}
			step={1}
			bind:value={s.mmrcGrade}
		/>
	</Field>

	<Field
		label="COPD Assessment Test (CAT) total"
		inputId="symptoms-catScore"
		description="CAT 0-40. Score ≥ 10 drives the high symptom axis."
	>
		<NumberInput
			id="symptoms-catScore"
			label="COPD Assessment Test (CAT) total"
			min={0}
			max={40}
			step={1}
			bind:value={s.catScore}
		/>
	</Field>
</Fieldset>
