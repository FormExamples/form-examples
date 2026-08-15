<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const b = assessment.data.bilirubin;
</script>

<Fieldset legend="Step 3 of 8 — Total bilirubin">
	<p class="hint">
		Calculation input 1 — the total serum bilirubin. Choose the reporting unit; umol/L values are
		converted to mg/dL (÷ 17.1). Values below 1.0 mg/dL are floored to 1.0 before the logarithm.
	</p>

	<Field label="Total bilirubin" inputId="bilirubin-bilirubin">
		<NumberInput
			id="bilirubin-bilirubin"
			label="Total bilirubin"
			min={0}
			max={100}
			step={0.1}
			bind:value={b.bilirubin}
		/>
	</Field>

	<Field label="Bilirubin unit" required inputId="bilirubin-bilirubinUnit">
		<Select
			id="bilirubin-bilirubinUnit"
			label="Bilirubin unit"
			required
			bind:value={b.bilirubinUnit}
		>
			<option value="">— Select —</option>
			<option value="mg/dL">mg/dL</option>
			<option value="umol/L">umol/L</option>
		</Select>
	</Field>
</Fieldset>
