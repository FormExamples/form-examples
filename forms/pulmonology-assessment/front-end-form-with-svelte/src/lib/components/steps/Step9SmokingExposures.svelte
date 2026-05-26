<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

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

	<Field label="Smoking status" required>
		<RadioGroup label="Smoking status">
			{#each statusOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="smokingStatus" value={opt.value} bind:group={s.smokingStatus} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if s.smokingStatus === 'current' || s.smokingStatus === 'ex'}
		<Field label="Pack-years" inputId="packYears">
			<NumberInput id="packYears" label="Pack-years" min={0} max={200} bind:value={s.packYears} />
		</Field>
	{/if}

	<Field label="Have you had occupational exposures (dust, chemicals, fumes)?">
		<RadioGroup label="Occupational exposures">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="occupExposure" value={opt.value} bind:group={s.occupationalExposures} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.occupationalExposures === 'yes'}
		<Field label="Please describe the exposures" inputId="occupDetails">
			<TextInput id="occupDetails" label="Occupational details" bind:value={s.occupationalDetails} />
		</Field>
	{/if}

	<Field label="Have you had significant biomass fuel exposure (wood, coal, dung for cooking/heating)?">
		<RadioGroup label="Biomass fuel exposure">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="biomass" value={opt.value} bind:group={s.biomassFuelExposure} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
