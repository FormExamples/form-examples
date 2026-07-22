<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const p = assessment.data.pregnancy;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Pregnancy">
	<p class="hint">This section applies to females of childbearing age</p>
	<Field label="Is there any possibility you could be pregnant?"><RadioGroup label="Is there any possibility you could be pregnant?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="possPregnant" value={opt.value} bind:group={p.possiblyPregnant}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if p.possiblyPregnant === 'yes'}
		<Field label="Has pregnancy been confirmed?"><RadioGroup label="Has pregnancy been confirmed?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="pregConfirmed" value={opt.value} bind:group={p.pregnancyConfirmed}/> {opt.label}</label>{/each}</RadioGroup></Field>
		{#if p.pregnancyConfirmed === 'yes'}
			<NumberInput label="Gestation" name="gestWeeks" bind:value={p.gestationWeeks} unit="weeks" min={1} max={42} />
		{/if}
	{/if}

	<Field label="Do you take contraceptive pills, HRT, or use oestrogen gel/coil?"><RadioGroup label="Do you take contraceptive pills, HRT, or use oestrogen gel/coil?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="contraceptiveHrt" value={opt.value} bind:group={p.contraceptiveOrHrtUse}/> {opt.label}</label>{/each}</RadioGroup></Field>
	<Field label="Date of your last menstrual period" inputId="lmp"><DateInput id="lmp" label="Date of your last menstrual period" bind:value={p.lastMenstrualPeriod} /></Field>
</Fieldset>
