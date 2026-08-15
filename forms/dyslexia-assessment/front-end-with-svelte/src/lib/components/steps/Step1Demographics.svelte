<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.demographics;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Section 1 of 10 · Demographics">
	<p class="hint">Basic patient information.</p>

	<div class="field-grid">
		<Field label="First name" required inputId="firstName">
			<TextInput id="firstName" label="First name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last name" required inputId="lastName">
			<TextInput id="lastName" label="Last name" required bind:value={d.lastName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Date of birth" required inputId="dob">
			<DateInput id="dob" label="Date of birth" required bind:value={d.dateOfBirth} />
		</Field>
		<Field label="Age (years)" inputId="ageYears">
			<NumberInput id="ageYears" label="Age" min={0} max={120} bind:value={d.ageYears} />
		</Field>
	</div>

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

	<div class="field-grid">
		<Field label="Preferred language" inputId="preferredLanguage">
			<TextInput id="preferredLanguage" label="Preferred language" bind:value={d.preferredLanguage} />
		</Field>
		<Field label="First language" inputId="firstLanguage">
			<TextInput id="firstLanguage" label="First language" bind:value={d.firstLanguage} />
		</Field>
	</div>

	<Field label="Handedness" inputId="handedness">
		<Select id="handedness" label="Handedness" bind:value={d.handedness}>
			<option value="">— Select —</option>
			<option value="right">Right</option>
			<option value="left">Left</option>
			<option value="ambidextrous">Ambidextrous</option>
		</Select>
	</Field>

	<Field label="Referral source" inputId="referralSource">
		<TextInput id="referralSource" label="Referral source" bind:value={d.referralSource} />
	</Field>

	<Field label="Reason for referral" inputId="referralReason">
		<TextAreaInput id="referralReason" label="Reason for referral" rows={3} bind:value={d.referralReason} />
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
</style>
