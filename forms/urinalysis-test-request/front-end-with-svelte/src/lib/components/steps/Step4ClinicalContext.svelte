<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { requestStore } from '$lib/stores/request.svelte';

	const d = requestStore.data.context;
</script>

<Fieldset legend="4. Clinical Context">
	<p class="hint">Indication and clinical details — the highest-value fields that drive every axis.</p>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.primaryIndication} required>
			<option value="">Select…</option>
			<option value="suspected-uti">Suspected UTI</option>
			<option value="haematuria">Haematuria</option>
			<option value="proteinuria">Proteinuria</option>
			<option value="diabetes-monitoring">Diabetes monitoring</option>
			<option value="renal-monitoring">Renal monitoring</option>
			<option value="pregnancy-screen">Pregnancy screen</option>
			<option value="pre-operative">Pre-operative</option>
			<option value="catheter-related">Catheter-related</option>
			<option value="suspected-malignancy">Suspected malignancy</option>
			<option value="drug-monitoring">Drug monitoring</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Clinical details" inputId="clinicalDetails" required>
		<TextAreaInput
			id="clinicalDetails"
			label="Clinical details"
			rows={3}
			placeholder="e.g. 72F, recurrent lower-UTI symptoms, two prior treatment failures."
			bind:value={d.clinicalDetails}
		/>
	</Field>

	<Field label="Modifiers">
		<CheckboxGroup label="Modifiers">
			<label><CheckboxInput label="Pregnant" bind:checked={d.pregnant} /> Pregnant</label>
			<label><CheckboxInput label="Catheterised" bind:checked={d.catheterised} /> Catheterised</label>
			<label><CheckboxInput label="Currently on antibiotics" bind:checked={d.currentAntibiotics} /> Currently on antibiotics</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
