<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import LikertField from '#lib/components/ui/LikertField.svelte';

	const d = assessment.data.overallExperience;

	const nhsScale = Array.from({ length: 11 }, (_, i) => i);
</script>

<Fieldset legend="Overall Experience">
	<p class="hint">How would you rate your overall experience?</p>

	<LikertField label="Overall satisfaction with this visit" name="overallSatisfaction" anchorId="overallSatisfaction" bind:value={d.overallSatisfaction} />
	<LikertField label="I would recommend this service to friends and family" name="wouldRecommend" bind:value={d.wouldRecommend} />
	<LikertField label="The service met my expectations" name="metExpectations" bind:value={d.metExpectations} />
	<LikertField label="I felt safe during this visit" name="feltSafe" bind:value={d.feltSafe} />
	<LikertField label="I would return to this service if I needed similar care" name="wouldReturn" bind:value={d.wouldReturn} />

	<Field label="Overall, on a scale of 0 to 10, how would you rate this service? (0 = worst, 10 = best)">
		<RadioGroup label="NHS rating 0 to 10">
			{#each nhsScale as n (n)}
				<label class="nhs-option">
					<input type="radio" class="radio-input" name="nhsRating" value={n} bind:group={d.nhsRating} />
					<span>{n}</span>
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>

<style>
	.nhs-option {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		margin-right: 0.75rem;
	}
</style>
