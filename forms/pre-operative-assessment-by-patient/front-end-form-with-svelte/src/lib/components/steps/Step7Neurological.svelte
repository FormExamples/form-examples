<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const n = assessment.data.neurological;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Neurological">
	<p class="hint">Brain and nerve conditions</p>
	<Field label="Have you had a stroke or TIA (mini-stroke)?"><RadioGroup label="Have you had a stroke or TIA (mini-stroke)?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="stroke" value={opt.value} bind:group={n.strokeOrTIA}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if n.strokeOrTIA === 'yes'}
		<Field label="Please provide details (when, residual effects)" inputId="strokeDetails"><TextInput id="strokeDetails" label="Please provide details (when, residual effects)" bind:value={n.strokeDetails} /></Field>
	{/if}

	<Field label="Do you have epilepsy?"><RadioGroup label="Do you have epilepsy?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="epilepsy" value={opt.value} bind:group={n.epilepsy}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if n.epilepsy === 'yes'}
		<Field label="Is your epilepsy well controlled?" required><RadioGroup label="Is your epilepsy well controlled?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="epilepsyCtrl" value={opt.value} bind:group={n.epilepsyControlled} required/> {opt.label}</label>{/each}</RadioGroup></Field>
	{/if}

	<Field label="Do you have any neuromuscular disease (e.g. MS, MND, myasthenia)?"><RadioGroup label="Do you have any neuromuscular disease (e.g. MS, MND, myasthenia)?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="neuromusc" value={opt.value} bind:group={n.neuromuscularDisease}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if n.neuromuscularDisease === 'yes'}
		<Field label="Please provide details" inputId="neuroDetails"><TextInput id="neuroDetails" label="Please provide details" bind:value={n.neuromuscularDetails} /></Field>
	{/if}

	<Field label="Do you have raised intracranial pressure?"><RadioGroup label="Do you have raised intracranial pressure?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="icp" value={opt.value} bind:group={n.raisedICP}/> {opt.label}</label>{/each}</RadioGroup></Field>
</Fieldset>
