<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

	const h = assessment.data.hepatic;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Hepatic">
	<p class="hint">Liver conditions</p>
	<Field label="Do you have liver disease?"><RadioGroup label="Do you have liver disease?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="liver" value={opt.value} bind:group={h.liverDisease}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if h.liverDisease === 'yes'}
		<Field label="Do you have cirrhosis?"><RadioGroup label="Do you have cirrhosis?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="cirrhosis" value={opt.value} bind:group={h.cirrhosis}/> {opt.label}</label>{/each}</RadioGroup></Field>
		{#if h.cirrhosis === 'yes'}
			<Field label="Child-Pugh Score" required inputId="childPugh"><Select id="childPugh" label="Child-Pugh Score" required bind:value={h.childPughScore}><option value="">-- Select --</option>{#each [
					{ value: 'A', label: 'A - Well compensated' },
					{ value: 'B', label: 'B - Significant compromise' },
					{ value: 'C', label: 'C - Decompensated' }
				] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
		{/if}
	{/if}

	<Field label="Do you have hepatitis?"><RadioGroup label="Do you have hepatitis?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="hepatitis" value={opt.value} bind:group={h.hepatitis}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if h.hepatitis === 'yes'}
		<Field label="Type (e.g. A, B, C)" inputId="hepType"><TextInput id="hepType" label="Type (e.g. A, B, C)" bind:value={h.hepatitisType} /></Field>
	{/if}
</Fieldset>
