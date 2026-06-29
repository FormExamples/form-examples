<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { requestStore } from '$lib/stores/request.svelte';

	const d = requestStore.data.symptoms;
</script>

<Fieldset legend="4. Symptoms">
	<p class="hint">
		Symptoms drive the clinical-priority axis and the NICE NG12 two-week-wait triggers.
	</p>

	<Field label="Breast symptoms">
		<CheckboxGroup label="Breast symptoms">
			<label><CheckboxInput label="Breast lump" bind:checked={d.symptomLump} /> Breast lump</label>
			<label><CheckboxInput label="Breast pain" bind:checked={d.symptomPain} /> Breast pain</label>
			<label
				><CheckboxInput label="Nipple discharge" bind:checked={d.symptomNippleDischarge} /> Nipple
				discharge</label
			>
			<label
				><CheckboxInput label="Skin change" bind:checked={d.symptomSkinChange} /> Skin change
				(dimpling, peau d’orange, erythema)</label
			>
			<label
				><CheckboxInput label="New nipple inversion / retraction" bind:checked={d.symptomNippleInversion} />
				New nipple inversion / retraction</label
			>
		</CheckboxGroup>
	</Field>

	{#if d.symptomLump || d.symptomSkinChange || d.symptomNippleInversion || d.symptomNippleDischarge}
		<Alert type="warning" heading="Suspected-cancer symptom recorded">
			<p>
				A reported lump, skin change, nipple change, or discharge may meet NICE NG12 two-week-wait
				criteria depending on the patient's age, and escalates the clinical-priority axis.
			</p>
		</Alert>
	{/if}
</Fieldset>
