<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const t = assessment.data.triage;

	const triageOptions = [
		{ value: 'red', label: 'RED (Immediate)' },
		{ value: 'yellow', label: 'YELLOW (Urgent)' },
		{ value: 'green', label: 'GREEN (Non-urgent)' }
	];
</script>

<Fieldset
	title="Triage"
	description="Assign a triage category and record what triage was based on. Treating provider assessment date and time may also be recorded here."
>
	<RadioGroup
		label="Triage category"
		name="triageCategory"
		options={triageOptions}
		bind:value={t.category}
		required
	/>

	<TextInput
		label="Triaged for (free text)"
		name="triagedFor"
		bind:value={t.triagedFor}
		placeholder="e.g. polytrauma; chest injury"
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Treating provider assessment</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Date" name="providerAssessmentDate" type="date" bind:value={t.providerAssessmentDate} />
		<TextInput label="Time (24h)" name="providerAssessmentTime" type="time" bind:value={t.providerAssessmentTime} />
	</div>
</Fieldset>
