<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { agePoints } from '$lib/engine/rockall-rules';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const p = assessment.data.identification;
	const point = $derived(agePoints(assessment.data));
</script>

<Fieldset legend="Step 2 of 6 — Patient identification">
	<p class="hint">
		Local identifier, age, and sex. The Rockall score applies to adults (&ge; 16 years) with acute
		upper GI bleeding. Age bands: &lt; 60 &rarr; 0, 60-79 &rarr; 1, &ge; 80 &rarr; 2.
	</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. ED-100482 or hospital MRN"
			required
			bind:value={p.patientIdentifier}
		/>
	</Field>

	<Field label="Age (years)" inputId="identification-ageYears">
		<NumberInput
			id="identification-ageYears"
			label="Age in years"
			min={0}
			max={120}
			step={1}
			bind:value={p.ageYears}
		/>
	</Field>

	<Field label="Age parameter points">
		<strong class="text-lg text-base-content">{point} pt</strong>
	</Field>

	<Field label="Sex" required inputId="identification-sex">
		<Select id="identification-sex" label="Sex" required bind:value={p.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>
</Fieldset>
