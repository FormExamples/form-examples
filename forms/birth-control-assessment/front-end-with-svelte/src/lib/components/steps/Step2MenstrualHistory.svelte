<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const m = assessment.data.menstrualHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const regularity = [
		{ value: 'regular', label: 'Regular' },
		{ value: 'irregular', label: 'Irregular' },
		{ value: 'absent', label: 'Absent' }
	];
	const flow = [
		{ value: 'light', label: 'Light' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'heavy', label: 'Heavy' }
	];
	const dysmenorrhoea = [
		{ value: 'none', label: 'None' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];
</script>

<Fieldset legend="Menstrual History" description="Cycle pattern, flow, and bleeding.">
	<NumberInput label="Age at menarche" unit="years" name="menarcheAge" min={8} max={20} bind:value={m.menarcheAge} />

	<RadioGroup label="Cycle regularity" name="cycleRegularity" options={regularity} bind:value={m.cycleRegularity} />

	<div class="field-grid">
		<NumberInput label="Cycle length" unit="days" name="cycleLengthDays" min={14} max={90} bind:value={m.cycleLengthDays} />
		<NumberInput label="Period duration" unit="days" name="periodDurationDays" min={1} max={14} bind:value={m.periodDurationDays} />
	</div>

	<RadioGroup label="Flow heaviness" name="flowHeaviness" options={flow} bind:value={m.flowHeaviness} />

	<RadioGroup label="Bleeding between periods (intermenstrual)?" name="intermenstrualBleeding" options={yesNo} bind:value={m.intermenstrualBleeding} />
	<RadioGroup label="Bleeding after intercourse (postcoital)?" name="postcoitalBleeding" options={yesNo} bind:value={m.postcoitalBleeding} />

	<Field label="Period pain (dysmenorrhoea)" inputId="dysmenorrhoea">
		<Select id="dysmenorrhoea" label="Period pain" bind:value={m.dysmenorrhoea}>
			<option value="">-- Select --</option>
			{#each dysmenorrhoea as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Last menstrual period" inputId="lmp">
		<DateInput id="lmp" label="Last menstrual period" bind:value={m.lastMenstrualPeriod} />
	</Field>

	<RadioGroup label="Absence of periods (amenorrhoea)?" name="amenorrhoea" options={yesNo} bind:value={m.amenorrhoea} />
	{#if m.amenorrhoea === 'yes'}
		<NumberInput label="Duration of amenorrhoea" unit="months" name="amenorrhoeaDurationMonths" min={1} max={120} bind:value={m.amenorrhoeaDurationMonths} />
	{/if}
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
