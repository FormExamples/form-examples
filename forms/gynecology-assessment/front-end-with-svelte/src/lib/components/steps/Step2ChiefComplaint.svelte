<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.chiefComplaint;
</script>

<Fieldset title="Chief Complaint" description="Describe your primary gynaecological concern">
	<TextAreaInput
		label="What is your primary gynaecological concern?"
		name="primaryConcern"
		bind:value={c.primaryConcern}
		placeholder="Describe your main concern..."
	/>

	<TextInput
		label="How long have you had this concern?"
		name="duration"
		bind:value={c.duration}
		placeholder="e.g., 2 weeks, 3 months, 5 years"
		required
	/>

	<RadioGroup
		label="How has the condition been changing?"
		name="progression"
		options={[
			{ value: 'stable', label: 'Stable' },
			{ value: 'improving', label: 'Improving' },
			{ value: 'worsening', label: 'Worsening' },
			{ value: 'fluctuating', label: 'Fluctuating' }
		]}
		bind:value={c.progression}
		required
	/>

	<TextAreaInput
		label="Previous treatments tried"
		name="previousTreatments"
		bind:value={c.previousTreatments}
		placeholder="List any treatments you have tried for this condition..."
	/>
</Fieldset>
