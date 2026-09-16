<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import { DateInput, RadioGroup, TextInput } from "@lilydesignsystem/svelte-headless";

	const d = assessment.data.demographics;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Demographics">
	<p class="hint">Basic patient information.</p>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="First Name" required inputId="firstName">
			<TextInput id="firstName" label="First Name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last Name" required inputId="lastName">
			<TextInput id="lastName" label="Last Name" required bind:value={d.lastName} />
		</Field>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Date of Birth" required inputId="dob">
			<DateInput id="dob" label="Date of Birth" required bind:value={d.dateOfBirth} />
		</Field>
		<Field label="Assessment Date" inputId="assessmentDate">
			<DateInput id="assessmentDate" label="Assessment Date" bind:value={d.assessmentDate} />
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
</Fieldset>
