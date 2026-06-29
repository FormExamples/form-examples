<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.dietaryHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Dietary History">
	<p class="hint">Usual diet pattern, intake, fluids, and lifestyle factors.</p>

	<Field label="Describe your typical diet" inputId="typicalDiet">
		<TextAreaInput id="typicalDiet" label="Typical diet" rows={3} placeholder="e.g. three meals per day with snacks; describe a typical day…" bind:value={d.typicalDiet} />
	</Field>

	<Field label="Diet pattern" inputId="dietPattern">
		<Select id="dietPattern" label="Diet pattern" bind:value={d.dietPattern}>
			<option value="">— Select —</option>
			<option value="omnivore">Omnivore (no restrictions)</option>
			<option value="vegetarian">Vegetarian</option>
			<option value="vegan">Vegan</option>
			<option value="pescatarian">Pescatarian</option>
			<option value="other">Other</option>
		</Select>
	</Field>
	{#if d.dietPattern === 'other'}
		<Field label="Please specify diet pattern" inputId="dietPatternOther">
			<TextInput id="dietPatternOther" label="Diet pattern (other)" bind:value={d.dietPatternOther} />
		</Field>
	{/if}

	<div class="field-grid">
		<Field label="Meals per day" inputId="mealsPerDay">
			<NumberInput id="mealsPerDay" label="Meals per day" min={0} max={10} bind:value={d.mealsPerDay} />
		</Field>
		<Field label="Snacks per day" inputId="snacksPerDay">
			<NumberInput id="snacksPerDay" label="Snacks per day" min={0} max={10} bind:value={d.snacksPerDay} />
		</Field>
	</div>

	<Field label="Has your appetite decreased recently?">
		<RadioGroup label="Appetite decreased">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="appetiteDecreased" value={opt.value} bind:group={d.appetiteDecreased} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.appetiteDecreased === 'yes'}
		<Field label="Appetite change notes" inputId="appetiteChangeNotes">
			<TextAreaInput id="appetiteChangeNotes" label="Appetite change notes" rows={2} placeholder="How long, what changed…" bind:value={d.appetiteChangeNotes} />
		</Field>
	{/if}

	<Field label="Has your food intake been reduced?">
		<RadioGroup label="Food intake reduced">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="foodIntakeReduced" value={opt.value} bind:group={d.foodIntakeReduced} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.foodIntakeReduced === 'yes'}
		<Field label="For how many days?" inputId="reducedIntakeDays">
			<NumberInput id="reducedIntakeDays" label="Reduced intake days" min={0} max={365} bind:value={d.reducedIntakeDays} />
		</Field>
	{/if}

	<Field label="Do you feel your fluid intake is adequate?">
		<RadioGroup label="Fluid intake adequate">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="fluidIntakeAdequate" value={opt.value} bind:group={d.fluidIntakeAdequate} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Estimated fluid intake per day (ml)" inputId="fluidIntakeMlPerDay">
		<NumberInput id="fluidIntakeMlPerDay" label="Fluid intake per day" min={0} max={10000} bind:value={d.fluidIntakeMlPerDay} />
	</Field>

	<Field label="Do you drink alcohol?">
		<RadioGroup label="Alcohol use">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="alcoholUse" value={opt.value} bind:group={d.alcoholUse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.alcoholUse === 'yes'}
		<Field label="Alcohol units per week" inputId="alcoholUnitsPerWeek">
			<NumberInput id="alcoholUnitsPerWeek" label="Alcohol units per week" min={0} max={200} bind:value={d.alcoholUnitsPerWeek} />
		</Field>
	{/if}

	<Field label="Do you have any cultural or religious dietary restrictions?">
		<RadioGroup label="Cultural or religious restrictions">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="culturalReligiousRestrictions" value={opt.value} bind:group={d.culturalReligiousRestrictions} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.culturalReligiousRestrictions === 'yes'}
		<Field label="Details of restrictions" inputId="culturalReligiousDetails">
			<TextAreaInput id="culturalReligiousDetails" label="Cultural or religious details" rows={2} bind:value={d.culturalReligiousDetails} />
		</Field>
	{/if}
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
