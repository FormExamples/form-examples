<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.capacityAndConsent;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const capacityOptions = [
		{ value: 'has-capacity', label: 'Has capacity' },
		{ value: 'lacks-capacity', label: 'Lacks capacity' },
		{ value: 'fluctuating', label: 'Fluctuating capacity' },
		{ value: 'not-assessed', label: 'Not yet assessed' }
	];
</script>

<Fieldset legend="Capacity & Consent">
	<p class="hint">Decision-making capacity and treatment preferences.</p>

	<Field label="Decision-Making Capacity" inputId="capacity">
		<Select id="capacity" label="Capacity" bind:value={c.decisionMakingCapacity}>
			<option value="">-- Select --</option>
			{#each capacityOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>
	{#if c.decisionMakingCapacity === 'lacks-capacity' || c.decisionMakingCapacity === 'fluctuating'}
		<Field label="Capacity Assessment Details" inputId="capacityDetails">
			<TextAreaInput id="capacityDetails" label="Capacity details" rows={3} bind:value={c.capacityDetails} />
		</Field>
	{/if}

	<Field label="Advance directives in place?">
		<RadioGroup label="Advance directives">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="advanceDirectives" value={opt.value} bind:group={c.advanceDirectives} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.advanceDirectives === 'yes'}
		<Field label="Advance Directive Details" inputId="advanceDirectiveDetails">
			<TextAreaInput id="advanceDirectiveDetails" label="Advance directive details" rows={3} bind:value={c.advanceDirectiveDetails} />
		</Field>
	{/if}

	<Field label="Power of attorney designated?">
		<RadioGroup label="Power of attorney">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="poa" value={opt.value} bind:group={c.powerOfAttorney} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.powerOfAttorney === 'yes'}
		<Field label="Power of Attorney Details" inputId="poaDetails">
			<TextAreaInput id="poaDetails" label="POA details" rows={3} bind:value={c.powerOfAttorneyDetails} />
		</Field>
	{/if}

	<Field label="Treatment Preferences" inputId="treatmentPrefs">
		<TextAreaInput id="treatmentPrefs" label="Treatment preferences" rows={3} bind:value={c.treatmentPreferences} />
	</Field>
</Fieldset>
