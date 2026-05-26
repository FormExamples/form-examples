<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.cognitiveScreen;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Cognitive Screen">
	<p class="hint">Cognitive function assessment including MMSE/MoCA, orientation, memory, and delirium risk.</p>

	<Field label="MMSE Score" inputId="mmseScore"><NumberInput id="mmseScore" label="MMSE Score" min={0} max={30} bind:value={c.mmseScore} /></Field>
	<Field label="MoCA Score" inputId="mocaScore"><NumberInput id="mocaScore" label="MoCA Score" min={0} max={30} bind:value={c.mocaScore} /></Field>

	<Field label="Is orientation intact (person, place, time)?">
		<RadioGroup label="Orientation intact">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="orientation" value={opt.value} bind:group={c.orientationIntact} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	<Field label="Is there any memory impairment?">
		<RadioGroup label="Memory impairment">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="memoryImpairment" value={opt.value} bind:group={c.memoryImpairment} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	<Field label="Is there any executive function impairment?">
		<RadioGroup label="Executive function impairment">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="execFunction" value={opt.value} bind:group={c.executiveFunctionImpairment} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	<Field label="Is there a risk of delirium?">
		<RadioGroup label="Delirium risk">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="deliriumRisk" value={opt.value} bind:group={c.deliriumRisk} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>

	<Field label="Overall Cognitive Status" required inputId="cognitiveStatus">
		<Select id="cognitiveStatus" label="Overall Cognitive Status" required bind:value={c.cognitiveStatus}>
			<option value="">-- Select --</option>
			<option value="normal">Normal</option>
			<option value="mild-impairment">Mild Cognitive Impairment</option>
			<option value="moderate-impairment">Moderate Cognitive Impairment</option>
			<option value="severe-impairment">Severe Cognitive Impairment</option>
		</Select>
	</Field>
</Fieldset>
