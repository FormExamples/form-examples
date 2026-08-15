<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Procedure Details">
	<p class="hint">The performed cystoscopy procedure and anaesthesia.</p>

	<Field label="Procedure" inputId="procedure" required>
		<Select id="procedure" label="Procedure" bind:value={d.procedure} required>
			<option value="">Select…</option>
			<option value="flexible-cystoscopy">Flexible cystoscopy</option>
			<option value="rigid-cystoscopy">Rigid cystoscopy</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Anaesthesia" inputId="anaesthesia">
		<Select id="anaesthesia" label="Anaesthesia" bind:value={d.anaesthesia}>
			<option value="">Select…</option>
			<option value="local">Local</option>
			<option value="sedation">Sedation</option>
			<option value="general">General</option>
		</Select>
	</Field>
</Fieldset>
