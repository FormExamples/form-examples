<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.identification;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 2 of 10 — Patient identification">
	<p class="hint">
		Identify the patient and confirm NEWS2 is in scope. NEWS2 is validated for acutely ill adults
		(16 years and over).
	</p>

	<Field label="Patient name" required inputId="identification-patientName">
		<TextInput
			id="identification-patientName"
			label="Patient name"
			placeholder="e.g. Grace Osei"
			required
			bind:value={d.patientName}
		/>
	</Field>

	<Field label="NHS number or hospital MRN" inputId="identification-nhsNumber">
		<TextInput
			id="identification-nhsNumber"
			label="NHS number or hospital MRN"
			placeholder="e.g. 485 777 3456"
			bind:value={d.nhsNumber}
		/>
	</Field>

	<Field label="Date of birth" inputId="identification-birthDate">
		<TextInput
			id="identification-birthDate"
			label="Date of birth"
			type="date"
			class="date-input"
			bind:value={d.birthDate}
		/>
	</Field>

	<Field
		label="Is the patient under 16 years old?"
		description="NEWS2 is not validated in children; use a paediatric early-warning system."
	>
		<RadioGroup label="Is the patient under 16 years old?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="identification-isUnder16"
						value={opt.value}
						bind:group={d.isUnder16}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field
		label="Is the patient pregnant?"
		description="Use a maternity early-warning system for pregnant patients."
	>
		<RadioGroup label="Is the patient pregnant?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="identification-isPregnant"
						value={opt.value}
						bind:group={d.isPregnant}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Does the patient have a spinal-cord injury?">
		<RadioGroup label="Does the patient have a spinal-cord injury?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="identification-hasSpinalCordInjury"
						value={opt.value}
						bind:group={d.hasSpinalCordInjury}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
