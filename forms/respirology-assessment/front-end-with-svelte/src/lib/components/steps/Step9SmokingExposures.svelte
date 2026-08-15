<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const s = assessment.data.smokingExposures;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const statusOptions = [
		{ value: 'current', label: 'Current smoker' },
		{ value: 'ex', label: 'Ex-smoker' },
		{ value: 'never', label: 'Never smoked' }
	];
</script>

<Fieldset legend="Smoking & Exposures">
	<p class="hint">Smoking history and environmental/occupational exposures.</p>

	<Field label="Smoking Status">
		<RadioGroup label="Smoking status">
			{#each statusOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="smokingStatus" value={opt.value} bind:group={s.smokingStatus} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.smokingStatus === 'current' || s.smokingStatus === 'ex'}
		<Field label="Pack-years" inputId="packYears">
			<NumberInput id="packYears" label="Pack-years" min={0} max={200} bind:value={s.packYears} />
		</Field>
	{/if}

	<Field label="Do you vape or use e-cigarettes?">
		<RadioGroup label="Vaping">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="vaping" value={opt.value} bind:group={s.vaping} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.vaping === 'yes'}
		<Field label="Vaping Details" inputId="vapingDetails">
			<TextInput id="vapingDetails" label="Vaping details" bind:value={s.vapingDetails} />
		</Field>
	{/if}

	<Field label="Do you have any occupational respiratory exposures?">
		<RadioGroup label="Occupational exposure">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="occupational" value={opt.value} bind:group={s.occupationalExposure} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.occupationalExposure === 'yes'}
		<Field label="Occupational Exposure Details" inputId="occupationalDetails">
			<TextInput id="occupationalDetails" label="Occupational details" bind:value={s.occupationalDetails} />
		</Field>
	{/if}

	<Field label="Have you ever been exposed to asbestos?">
		<RadioGroup label="Asbestos exposure">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="asbestos" value={opt.value} bind:group={s.asbestosExposure} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.asbestosExposure === 'yes'}
		<Field label="Asbestos Exposure Details" inputId="asbestosDetails">
			<TextInput id="asbestosDetails" label="Asbestos details" bind:value={s.asbestosDetails} />
		</Field>
	{/if}

	<Field label="Do you have pets at home?">
		<RadioGroup label="Pets">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="pets" value={opt.value} bind:group={s.pets} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.pets === 'yes'}
		<Field label="Pet Details" inputId="petDetails">
			<TextInput id="petDetails" label="Pet details" bind:value={s.petDetails} />
		</Field>
	{/if}
</Fieldset>
