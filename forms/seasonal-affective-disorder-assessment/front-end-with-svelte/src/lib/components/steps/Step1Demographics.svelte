<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateAge } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.demographics;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' },
		{ value: 'prefer-not-to-say', label: 'Prefer not to say' }
	];

	const age = $derived(calculateAge(d.dateOfBirth));
</script>

<Fieldset legend="Demographics">
	<p class="hint">Basic patient information and geographic context.</p>

	<div class="field-grid">
		<Field label="First Name" inputId="firstName">
			<TextInput id="firstName" label="First Name" bind:value={d.firstName} />
		</Field>
		<Field label="Last Name" required inputId="lastName">
			<TextInput id="lastName" label="Last Name" required bind:value={d.lastName} />
		</Field>
	</div>

	<Field label="Date of Birth" required inputId="dob">
		<DateInput id="dob" label="Date of Birth" required bind:value={d.dateOfBirth} />
		{#if age !== null}<p class="hint">Age {age}</p>{/if}
	</Field>

	<Field label="Sex">
		<RadioGroup label="Sex">
			{#each sexOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={d.sex} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<div class="field-grid field-grid-3">
		<Field label="Latitude" description="e.g. 54.5N" inputId="latitude">
			<TextInput id="latitude" label="Latitude" placeholder="e.g. 54.5N" bind:value={d.latitude} />
		</Field>
		<Field label="Country" inputId="country">
			<TextInput id="country" label="Country" bind:value={d.country} />
		</Field>
		<Field label="Years at current latitude" inputId="yearsAtCurrentLatitude">
			<NumberInput
				id="yearsAtCurrentLatitude"
				label="Years at current latitude"
				min={0}
				max={120}
				bind:value={d.yearsAtCurrentLatitude}
			/>
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
