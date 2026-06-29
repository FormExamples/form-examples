<script lang="ts">
	import { application } from '$lib/stores/application.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import { conditionLabel } from '$lib/engine/utils';

	const data = application.data;

	const selectedConditions = $derived(data.qualifyingConditions.filter((c) => c.selected));

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const diabetesTreatmentModeOptions = [
		{ value: 'insulin', label: 'Insulin' },
		{ value: 'oral-hypoglycaemic', label: 'Oral hypoglycaemic' },
		{ value: 'insulin-and-oral', label: 'Insulin and oral' },
		{ value: 'glp1-agonist', label: 'GLP-1 receptor agonist' },
		{ value: 'diet-only', label: 'Diet only (excluded from FP92A)' }
	];

	const cancerPhaseOptions = [
		{ value: 'active-treatment', label: 'Active treatment' },
		{ value: 'effects-of-cancer', label: 'Effects of cancer' },
		{ value: 'effects-of-treatment', label: 'Effects of treatment' },
		{ value: 'remission-with-ongoing-treatment', label: 'Remission with ongoing treatment' },
		{ value: 'palliative', label: 'Palliative' }
	];

	const histologyOptions = [
		{ value: 'yes', label: 'Yes — histologically confirmed' },
		{ value: 'no', label: 'No — clinical diagnosis only' },
		{ value: 'pending', label: 'Pending histology' }
	];
</script>

<Fieldset
	title="Qualifying condition detail"
	description="Provide the clinical detail required by NHSBSA for each selected qualifying condition."
>
	{#if selectedConditions.length === 0}
		<p class="text-sm text-base-content/60">
			Select at least one qualifying condition in Step 6 to enable this section.
		</p>
	{:else}
		{#each selectedConditions as c (c.code)}
			<div class="mb-6 rounded-lg border border-base-300 p-4">
				<h3 class="mb-3 text-base font-semibold text-base-content">
					{conditionLabel(c.code)}
				</h3>

				<TextInput
					label="Diagnosis date"
					name={`diagnosisDate-${c.code}`}
					type="date"
					bind:value={c.diagnosisDate}
				/>

				<div class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
					<TextInput
						label="SNOMED CT code"
						name={`snomed-${c.code}`}
						bind:value={c.snomedCtCode}
					/>
					<TextInput
						label="ICD-10 code"
						name={`icd10-${c.code}`}
						bind:value={c.icd10Code}
					/>
				</div>

				<TextAreaInput
					label="Treatment detail"
					name={`treatment-${c.code}`}
					bind:value={c.treatmentDetail}
					rows={2}
				/>

				{#if c.code === 'diabetes-mellitus-not-diet-only'}
					<RadioGroup
						label="Diabetes treatment mode"
						name={`diabetesTreatmentMode-${c.code}`}
						options={diabetesTreatmentModeOptions}
						bind:value={c.diabetesTreatmentMode}
						required
					/>
				{/if}

				{#if c.code === 'hypoadrenalism' || c.code === 'myxoedema' || c.code === 'hypoparathyroidism' || c.code === 'diabetes-insipidus-or-hypopituitarism'}
					<TextInput
						label="Substitution therapy (drug & dose)"
						name={`substitutionTherapy-${c.code}`}
						bind:value={c.substitutionTherapy}
						placeholder="e.g. hydrocortisone 20mg AM / 10mg PM"
					/>
					<RadioGroup
						label="Patient is currently on the required substitution therapy"
						name={`onSubstitutionTherapy-${c.code}`}
						options={yesNoOptions}
						bind:value={c.onSubstitutionTherapy}
					/>
				{/if}

				{#if c.code === 'epilepsy-on-anticonvulsant'}
					<TextInput
						label="Anticonvulsant (drug & dose)"
						name={`anticonvulsant-${c.code}`}
						bind:value={c.anticonvulsant}
					/>
					<RadioGroup
						label="Patient receives continuous anticonvulsant therapy"
						name={`continuousAnticonvulsantTherapy-${c.code}`}
						options={yesNoOptions}
						bind:value={c.continuousAnticonvulsantTherapy}
					/>
				{/if}

				{#if c.code === 'cancer-or-effects'}
					<TextInput
						label="Cancer site"
						name={`cancerSite-${c.code}`}
						bind:value={c.cancerSite}
						placeholder="e.g. breast, colorectal"
					/>
					<Select
						label="Treatment phase"
						name={`cancerTreatmentPhase-${c.code}`}
						options={cancerPhaseOptions}
						bind:value={c.cancerTreatmentPhase}
					/>
					<RadioGroup
						label="Histology confirmed?"
						name={`histologyConfirmed-${c.code}`}
						options={histologyOptions}
						bind:value={c.histologyConfirmed}
					/>
				{/if}

				<TextAreaInput
					label="Practitioner attestation notes"
					name={`attestation-${c.code}`}
					bind:value={c.practitionerAttestationNotes}
					rows={2}
				/>
			</div>
		{/each}
	{/if}
</Fieldset>
