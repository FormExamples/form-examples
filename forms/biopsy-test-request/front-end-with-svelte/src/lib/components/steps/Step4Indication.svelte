<script lang="ts">
	import { request } from '$lib/stores/request.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = request.data.indication;
</script>

<Fieldset legend="Indication & question">
	<p class="hint">Primary indication and the specific clinical question — the highest-value fields.</p>

	<Field label="Primary indication" required inputId="primaryIndication">
		<Select id="primaryIndication" label="Primary indication" required bind:value={d.primaryIndication}>
			<option value="">— Select —</option>
			<option value="suspected-malignancy">Suspected malignancy</option>
			<option value="cancer-staging">Cancer staging</option>
			<option value="suspected-infection">Suspected infection</option>
			<option value="inflammatory-disease">Inflammatory disease</option>
			<option value="transplant-monitoring">Transplant monitoring</option>
			<option value="lymphadenopathy">Lymphadenopathy</option>
			<option value="characterise-lesion">Characterise lesion</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" required inputId="clinicalQuestion">
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={2}
			required
			placeholder="e.g. Confirm or exclude malignancy and provide tissue for molecular typing."
			bind:value={d.clinicalQuestion}
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput id="relevantHistory" label="Relevant history" rows={2} bind:value={d.relevantHistory} />
	</Field>
</Fieldset>
