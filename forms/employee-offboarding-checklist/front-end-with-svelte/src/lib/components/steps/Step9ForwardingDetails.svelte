<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import YesNoRadio from '$lib/components/ui/YesNoRadio.svelte';

	const d = assessment.data.forwardingDetails;
</script>

<Fieldset legend="Forwarding Details">
	<p class="hint">Capture a forwarding address and personal contact details for future correspondence.</p>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Address line 1" inputId="forwardingAddressLine1">
			<TextInput id="forwardingAddressLine1" label="Address line 1" bind:value={d.forwardingAddressLine1} />
		</Field>
		<Field label="Address line 2" inputId="forwardingAddressLine2">
			<TextInput id="forwardingAddressLine2" label="Address line 2" bind:value={d.forwardingAddressLine2} />
		</Field>
		<Field label="City / town" inputId="forwardingCity">
			<TextInput id="forwardingCity" label="City / town" bind:value={d.forwardingCity} />
		</Field>
		<Field label="Postcode" inputId="forwardingPostcode">
			<TextInput id="forwardingPostcode" label="Postcode" bind:value={d.forwardingPostcode} />
		</Field>
		<Field label="Country" inputId="forwardingCountry">
			<TextInput id="forwardingCountry" label="Country" bind:value={d.forwardingCountry} />
		</Field>
		<Field label="Personal email" inputId="personalEmail">
			<TextInput id="personalEmail" label="Personal email" bind:value={d.personalEmail} />
		</Field>
		<Field label="Personal phone" inputId="personalPhone">
			<TextInput id="personalPhone" label="Personal phone" bind:value={d.personalPhone} />
		</Field>
		<Field label="Forwarding details confirmed">
			<YesNoRadio label="Forwarding details confirmed" name="forwardingDetailsConfirmed" bind:value={d.forwardingDetailsConfirmed} />
		</Field>
	</div>

	<Field label="Notes" inputId="forwardingNotes">
		<TextAreaInput id="forwardingNotes" label="Notes" rows={3} bind:value={d.forwardingNotes} />
	</Field>
</Fieldset>
