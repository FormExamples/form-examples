<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;
</script>

<Fieldset legend="8. Dietary Recall">
	<p class="hint">Typical daily intake, meal frequency, and portion sizes, recorded as a 24-hour recall by eating occasion.</p>

	<Field label="Meals per day" inputId="dietaryRecall-mealsPerDay">
		<NumberInput id="dietaryRecall-mealsPerDay" label="Meals per day" min={0} max={12} bind:value={d.dietaryRecall.mealsPerDay} />
	</Field>
	<Field label="Snacks per day" inputId="dietaryRecall-snacksPerDay">
		<NumberInput id="dietaryRecall-snacksPerDay" label="Snacks per day" min={0} max={12} bind:value={d.dietaryRecall.snacksPerDay} />
	</Field>
	<Field label="Breakfast" inputId="dietaryRecall-recallBreakfast">
		<TextAreaInput id="dietaryRecall-recallBreakfast" label="Breakfast" rows={2} bind:value={d.dietaryRecall.recallBreakfast} />
	</Field>
	<Field label="Mid-morning" inputId="dietaryRecall-recallMidMorning">
		<TextAreaInput id="dietaryRecall-recallMidMorning" label="Mid-morning" rows={2} bind:value={d.dietaryRecall.recallMidMorning} />
	</Field>
	<Field label="Lunch" inputId="dietaryRecall-recallLunch">
		<TextAreaInput id="dietaryRecall-recallLunch" label="Lunch" rows={2} bind:value={d.dietaryRecall.recallLunch} />
	</Field>
	<Field label="Afternoon" inputId="dietaryRecall-recallAfternoon">
		<TextAreaInput id="dietaryRecall-recallAfternoon" label="Afternoon" rows={2} bind:value={d.dietaryRecall.recallAfternoon} />
	</Field>
	<Field label="Dinner" inputId="dietaryRecall-recallDinner">
		<TextAreaInput id="dietaryRecall-recallDinner" label="Dinner" rows={2} bind:value={d.dietaryRecall.recallDinner} />
	</Field>
	<Field label="Evening" inputId="dietaryRecall-recallEvening">
		<TextAreaInput id="dietaryRecall-recallEvening" label="Evening" rows={2} bind:value={d.dietaryRecall.recallEvening} />
	</Field>
	<Field label="Portion size" inputId="dietaryRecall-portionSize">
		<Select id="dietaryRecall-portionSize" label="Portion size" bind:value={d.dietaryRecall.portionSize}>
			<option value="">— Select —</option>
			{#each OPTIONS.portionSize as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Appetite" inputId="dietaryRecall-appetite">
		<Select id="dietaryRecall-appetite" label="Appetite" bind:value={d.dietaryRecall.appetite}>
			<option value="">— Select —</option>
			{#each OPTIONS.appetite as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Appetite score (0–10)" inputId="dietaryRecall-appetiteScore0To10">
		<NumberInput id="dietaryRecall-appetiteScore0To10" label="Appetite score (0–10)" min={0} max={10} bind:value={d.dietaryRecall.appetiteScore0To10} />
	</Field>
	<Field label="Intake as a proportion of usual (%)" inputId="dietaryRecall-proportionOfUsualIntakePercent" description="At or below 50% satisfies the GLIM reduced-intake criterion.">
		<NumberInput id="dietaryRecall-proportionOfUsualIntakePercent" label="Intake as a proportion of usual (%)" min={0} max={200} bind:value={d.dietaryRecall.proportionOfUsualIntakePercent} />
	</Field>
	<Field label="Meals eaten out per week" inputId="dietaryRecall-mealsOutPerWeek">
		<NumberInput id="dietaryRecall-mealsOutPerWeek" label="Meals eaten out per week" min={0} max={30} bind:value={d.dietaryRecall.mealsOutPerWeek} />
	</Field>
	<Field label="Takeaways per week" inputId="dietaryRecall-takeawaysPerWeek">
		<NumberInput id="dietaryRecall-takeawaysPerWeek" label="Takeaways per week" min={0} max={30} bind:value={d.dietaryRecall.takeawaysPerWeek} />
	</Field>
	<Field label="Estimated energy intake (kcal/day)" inputId="dietaryRecall-estimatedEnergyIntakeKcal">
		<NumberInput id="dietaryRecall-estimatedEnergyIntakeKcal" label="Estimated energy intake (kcal/day)" min={0} max={10000} bind:value={d.dietaryRecall.estimatedEnergyIntakeKcal} />
	</Field>
	<Field label="Estimated protein intake (g/day)" inputId="dietaryRecall-estimatedProteinIntakeG">
		<NumberInput id="dietaryRecall-estimatedProteinIntakeG" label="Estimated protein intake (g/day)" min={0} max={500} bind:value={d.dietaryRecall.estimatedProteinIntakeG} />
	</Field>
	<Field label="Food diary completed" inputId="dietaryRecall-foodDiaryCompleted">
		<Select id="dietaryRecall-foodDiaryCompleted" label="Food diary completed" bind:value={d.dietaryRecall.foodDiaryCompleted}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Usually eats alone" inputId="dietaryRecall-eatsAlone">
		<Select id="dietaryRecall-eatsAlone" label="Usually eats alone" bind:value={d.dietaryRecall.eatsAlone}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Dietary recall notes" inputId="dietaryRecall-dietaryRecallNotes">
		<TextAreaInput id="dietaryRecall-dietaryRecallNotes" label="Dietary recall notes" rows={2} bind:value={d.dietaryRecall.dietaryRecallNotes} />
	</Field>
</Fieldset>
