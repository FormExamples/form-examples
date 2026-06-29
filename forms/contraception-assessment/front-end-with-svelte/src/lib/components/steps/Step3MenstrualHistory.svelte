<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const m = assessment.data.menstrualHistory;
</script>

<Fieldset legend="Menstrual History">
	<p class="hint">Details about your menstrual cycle.</p>

	<div class="field-grid">
		<Field label="Cycle length (days)" inputId="cycleLength">
			<NumberInput id="cycleLength" label="Cycle length" min={14} max={60} bind:value={m.cycleLength} />
		</Field>
		<Field label="Period duration (days)" inputId="cycleDuration">
			<NumberInput id="cycleDuration" label="Period duration" min={1} max={14} bind:value={m.cycleDuration} />
		</Field>
	</div>

	<Field label="Flow heaviness" inputId="flowHeaviness">
		<Select id="flowHeaviness" label="Flow heaviness" bind:value={m.flowHeaviness}>
			<option value="">-- Select --</option>
			<option value="light">Light</option>
			<option value="moderate">Moderate</option>
			<option value="heavy">Heavy</option>
			<option value="very-heavy">Very heavy (flooding/clots)</option>
		</Select>
	</Field>

	<Field label="Period pain (dysmenorrhea)" inputId="dysmenorrhea">
		<Select id="dysmenorrhea" label="Period pain (dysmenorrhea)" bind:value={m.dysmenorrhea}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="mild">Mild - manageable without medication</option>
			<option value="moderate">Moderate - requires pain relief</option>
			<option value="severe">Severe - affects daily activities</option>
		</Select>
	</Field>

	<Field label="Date of last menstrual period" inputId="lastMenstrualPeriod">
		<DateInput id="lastMenstrualPeriod" label="Date of last menstrual period" bind:value={m.lastMenstrualPeriod} />
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
