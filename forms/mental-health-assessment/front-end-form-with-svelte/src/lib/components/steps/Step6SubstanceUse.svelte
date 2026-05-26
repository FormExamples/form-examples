<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.substanceUse;
	const drugOptions = [
		{ value: 'never', label: 'Never' },
		{ value: 'past', label: 'In the past' },
		{ value: 'occasional', label: 'Occasionally' },
		{ value: 'regular', label: 'Regularly' }
	];
	const tobaccoOptions = [
		{ value: 'never', label: 'Never' },
		{ value: 'former', label: 'Former smoker' },
		{ value: 'current', label: 'Current smoker' }
	];
</script>

<Fieldset legend="Alcohol Use (AUDIT-C)">
	<Field label="How often do you have a drink containing alcohol?" inputId="alcoholFrequency">
		<Select id="alcoholFrequency" label="Alcohol frequency" bind:value={s.alcoholFrequency}>
			<option value="">-- Select --</option>
			<option value="never">Never</option>
			<option value="monthly-or-less">Monthly or less</option>
			<option value="2-4-per-month">2-4 times per month</option>
			<option value="2-3-per-week">2-3 times per week</option>
			<option value="4-or-more-per-week">4 or more times per week</option>
		</Select>
	</Field>

	{#if s.alcoholFrequency !== '' && s.alcoholFrequency !== 'never'}
		<Field label="How many standard drinks on a typical day when you are drinking?" inputId="alcoholQuantity">
			<Select id="alcoholQuantity" label="Alcohol quantity" bind:value={s.alcoholQuantity}>
				<option value="">-- Select --</option>
				<option value="1-2">1-2</option>
				<option value="3-4">3-4</option>
				<option value="5-6">5-6</option>
				<option value="7-9">7-9</option>
				<option value="10-or-more">10 or more</option>
			</Select>
		</Field>

		<Field label="How often do you have 6 or more drinks on one occasion?" inputId="bingeDrinking">
			<Select id="bingeDrinking" label="Binge drinking" bind:value={s.bingeDrinking}>
				<option value="">-- Select --</option>
				<option value="never">Never</option>
				<option value="less-than-monthly">Less than monthly</option>
				<option value="monthly">Monthly</option>
				<option value="weekly">Weekly</option>
				<option value="daily-or-almost">Daily or almost daily</option>
			</Select>
		</Field>
	{/if}
</Fieldset>

<Fieldset legend="Drug Use">
	<Field label="Do you use recreational or non-prescribed drugs?">
		<RadioGroup label="Drug use">
			{#each drugOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="drugUse" value={opt.value} bind:group={s.drugUse} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.drugUse !== '' && s.drugUse !== 'never'}
		<Field label="Please provide details (types, frequency)" inputId="drugDetails">
			<TextAreaInput id="drugDetails" label="Drug details" rows={3} bind:value={s.drugDetails} />
		</Field>
	{/if}
</Fieldset>

<Fieldset legend="Tobacco">
	<Field label="Do you use tobacco products?">
		<RadioGroup label="Tobacco use">
			{#each tobaccoOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="tobaccoUse" value={opt.value} bind:group={s.tobaccoUse} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.tobaccoUse === 'current' || s.tobaccoUse === 'former'}
		<Field label="Please provide details (amount, duration)" inputId="tobaccoDetails">
			<TextAreaInput id="tobaccoDetails" label="Tobacco details" rows={3} bind:value={s.tobaccoDetails} />
		</Field>
	{/if}
</Fieldset>
