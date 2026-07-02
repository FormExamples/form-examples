<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const o = assessment.data.observations;
</script>

<Fieldset legend="Step 5 of 6 — Clinical observations">
	<p class="hint">
		Symptoms and any incidental findings. A symptomatic patient with an aneurysm present is flagged
		for emergency assessment.
	</p>

	<Field
		label="Symptomatic (abdominal or back pain / tenderness)"
		inputId="observations-symptomatic"
	>
		<Select
			id="observations-symptomatic"
			label="Symptomatic (abdominal or back pain / tenderness)"
			bind:value={o.symptomatic}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Incidental findings" inputId="observations-incidentalFindings">
		<TextAreaInput
			id="observations-incidentalFindings"
			label="Incidental findings"
			rows={3}
			placeholder="Any incidental findings noted during the scan."
			bind:value={o.incidentalFindings}
		/>
	</Field>
</Fieldset>
