<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const r = assessment.data.recentContact;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset
	title="Question 11 — Recent Contact"
	description="Recent contact with your healthcare professional or optician/optometrist about your vision."
>
	<RadioGroup
		label="Have you had any contact (telephone, video, or face to face) with your healthcare professional or optician/optometrist about your vision condition in the last 12 months?"
		name="rcHadContact"
		options={yesNoOptions}
		bind:value={r.hadContact}
		required
	/>

	{#if r.hadContact === 'yes'}
		<div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
			<TextInput
				label="11a) Date of contact"
				name="rcDateOfContact"
				type="date"
				bind:value={r.dateOfContact}
				required
			/>
		</div>
	{/if}
</Fieldset>
