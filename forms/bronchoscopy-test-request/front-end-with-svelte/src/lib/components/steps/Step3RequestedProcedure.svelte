<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { requestStore } from '#lib/stores/result.svelte.js';

	const d = requestStore.data.request;
</script>

<Fieldset legend="3. Requested Procedure">
	<p class="hint">The requested procedure, the primary indication, and the specific clinical question.</p>

	<Field label="Requested procedure" inputId="procedure" required>
		<Select id="procedure" label="Requested procedure" bind:value={d.procedure} required>
			<option value="">Select…</option>
			<option value="flexible-bronchoscopy">Flexible bronchoscopy</option>
			<option value="ebus">EBUS (endobronchial ultrasound)</option>
			<option value="rigid-bronchoscopy">Rigid bronchoscopy</option>
			<option value="bronchoalveolar-lavage">Bronchoalveolar lavage</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.primaryIndication} required>
			<option value="">Select…</option>
			<option value="suspected-lung-cancer">Suspected lung cancer</option>
			<option value="haemoptysis">Haemoptysis</option>
			<option value="persistent-cough">Persistent cough</option>
			<option value="lung-mass-on-imaging">Lung mass on imaging</option>
			<option value="mediastinal-lymphadenopathy">Mediastinal lymphadenopathy</option>
			<option value="infection-sampling">Infection sampling</option>
			<option value="foreign-body">Foreign body</option>
			<option value="stridor">Stridor</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="The specific question the bronchoscopy is asked to answer…"
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
