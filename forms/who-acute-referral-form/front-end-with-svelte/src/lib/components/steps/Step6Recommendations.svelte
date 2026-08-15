<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Checkbox from '#lib/components/ui/Checkbox.svelte';

	const r = assessment.data.recommendations;
</script>

<Fieldset
	title="Recommendations"
	description="The fourth part of the SBAR framework. Treatment plan during transport, anticipated worsening, cautions and precautions."
>
	<TextAreaInput
		label="Next steps in treatment plan, including therapies continued during transport"
		name="treatmentPlanDuringTransport"
		bind:value={r.treatmentPlanDuringTransport}
		rows={4}
		required
	/>

	<TextAreaInput
		label="Potential worsening of patient condition (anticipated deterioration during transit)"
		name="potentialWorseningOfCondition"
		bind:value={r.potentialWorseningOfCondition}
		rows={3}
	/>

	<TextAreaInput
		label="Cautions regarding prior therapies or interventions"
		name="cautionsRegardingPriorTherapies"
		bind:value={r.cautionsRegardingPriorTherapies}
		rows={3}
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Precautions</h3>
	<p class="mb-3 text-xs text-base-content/60">Tick any that apply to this patient.</p>
	<Checkbox
		label="Highly infectious disease"
		name="highlyInfectiousDisease"
		bind:checked={r.precautions.highlyInfectiousDisease}
	/>
	<Checkbox
		label="Spinal precautions"
		name="spinalPrecautions"
		bind:checked={r.precautions.spinalPrecautions}
	/>
	<Checkbox
		label="Weight-bearing restrictions"
		name="weightBearingRestrictions"
		bind:checked={r.precautions.weightBearingRestrictions}
	/>
	<Checkbox label="Fall risk" name="fallRisk" bind:checked={r.precautions.fallRisk} />
	<Checkbox
		label="Aspiration risk"
		name="aspirationRisk"
		bind:checked={r.precautions.aspirationRisk}
	/>
	<Checkbox label="Other" name="otherPrecaution" bind:checked={r.precautions.other} />

	{#if r.precautions.other}
		<TextAreaInput
			label="Describe other precaution"
			name="otherPrecautionDetails"
			bind:value={r.precautions.otherDetails}
			rows={2}
			required
		/>
	{/if}
</Fieldset>
