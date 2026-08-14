<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO_OPTS } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;
</script>

<Fieldset legend="4. Medications">
	<p class="hint">The medication domain is optimized when a hold-and-restart plan has been agreed with the prescriber.</p>

	<Field label="Prescription medicines" inputId="medication-takesPrescriptionMedicines">
		<Select id="medication-takesPrescriptionMedicines" label="Prescription medicines" bind:value={d.medication.takesPrescriptionMedicines}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Over-the-counter medicines" inputId="medication-takesOverTheCounterMedicines">
		<Select id="medication-takesOverTheCounterMedicines" label="Over-the-counter medicines" bind:value={d.medication.takesOverTheCounterMedicines}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Herbal or complementary products" inputId="medication-takesHerbalProducts">
		<Select id="medication-takesHerbalProducts" label="Herbal or complementary products" bind:value={d.medication.takesHerbalProducts}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Anticoagulant" inputId="medication-takesAnticoagulant">
		<Select id="medication-takesAnticoagulant" label="Anticoagulant" bind:value={d.medication.takesAnticoagulant}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Antiplatelet" inputId="medication-takesAntiplatelet">
		<Select id="medication-takesAntiplatelet" label="Antiplatelet" bind:value={d.medication.takesAntiplatelet}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="SGLT2 inhibitor" inputId="medication-takesSglt2Inhibitor" description="Can cause ketoacidosis with a normal blood glucose. Needs an explicit hold plan.">
		<Select id="medication-takesSglt2Inhibitor" label="SGLT2 inhibitor" bind:value={d.medication.takesSglt2Inhibitor}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="GLP-1 receptor agonist" inputId="medication-takesGlp1Agonist" description="Delays gastric emptying — aspiration risk despite standard fasting.">
		<Select id="medication-takesGlp1Agonist" label="GLP-1 receptor agonist" bind:value={d.medication.takesGlp1Agonist}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Formulation" inputId="medication-glp1Formulation">
		<Select id="medication-glp1Formulation" label="Formulation" bind:value={d.medication.glp1Formulation}>
			<option value="">— Select —</option>
			<option value="daily">Daily</option>
			<option value="weekly">Weekly</option>
		</Select>
	</Field>
	<Field label="Held per guideline" inputId="medication-glp1HeldPerGuideline" description="Daily formulations held day-of; weekly formulations held one week prior.">
		<Select id="medication-glp1HeldPerGuideline" label="Held per guideline" bind:value={d.medication.glp1HeldPerGuideline}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Extended clear-fluid fast confirmed" inputId="medication-glp1ExtendedClearFluidsConfirmed" description="24-hour solid fast plus 4-8 hour clear-liquid fast, if not held.">
		<Select id="medication-glp1ExtendedClearFluidsConfirmed" label="Extended clear-fluid fast confirmed" bind:value={d.medication.glp1ExtendedClearFluidsConfirmed}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Active GI symptoms" inputId="medication-glp1GiSymptoms" description="Nausea, vomiting, bloating, or abdominal pain.">
		<Select id="medication-glp1GiSymptoms" label="Active GI symptoms" bind:value={d.medication.glp1GiSymptoms}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="GI symptom details" inputId="medication-glp1GiSymptomsDetails">
		<TextInput id="medication-glp1GiSymptomsDetails" label="GI symptom details" bind:value={d.medication.glp1GiSymptomsDetails} />
	</Field>
	<Field label="Gastric ultrasound performed" inputId="medication-glp1GastricUltrasoundPerformed">
		<Select id="medication-glp1GastricUltrasoundPerformed" label="Gastric ultrasound performed" bind:value={d.medication.glp1GastricUltrasoundPerformed}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Gastric ultrasound finding" inputId="medication-glp1GastricUltrasoundFindings">
		<Select id="medication-glp1GastricUltrasoundFindings" label="Gastric ultrasound finding" bind:value={d.medication.glp1GastricUltrasoundFindings}>
			<option value="">— Select —</option>
			<option value="empty">Empty</option>
			<option value="low-risk">Low risk</option>
			<option value="full-stomach">Full stomach</option>
		</Select>
	</Field>
	<Field label="ACE inhibitor or ARB" inputId="medication-takesAceInhibitorOrArb">
		<Select id="medication-takesAceInhibitorOrArb" label="ACE inhibitor or ARB" bind:value={d.medication.takesAceInhibitorOrArb}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Systemic corticosteroid" inputId="medication-takesCorticosteroid">
		<Select id="medication-takesCorticosteroid" label="Systemic corticosteroid" bind:value={d.medication.takesCorticosteroid}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Immunosuppressant or biologic" inputId="medication-takesImmunosuppressant">
		<Select id="medication-takesImmunosuppressant" label="Immunosuppressant or biologic" bind:value={d.medication.takesImmunosuppressant}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Hormone therapy" inputId="medication-takesHormoneTherapy">
		<Select id="medication-takesHormoneTherapy" label="Hormone therapy" bind:value={d.medication.takesHormoneTherapy}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Hold-and-restart plan agreed" inputId="medication-medicationHoldPlanAgreed" description="This is the medication domain optimization criterion.">
		<Select id="medication-medicationHoldPlanAgreed" label="Hold-and-restart plan agreed" bind:value={d.medication.medicationHoldPlanAgreed}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Agreed by" inputId="medication-medicationHoldPlanAgreedBy">
		<TextInput id="medication-medicationHoldPlanAgreedBy" label="Agreed by" bind:value={d.medication.medicationHoldPlanAgreedBy} />
	</Field>
	<Field label="Adherence" inputId="medication-medicationAdherence">
		<Select id="medication-medicationAdherence" label="Adherence" bind:value={d.medication.medicationAdherence}>
			<option value="">— Select —</option>
			{#each OPTIONS.adherence as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Medication notes" inputId="medication-medicationNotes">
		<TextAreaInput id="medication-medicationNotes" label="Medication notes" rows={2} bind:value={d.medication.medicationNotes} />
	</Field>
</Fieldset>
