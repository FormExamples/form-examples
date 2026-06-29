<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.socialHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const smokingOptions = [
		{ value: 'current', label: 'Current smoker' },
		{ value: 'ex', label: 'Ex-smoker' },
		{ value: 'never', label: 'Never smoked' }
	];

	const vapingOptions = [
		{ value: 'current', label: 'Current vaper' },
		{ value: 'ex', label: 'Ex-vaper' },
		{ value: 'never', label: 'Never vaped' }
	];
</script>

<Fieldset legend="Social History">
	<p class="hint">Lifestyle and environmental factors affecting your asthma.</p>

	<Field label="Do you smoke?">
		<RadioGroup label="Smoking">
			{#each smokingOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="smoking" value={opt.value} bind:group={s.smoking} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.smoking === 'current' || s.smoking === 'ex'}
		<Field label="Pack-years" inputId="smokingPackYears">
			<NumberInput id="smokingPackYears" label="Pack years" min={0} max={200} bind:value={s.smokingPackYears} />
		</Field>
	{/if}

	<Field label="Do you vape?">
		<RadioGroup label="Vaping">
			{#each vapingOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="vaping" value={opt.value} bind:group={s.vaping} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you have occupational exposures (chemicals, fumes, dust)?">
		<RadioGroup label="Occupational exposures">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="occupationalExposures" value={opt.value} bind:group={s.occupationalExposures} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.occupationalExposures === 'yes'}
		<Field label="Details of occupational exposures" inputId="occupationalExposureDetails">
			<TextInput id="occupationalExposureDetails" label="Occupational exposure details" bind:value={s.occupationalExposureDetails} />
		</Field>
	{/if}

	<Field label="Home environment" inputId="homeEnvironment">
		<TextAreaInput id="homeEnvironment" label="Home environment" rows={3} bind:value={s.homeEnvironment} />
	</Field>

	<Field label="Do you have pets?">
		<RadioGroup label="Pets">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="pets" value={opt.value} bind:group={s.pets} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.pets === 'yes'}
		<Field label="What type of pets?" inputId="petDetails">
			<TextInput id="petDetails" label="Pet details" bind:value={s.petDetails} />
		</Field>
	{/if}

	<Field label="Do you have carpet in your bedroom?">
		<RadioGroup label="Carpet in bedroom">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="carpetInBedroom" value={opt.value} bind:group={s.carpetInBedroom} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Is there mould in your home?">
		<RadioGroup label="Mould exposure">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="moldExposure" value={opt.value} bind:group={s.moldExposure} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
