<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.substanceUse;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const alcoholFreq = [
		{ value: 'none', label: 'None' },
		{ value: 'occasional', label: 'Occasional' },
		{ value: 'regular', label: 'Regular' },
		{ value: 'daily', label: 'Daily' },
		{ value: 'dependent', label: 'Dependent' }
	];
</script>

<Fieldset legend="Substance Use">
	<p class="hint">Alcohol, drugs, tobacco, and gambling assessment.</p>

	<Field label="AUDIT Score (Alcohol Use Disorders Identification Test)" inputId="audit" description="0-7 low risk, 8-15 hazardous, 16-19 harmful, 20-40 possible dependence">
		<NumberInput id="audit" label="AUDIT score" min={0} max={40} bind:value={s.alcoholAuditScore} />
	</Field>

	<Field label="Alcohol Frequency" inputId="alcoholFreq">
		<Select id="alcoholFreq" label="Alcohol frequency" bind:value={s.alcoholFrequency}>
			<option value="">-- Select --</option>
			{#each alcoholFreq as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Illicit drug use?">
		<RadioGroup label="Drug use">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="drugUse" value={opt.value} bind:group={s.drugUse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.drugUse === 'yes'}
		<Field label="Drug Use Details" inputId="drugDetails">
			<TextAreaInput id="drugDetails" label="Drug details" rows={3} bind:value={s.drugDetails} />
		</Field>
	{/if}

	<Field label="Tobacco use?">
		<RadioGroup label="Tobacco use">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tobacco" value={opt.value} bind:group={s.tobaccoUse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.tobaccoUse === 'yes'}
		<Field label="Tobacco Details" inputId="tobaccoDetails">
			<TextAreaInput id="tobaccoDetails" label="Tobacco details" rows={3} bind:value={s.tobaccoDetails} />
		</Field>
	{/if}

	<Field label="Problem gambling?">
		<RadioGroup label="Problem gambling">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="gambling" value={opt.value} bind:group={s.gamblingProblem} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Withdrawal risk?">
		<RadioGroup label="Withdrawal risk">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="withdrawal" value={opt.value} bind:group={s.withdrawalRisk} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.withdrawalRisk === 'yes'}
		<Field label="Withdrawal Risk Details" inputId="withdrawalDetails">
			<TextAreaInput id="withdrawalDetails" label="Withdrawal details" rows={3} bind:value={s.withdrawalDetails} />
		</Field>
	{/if}
</Fieldset>
