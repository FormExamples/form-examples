<script lang="ts">
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateBMI, bmiCategory } from '#lib/engine/utils.js';

	const d = assessment.data.demographics;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	$effect(() => {
		const bmi = calculateBMI(d.weight, d.height);
		assessment.data.demographics.bmi = bmi;
	});
</script>

<Fieldset legend="Demographics">
	<p class="hint">Basic patient information</p>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Field label="First Name" required inputId="firstName"><TextInput id="firstName" label="First Name" required bind:value={d.firstName} /></Field>
		<Field label="Last Name" required inputId="lastName"><TextInput id="lastName" label="Last Name" required bind:value={d.lastName} /></Field>
	</div>

	<Field label="Date of Birth" required inputId="dob"><DateInput id="dob" label="Date of Birth" required bind:value={d.dateOfBirth} /></Field>

	<Field label="Sex" required><RadioGroup label="Sex">{#each [
			{ value: 'male', label: 'Male' },
			{ value: 'female', label: 'Female' },
			{ value: 'other', label: 'Other' }
		] as opt (opt.value)}<label><input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={d.sex} required/> {opt.label}</label>{/each}</RadioGroup></Field>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
		<NumberInput label="Weight" name="weight" bind:value={d.weight} unit="kg" min={1} max={400} required />
		<NumberInput label="Height" name="height" bind:value={d.height} unit="cm" min={50} max={250} required />
		<div class="mb-4">
			<span class="mb-1 block text-sm font-medium text-base-content/80">BMI</span>
			<div class="flex h-[38px] items-center rounded-lg border border-base-300 bg-base-200 px-3 text-sm">
				{#if d.bmi}
					<span class="font-medium">{d.bmi}</span>
					<span class="ml-2 text-base-content/60">({bmiCategory(d.bmi)})</span>
				{:else}
					<span class="text-base-content/50">Auto-calculated</span>
				{/if}
			</div>
		</div>
	</div>

	<Field label="Planned Procedure" required inputId="procedure"><TextInput id="procedure" label="Planned Procedure" required bind:value={d.plannedProcedure} /></Field>

	<Field label="Procedure Urgency" required inputId="urgency"><Select id="urgency" label="Procedure Urgency" required bind:value={d.procedureUrgency}><option value="">-- Select --</option>{#each [
			{ value: 'elective', label: 'Elective' },
			{ value: 'urgent', label: 'Urgent' },
			{ value: 'emergency', label: 'Emergency' }
		] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>

	<p class="hint">Background health</p>
	<Field label="Have you ever been diagnosed with cancer?"><RadioGroup label="Have you ever been diagnosed with cancer?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="cancer" value={opt.value} bind:group={d.cancerHistory}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if d.cancerHistory === 'yes'}
		<Field label="Please give full details including dates and treatment" inputId="cancerDetails"><TextInput id="cancerDetails" label="Please give full details including dates and treatment" bind:value={d.cancerHistoryDetails} /></Field>
	{/if}
	<Field label="Do you have a history of MRSA or MSSA?"><RadioGroup label="Do you have a history of MRSA or MSSA?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="mrsa" value={opt.value} bind:group={d.mrsaHistory}/> {opt.label}</label>{/each}</RadioGroup></Field>
	<Field label="Have you been admitted to hospital or a nursing/care home within the last 6 months?"><RadioGroup label="Have you been admitted to hospital or a nursing/care home within the last 6 months?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="recentAdmission" value={opt.value} bind:group={d.recentHospitalOrCareHomeAdmission}/> {opt.label}</label>{/each}</RadioGroup></Field>
</Fieldset>
