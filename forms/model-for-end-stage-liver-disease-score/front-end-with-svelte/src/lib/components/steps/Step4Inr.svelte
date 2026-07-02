<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const i = assessment.data.inr;
</script>

<Fieldset legend="Step 4 of 8 — INR">
	<p class="hint">
		Calculation input 2 — the international normalised ratio (INR) of prothrombin time. Values below
		1.0 are floored to 1.0 before the logarithm. An INR &ge; 2.5 raises a coagulopathy flag.
	</p>

	<Field
		label="INR"
		description="Adult INR is typically around 0.8-1.2; higher values reflect impaired synthetic liver function."
		inputId="inr-inr"
	>
		<NumberInput id="inr-inr" label="INR" min={0} max={20} step={0.1} bind:value={i.inr} />
	</Field>
</Fieldset>
