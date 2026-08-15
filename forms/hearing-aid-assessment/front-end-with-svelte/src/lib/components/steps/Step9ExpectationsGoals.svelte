<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const eg = assessment.data.expectationsGoals;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const willingnessOptions = [
		{ value: 'very-willing', label: 'Very willing' },
		{ value: 'willing', label: 'Willing' },
		{ value: 'uncertain', label: 'Uncertain' },
		{ value: 'reluctant', label: 'Reluctant' }
	];

	const concernOptions = [
		{ value: 'none', label: 'No concerns' },
		{ value: 'mild', label: 'Mild concerns' },
		{ value: 'moderate', label: 'Moderate concerns' },
		{ value: 'significant', label: 'Significant concerns' }
	];
</script>

<Fieldset legend="Expectations & Goals">
	<p class="hint">Your goals and expectations for hearing aids.</p>

	<Field label="What is your primary goal for hearing improvement?" inputId="primaryGoal">
		<TextAreaInput id="primaryGoal" label="Primary goal" rows={3} placeholder="e.g., better conversation with family, hearing TV clearly, phone calls..." bind:value={eg.primaryGoal} />
	</Field>

	<Field label="Do you have realistic expectations about what hearing aids can achieve?">
		<RadioGroup label="Realistic expectations">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="realisticExpectations" value={opt.value} bind:group={eg.realisticExpectations} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>

	<Field label="How willing are you to wear hearing aids daily?">
		<RadioGroup label="Willingness to wear">{#each willingnessOptions as opt (opt.value)}<label><input type="radio" class="radio-input" name="willingnessToWear" value={opt.value} bind:group={eg.willingnessToWear} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>

	<Field label="Do you have concerns about the cost of hearing aids?">
		<RadioGroup label="Budget concerns">{#each concernOptions as opt (opt.value)}<label><input type="radio" class="radio-input" name="budgetConcerns" value={opt.value} bind:group={eg.budgetConcerns} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>

	<Field label="Do you have concerns about the cosmetic appearance of hearing aids?">
		<RadioGroup label="Cosmetic concerns">{#each concernOptions as opt (opt.value)}<label><input type="radio" class="radio-input" name="cosmeticConcerns" value={opt.value} bind:group={eg.cosmeticConcerns} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
</Fieldset>
