<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { YES_NO_OPTS } from '#lib/config/options.js';
	import { assessmentStore } from '#lib/stores/assessment.svelte.js';

	const d = assessmentStore.data;
</script>

<Fieldset legend="15. Optimisation Plan by Domain">
	<p class="hint">What will be done for each triggered domain, and whether an onward referral has been made.</p>

	<Field label="Anaemia plan" inputId="plan-planAnaemia">
		<TextAreaInput id="plan-planAnaemia" label="Anaemia plan" rows={2} bind:value={d.plan.planAnaemia} />
	</Field>
	<Field label="Anaemia referral made" inputId="plan-referralAnaemia">
		<Select id="plan-referralAnaemia" label="Anaemia referral made" bind:value={d.plan.referralAnaemia}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Glycaemic control plan" inputId="plan-planGlycaemicControl">
		<TextAreaInput id="plan-planGlycaemicControl" label="Glycaemic control plan" rows={2} bind:value={d.plan.planGlycaemicControl} />
	</Field>
	<Field label="Glycaemic control referral made" inputId="plan-referralGlycaemicControl">
		<Select id="plan-referralGlycaemicControl" label="Glycaemic control referral made" bind:value={d.plan.referralGlycaemicControl}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Smoking plan" inputId="plan-planSmoking">
		<TextAreaInput id="plan-planSmoking" label="Smoking plan" rows={2} bind:value={d.plan.planSmoking} />
	</Field>
	<Field label="Smoking referral made" inputId="plan-referralSmoking">
		<Select id="plan-referralSmoking" label="Smoking referral made" bind:value={d.plan.referralSmoking}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Alcohol plan" inputId="plan-planAlcohol">
		<TextAreaInput id="plan-planAlcohol" label="Alcohol plan" rows={2} bind:value={d.plan.planAlcohol} />
	</Field>
	<Field label="Alcohol referral made" inputId="plan-referralAlcohol">
		<Select id="plan-referralAlcohol" label="Alcohol referral made" bind:value={d.plan.referralAlcohol}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Nutrition plan" inputId="plan-planNutrition">
		<TextAreaInput id="plan-planNutrition" label="Nutrition plan" rows={2} bind:value={d.plan.planNutrition} />
	</Field>
	<Field label="Nutrition referral made" inputId="plan-referralNutrition">
		<Select id="plan-referralNutrition" label="Nutrition referral made" bind:value={d.plan.referralNutrition}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Physical fitness plan" inputId="plan-planPhysicalFitness">
		<TextAreaInput id="plan-planPhysicalFitness" label="Physical fitness plan" rows={2} bind:value={d.plan.planPhysicalFitness} />
	</Field>
	<Field label="Physical fitness referral made" inputId="plan-referralPhysicalFitness">
		<Select id="plan-referralPhysicalFitness" label="Physical fitness referral made" bind:value={d.plan.referralPhysicalFitness}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Medication plan" inputId="plan-planMedication">
		<TextAreaInput id="plan-planMedication" label="Medication plan" rows={2} bind:value={d.plan.planMedication} />
	</Field>
	<Field label="Medication referral made" inputId="plan-referralMedication">
		<Select id="plan-referralMedication" label="Medication referral made" bind:value={d.plan.referralMedication}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Cardiorespiratory plan" inputId="plan-planCardiorespiratory">
		<TextAreaInput id="plan-planCardiorespiratory" label="Cardiorespiratory plan" rows={2} bind:value={d.plan.planCardiorespiratory} />
	</Field>
	<Field label="Cardiorespiratory referral made" inputId="plan-referralCardiorespiratory">
		<Select id="plan-referralCardiorespiratory" label="Cardiorespiratory referral made" bind:value={d.plan.referralCardiorespiratory}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Responsible clinician" inputId="plan-responsibleClinician">
		<TextInput id="plan-responsibleClinician" label="Responsible clinician" bind:value={d.plan.responsibleClinician} />
	</Field>
	<Field label="Plan agreed with the patient" inputId="plan-planAgreedWithPatient">
		<Select id="plan-planAgreedWithPatient" label="Plan agreed with the patient" bind:value={d.plan.planAgreedWithPatient}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Copy given to the patient" inputId="plan-planSharedWithPatient">
		<Select id="plan-planSharedWithPatient" label="Copy given to the patient" bind:value={d.plan.planSharedWithPatient}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Next review date" inputId="plan-nextReviewDate">
		<DateInput id="plan-nextReviewDate" label="Next review date" bind:value={d.plan.nextReviewDate} />
	</Field>
	<Field label="Plan notes" inputId="plan-planNotes">
		<TextAreaInput id="plan-planNotes" label="Plan notes" rows={3} bind:value={d.plan.planNotes} />
	</Field>
</Fieldset>
