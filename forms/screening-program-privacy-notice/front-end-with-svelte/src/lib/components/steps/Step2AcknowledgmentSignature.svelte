<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const ack = assessment.data.acknowledgment;

	if (!ack.patientTypedDate) {
		ack.patientTypedDate = new Date().toISOString().slice(0, 10);
	}
</script>

<Fieldset title="Acknowledgment & Signature" description="Please confirm you have read and understood the screening program privacy notice.">
	<div class="mb-6">
		<label
			class="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors {ack.agreed
				? 'border-primary bg-primary/10'
				: 'border-base-300 bg-base-100 hover:bg-base-200'}"
		>
			<input id="agreed" type="checkbox" bind:checked={ack.agreed} class="mt-0.5 accent-primary" />
			<span class="text-sm text-base-content/80">
				I have read and understood the above screening program privacy notice. I understand how my
				information is used across the NHS national screening programmes.
				<span class="text-error">*</span>
			</span>
		</label>
	</div>

	<TextInput label="Full Name" name="patientTypedFullName" bind:value={ack.patientTypedFullName} placeholder="Type your full name" required />
	<TextInput label="Today's Date" name="patientTypedDate" bind:value={ack.patientTypedDate} type="date" required />
</Fieldset>
