<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Measurements">
	<p class="hint">Key measurements and radiation dose for audit.</p>

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
		label="Radiation dose — DLP (mGy.cm)"
		inputId="radiationDoseDlp"
		description="Dose-length product for the examination (IR(ME)R dose audit)."
	>
		<NumberInput
			id="radiationDoseDlp"
			label="Radiation dose — DLP (mGy.cm)"
			min={0}
			max={100000}
			step={0.1}
			bind:value={d.radiationDoseDlp}
		/>
	</Field>
</Fieldset>
