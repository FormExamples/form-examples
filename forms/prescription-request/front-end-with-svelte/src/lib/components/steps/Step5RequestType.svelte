<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const r = assessment.data.requestType;

	const newRefill = [
		{ value: 'yes', label: 'New Prescription' },
		{ value: 'no', label: 'Refill / Repeat' }
	];

	const emergency = [
		{ value: 'yes', label: 'Emergency' },
		{ value: 'no', label: 'Normal' }
	];
</script>

<Fieldset legend="Request Type">
	<p class="hint">Classify this prescription request.</p>

	<Field label="Is this a new prescription or a refill?" required>
		<RadioGroup label="Is this a new prescription or a refill?">
			{#each newRefill as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="isNew" value={opt.value} bind:group={r.isNewPrescription} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Is this an emergency request?" required>
		<RadioGroup label="Is this an emergency request?">
			{#each emergency as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="isEmergency" value={opt.value} bind:group={r.isEmergency} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Additional Notes" inputId="additionalNotes">
		<TextAreaInput id="additionalNotes" label="Additional Notes" placeholder="Any other information relevant to this request..." bind:value={r.additionalNotes} />
	</Field>
</Fieldset>
