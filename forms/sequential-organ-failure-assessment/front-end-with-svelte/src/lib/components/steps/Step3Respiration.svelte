<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { scoreRespiration } from '$lib/engine/sofa-rules';
	import { subScoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const r = assessment.data.respiration;
	const sub = $derived(scoreRespiration(assessment.data).score);
</script>

<Fieldset legend="Step 3 of 9 — Respiration">
	<p class="hint">
		PaO2/FiO2 ratio in mmHg. Enter the ratio directly, or PaO2 and FiO2 to derive it. Sub-scores 3
		and 4 (ratio &lt; 200 and &lt; 100) require respiratory support.
	</p>

	<Field
		label="PaO2/FiO2 ratio (mmHg)"
		description="Enter directly if known. Bands: &ge; 400 = 0, &lt; 400 = 1, &lt; 300 = 2, &lt; 200 = 3, &lt; 100 = 4."
		inputId="respiration-pao2Fio2Ratio"
	>
		<NumberInput
			id="respiration-pao2Fio2Ratio"
			label="PaO2/FiO2 ratio (mmHg)"
			min={0}
			max={700}
			step={1}
			bind:value={r.pao2Fio2Ratio}
		/>
	</Field>

	<Field
		label="PaO2 (mmHg)"
		description="Optional — used to derive the ratio when no ratio is entered."
		inputId="respiration-pao2"
	>
		<NumberInput
			id="respiration-pao2"
			label="PaO2 (mmHg)"
			min={0}
			max={700}
			step={1}
			bind:value={r.pao2}
		/>
	</Field>

	<Field
		label="FiO2 (fraction, 0.21-1.0)"
		description="Optional — used to derive the ratio when no ratio is entered."
		inputId="respiration-fio2"
	>
		<NumberInput
			id="respiration-fio2"
			label="FiO2 (fraction, 0.21-1.0)"
			min={0.21}
			max={1}
			step={0.01}
			bind:value={r.fio2}
		/>
	</Field>

	<Field label="Respiratory support" inputId="respiration-respiratorySupport">
		<Select
			id="respiration-respiratorySupport"
			label="Respiratory support"
			bind:value={r.respiratorySupport}
		>
			<option value="">— Select —</option>
			<option value="ventilated">Mechanical ventilation</option>
			<option value="cpap">CPAP</option>
			<option value="none">None</option>
		</Select>
	</Field>

	<Field label="Respiration sub-score">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subScoreColor(sub)}">
			{sub === null ? 'Not scored' : `Sub-score ${sub}`}
		</span>
	</Field>
</Fieldset>
