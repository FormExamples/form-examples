<script lang="ts">
	import { store } from '$lib/stores/fitnote.svelte';
	import { DIAGNOSIS_CATEGORIES } from '$lib/engine/types';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import YesNo from '$lib/components/ui/YesNo.svelte';

	const d = store.data;
</script>

<Fieldset legend="Diagnosis">
	<p class="hint">The medical condition and its classification.</p>

	<Field label="Condition (free text)" inputId="diagnosis-text">
		<TextAreaInput
			id="diagnosis-text"
			label="Condition"
			rows={3}
			placeholder="Describe the medical condition."
			bind:value={d.diagnosisText}
		/>
	</Field>

	<div class="field-grid">
		<Field label="SNOMED CT code (optional)" inputId="diagnosis-snomed-code">
			<TextInput id="diagnosis-snomed-code" label="SNOMED CT code" bind:value={d.diagnosisSnomedCode} />
		</Field>
		<Field label="SNOMED CT display (optional)" inputId="diagnosis-snomed-display">
			<TextInput
				id="diagnosis-snomed-display"
				label="SNOMED CT display"
				bind:value={d.diagnosisSnomedDisplay}
			/>
		</Field>
		<Field label="Diagnosis category" inputId="diagnosis-category">
			<Select id="diagnosis-category" label="Diagnosis category" bind:value={d.diagnosisCategory}>
				<option value="">—</option>
				{#each DIAGNOSIS_CATEGORIES as cat (cat.value)}
					<option value={cat.value}>{cat.label}</option>
				{/each}
			</Select>
		</Field>
		<Field
			label="Condition first recorded date"
			description="Used to evaluate the 3-month / first-6-months policy rule."
			inputId="condition-first-recorded"
		>
			<DateInput
				id="condition-first-recorded"
				label="Condition first recorded date"
				bind:value={d.conditionFirstRecordedDate}
			/>
		</Field>
	</div>

	<Field
		label="Automatic disability (HIV / cancer / MS)?"
		description="Equality Act 2010 s.6."
	>
		<YesNo
			label="Automatic disability?"
			name="isAutomaticDisability"
			bind:value={d.isAutomaticDisability}
		/>
	</Field>

	<Field
		label="Is the reason non-medical?"
		description="Fit notes cannot be issued for non-medical problems (DWP policy 3.6)."
	>
		<YesNo label="Is the reason non-medical?" name="isNonMedical" bind:value={d.isNonMedical} />
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
