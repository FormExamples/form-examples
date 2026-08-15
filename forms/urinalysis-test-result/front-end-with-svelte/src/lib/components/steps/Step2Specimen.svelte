<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Specimen">
	<p class="hint">The specimen, its condition, and the clinical context.</p>

	<Field label="Specimen type" inputId="specimenType" required>
		<Select id="specimenType" label="Specimen type" bind:value={d.specimenType} required>
			<option value="">Select…</option>
			<option value="midstream">Midstream (MSU)</option>
			<option value="catheter">Catheter (CSU)</option>
			<option value="clean-catch">Clean catch</option>
			<option value="24h">24-hour collection</option>
			<option value="random">Random</option>
		</Select>
	</Field>

	<Field label="Specimen condition" inputId="specimenCondition">
		<Select id="specimenCondition" label="Specimen condition" bind:value={d.specimenCondition}>
			<option value="">Select…</option>
			<option value="satisfactory">Satisfactory</option>
			<option value="contaminated">Contaminated</option>
			<option value="insufficient">Insufficient</option>
			<option value="delayed">Delayed</option>
		</Select>
	</Field>

	<Field label="Clinical history" inputId="clinicalHistory">
		<TextAreaInput
			id="clinicalHistory"
			label="Clinical history"
			rows={3}
			placeholder="Clinical history and the question the investigation was performed to answer…"
			bind:value={d.clinicalHistory}
		/>
	</Field>

	<Field label="Pregnancy">
		<CheckboxGroup label="Pregnancy">
			<label>
				<CheckboxInput label="Patient is pregnant" bind:checked={d.pregnant} /> Patient is pregnant
			</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
