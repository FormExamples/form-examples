<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data;
</script>

<Fieldset legend="3. Requested Procedure">
	<p class="hint">Procedure, indication, and the specific clinical question — the highest-value fields.</p>

	<Field label="Requested procedure" inputId="procedure" required>
		<Select id="procedure" label="Requested procedure" bind:value={d.request.procedure} required>
			<option value="">Select…</option>
			<option value="colonoscopy">Colonoscopy</option>
			<option value="flexible-sigmoidoscopy">Flexible sigmoidoscopy</option>
			<option value="ct-colonography">CT colonography</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.request.primaryIndication} required>
			<option value="">Select…</option>
			<option value="rectal-bleeding">Rectal bleeding</option>
			<option value="change-in-bowel-habit">Change in bowel habit</option>
			<option value="iron-deficiency-anaemia">Iron-deficiency anaemia</option>
			<option value="positive-fit">Positive FIT</option>
			<option value="abdominal-mass">Abdominal / rectal mass</option>
			<option value="ibd-diagnosis">IBD diagnosis</option>
			<option value="ibd-surveillance">IBD surveillance</option>
			<option value="polyp-surveillance">Polyp surveillance</option>
			<option value="crc-screening">CRC screening</option>
			<option value="abnormal-imaging">Abnormal imaging</option>
			<option value="chronic-diarrhoea">Chronic diarrhoea</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={2}
			placeholder="e.g. Investigate change in bowel habit; exclude colorectal malignancy."
			bind:value={d.request.clinicalQuestion}
			required
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput
			id="relevantHistory"
			label="Relevant history"
			rows={2}
			placeholder="Relevant clinical history, prior endoscopy, family history…"
			bind:value={d.request.relevantHistory}
		/>
	</Field>
</Fieldset>
