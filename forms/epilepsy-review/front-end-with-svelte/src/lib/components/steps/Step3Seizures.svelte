<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const s = assessment.data.seizures;
</script>

<Fieldset legend="Step 3 of 11 — Seizure type and frequency">
	<p class="hint">
		Position since the last review. Frequency and trend drive the control classification.
	</p>

	<Field label="Seizure type(s) present" inputId="seizures-seizureTypes">
		<TextAreaInput
			id="seizures-seizureTypes"
			label="Seizure type(s) present"
			rows={3}
			placeholder="e.g. focal impaired awareness; occasional secondary generalisation."
			bind:value={s.seizureTypes}
		/>
	</Field>

	<Field
		label="Seizure frequency since last review"
		description="Weekly or daily classifies control as uncontrolled."
		inputId="seizures-seizureFrequency"
	>
		<Select
			id="seizures-seizureFrequency"
			label="Seizure frequency since last review"
			bind:value={s.seizureFrequency}
		>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="less-than-monthly">Less than monthly</option>
			<option value="monthly">Monthly</option>
			<option value="weekly">Weekly</option>
			<option value="daily">Daily</option>
		</Select>
	</Field>

	<Field label="Date of most recent seizure" inputId="seizures-lastSeizureDate">
		<DateInput
			id="seizures-lastSeizureDate"
			label="Date of most recent seizure"
			bind:value={s.lastSeizureDate}
		/>
	</Field>

	<Field label="Documented seizure-free duration (months)" inputId="seizures-seizureFreeMonths">
		<NumberInput
			id="seizures-seizureFreeMonths"
			label="Documented seizure-free duration (months)"
			min={0}
			max={600}
			step={1}
			placeholder="e.g. 18"
			bind:value={s.seizureFreeMonths}
		/>
	</Field>

	<Field
		label="Trend versus previous review"
		description="Increasing classifies control as uncontrolled and raises a specialist-review flag."
		inputId="seizures-seizureTrend"
	>
		<Select id="seizures-seizureTrend" label="Trend versus previous review" bind:value={s.seizureTrend}>
			<option value="">— Select —</option>
			<option value="seizure-free">Seizure-free</option>
			<option value="decreasing">Decreasing</option>
			<option value="stable">Stable</option>
			<option value="increasing">Increasing</option>
		</Select>
	</Field>
</Fieldset>
