<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const v = assessment.data.vpShunt;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<SectionCard
	title="Question 8 — VP shunt"
	description="A ventriculoperitoneal (VP) shunt drains excess cerebrospinal fluid from the brain."
>
	<RadioGroup
		label="Have you ever had an insertion or upper end revision of a VP shunt or external ventricular drain?"
		name="hadVpShunt"
		options={yesNo}
		bind:value={v.hadVpShuntOrDrain}
		required
	/>

	{#if v.hadVpShuntOrDrain === 'yes'}
		<TextInput
			label="Date of procedure"
			name="vpShuntDate"
			type="date"
			bind:value={v.procedureDate}
			required
		/>
	{/if}
</SectionCard>
