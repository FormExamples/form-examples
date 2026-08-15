<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const s = assessment.data.sodium;
</script>

<Fieldset legend="Step 6 of 8 — Serum sodium">
	<p class="hint">
		Required for MELD-Na and MELD 3.0. Sodium is clamped to 125-137 mEq/L in the correction. A serum
		sodium &lt; 130 mEq/L raises a hyponatraemia flag.
	</p>

	<Field
		label="Serum sodium (mEq/L)"
		description="Adult serum sodium is typically around 135-145 mEq/L."
		inputId="sodium-sodium"
	>
		<NumberInput
			id="sodium-sodium"
			label="Serum sodium"
			min={100}
			max={170}
			step={1}
			bind:value={s.sodium}
		/>
	</Field>
</Fieldset>
