<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateOttawaDecision } from '$lib/engine/ottawa-ankle-grader';
	import { weightBearingColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	const w = assessment.data.weightBearing;
	const unable = $derived(calculateOttawaDecision(assessment.data).unableToBearWeight);
	const note = $derived(
		unable
			? 'cannot take four steps both immediately and now — feeds both decisions'
			: 'able at either time point, or not yet answered'
	);
</script>

<Fieldset legend="Step 7 of 8 — Weight-bearing">
	<p class="hint">
		Criteria A3 / F3. "Unable to bear weight" requires that the patient cannot take four steps (two
		on each foot) BOTH immediately after the injury AND now — and it feeds both decisions.
	</p>

	<Field label="Able to take four steps (two on each foot) immediately after the injury?">
		<RadioGroup label="Able to bear weight immediately">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="weightBearing-ableToBearWeightImmediately"
					value="yes"
					bind:group={w.ableToBearWeightImmediately}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="weightBearing-ableToBearWeightImmediately"
					value="no"
					bind:group={w.ableToBearWeightImmediately}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Able to take four steps now, at assessment?">
		<RadioGroup label="Able to bear weight now">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="weightBearing-ableToBearWeightNow"
					value="yes"
					bind:group={w.ableToBearWeightNow}
				/> Yes
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="weightBearing-ableToBearWeightNow"
					value="no"
					bind:group={w.ableToBearWeightNow}
				/> No
			</label>
		</RadioGroup>
	</Field>

	<Field label="Unable to bear weight">
		<span class="inline-flex flex-wrap items-center gap-3">
			<Badge label={unable ? 'Yes' : 'No'} colorClass={weightBearingColor(unable)} />
			<span class="text-sm text-base-content/60">({note})</span>
		</span>
	</Field>
</Fieldset>
