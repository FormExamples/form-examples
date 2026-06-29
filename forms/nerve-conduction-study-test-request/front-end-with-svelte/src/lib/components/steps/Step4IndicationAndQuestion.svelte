<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const r = request.data.request;
</script>

<Fieldset legend="4. Indication and Question">
	<p class="hint">Indication and the specific clinical question — the highest-value fields.</p>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={r.primaryIndication} required>
			<option value="">Select…</option>
			<option value="carpal-tunnel">Carpal tunnel</option>
			<option value="peripheral-neuropathy">Peripheral neuropathy</option>
			<option value="radiculopathy">Radiculopathy</option>
			<option value="suspected-motor-neurone-disease">Suspected motor neurone disease</option>
			<option value="myopathy">Myopathy</option>
			<option value="plexopathy">Plexopathy</option>
			<option value="suspected-myasthenia">Suspected myasthenia</option>
			<option value="nerve-injury">Nerve injury</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={2}
			placeholder="e.g. Confirm median neuropathy at the wrist and grade severity."
			bind:value={r.clinicalQuestion}
			required
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput id="relevantHistory" label="Relevant history" rows={2} bind:value={r.relevantHistory} />
	</Field>
</Fieldset>
