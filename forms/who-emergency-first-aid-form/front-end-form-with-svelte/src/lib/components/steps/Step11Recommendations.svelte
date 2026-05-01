<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	const r = assessment.data.recommendations;
</script>

<SectionCard
	title="Recommendations"
	description="Plan for ongoing care, anticipated problems, and precautions to flag for the receiving facility."
>
	<TextArea
		label="Next steps in transport plan"
		name="transportPlan"
		bind:value={r.transportPlan}
		rows={3}
		required
	/>
	<TextArea
		label="Any problems anticipated"
		name="problemsAnticipated"
		bind:value={r.problemsAnticipated}
		rows={3}
	/>
	<TextArea
		label="Any other concerns"
		name="otherConcerns"
		bind:value={r.otherConcerns}
		rows={3}
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Precautions</h3>
	<p class="mb-3 text-sm text-gray-600">Tick all that apply.</p>
	<Checkbox
		label="Highly infectious disease"
		name="pcInfectious"
		bind:checked={r.precautions.highlyInfectiousDisease}
	/>
	<Checkbox
		label="Spinal immobilization"
		name="pcSpinal"
		bind:checked={r.precautions.spinalImmobilization}
	/>
	<Checkbox
		label="Possible fracture"
		name="pcFracture"
		bind:checked={r.precautions.possibleFracture}
	/>
	<Checkbox
		label="Fall risk"
		name="pcFallRisk"
		bind:checked={r.precautions.fallRisk}
	/>
	<Checkbox
		label="Altered mental status"
		name="pcAlteredMentalStatus"
		bind:checked={r.precautions.alteredMentalStatus}
	/>
	<Checkbox label="Other" name="pcOther" bind:checked={r.precautions.other} />
	{#if r.precautions.other}
		<div class="-mt-2 mb-3 ml-6 rounded-lg border border-amber-300 bg-amber-50 p-3">
			<TextInput
				label="Describe other precaution"
				name="pcOtherDetails"
				bind:value={r.precautions.otherDetails}
				required
			/>
		</div>
	{/if}
</SectionCard>
