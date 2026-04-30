<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const t = assessment.data.treatmentProvider;
</script>

<SectionCard
	title="Question 2 — Treatment provider"
	description="Tell us who you most recently saw for the treatment of this condition."
>
	<RadioGroup
		label="Who did you last see for the treatment of this condition?"
		name="lastSeen"
		options={[
			{ value: 'gp', label: 'GP' },
			{ value: 'consultant', label: 'Consultant' }
		]}
		bind:value={t.lastSeen}
		required
	/>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">
		a) Dates of consultations for this condition
	</h3>

	{#if t.lastSeen === 'gp'}
		<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
			<TextInput
				label="GP — date of last contact"
				name="gpLastContact"
				type="date"
				bind:value={t.gpLastContactDate}
				required
			/>
			<TextInput
				label="GP — date of next contact"
				name="gpNextContact"
				type="date"
				bind:value={t.gpNextContactDate}
			/>
		</div>
	{/if}

	{#if t.lastSeen === 'consultant'}
		<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
			<TextInput
				label="Consultant — date of last contact"
				name="consLastContact"
				type="date"
				bind:value={t.consultantLastContactDate}
				required
			/>
			<TextInput
				label="Consultant — date of next contact"
				name="consNextContact"
				type="date"
				bind:value={t.consultantNextContactDate}
			/>
		</div>
	{/if}
</SectionCard>
