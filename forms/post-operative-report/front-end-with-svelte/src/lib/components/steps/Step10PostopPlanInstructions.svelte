<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.postopPlanInstructions;
</script>

<Fieldset legend="Post-op Plan & Instructions">
	<p class="hint">Onward management plan, prescriptions, and follow-up.</p>

	<Field label="Medications prescribed" inputId="medicationsPrescribed">
		<TextAreaInput id="medicationsPrescribed" label="Medications prescribed" rows={3} placeholder="New medications, regular medications continued/held." bind:value={d.medicationsPrescribed} />
	</Field>
	<Field label="Antibiotic plan" inputId="antibioticPlan">
		<TextAreaInput id="antibioticPlan" label="Antibiotic plan" rows={2} placeholder="Prophylactic vs treatment course, agents, duration." bind:value={d.antibioticPlan} />
	</Field>
	<Field label="Thromboprophylaxis" inputId="thromboprophylaxis">
		<TextAreaInput id="thromboprophylaxis" label="Thromboprophylaxis" rows={2} placeholder="e.g. LMWH 40 mg SC daily, TED stockings, IPCs." bind:value={d.thromboprophylaxis} />
	</Field>
	<Field label="Analgesia plan" inputId="analgesiaPlan">
		<TextAreaInput id="analgesiaPlan" label="Analgesia plan" rows={2} placeholder="Multimodal analgesia, PCA, regional blocks." bind:value={d.analgesiaPlan} />
	</Field>
	<Field label="Diet plan" inputId="dietPlan">
		<TextAreaInput id="dietPlan" label="Diet plan" rows={2} placeholder="NBM, sips, free fluids, light diet, normal diet." bind:value={d.dietPlan} />
	</Field>
	<Field label="Mobilisation plan" inputId="mobilisationPlan">
		<TextAreaInput id="mobilisationPlan" label="Mobilisation plan" rows={2} placeholder="Bed rest vs mobilise as able, weight bearing status." bind:value={d.mobilisationPlan} />
	</Field>
	<Field label="Wound care instructions" inputId="woundCareInstructions">
		<TextAreaInput id="woundCareInstructions" label="Wound care instructions" rows={2} placeholder="Dressing changes, suture/staple removal date, signs of infection." bind:value={d.woundCareInstructions} />
	</Field>
	<Field label="Follow-up plan" inputId="followUpPlan">
		<TextAreaInput id="followUpPlan" label="Follow-up plan" rows={2} placeholder="Outpatient appointments, imaging, results review." bind:value={d.followUpPlan} />
	</Field>
	<Field label="Discharge criteria" inputId="dischargeCriteria">
		<TextAreaInput id="dischargeCriteria" label="Discharge criteria" rows={2} placeholder="Conditions to meet before discharge." bind:value={d.dischargeCriteria} />
	</Field>
	<Field label="Alerts & escalation" inputId="alertsAndEscalation">
		<TextAreaInput id="alertsAndEscalation" label="Alerts & escalation" rows={2} placeholder="When to escalate, who to call, named contact." bind:value={d.alertsAndEscalation} />
	</Field>
</Fieldset>
