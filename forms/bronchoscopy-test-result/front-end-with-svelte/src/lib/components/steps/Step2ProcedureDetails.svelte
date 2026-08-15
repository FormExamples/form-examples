<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Procedure Details">
	<p class="hint">The performed procedure, sedation, and the extent of the airway examined.</p>

	<Field label="Procedure" inputId="procedure" required>
		<Select id="procedure" label="Procedure" bind:value={d.procedure} required>
			<option value="">Select…</option>
			<option value="flexible-bronchoscopy">Flexible bronchoscopy</option>
			<option value="ebus">EBUS</option>
			<option value="rigid-bronchoscopy">Rigid bronchoscopy</option>
			<option value="bronchoalveolar-lavage">Bronchoalveolar lavage</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Sedation used" inputId="sedationUsed">
		<Select id="sedationUsed" label="Sedation used" bind:value={d.sedationUsed}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="local">Local</option>
			<option value="conscious">Conscious</option>
			<option value="deep">Deep</option>
			<option value="general">General</option>
		</Select>
	</Field>

	<Field label="Extent examined" inputId="extentExamined">
		<TextAreaInput
			id="extentExamined"
			label="Extent examined"
			rows={3}
			placeholder="Trachea, carina, lobar and segmental bronchi reached…"
			bind:value={d.extentExamined}
		/>
	</Field>
</Fieldset>
