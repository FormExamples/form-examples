<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import EmailInput from '#lib/components/ui/EmailInput.svelte';

	const r = assessment.data.authorizedRecipient;
</script>

<Fieldset legend="Authorized Recipient">
	<p class="hint">Details of the person or organization who will receive the medical records.</p>

	<Field label="Recipient Name" required inputId="recipientName">
		<TextInput id="recipientName" label="Recipient Name" required placeholder="e.g., Dr James Wilson" bind:value={r.recipientName} />
	</Field>

	<Field label="Organization" required inputId="recipientOrganization">
		<TextInput
			id="recipientOrganization"
			label="Organization"
			required
			placeholder="e.g., Royal London Hospital"
			bind:value={r.recipientOrganization}
		/>
	</Field>

	<Field label="Address" required inputId="recipientAddress">
		<TextInput
			id="recipientAddress"
			label="Address"
			required
			placeholder="Full postal address of the recipient"
			bind:value={r.recipientAddress}
		/>
	</Field>

	<div class="field-grid">
		<Field label="Phone Number" inputId="recipientPhone">
			<TextInput id="recipientPhone" label="Phone Number" placeholder="e.g., 020 7377 7000" bind:value={r.recipientPhone} />
		</Field>
		<Field label="Email Address" inputId="recipientEmail">
			<EmailInput id="recipientEmail" label="Email Address" placeholder="e.g., recipient@nhs.uk" bind:value={r.recipientEmail} />
		</Field>
	</div>

	<Field label="Role / Title" inputId="recipientRole">
		<TextInput id="recipientRole" label="Role / Title" placeholder="e.g., Consultant Neurologist" bind:value={r.recipientRole} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
