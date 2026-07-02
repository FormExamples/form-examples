<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { coagulationPoints } from '$lib/engine/child-pugh-rules';
	import { formatPoint } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const cg = assessment.data.coagulation;
	const point = $derived(coagulationPoints(assessment.data));
</script>

<Fieldset legend="Step 5 of 8 — Coagulation">
	<p class="hint">
		Parameter 3 — INR is preferred (bands: &lt; 1.7 → 1, 1.7-2.3 → 2, &gt; 2.3 → 3). Prothrombin-time
		prolongation in seconds is used only when no INR is recorded (bands: &lt; 4 → 1, 4-6 → 2, &gt; 6
		→ 3).
	</p>

	<Field
		label="INR (International Normalised Ratio)"
		description="Preferred measure. Leave blank to fall back to prothrombin-time prolongation."
		inputId="coagulation-inr"
	>
		<NumberInput
			id="coagulation-inr"
			label="INR"
			min={0}
			max={20}
			step={0.1}
			bind:value={cg.inr}
		/>
	</Field>

	<Field
		label="Prothrombin-time prolongation (seconds)"
		description="Fallback used only when INR is unavailable."
		inputId="coagulation-prothrombinTimeProlongation"
	>
		<NumberInput
			id="coagulation-prothrombinTimeProlongation"
			label="Prothrombin-time prolongation"
			min={0}
			max={60}
			step={1}
			bind:value={cg.prothrombinTimeProlongation}
		/>
	</Field>

	<Field label="Parameter points">
		<strong class="text-lg text-base-content">{formatPoint(point)}</strong>
	</Field>
</Fieldset>
