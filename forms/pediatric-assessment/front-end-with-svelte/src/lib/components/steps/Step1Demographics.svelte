<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import EmailInput from '#lib/components/ui/EmailInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.demographics;
	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Demographics">
	<p class="hint">Child and parent/guardian information.</p>

	<h3 class="step-subhead">Child Information</h3>
	<div class="field-grid">
		<Field label="Child's First Name" required inputId="childFirstName">
			<TextInput id="childFirstName" label="Child's first name" required bind:value={d.childFirstName} />
		</Field>
		<Field label="Child's Last Name" required inputId="childLastName">
			<TextInput id="childLastName" label="Child's last name" required bind:value={d.childLastName} />
		</Field>
	</div>

	<Field label="Date of Birth" required inputId="dob">
		<DateInput id="dob" label="Date of birth" required bind:value={d.dateOfBirth} />
	</Field>

	<Field label="Sex" required>
		<RadioGroup label="Sex">
			{#each sexOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={d.sex} required />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<div class="field-grid field-grid-3">
		<Field label="Weight (kg)" required inputId="weight">
			<NumberInput id="weight" label="Weight" min={0.5} max={150} step={0.1} required bind:value={d.weight} />
		</Field>
		<Field label="Height (cm)" required inputId="height">
			<NumberInput id="height" label="Height" min={30} max={200} step={0.1} required bind:value={d.height} />
		</Field>
		<Field label="Head Circumference (cm)" inputId="headCirc">
			<NumberInput id="headCirc" label="Head circumference" min={20} max={65} step={0.1} bind:value={d.headCircumference} />
		</Field>
	</div>

	<h3 class="step-subhead">Parent/Guardian Information</h3>
	<Field label="Parent/Guardian Name" required inputId="parentName">
		<TextInput id="parentName" label="Parent name" required bind:value={d.parentGuardianName} />
	</Field>
	<Field label="Relationship to Child" required inputId="parentRelationship">
		<TextInput id="parentRelationship" label="Relationship" required bind:value={d.parentGuardianRelationship} />
	</Field>
	<div class="field-grid">
		<Field label="Phone Number" inputId="parentPhone">
			<TextInput id="parentPhone" label="Phone number" bind:value={d.parentGuardianPhone} />
		</Field>
		<Field label="Email" inputId="parentEmail">
			<EmailInput id="parentEmail" label="Email" bind:value={d.parentGuardianEmail} />
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
	@media (max-width: 640px) {
		.field-grid, .field-grid.field-grid-3 { grid-template-columns: 1fr; }
	}
	.step-subhead {
		font-size: 1rem;
		font-weight: 600;
		margin: 1.25rem 0 0.5rem;
	}
</style>
