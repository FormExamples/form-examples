<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.coughAssessment;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const characterOptions = [
		{ value: 'productive', label: 'Productive (with sputum)' },
		{ value: 'dry', label: 'Dry (no sputum)' }
	];
	const volumeOptions = [
		{ value: 'small', label: 'Small (teaspoon)' },
		{ value: 'moderate', label: 'Moderate (tablespoon)' },
		{ value: 'large', label: 'Large (egg-cup or more)' }
	];
	const colourOptions = [
		{ value: 'clear', label: 'Clear' },
		{ value: 'white', label: 'White/Mucoid' },
		{ value: 'yellow', label: 'Yellow' },
		{ value: 'green', label: 'Green' },
		{ value: 'brown', label: 'Brown/Rusty' },
		{ value: 'blood-streaked', label: 'Blood-streaked' }
	];
</script>

<Fieldset legend="Cough Assessment">
	<p class="hint">Cough characteristics and sputum.</p>

	<Field label="Cough Duration" inputId="coughDuration" description="e.g. 2 weeks, 6 months, chronic">
		<TextInput id="coughDuration" label="Cough duration" bind:value={c.duration} />
	</Field>

	<Field label="Cough Character">
		<RadioGroup label="Cough character">
			{#each characterOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="coughCharacter" value={opt.value} bind:group={c.character} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if c.character === 'productive'}
		<Field label="Sputum Volume" inputId="sputumVolume">
			<Select id="sputumVolume" label="Sputum volume" bind:value={c.sputumVolume}>
				<option value="">-- Select --</option>
				{#each volumeOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>

		<Field label="Sputum Colour" inputId="sputumColour">
			<Select id="sputumColour" label="Sputum colour" bind:value={c.sputumColour}>
				<option value="">-- Select --</option>
				{#each colourOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
	{/if}

	<Field label="Have you coughed up blood (haemoptysis)?">
		<RadioGroup label="Haemoptysis">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="haemoptysis" value={opt.value} bind:group={c.haemoptysis} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.haemoptysis === 'yes'}
		<Field label="Haemoptysis Details" inputId="haemoptysisDetails">
			<TextAreaInput id="haemoptysisDetails" label="Haemoptysis details" rows={3} bind:value={c.haemoptysisDetails} />
		</Field>
	{/if}
</Fieldset>
