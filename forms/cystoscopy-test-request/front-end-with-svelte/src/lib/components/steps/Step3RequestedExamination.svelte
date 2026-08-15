<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { requestStore } from '#lib/stores/result.svelte.js';

	const r = requestStore.data.request;
</script>

<Fieldset legend="3. Requested Examination">
	<p class="hint">The requested procedure, the primary indication, and the specific clinical question.</p>

	<Field label="Requested procedure" inputId="procedure" required>
		<Select id="procedure" label="Requested procedure" bind:value={r.procedure} required>
			<option value="">Select…</option>
			<option value="flexible-cystoscopy">Flexible cystoscopy</option>
			<option value="rigid-cystoscopy">Rigid cystoscopy</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={r.primaryIndication} required>
			<option value="">Select…</option>
			<option value="visible-haematuria">Visible haematuria</option>
			<option value="non-visible-haematuria">Non-visible haematuria</option>
			<option value="recurrent-uti">Recurrent UTI</option>
			<option value="lower-urinary-tract-symptoms">Lower urinary tract symptoms</option>
			<option value="bladder-cancer-surveillance">Bladder cancer surveillance</option>
			<option value="suspected-bladder-tumour">Suspected bladder tumour</option>
			<option value="urethral-stricture">Urethral stricture</option>
			<option value="catheter-problems">Catheter problems</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="The specific question the cystoscopy should answer…"
			bind:value={r.clinicalQuestion}
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput
			id="relevantHistory"
			label="Relevant history"
			rows={3}
			placeholder="Relevant clinical history and context for the request…"
			bind:value={r.relevantHistory}
		/>
	</Field>
</Fieldset>
