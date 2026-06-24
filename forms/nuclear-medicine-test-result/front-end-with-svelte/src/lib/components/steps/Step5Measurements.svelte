<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Measurements">
	<p class="hint">Key quantitative measurements for gated cardiac and renal studies.</p>

	<Field
		label="Ejection fraction (%)"
		inputId="ejectionFractionPercent"
		description="Left-ventricular ejection fraction, where gated cardiac studies are performed (0–100)."
	>
		<NumberInput
			id="ejectionFractionPercent"
			label="Ejection fraction (%)"
			min={0}
			max={100}
			step={0.1}
			bind:value={d.ejectionFractionPercent}
		/>
	</Field>

	<Field
		label="Split function — left kidney (%)"
		inputId="splitFunctionLeftPercent"
		description="Left-kidney split (differential) function percentage, for renal studies (0–100)."
	>
		<NumberInput
			id="splitFunctionLeftPercent"
			label="Split function — left kidney (%)"
			min={0}
			max={100}
			step={0.1}
			bind:value={d.splitFunctionLeftPercent}
		/>
	</Field>

	<Field
		label="Split function — right kidney (%)"
		inputId="splitFunctionRightPercent"
		description="Right-kidney split (differential) function percentage, for renal studies (0–100)."
	>
		<NumberInput
			id="splitFunctionRightPercent"
			label="Split function — right kidney (%)"
			min={0}
			max={100}
			step={0.1}
			bind:value={d.splitFunctionRightPercent}
		/>
	</Field>
</Fieldset>
