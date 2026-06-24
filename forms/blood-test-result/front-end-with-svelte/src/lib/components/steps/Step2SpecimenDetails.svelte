<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Specimen Details">
	<p class="hint">The specimen analysed and its condition / quality.</p>

	<Field label="Specimen type" inputId="specimenType">
		<Select id="specimenType" label="Specimen type" bind:value={d.specimenType}>
			<option value="">Select…</option>
			<option value="serum">Serum</option>
			<option value="plasma">Plasma</option>
			<option value="whole-blood">Whole blood</option>
		</Select>
	</Field>

	<Field label="Specimen condition" inputId="specimenCondition">
		<Select id="specimenCondition" label="Specimen condition" bind:value={d.specimenCondition}>
			<option value="">Select…</option>
			<option value="satisfactory">Satisfactory</option>
			<option value="haemolysed">Haemolysed</option>
			<option value="lipaemic">Lipaemic</option>
			<option value="clotted">Clotted</option>
			<option value="insufficient">Insufficient</option>
		</Select>
	</Field>

	{#if d.specimenCondition === 'haemolysed' || d.specimenCondition === 'clotted' || d.specimenCondition === 'insufficient'}
		<Alert type="warning" heading="Specimen quality may affect results">
			<p>
				The specimen condition may reduce result reliability and will raise an
				inadequate-specimen safety flag. Consider repeating the test on a fresh specimen.
			</p>
		</Alert>
	{/if}
</Fieldset>
