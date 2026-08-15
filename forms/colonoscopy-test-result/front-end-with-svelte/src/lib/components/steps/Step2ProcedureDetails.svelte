<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Procedure Details">
	<p class="hint">The performed procedure, extent reached, bowel preparation, and sedation.</p>

	<Field label="Procedure" inputId="procedure" required>
		<Select id="procedure" label="Procedure" bind:value={d.procedure} required>
			<option value="">Select…</option>
			<option value="colonoscopy">Colonoscopy</option>
			<option value="flexible-sigmoidoscopy">Flexible sigmoidoscopy</option>
			<option value="ct-colonography">CT colonography</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field
		label="Extent reached"
		inputId="extentReached"
		description="Caecal / terminal-ileal intubation is the completeness key performance indicator."
	>
		<Select id="extentReached" label="Extent reached" bind:value={d.extentReached}>
			<option value="">Select…</option>
			<option value="caecum">Caecum</option>
			<option value="terminal-ileum">Terminal ileum</option>
			<option value="hepatic-flexure">Hepatic flexure</option>
			<option value="splenic-flexure">Splenic flexure</option>
			<option value="descending-colon">Descending colon</option>
			<option value="rectum-sigmoid">Rectum / sigmoid</option>
			<option value="incomplete">Incomplete</option>
		</Select>
	</Field>

	<Field label="Bowel-preparation quality" inputId="bowelPreparationQuality">
		<Select id="bowelPreparationQuality" label="Bowel-preparation quality" bind:value={d.bowelPreparationQuality}>
			<option value="">Select…</option>
			<option value="excellent">Excellent</option>
			<option value="good">Good</option>
			<option value="adequate">Adequate</option>
			<option value="poor">Poor</option>
		</Select>
	</Field>

	<Field label="Sedation">
		<CheckboxGroup label="Sedation">
			<label>
				<CheckboxInput label="Sedation / analgesia administered" bind:checked={d.sedationUsed} /> Sedation
				/ analgesia administered
			</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
