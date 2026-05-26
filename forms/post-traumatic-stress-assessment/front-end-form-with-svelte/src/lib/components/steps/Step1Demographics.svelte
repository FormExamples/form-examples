<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.demographics;
	const sexOptions = ['male', 'female', 'other'] as const;
</script>

<Fieldset legend="Demographics">
	<p class="hint">Your details. Used to contextualise the PCL-5 score for clinical records.</p>

	<Field label="First Name" required inputId="firstName">
		<TextInput id="firstName" label="First name" required bind:value={d.firstName} />
	</Field>
	<Field label="Last Name" required inputId="lastName">
		<TextInput id="lastName" label="Last name" required bind:value={d.lastName} />
	</Field>
	<Field label="Date of Birth" required inputId="dob">
		<DateInput id="dob" label="Date of birth" required bind:value={d.dateOfBirth} />
	</Field>
	<Field label="Sex">
		<RadioGroup label="Sex">
			{#each sexOptions as opt (opt)}
				<label>
					<input type="radio" class="radio-input" name="sex" value={opt} bind:group={d.sex} />
					<span class="capitalize">{opt}</span>
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
