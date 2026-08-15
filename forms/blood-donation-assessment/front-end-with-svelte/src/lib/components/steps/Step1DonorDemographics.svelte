<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateAgeYears } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const d = assessment.data.donorDemographics;

	const age = $derived(calculateAgeYears(d.dateOfBirth));

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Donor Demographics">
	<p class="hint">Basic details required to register the donation.</p>

	<div class="field-grid">
		<Field label="First Name" required inputId="firstName">
			<TextInput id="firstName" label="First Name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last Name" required inputId="lastName">
			<TextInput id="lastName" label="Last Name" required bind:value={d.lastName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Date of Birth" required inputId="dob">
			<DateInput id="dob" label="Date of Birth" required bind:value={d.dateOfBirth} />
		</Field>
		<Field label="Age" description="Auto-calculated">
			{#if age != null}
				<p class="readout-value">{age} <span class="readout-muted">years</span></p>
			{:else}
				<p class="readout-value readout-muted">—</p>
			{/if}
		</Field>
	</div>

	<Field label="Sex">
		<RadioGroup label="Sex">
			{#each sexOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={d.sex} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<div class="field-grid">
		<Field label="Weight (kg)" inputId="weight">
			<NumberInput id="weight" label="Weight" min={30} max={250} bind:value={d.weight} />
		</Field>
		<Field label="Height (cm)" inputId="height">
			<NumberInput id="height" label="Height" min={100} max={230} bind:value={d.height} />
		</Field>
	</div>

	<Field label="Donor type" inputId="donorType">
		<Select id="donorType" label="Donor type" bind:value={d.donorType}>
			<option value="">-- Select --</option>
			<option value="first-time">First-time donor</option>
			<option value="regular">Regular donor (donated within past 2 years)</option>
			<option value="lapsed">Lapsed donor (no donation in last 2 years)</option>
		</Select>
	</Field>

	<Field label="Date of last donation" inputId="lastDonationDate">
		<DateInput id="lastDonationDate" label="Date of last donation" bind:value={d.lastDonationDate} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
	.readout-value {
		margin: 0;
		font-weight: 500;
	}
	.readout-muted {
		color: var(--color-muted);
		font-weight: 400;
	}
</style>
