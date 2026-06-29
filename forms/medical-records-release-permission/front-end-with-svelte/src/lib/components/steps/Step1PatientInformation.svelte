<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import EmailInput from '$lib/components/ui/EmailInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.patientInformation;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Patient Information">
	<p class="hint">Full patient details for the records release authorization.</p>

	<div class="field-grid">
		<Field label="First Name" required inputId="firstName">
			<TextInput id="firstName" label="First Name" required bind:value={p.firstName} />
		</Field>
		<Field label="Last Name" required inputId="lastName">
			<TextInput id="lastName" label="Last Name" required bind:value={p.lastName} />
		</Field>
	</div>

	<Field label="Date of Birth" required inputId="dateOfBirth">
		<DateInput id="dateOfBirth" label="Date of Birth" required bind:value={p.dateOfBirth} />
	</Field>

	<Field label="Sex">
		<RadioGroup label="Sex">
			{#each sexOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="sex"
						value={opt.value}
						bind:group={p.sex}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Address" required inputId="address">
		<TextInput id="address" label="Address" required placeholder="Full postal address" bind:value={p.address} />
	</Field>

	<div class="field-grid">
		<Field label="Phone Number" inputId="phone">
			<TextInput id="phone" label="Phone Number" placeholder="e.g., 020 7946 0958" bind:value={p.phone} />
		</Field>
		<Field label="Email Address" inputId="email">
			<EmailInput id="email" label="Email Address" placeholder="e.g., patient@example.com" bind:value={p.email} />
		</Field>
	</div>

	<Field label="NHS Number" required inputId="nhsNumber" description="e.g., 943 476 5919">
		<TextInput id="nhsNumber" label="NHS Number" required bind:value={p.nhsNumber} />
	</Field>

	<div class="field-grid">
		<Field label="GP Name" inputId="gpName">
			<TextInput id="gpName" label="GP Name" placeholder="e.g., Dr Sarah Thompson" bind:value={p.gpName} />
		</Field>
		<Field label="GP Practice" inputId="gpPractice">
			<TextInput id="gpPractice" label="GP Practice" placeholder="e.g., Elm Street Surgery" bind:value={p.gpPractice} />
		</Field>
	</div>
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
</style>
