<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.consent;
</script>

<Fieldset legend="Step 3 of 6 — Consent">
	<p class="hint">
		Informed consent to the ultrasound scan and whether the programme information leaflet was
		provided.
	</p>

	<Field label="Informed consent given" inputId="consent-consentGiven">
		<Select id="consent-consentGiven" label="Informed consent given" bind:value={c.consentGiven}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Information leaflet provided" inputId="consent-leafletProvided">
		<Select
			id="consent-leafletProvided"
			label="Information leaflet provided"
			bind:value={c.leafletProvided}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Consent note" inputId="consent-consentNote">
		<TextAreaInput
			id="consent-consentNote"
			label="Consent note"
			rows={3}
			placeholder="Any refusal, query, or capacity detail."
			bind:value={c.consentNote}
		/>
	</Field>
</Fieldset>
