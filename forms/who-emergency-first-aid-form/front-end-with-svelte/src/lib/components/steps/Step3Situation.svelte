<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.situation;

	const yesNoUnknown = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset
	title="Situation"
	description="Classify the problem (medical, trauma or both), pregnancy status, and what happened."
>
	<fieldset class="mb-4">
		<legend class="mb-2 block text-sm font-medium text-base-content/80">
			Problem (tick all that apply) <span class="text-error">*</span>
		</legend>
		<Checkbox label="Medical" name="situationMedical" bind:checked={s.medical} />
		<Checkbox label="Trauma" name="situationTrauma" bind:checked={s.trauma} />
	</fieldset>

	<RadioGroup
		label="Pregnant?"
		name="situationPregnant"
		options={yesNoUnknown}
		bind:value={s.pregnant}
		required
	/>

	<TextAreaInput
		label="What happened to the patient"
		name="whatHappened"
		bind:value={s.whatHappened}
		placeholder="Date and time of injury or illness onset, where, how — narrative description."
		rows={4}
		required
	/>
</Fieldset>
