<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const e = assessment.data.electrolytes;
</script>

<Fieldset legend="Step 3 of 5 — Electrolytes">
	<p class="hint">
		The serum electrolyte panel in mmol/L. Sodium, chloride, and bicarbonate are required. Entering a
		potassium selects the potassium-inclusive formula and its 8–16 mmol/L reference range; leaving it
		blank uses the potassium-exclusive formula and 8–12 mmol/L.
	</p>

	<Field
		label="Serum sodium (mmol/L)"
		description="Adult sodium results are typically around 135-145 mmol/L."
		inputId="electrolytes-sodium"
	>
		<NumberInput
			id="electrolytes-sodium"
			label="Serum sodium"
			min={0}
			max={250}
			step={1}
			bind:value={e.sodium}
		/>
	</Field>

	<Field
		label="Serum potassium (mmol/L) — optional"
		description="Adult potassium results are typically around 3.5-5.0 mmol/L. Leave blank to omit potassium from the formula."
		inputId="electrolytes-potassium"
	>
		<NumberInput
			id="electrolytes-potassium"
			label="Serum potassium"
			min={0}
			max={15}
			step={0.1}
			bind:value={e.potassium}
		/>
	</Field>

	<Field
		label="Serum chloride (mmol/L)"
		description="Adult chloride results are typically around 98-107 mmol/L."
		inputId="electrolytes-chloride"
	>
		<NumberInput
			id="electrolytes-chloride"
			label="Serum chloride"
			min={0}
			max={200}
			step={1}
			bind:value={e.chloride}
		/>
	</Field>

	<Field
		label="Serum bicarbonate (mmol/L)"
		description="Adult bicarbonate (HCO₃⁻) results are typically around 22-29 mmol/L."
		inputId="electrolytes-bicarbonate"
	>
		<NumberInput
			id="electrolytes-bicarbonate"
			label="Serum bicarbonate"
			min={0}
			max={100}
			step={1}
			bind:value={e.bicarbonate}
		/>
	</Field>
</Fieldset>
