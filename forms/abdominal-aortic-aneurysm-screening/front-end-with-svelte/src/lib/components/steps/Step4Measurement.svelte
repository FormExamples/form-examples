<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const m = $state(assessment.data.measurement);
</script>

<Fieldset legend="Step 4 of 6 — Ultrasound measurement">
	<p class="hint">
		The classified value is the maximum antero-posterior aortic diameter (cm). If the aorta cannot
		be adequately visualised the result is non-visualised and a re-scan is arranged.
	</p>

	<Field
		label="Aorta adequately visualised"
		description="Select No if excess bowel gas or body habitus prevented an adequate measurement."
		inputId="measurement-aortaVisualised"
	>
		<Select
			id="measurement-aortaVisualised"
			label="Aorta adequately visualised"
			bind:value={m.aortaVisualised}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field
		label="Maximum aortic diameter (cm)"
		description="Largest antero-posterior diameter of the infrarenal aorta. Thresholds: 3.0, 4.5, 5.5 cm."
		inputId="measurement-maxAorticDiameterCm"
	>
		<NumberInput
			id="measurement-maxAorticDiameterCm"
			label="Maximum aortic diameter"
			min={0}
			max={15}
			step={0.1}
			bind:value={m.maxAorticDiameterCm}
		/>
	</Field>

	<Field
		label="Prior maximum diameter (cm)"
		description="Surveillance patients only — the maximum diameter at the previous scan; used to compute growth."
		inputId="measurement-priorMaxDiameterCm"
	>
		<NumberInput
			id="measurement-priorMaxDiameterCm"
			label="Prior maximum diameter"
			min={0}
			max={15}
			step={0.1}
			bind:value={m.priorMaxDiameterCm}
		/>
	</Field>

	<Field label="Prior scan date" inputId="measurement-priorScanDate">
		<TextInput
			id="measurement-priorScanDate"
			label="Prior scan date"
			type="date"
			class="date-input"
			bind:value={m.priorScanDate}
		/>
	</Field>
</Fieldset>
