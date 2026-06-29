<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.specimen;
</script>

<Fieldset legend="3. Specimen">
	<p class="hint">The specimen type and site, and its collection status.</p>

	<Field label="Specimen type" inputId="specimenType" required>
		<Select id="specimenType" label="Specimen type" bind:value={d.specimenType} required>
			<option value="">Select…</option>
			<option value="blood-culture">Blood culture</option>
			<option value="urine">Urine</option>
			<option value="wound-swab">Wound swab</option>
			<option value="sputum">Sputum</option>
			<option value="throat-swab">Throat swab</option>
			<option value="stool">Stool</option>
			<option value="csf">CSF</option>
			<option value="tissue">Tissue</option>
			<option value="catheter-tip">Catheter tip</option>
			<option value="genital-swab">Genital swab</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specimen site detail" inputId="specimenSiteDetail">
		<TextInput
			id="specimenSiteDetail"
			label="Specimen site detail"
			placeholder="e.g. left leg ulcer, midstream urine"
			bind:value={d.specimenSiteDetail}
		/>
	</Field>

	<Field label="Specimen collected?" inputId="specimenCollected">
		<Select id="specimenCollected" label="Specimen collected?" bind:value={d.specimenCollected}>
			<option value="">Select…</option>
			<option value="yes">Yes — collected</option>
			<option value="no">No — not yet collected</option>
		</Select>
	</Field>

	<Field label="Collection date / time" inputId="collectionDatetime" description="Starts the transport clock for time-critical specimens.">
		<TextInput
			id="collectionDatetime"
			label="Collection date / time"
			type="datetime-local"
			bind:value={d.collectionDatetime}
		/>
	</Field>
</Fieldset>
