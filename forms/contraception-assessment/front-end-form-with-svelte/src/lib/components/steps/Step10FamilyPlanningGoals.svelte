<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const f = assessment.data.familyPlanningGoals;

	const desireOptions = [
		{ value: 'yes-soon', label: 'Yes, soon' },
		{ value: 'yes-future', label: 'Yes, in the future' },
		{ value: 'unsure', label: 'Unsure' },
		{ value: 'no', label: 'No' }
	];

	const partnerOptions = [
		{ value: 'involved', label: 'Partner involved in decision' },
		{ value: 'not-involved', label: 'Making decision independently' },
		{ value: 'not-applicable', label: 'Not applicable' }
	];
</script>

<Fieldset legend="Family Planning Goals">
	<p class="hint">Your goals and preferences for family planning.</p>

	<Field label="Do you desire children in the future?">
		<RadioGroup label="Do you desire children in the future?">
			{#each desireOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="desireForChildren" value={opt.value} bind:group={f.desireForChildren} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if f.desireForChildren === 'yes-soon' || f.desireForChildren === 'yes-future'}
		<Field label="Timeframe for starting a family" inputId="timeframe">
			<Select id="timeframe" label="Timeframe" bind:value={f.timeframe}>
				<option value="">-- Select --</option>
				<option value="within-1-year">Within 1 year</option>
				<option value="1-3-years">1-3 years</option>
				<option value="3-5-years">3-5 years</option>
				<option value="5-plus-years">5+ years</option>
			</Select>
		</Field>
	{:else}
		<Field label="Timeframe" inputId="timeframe">
			<Select id="timeframe" label="Timeframe" bind:value={f.timeframe}>
				<option value="">-- Select --</option>
				<option value="not-applicable">Not applicable</option>
			</Select>
		</Field>
	{/if}

	<Field label="Partner involvement in contraceptive decision">
		<RadioGroup label="Partner involvement in contraceptive decision">
			{#each partnerOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="partnerInvolvement" value={opt.value} bind:group={f.partnerInvolvement} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
