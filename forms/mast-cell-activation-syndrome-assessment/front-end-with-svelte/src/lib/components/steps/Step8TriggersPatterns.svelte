<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const t = assessment.data.triggersPatterns;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Triggers and Patterns">
	<p class="hint">Identify factors that trigger or worsen your symptoms.</p>

	<Field label="Food triggers" inputId="foodTriggers">
		<TextAreaInput
			id="foodTriggers"
			label="Food triggers"
			rows={3}
			placeholder="e.g., alcohol, aged cheese, fermented foods, histamine-rich foods, additives..."
			bind:value={t.foodTriggers}
		/>
	</Field>

	<Field label="Environmental triggers" inputId="environmentalTriggers">
		<TextAreaInput
			id="environmentalTriggers"
			label="Environmental triggers"
			rows={3}
			placeholder="e.g., heat, cold, fragrances, chemicals, pollen, mould..."
			bind:value={t.environmentalTriggers}
		/>
	</Field>

	<Field label="Does emotional stress trigger or worsen your symptoms?">
		<RadioGroup label="Stress triggers">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="stressTriggers" value={opt.value} bind:group={t.stressTriggers} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Does physical exercise trigger or worsen your symptoms?">
		<RadioGroup label="Exercise trigger">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="exerciseTrigger" value={opt.value} bind:group={t.exerciseTrigger} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do temperature changes trigger or worsen your symptoms?">
		<RadioGroup label="Temperature trigger">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="temperatureTrigger" value={opt.value} bind:group={t.temperatureTrigger} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Medication triggers" inputId="medicationTriggers">
		<TextAreaInput
			id="medicationTriggers"
			label="Medication triggers"
			rows={3}
			placeholder="e.g., NSAIDs, opioids, antibiotics, contrast dyes, anaesthetics..."
			bind:value={t.medicationTriggers}
		/>
	</Field>
</Fieldset>
