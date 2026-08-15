<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const f = assessment.data.functionalHistory;

	const adlOptions = [
		{ value: 'independent', label: 'Independent' },
		{ value: 'needs-some-help', label: 'Needs some help' },
		{ value: 'needs-significant-help', label: 'Needs significant help' },
		{ value: 'fully-dependent', label: 'Fully dependent' }
	];

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Functional History">
	<p class="hint">Activities of daily living, living situation, and support network.</p>

	<Field label="Living Arrangement" required inputId="livingArrangement">
		<Select id="livingArrangement" label="Living Arrangement" required bind:value={f.livingArrangement}>
			<option value="">-- Select --</option>
			<option value="alone">Lives alone</option>
			<option value="with-spouse">Lives with spouse/partner</option>
			<option value="with-family">Lives with family</option>
			<option value="care-home">Care home/nursing home</option>
			<option value="assisted-living">Assisted living facility</option>
		</Select>
	</Field>

	<h3 class="adl-head">Activities of Daily Living (ADLs)</h3>

	<Field label="Bathing" inputId="adlBathing">
		<Select id="adlBathing" label="Bathing" bind:value={f.adlBathing}>
			<option value="">-- Select --</option>
			{#each adlOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>
	<Field label="Dressing" inputId="adlDressing">
		<Select id="adlDressing" label="Dressing" bind:value={f.adlDressing}>
			<option value="">-- Select --</option>
			{#each adlOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>
	<Field label="Preparing Meals" inputId="adlMeals">
		<Select id="adlMeals" label="Preparing Meals" bind:value={f.adlMeals}>
			<option value="">-- Select --</option>
			{#each adlOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>
	<Field label="Managing Medications" inputId="adlMedications">
		<Select id="adlMedications" label="Managing Medications" bind:value={f.adlMedications}>
			<option value="">-- Select --</option>
			{#each adlOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>
	<Field label="Managing Finances" inputId="adlFinances">
		<Select id="adlFinances" label="Managing Finances" bind:value={f.adlFinances}>
			<option value="">-- Select --</option>
			{#each adlOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>
	<Field label="Using Transport" inputId="adlTransport">
		<Select id="adlTransport" label="Using Transport" bind:value={f.adlTransport}>
			<option value="">-- Select --</option>
			{#each adlOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Recent changes in function or behaviour" inputId="recentChanges">
		<TextAreaInput id="recentChanges" label="Recent changes in function or behaviour" rows={3} placeholder="Describe any recent changes in the patient's abilities, behaviour, or personality..." bind:value={f.recentChanges} />
	</Field>

	<Field label="Safety concerns" inputId="safetyConcerns">
		<TextAreaInput id="safetyConcerns" label="Safety concerns" rows={3} placeholder="e.g., leaving stove on, wandering, getting lost, falls, driving concerns..." bind:value={f.safetyConerns} />
	</Field>

	<Field label="Are carers or support persons available?">
		<RadioGroup label="Are carers or support persons available?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="carersAvailable" value={opt.value} bind:group={f.carersAvailable} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if f.carersAvailable === 'yes'}
		<Field label="Carer details" inputId="carerDetails">
			<TextAreaInput id="carerDetails" label="Carer details" rows={3} placeholder="Name and relationship of carer(s)..." bind:value={f.carerDetails} />
		</Field>
	{/if}
</Fieldset>

<style>
	.adl-head {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 1rem 0 0.5rem;
	}
</style>
