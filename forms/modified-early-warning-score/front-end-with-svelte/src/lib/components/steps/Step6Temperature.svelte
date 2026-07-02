<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { computeSubscores } from '$lib/engine/mews-grader';
	import { subscoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const t = assessment.data.temperature;
	const points = $derived(computeSubscores(assessment.data).temperature);
</script>

<Fieldset legend="Step 6 of 8 — Temperature">
	<p class="hint">
		Parameter 4 — degrees Celsius. Scores 2 (&lt; 35.0 or &ge; 38.5) or 0 (35.0-38.4).
	</p>

	<Field label="Measured temperature (°C)" inputId="temperature-temperature">
		<NumberInput
			id="temperature-temperature"
			label="Measured temperature"
			min={25}
			max={45}
			step={0.1}
			bind:value={t.temperature}
		/>
	</Field>

	<Field label="Temperature subscore">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subscoreColor(points)}">
			{points === null ? 'Not recorded' : `${points} point${points === 1 ? '' : 's'}`}
		</span>
	</Field>
</Fieldset>
