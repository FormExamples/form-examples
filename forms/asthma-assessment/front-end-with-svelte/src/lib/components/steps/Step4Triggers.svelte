<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const t = assessment.data.triggers;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Triggers">
	<p class="hint">What triggers or worsens your asthma symptoms?</p>

	<Field label="Do allergens trigger your asthma? (dust mites, pollen, mould, pet dander)">
		<RadioGroup label="Allergens">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="allergens" value={opt.value} bind:group={t.allergens} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.allergens === 'yes'}
		<Field label="Which allergens?" inputId="allergenDetails">
			<TextInput id="allergenDetails" label="Allergens" bind:value={t.allergenDetails} />
		</Field>
	{/if}

	<Field label="Does exercise trigger your asthma?">
		<RadioGroup label="Exercise">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="exercise" value={opt.value} bind:group={t.exercise} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Does weather or temperature change trigger your asthma?">
		<RadioGroup label="Weather">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="weather" value={opt.value} bind:group={t.weather} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.weather === 'yes'}
		<Field label="Details (cold air, humidity, etc.)" inputId="weatherDetails">
			<TextInput id="weatherDetails" label="Weather details" bind:value={t.weatherDetails} />
		</Field>
	{/if}

	<Field label="Do you have occupational triggers?">
		<RadioGroup label="Occupational">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="occupational" value={opt.value} bind:group={t.occupational} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.occupational === 'yes'}
		<Field label="What are the occupational triggers?" inputId="occupationalDetails">
			<TextInput id="occupationalDetails" label="Occupational triggers" bind:value={t.occupationalDetails} />
		</Field>
	{/if}

	<Field label="Do respiratory infections worsen your asthma?">
		<RadioGroup label="Infections">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="infections" value={opt.value} bind:group={t.infections} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Does smoke exposure trigger your asthma?">
		<RadioGroup label="Smoke">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="smoke" value={opt.value} bind:group={t.smoke} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Does stress or strong emotions trigger your asthma?">
		<RadioGroup label="Stress">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="stress" value={opt.value} bind:group={t.stress} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do any medications trigger your asthma? (e.g., aspirin, beta-blockers)">
		<RadioGroup label="Medications">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="trigMedications" value={opt.value} bind:group={t.medications} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.medications === 'yes'}
		<Field label="Which medications?" inputId="medicationDetails">
			<TextInput id="medicationDetails" label="Medication triggers" bind:value={t.medicationDetails} />
		</Field>
	{/if}

	<Field label="Other triggers" inputId="otherTriggers">
		<TextAreaInput id="otherTriggers" label="Other triggers" rows={3} bind:value={t.otherTriggers} />
	</Field>
</Fieldset>
