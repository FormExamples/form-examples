<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	const m = assessment.data.medication;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<SectionCard
	title="Question 7 — Medication"
	description="Please list any medication that you take or have taken for this condition. If you take none, tick the box below."
>
	<Checkbox
		label="No medication taken"
		name="noMedicationTaken"
		bind:checked={m.noMedicationTaken}
	/>

	{#if !m.noMedicationTaken}
		<div class="space-y-4">
			{#each m.entries as entry, i (i)}
				<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
					<h4 class="mb-2 text-sm font-semibold text-gray-700">Medication {i + 1}</h4>
					<TextInput
						label="Name of medication"
						name={`medName${i}`}
						bind:value={entry.name}
						placeholder="e.g. Levetiracetam 500mg twice daily"
					/>
					<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
						<TextInput
							label="Start date"
							name={`medStart${i}`}
							type="date"
							bind:value={entry.startDate}
						/>
						<TextInput
							label="End date (leave blank if ongoing)"
							name={`medEnd${i}`}
							type="date"
							bind:value={entry.endDate}
						/>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-6">
			<RadioGroup
				label="a) Does your medication make you drowsy or confused when driving?"
				name="medMakesDrowsy"
				options={yesNo}
				bind:value={m.makesDrowsyOrConfused}
				required
			/>
		</div>
	{/if}
</SectionCard>
