<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.menstrualCycle;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const regularityOptions = [
		{ value: 'regular', label: 'Regular' },
		{ value: 'irregular', label: 'Irregular' },
		{ value: 'absent', label: 'Absent (amenorrhoea)' }
	];
</script>

<Fieldset legend="Menstrual Cycle History">
	<p class="hint">Pattern, length, and symptoms of your menstrual cycle.</p>

	<div class="field-grid">
		<Field label="Age of menarche (first period)" inputId="menstrualCycle-menarcheAge">
			<NumberInput id="menstrualCycle-menarcheAge" label="Age of menarche" min={6} max={25} bind:value={m.menarcheAge} />
		</Field>
		<Field label="Typical cycle length (days)" inputId="menstrualCycle-cycleLengthDays">
			<NumberInput id="menstrualCycle-cycleLengthDays" label="Cycle length" min={14} max={90} bind:value={m.cycleLengthDays} />
		</Field>
	</div>

	<Field label="Cycle regularity">
		<RadioGroup label="Cycle regularity">
			{#each regularityOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cycleRegularity" value={opt.value} bind:group={m.cycleRegularity} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Period duration (days)" inputId="menstrualCycle-periodDurationDays">
		<NumberInput id="menstrualCycle-periodDurationDays" label="Period duration" min={0} max={14} bind:value={m.periodDurationDays} />
	</Field>

	<Field label="Heavy menstrual bleeding?">
		<RadioGroup label="Heavy menstrual bleeding?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="heavyBleeding" value={opt.value} bind:group={m.heavyBleeding} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Painful periods (dysmenorrhoea)?">
		<RadioGroup label="Painful periods (dysmenorrhoea)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dysmenorrhoea" value={opt.value} bind:group={m.dysmenorrhoea} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Bleeding between periods?">
		<RadioGroup label="Bleeding between periods?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="intermenstrualBleeding" value={opt.value} bind:group={m.intermenstrualBleeding} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Last menstrual period (first day)" inputId="menstrualCycle-lastMenstrualPeriod">
		<DateInput id="menstrualCycle-lastMenstrualPeriod" label="Last menstrual period" bind:value={m.lastMenstrualPeriod} />
	</Field>

	<Field label="Cycle notes" inputId="menstrualCycle-cycleNotes">
		<TextAreaInput id="menstrualCycle-cycleNotes" label="Cycle notes" rows={3} placeholder="Anything else about your cycle…" bind:value={m.cycleNotes} />
	</Field>
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
