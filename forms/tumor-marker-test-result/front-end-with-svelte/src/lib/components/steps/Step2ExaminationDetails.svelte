<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Specimen & Context">
	<p class="hint">Specimen condition, clinical history, and any known cancer site.</p>

	<Field label="Specimen condition" inputId="specimenCondition">
		<Select id="specimenCondition" label="Specimen condition" bind:value={d.specimenCondition}>
			<option value="">Select…</option>
			<option value="satisfactory">Satisfactory</option>
			<option value="haemolysed">Haemolysed</option>
			<option value="lipaemic">Lipaemic</option>
			<option value="insufficient">Insufficient</option>
		</Select>
	</Field>

	<Field label="Known cancer site" inputId="knownCancerSite">
		<TextInput
			id="knownCancerSite"
			label="Known cancer site"
			placeholder="e.g. ovary, testis, colorectal"
			bind:value={d.knownCancerSite}
		/>
	</Field>

	<Field label="Clinical history" inputId="clinicalHistory">
		<TextAreaInput
			id="clinicalHistory"
			label="Clinical history"
			rows={3}
			placeholder="Clinical history and the question the test was performed to answer…"
			bind:value={d.clinicalHistory}
		/>
	</Field>
</Fieldset>
