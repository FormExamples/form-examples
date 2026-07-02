<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const l = assessment.data.lethality;
	const codePotential = $derived(l.actualLethality === 0);
</script>

<Fieldset legend="Step 6 of 8 — Lethality">
	<p class="hint">
		For an actual attempt: record the medical damage. Actual lethality of 3 or greater, or potential
		lethality of 2, is treated as a high-lethality attempt (High risk).
	</p>

	<Field
		label="Actual lethality / medical damage"
		description="Ordinal 0-5 (0 = no physical damage, 5 = death). Leave blank if there was no actual attempt."
		inputId="lethality-actualLethality"
	>
		<NumberInput
			id="lethality-actualLethality"
			label="Actual lethality / medical damage"
			min={0}
			max={5}
			step={1}
			bind:value={l.actualLethality}
		/>
	</Field>

	<Field
		label="Potential lethality"
		description="Ordinal 0-2; coded only when actual lethality is 0, estimating the likely harm of the attempt as carried out."
		inputId="lethality-potentialLethality"
	>
		<NumberInput
			id="lethality-potentialLethality"
			label="Potential lethality"
			min={0}
			max={2}
			step={1}
			disabled={!codePotential}
			bind:value={l.potentialLethality}
		/>
	</Field>

	{#if !codePotential}
		<p class="hint">Potential lethality is coded only when actual lethality is 0.</p>
	{/if}
</Fieldset>
