<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.demographics;
	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
	];
	const legalOptions = [
		{ value: 'voluntary', label: 'Voluntary' },
		{ value: 'involuntary', label: 'Involuntary' }
	];
</script>

<Fieldset legend="Demographics">
	<p class="hint">Basic patient information and legal status.</p>

	<div class="field-grid">
		<Field label="First Name" required inputId="firstName">
			<TextInput id="firstName" label="First name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last Name" required inputId="lastName">
			<TextInput id="lastName" label="Last name" required bind:value={d.lastName} />
		</Field>
	</div>

	<Field label="Date of Birth" required inputId="dob">
		<DateInput id="dob" label="Date of birth" required bind:value={d.dateOfBirth} />
	</Field>

	<Field label="Sex" required>
		<RadioGroup label="Sex">
			{#each sexOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={d.sex} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<div class="field-grid">
		<Field label="Emergency Contact Name" required inputId="emergencyContactName">
			<TextInput id="emergencyContactName" label="Emergency contact" required bind:value={d.emergencyContactName} />
		</Field>
		<Field label="Emergency Contact Phone" required inputId="emergencyContactPhone">
			<TextInput id="emergencyContactPhone" label="Emergency contact phone" required bind:value={d.emergencyContactPhone} />
		</Field>
	</div>

	<Field label="Legal Status" required>
		<RadioGroup label="Legal status">
			{#each legalOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="legalStatus" value={opt.value} bind:group={d.legalStatus} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
