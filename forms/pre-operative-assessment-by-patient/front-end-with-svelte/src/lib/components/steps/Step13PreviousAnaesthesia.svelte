<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const p = assessment.data.previousAnaesthesia;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Previous Anaesthesia">
	<p class="hint">Your experience with previous anaesthetics</p>
	<Field label="Have you had a general anaesthetic before?"><RadioGroup label="Have you had a general anaesthetic before?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="prevAnaes" value={opt.value} bind:group={p.previousAnaesthesia}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if p.previousAnaesthesia === 'yes'}
		<Field label="Were there any problems with the anaesthetic?"><RadioGroup label="Were there any problems with the anaesthetic?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="anaesProblems" value={opt.value} bind:group={p.anaesthesiaProblems}/> {opt.label}</label>{/each}</RadioGroup></Field>
		{#if p.anaesthesiaProblems === 'yes'}
			<Field label="Please describe the problems" inputId="anesProbDetails"><TextInput id="anesProbDetails" label="Please describe the problems" bind:value={p.anaesthesiaProblemDetails} /></Field>
		{/if}
	{/if}

	<Field label="Has anyone in your family had problems with anaesthesia (malignant hyperthermia)?"><RadioGroup label="Has anyone in your family had problems with anaesthesia (malignant hyperthermia)?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="mhHistory" value={opt.value} bind:group={p.familyMHHistory}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if p.familyMHHistory === 'yes'}
		<Field label="Please provide details" inputId="mhDetails"><TextInput id="mhDetails" label="Please provide details" bind:value={p.familyMHDetails} /></Field>
	{/if}

	<Field label="Do you suffer from severe nausea/vomiting after anaesthesia (PONV)?"><RadioGroup label="Do you suffer from severe nausea/vomiting after anaesthesia (PONV)?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="ponv" value={opt.value} bind:group={p.ponv}/> {opt.label}</label>{/each}</RadioGroup></Field>
</Fieldset>
