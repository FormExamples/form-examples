<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.demographics;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Demographics">
	<p class="hint">Basic patient information and skin type.</p>

	<div class="field-grid">
		<Field label="First Name" required inputId="firstName">
			<TextInput id="firstName" label="First Name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last Name" required inputId="lastName">
			<TextInput id="lastName" label="Last Name" required bind:value={d.lastName} />
		</Field>
	</div>

	<Field label="Date of Birth" required inputId="dob">
		<DateInput id="dob" label="Date of Birth" required bind:value={d.dateOfBirth} />
	</Field>

	<Field label="Sex" required>
		<RadioGroup label="Sex">
			{#each sexOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={d.sex} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Fitzpatrick Skin Type" required inputId="skinType">
		<Select id="skinType" label="Fitzpatrick Skin Type" required bind:value={d.skinType}>
			<option value="">-- Select --</option>
			<option value="I">Type I - Very fair, always burns, never tans</option>
			<option value="II">Type II - Fair, usually burns, tans minimally</option>
			<option value="III">Type III - Medium, sometimes burns, tans uniformly</option>
			<option value="IV">Type IV - Olive, rarely burns, always tans well</option>
			<option value="V">Type V - Brown, very rarely burns, tans very easily</option>
			<option value="VI">Type VI - Dark brown/black, never burns, always tans</option>
		</Select>
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
