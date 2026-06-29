<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.request;
</script>

<Fieldset legend="3. Requested Procedure">
	<p class="hint">The requested procedure, the primary indication, and the specific clinical question.</p>

	<Field label="Requested procedure" inputId="requestedProcedure" required>
		<Select id="requestedProcedure" label="Requested procedure" bind:value={d.requestedProcedure} required>
			<option value="">Select…</option>
			<option value="ogd">OGD / gastroscopy</option>
			<option value="gastroscopy">Gastroscopy</option>
			<option value="colonoscopy">Colonoscopy</option>
			<option value="flexible-sigmoidoscopy">Flexible sigmoidoscopy</option>
			<option value="ercp">ERCP</option>
			<option value="eus">EUS</option>
			<option value="capsule">Capsule</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.primaryIndication} required>
			<option value="">Select…</option>
			<option value="dyspepsia">Dyspepsia</option>
			<option value="gord">GORD</option>
			<option value="dysphagia">Dysphagia</option>
			<option value="upper-gi-bleeding">Upper-GI bleeding</option>
			<option value="iron-deficiency-anaemia">Iron-deficiency anaemia</option>
			<option value="weight-loss">Weight loss</option>
			<option value="suspected-malignancy">Suspected malignancy</option>
			<option value="barretts-surveillance">Barrett's surveillance</option>
			<option value="h-pylori">H. pylori</option>
			<option value="rectal-bleeding">Rectal bleeding</option>
			<option value="change-in-bowel-habit">Change in bowel habit</option>
			<option value="positive-fit">Positive FIT</option>
			<option value="ibd-surveillance">IBD surveillance</option>
			<option value="polyp-surveillance">Polyp surveillance</option>
			<option value="abnormal-imaging">Abnormal imaging</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="The specific question the endoscopy is asked to answer…"
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
