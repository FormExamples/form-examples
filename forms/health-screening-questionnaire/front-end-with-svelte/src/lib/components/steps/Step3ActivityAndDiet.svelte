<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS } from '$lib/config/options';
	import { questionnaireStore } from '$lib/stores/questionnaire.svelte';

	const d = questionnaireStore.data;
</script>

<Fieldset legend="3. Lifestyle — Activity and Diet">
	<p class="hint">Usual activity level and eating pattern.</p>

	<Field label="Usual activity level" inputId="activityDiet-usualActivityLevel">
		<Select id="activityDiet-usualActivityLevel" label="Usual activity level" bind:value={d.activityDiet.usualActivityLevel}>
			<option value="">— Select —</option>
			{#each OPTIONS.usualActivityLevel as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Days of moderate exercise per week" inputId="activityDiet-moderateExerciseDaysPerWeek">
		<NumberInput id="activityDiet-moderateExerciseDaysPerWeek" label="Days of moderate exercise per week"
			min={0} max={7} bind:value={d.activityDiet.moderateExerciseDaysPerWeek} />
	</Field>
	<Field label="Fruit and vegetable portions per day" inputId="activityDiet-fruitAndVegetablePortionsPerDay">
		<NumberInput id="activityDiet-fruitAndVegetablePortionsPerDay" label="Fruit and vegetable portions per day"
			min={0} max={20} bind:value={d.activityDiet.fruitAndVegetablePortionsPerDay} />
	</Field>
	<Field label="Diet notes" inputId="activityDiet-dietNotes">
		<TextAreaInput id="activityDiet-dietNotes" label="Diet notes" rows={2} bind:value={d.activityDiet.dietNotes} />
	</Field>
</Fieldset>
