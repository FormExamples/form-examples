<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.consent;
</script>

<Fieldset legend="Step 4 of 9 — Consent">
	<p class="hint">
		Informed consent to take the sample and process the result. A result must not be reported
		without recorded consent.
	</p>

	<Field label="Informed consent given" required inputId="consent-consentGiven">
		<Select id="consent-consentGiven" label="Informed consent given" required bind:value={c.consentGiven}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
