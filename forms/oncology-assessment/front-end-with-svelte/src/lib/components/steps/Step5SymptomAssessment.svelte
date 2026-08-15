<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const s = assessment.data.symptomAssessment;

	const severityOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];
</script>

<Fieldset legend="Symptom Assessment">
	<p class="hint">Current symptoms and severity.</p>

	<Field label="Pain (NRS 0-10)" description="0 = no pain, 10 = worst pain imaginable" inputId="painNRS">
		<NumberInput id="painNRS" label="Pain NRS" min={0} max={10} step={1} bind:value={s.painNRS} />
	</Field>

	<Field label="Fatigue" inputId="fatigue">
		<Select id="fatigue" label="Fatigue" bind:value={s.fatigue}>
			<option value="">-- Select --</option>
			{#each severityOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Nausea" inputId="nausea">
		<Select id="nausea" label="Nausea" bind:value={s.nausea}>
			<option value="">-- Select --</option>
			{#each severityOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Appetite" inputId="appetite">
		<Select id="appetite" label="Appetite" bind:value={s.appetite}>
			<option value="">-- Select --</option>
			<option value="normal">Normal</option>
			<option value="decreased">Decreased</option>
			<option value="severely-decreased">Severely Decreased</option>
		</Select>
	</Field>

	<Field label="Weight Change" inputId="weightChange">
		<Select id="weightChange" label="Weight Change" bind:value={s.weightChange}>
			<option value="">-- Select --</option>
			<option value="stable">Stable</option>
			<option value="gaining">Gaining</option>
			<option value="losing-less-5">Losing &lt;5%</option>
			<option value="losing-5-10">Losing 5-10%</option>
			<option value="losing-more-10">Losing &gt;10%</option>
		</Select>
	</Field>

	<Field label="ESAS Total Score" description="Edmonton Symptom Assessment System (0-100)" inputId="esasScore">
		<NumberInput id="esasScore" label="ESAS" min={0} max={100} bind:value={s.esasScore} />
	</Field>
</Fieldset>
