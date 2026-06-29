<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const a = assessment.data.anesthesiaInformation;

	const anesthesiaTypes = [
		{ value: 'general', label: 'General Anesthesia' },
		{ value: 'regional', label: 'Regional Anesthesia' },
		{ value: 'local', label: 'Local Anesthesia' },
		{ value: 'sedation', label: 'Sedation' },
		{ value: 'none', label: 'None' }
	];

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Anesthesia Information">
	<p class="hint">Details about the planned anesthesia and any prior issues.</p>

	<Field label="Anesthesia Type" required inputId="anesthesiaType">
		<Select id="anesthesiaType" label="Anesthesia Type" required bind:value={a.anesthesiaType}>
			<option value="">-- Select --</option>
			{#each anesthesiaTypes as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Anesthesia Risks" inputId="anesthesiaRisks">
		<TextAreaInput
			id="anesthesiaRisks"
			label="Anesthesia Risks"
			rows={3}
			placeholder="Document specific anesthesia risks discussed with the patient..."
			bind:value={a.anesthesiaRisks}
		/>
	</Field>

	<Field label="Previous Anesthesia Problems" required>
		<RadioGroup label="Previous Anesthesia Problems">
			{#each yesNoOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="previousAnesthesiaProblems"
						value={opt.value}
						bind:group={a.previousAnesthesiaProblems}
						required
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if a.previousAnesthesiaProblems === 'yes'}
		<Field label="Previous Anesthesia Problem Details" inputId="previousAnesthesiaDetails">
			<TextAreaInput
				id="previousAnesthesiaDetails"
				label="Previous Anesthesia Problem Details"
				rows={3}
				placeholder="Describe previous anesthesia problems in detail..."
				bind:value={a.previousAnesthesiaDetails}
			/>
		</Field>
	{/if}

	<Field label="Fasting Instructions" inputId="fastingInstructions">
		<TextAreaInput
			id="fastingInstructions"
			label="Fasting Instructions"
			rows={2}
			placeholder="e.g., No food for 6 hours, clear fluids until 2 hours before procedure..."
			bind:value={a.fastingInstructions}
		/>
	</Field>
</Fieldset>
