<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { bilirubinPoints } from '$lib/engine/child-pugh-rules';
	import { formatPoint } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const b = assessment.data.bilirubin;
	const point = $derived(bilirubinPoints(assessment.data));
</script>

<Fieldset legend="Step 3 of 8 — Total bilirubin">
	<p class="hint">
		Parameter 1 — measured total bilirubin in µmol/L. Bands: &lt; 34 → 1 point, 34-50 → 2 points,
		&gt; 50 → 3 points.
	</p>

	<Field
		label="Measured total bilirubin (µmol/L)"
		description="Adult total-bilirubin results are typically below ~21 µmol/L."
		inputId="bilirubin-totalBilirubin"
	>
		<NumberInput
			id="bilirubin-totalBilirubin"
			label="Measured total bilirubin"
			min={0}
			max={1000}
			step={1}
			bind:value={b.totalBilirubin}
		/>
	</Field>

	<Field label="Parameter points">
		<strong class="text-lg text-base-content">{formatPoint(point)}</strong>
	</Field>
</Fieldset>
