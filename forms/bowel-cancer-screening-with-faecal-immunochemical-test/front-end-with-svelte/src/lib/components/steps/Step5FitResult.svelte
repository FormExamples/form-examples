<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const r = assessment.data.result;
</script>

<Fieldset legend="Step 5 of 7 — FIT result">
	<p class="hint">
		The measured faecal haemoglobin concentration and the programme threshold applied. A value at or
		above the threshold classifies as positive; below it, negative. The screening default threshold
		is 120 &micro;g Hb/g; the NICE DG56 symptomatic threshold is 10 &micro;g Hb/g.
	</p>

	<Field
		label="Faecal haemoglobin (&micro;g Hb/g)"
		description="Leave blank when no valid sample was analysed."
		inputId="result-faecalHaemoglobinUgG"
	>
		<NumberInput
			id="result-faecalHaemoglobinUgG"
			label="Faecal haemoglobin"
			min={0}
			max={1000}
			step={1}
			bind:value={r.faecalHaemoglobinUgG}
		/>
	</Field>

	<Field label="Programme threshold applied (&micro;g Hb/g)" inputId="result-thresholdApplied">
		<NumberInput
			id="result-thresholdApplied"
			label="Programme threshold applied"
			min={0}
			max={1000}
			step={1}
			bind:value={r.thresholdApplied}
		/>
	</Field>

	<Field label="Assay / analyser" inputId="result-assay">
		<TextInput
			id="result-assay"
			label="Assay / analyser"
			placeholder="e.g. OC-Sensor io"
			bind:value={r.assay}
		/>
	</Field>
</Fieldset>
