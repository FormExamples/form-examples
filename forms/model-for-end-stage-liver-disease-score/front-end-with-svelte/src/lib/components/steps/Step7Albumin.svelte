<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const a = assessment.data.albumin;
</script>

<Fieldset legend="Step 7 of 8 — Serum albumin">
	<p class="hint">
		Required for MELD 3.0 only. Albumin is clamped to 1.5-3.5 g/dL in the MELD 3.0 formula.
	</p>

	<Field
		label="Serum albumin (g/dL)"
		description="Adult serum albumin is typically around 3.5-5.0 g/dL."
		inputId="albumin-albumin"
	>
		<NumberInput
			id="albumin-albumin"
			label="Serum albumin"
			min={0}
			max={10}
			step={0.1}
			bind:value={a.albumin}
		/>
	</Field>
</Fieldset>
