<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.lifestyleSocialFactors;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const smoking = [
		{ value: 'never', label: 'Never smoked' },
		{ value: 'ex', label: 'Ex-smoker' },
		{ value: 'current', label: 'Current smoker' }
	];
	const useLevels = [
		{ value: 'none', label: 'None' },
		{ value: 'occasional', label: 'Occasional' },
		{ value: 'regular', label: 'Regular' }
	];
</script>

<Fieldset legend="Lifestyle & Social Factors">
	<p class="hint">Lifestyle and social-care needs that affect pregnancy outcome.</p>

	<Field label="Smoking status">
		<RadioGroup label="Smoking status">
			{#each smoking as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="smokingStatus" value={opt.value} bind:group={s.smokingStatus} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.smokingStatus === 'current'}
		<Field label="Cigarettes per day" inputId="cigarettesPerDay">
			<NumberInput id="cigarettesPerDay" label="Cigarettes per day" min={1} max={60} bind:value={s.cigarettesPerDay} />
		</Field>
	{/if}

	<Field label="Alcohol use in pregnancy">
		<RadioGroup label="Alcohol use in pregnancy">
			{#each useLevels as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="alcoholUse" value={opt.value} bind:group={s.alcoholUse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Recreational substance use">
		<RadioGroup label="Recreational substance use">
			{#each useLevels as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="substanceUse" value={opt.value} bind:group={s.substanceUse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Domestic abuse - past or current?">
		<RadioGroup label="Domestic abuse - past or current?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="domesticAbuse" value={opt.value} bind:group={s.domesticAbuse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Safeguarding concerns (e.g. children on plan)?">
		<RadioGroup label="Safeguarding concerns?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="safeguardingConcerns" value={opt.value} bind:group={s.safeguardingConcerns} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Housing insecurity?">
		<RadioGroup label="Housing insecurity?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="housingInsecurity" value={opt.value} bind:group={s.housingInsecurity} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Financial difficulty?">
		<RadioGroup label="Financial difficulty?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="financialDifficulty" value={opt.value} bind:group={s.financialDifficulty} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Requires interpreter?">
		<RadioGroup label="Requires interpreter?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="requiresInterpreter" value={opt.value} bind:group={s.requiresInterpreter} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.requiresInterpreter === 'yes'}
		<Field label="Language required" inputId="interpreterLanguage">
			<TextInput id="interpreterLanguage" label="Language required" bind:value={s.interpreterLanguage} />
		</Field>
	{/if}

	<Field label="Asylum seeker / refugee?">
		<RadioGroup label="Asylum seeker / refugee?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="asylumOrRefugee" value={opt.value} bind:group={s.asylumOrRefugee} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Female genital mutilation (FGM)?">
		<RadioGroup label="Female genital mutilation (FGM)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="femaleGenitalMutilation" value={opt.value} bind:group={s.femaleGenitalMutilation} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Other social notes" inputId="socialNotes">
		<TextAreaInput id="socialNotes" label="Other social notes" rows={3} placeholder="Any other relevant social information." bind:value={s.socialNotes} />
	</Field>
</Fieldset>
