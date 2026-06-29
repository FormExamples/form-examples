<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const e = assessment.data.exceptionsConditions;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Exceptions & Conditions">
	<p class="hint">Circumstances where your treatment refusals would NOT apply</p>
	<div class="mb-4 rounded-lg border border-info/40 bg-info/10 p-4 text-sm text-info">
		<p class="font-semibold">Guidance</p>
		<p class="mt-1">You may wish to specify circumstances where your refusal of treatment does NOT apply. For example, you might refuse treatment in the case of advanced dementia but not in the case of a temporary illness from which you could recover.</p>
	</div>

	<Field label="Are there any circumstances where your treatment refusals would NOT apply?"><RadioGroup label="Are there any circumstances where your treatment refusals would NOT apply?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="hasExceptions" value={opt.value} bind:group={e.hasExceptions}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if e.hasExceptions === 'yes'}
		<Field label="Describe the exceptions" inputId="exceptionsDescription"><TextAreaInput id="exceptionsDescription" label="Describe the exceptions" rows={4} placeholder="Describe the circumstances in which your treatment refusals would NOT apply" bind:value={e.exceptionsDescription} /></Field>
	{/if}

	<Field label="Does this ADRT have any time limitations?"><RadioGroup label="Does this ADRT have any time limitations?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="hasTimeLimitations" value={opt.value} bind:group={e.hasTimeLimitations}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if e.hasTimeLimitations === 'yes'}
		<Field label="Time limitations" inputId="timeLimitationsDescription"><TextAreaInput id="timeLimitationsDescription" label="Time limitations" rows={3} placeholder="e.g. 'This ADRT is valid for 5 years from the date of signing'" bind:value={e.timeLimitationsDescription} /></Field>
	{/if}

	<Field label="Conditions that would invalidate this ADRT (optional)" inputId="invalidatingConditions"><TextAreaInput id="invalidatingConditions" label="Conditions that would invalidate this ADRT (optional)" rows={3} placeholder="e.g. 'This ADRT is invalidated if a new treatment becomes available for my condition'" bind:value={e.invalidatingConditions} /></Field>
</Fieldset>
