<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const i = assessment.data.identification;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 2 of 7 — Identification and eligibility">
	<p class="hint">
		Patient identifier, age, previous screen, and the surveillance-pathway flag. Routine screening
		invites women aged 50 to 70.
	</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. NHS number or local screening ID"
			required
			bind:value={i.patientIdentifier}
		/>
	</Field>

	<Field
		label="Age in years"
		description="Routine eligible range is 50 to 70; outside this a routine episode raises an age-range flag."
		required
		inputId="identification-ageYears"
	>
		<NumberInput
			id="identification-ageYears"
			label="Age in years"
			min={0}
			max={120}
			step={1}
			required
			bind:value={i.ageYears}
		/>
	</Field>

	<Field
		label="Date last screened"
		description="More than about 36 months ago raises an overdue flag."
		inputId="identification-lastScreenedDate"
	>
		<TextInput
			id="identification-lastScreenedDate"
			label="Date last screened"
			type="date"
			class="date-input"
			bind:value={i.lastScreenedDate}
		/>
	</Field>

	<Field label="On the higher-risk surveillance pathway?">
		<RadioGroup label="On the higher-risk surveillance pathway?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="identification-higherRiskSurveillance"
						value={opt.value}
						bind:group={i.higherRiskSurveillance}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
