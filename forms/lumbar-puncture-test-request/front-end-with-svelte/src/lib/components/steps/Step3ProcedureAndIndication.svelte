<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.procedure;
</script>

<Fieldset legend="3. Procedure and Indication">
	<p class="hint">The procedure intent, the primary clinical indication, and the specific question.</p>

	<Field label="Procedure intent" inputId="procedureIntent" required>
		<Select id="procedureIntent" label="Procedure intent" bind:value={d.procedureIntent} required>
			<option value="">Select…</option>
			<option value="diagnostic">Diagnostic</option>
			<option value="therapeutic">Therapeutic</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.primaryIndication} required>
			<option value="">Select…</option>
			<option value="suspected-meningitis">Suspected meningitis</option>
			<option value="suspected-subarachnoid-haemorrhage">Suspected subarachnoid haemorrhage</option>
			<option value="suspected-multiple-sclerosis">Suspected multiple sclerosis</option>
			<option value="suspected-guillain-barre">Suspected Guillain-Barré</option>
			<option value="idiopathic-intracranial-hypertension">Idiopathic intracranial hypertension</option>
			<option value="suspected-cns-malignancy">Suspected CNS malignancy</option>
			<option value="cns-infection">CNS infection</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="The specific question the CSF analysis should answer…"
			bind:value={d.clinicalQuestion}
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput
			id="relevantHistory"
			label="Relevant history"
			rows={3}
			placeholder="Relevant clinical history and context for the request…"
			bind:value={d.relevantHistory}
		/>
	</Field>
</Fieldset>
