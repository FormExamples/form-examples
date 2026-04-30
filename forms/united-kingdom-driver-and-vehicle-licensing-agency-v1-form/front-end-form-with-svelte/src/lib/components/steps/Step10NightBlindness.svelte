<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const n = assessment.data.nightBlindness;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<SectionCard
	title="Question 8 — Night Blindness (Nyctalopia)"
	description="Night blindness is difficulty seeing in low light or darkness."
>
	<RadioGroup
		label="Do you have night blindness?"
		name="nbHasCondition"
		options={yesNoOptions}
		bind:value={n.hasCondition}
		required
	/>

	{#if n.hasCondition === 'yes'}
		<div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
			<RadioGroup
				label="8a) Which eye(s) are affected?"
				name="nbWhichEyes"
				options={[
					{ value: 'both', label: 'Both eyes' },
					{ value: 'left', label: 'Left eye' },
					{ value: 'right', label: 'Right eye' }
				]}
				bind:value={n.whichEyes}
				required
			/>
		</div>
	{/if}
</SectionCard>
