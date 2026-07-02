<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { scoreCardiovascular } from '$lib/engine/sofa-rules';
	import { subScoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const cv = assessment.data.cardiovascular;
	const sub = $derived(scoreCardiovascular(assessment.data).score);
</script>

<Fieldset legend="Step 6 of 9 — Cardiovascular">
	<p class="hint">
		Mean arterial pressure and any vasopressor/inotrope (dose in &micro;g/kg/min, given for &ge; 1
		hour). The highest applicable band across MAP and vasopressor sets the sub-score. MAP &ge; 70 =
		0, MAP &lt; 70 = 1.
	</p>

	<Field label="Mean arterial pressure (mmHg)" inputId="cardiovascular-map">
		<NumberInput
			id="cardiovascular-map"
			label="Mean arterial pressure (mmHg)"
			min={0}
			max={200}
			step={1}
			bind:value={cv.map}
		/>
	</Field>

	<Field
		label="Vasopressor / inotrope"
		description="Dobutamine (any) = 2; dopamine &le; 5 = 2, &gt; 5 = 3, &gt; 15 = 4; adrenaline / noradrenaline &le; 0.1 = 3, &gt; 0.1 = 4."
		inputId="cardiovascular-vasopressor"
	>
		<Select
			id="cardiovascular-vasopressor"
			label="Vasopressor / inotrope"
			bind:value={cv.vasopressor}
		>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="dopamine">Dopamine</option>
			<option value="dobutamine">Dobutamine</option>
			<option value="adrenaline">Adrenaline (epinephrine)</option>
			<option value="noradrenaline">Noradrenaline (norepinephrine)</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Vasopressor dose (ug/kg/min)" inputId="cardiovascular-vasopressorDose">
		<NumberInput
			id="cardiovascular-vasopressorDose"
			label="Vasopressor dose (ug/kg/min)"
			min={0}
			max={100}
			step={0.01}
			bind:value={cv.vasopressorDose}
		/>
	</Field>

	<Field label="Cardiovascular sub-score">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subScoreColor(sub)}">
			{sub === null ? 'Not scored' : `Sub-score ${sub}`}
		</span>
	</Field>
</Fieldset>
