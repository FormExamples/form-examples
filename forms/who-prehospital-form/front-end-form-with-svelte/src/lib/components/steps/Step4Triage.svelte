<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const t = assessment.data.triage;

	const triageOptions = [
		{ value: 'red', label: 'RED — Immediate / life-threatening' },
		{ value: 'yellow', label: 'YELLOW — Urgent' },
		{ value: 'green', label: 'GREEN — Non-urgent' }
	];
</script>

<SectionCard
	title="Triage"
	description="Assign a triage category and record the reasoning."
>
	<RadioGroup
		label="Triage category"
		name="triageCategory"
		options={triageOptions}
		bind:value={t.category}
		required
	/>
	<TextInput label="Triaged for" name="triagedFor" bind:value={t.triagedFor} />
</SectionCard>
