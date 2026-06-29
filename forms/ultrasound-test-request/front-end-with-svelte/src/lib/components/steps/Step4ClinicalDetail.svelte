<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data;
</script>

<Fieldset legend="4. Clinical Detail">
	<p class="hint">The specific clinical question and relevant history — the highest-value fields.</p>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={2}
			placeholder="e.g. Confirm or exclude gallstones in a patient with right-upper-quadrant pain."
			bind:value={d.request.clinicalQuestion}
			required
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput id="relevantHistory" label="Relevant history" rows={2} bind:value={d.request.relevantHistory} />
	</Field>

	<Field label="Previous scan finding" inputId="previousScanFinding">
		<TextInput id="previousScanFinding" label="Previous scan finding" bind:value={d.request.previousScanFinding} />
	</Field>

	<Field label="Previous scan date" inputId="previousScanDate">
		<DateInput id="previousScanDate" label="Previous scan date" bind:value={d.request.previousScanDate} />
	</Field>
</Fieldset>
