<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Measurements & Category">
	<p class="hint">Key measurement and the structured-reporting category.</p>

	<Field
		label="Largest lesion size (mm)"
		inputId="largestLesionSizeMm"
		description="Largest lesion long-axis size, for surveillance and categorisation."
	>
		<NumberInput
			id="largestLesionSizeMm"
			label="Largest lesion size (mm)"
			min={0}
			max={2000}
			step={0.1}
			bind:value={d.largestLesionSizeMm}
		/>
	</Field>

	<Field
		label="Structured-reporting category"
		inputId="reportingCategory"
		description="PI-RADS 1–5 for prostate MRI, BI-RADS 0–6 for breast MRI, or a Likert score."
	>
		<TextInput
			id="reportingCategory"
			label="Structured-reporting category"
			placeholder="e.g. PI-RADS 4, BI-RADS 4, or Likert 3"
			bind:value={d.reportingCategory}
		/>
	</Field>
</Fieldset>
