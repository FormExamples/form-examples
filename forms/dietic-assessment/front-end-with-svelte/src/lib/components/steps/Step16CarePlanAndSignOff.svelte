<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;
</script>

<Fieldset legend="16. Nutrition Care Plan and Sign-off">
	<p class="hint">The intervention, the goals, the monitoring plan, and the dietitian signature.</p>

	<Field label="Intervention type" inputId="plan-interventionType" required>
		<Select id="plan-interventionType" label="Intervention type" bind:value={d.plan.interventionType} required>
			<option value="">— Select —</option>
			{#each OPTIONS.interventionType as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Prescribed supplement" inputId="plan-prescribedSupplement">
		<TextInput id="plan-prescribedSupplement" label="Prescribed supplement" bind:value={d.plan.prescribedSupplement} />
	</Field>
	<Field label="Dose and frequency" inputId="plan-prescribedSupplementDose">
		<TextInput id="plan-prescribedSupplementDose" label="Dose and frequency" bind:value={d.plan.prescribedSupplementDose} />
	</Field>
	<Field label="Texture modification plan" inputId="plan-textureModificationPlan">
		<TextInput id="plan-textureModificationPlan" label="Texture modification plan"
			placeholder="Stated in IDDSI levels where applicable" bind:value={d.plan.textureModificationPlan} />
	</Field>
	<Field label="Goal 1" inputId="plan-goal1">
		<TextAreaInput id="plan-goal1" label="Goal 1" rows={2}
			placeholder="Target, measure, and review date." bind:value={d.plan.goal1} />
	</Field>
	<Field label="Goal 2" inputId="plan-goal2">
		<TextAreaInput id="plan-goal2" label="Goal 2" rows={2} bind:value={d.plan.goal2} />
	</Field>
	<Field label="Goal 3" inputId="plan-goal3">
		<TextAreaInput id="plan-goal3" label="Goal 3" rows={2} bind:value={d.plan.goal3} />
	</Field>
	<Field label="Education provided" inputId="plan-educationProvided">
		<TextAreaInput id="plan-educationProvided" label="Education provided" rows={2} bind:value={d.plan.educationProvided} />
	</Field>
	<Field label="Resources given" inputId="plan-resourcesGiven">
		<TextAreaInput id="plan-resourcesGiven" label="Resources given" rows={2} bind:value={d.plan.resourcesGiven} />
	</Field>
	<Field label="Monitoring indicators" inputId="plan-monitoringIndicators">
		<TextAreaInput id="plan-monitoringIndicators" label="Monitoring indicators" rows={2}
			placeholder="Weight, intake, or a biochemical marker." bind:value={d.plan.monitoringIndicators} />
	</Field>
	<Field label="Review interval (weeks)" inputId="plan-reviewIntervalWeeks">
		<NumberInput id="plan-reviewIntervalWeeks" label="Review interval (weeks)" min={0} max={260} bind:value={d.plan.reviewIntervalWeeks} />
	</Field>
	<Field label="Review date" inputId="plan-reviewDate">
		<DateInput id="plan-reviewDate" label="Review date" bind:value={d.plan.reviewDate} />
	</Field>
	<Field label="Onward referrals" inputId="plan-onwardReferral">
		<TextInput id="plan-onwardReferral" label="Onward referrals" bind:value={d.plan.onwardReferral} />
	</Field>
	<p class="hint">The override changes the composite risk category only. Safety flags are computed independently and are always printed, so an override cannot hide a hazard.</p>
	<Field label="Override composite risk" inputId="plan-overrideCompositeRisk">
		<Select id="plan-overrideCompositeRisk" label="Override composite risk" bind:value={d.plan.overrideCompositeRisk}>
			<option value="">— Select —</option>
			{#each OPTIONS.compositeRisk as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Override reason" inputId="plan-overrideReason" description="Mandatory when the override differs from the computed value.">
		<TextInput id="plan-overrideReason" label="Override reason" bind:value={d.plan.overrideReason} />
	</Field>
	<Field label="Additional notes" inputId="plan-additionalNotes">
		<TextAreaInput id="plan-additionalNotes" label="Additional notes" rows={3} bind:value={d.plan.additionalNotes} />
	</Field>
	<Field label="Signed by (registered dietitian)" inputId="plan-signedByName" description="A registered dietitian must sign before the report is final." required>
		<TextInput id="plan-signedByName" label="Signed by (registered dietitian)" bind:value={d.plan.signedByName} required />
	</Field>
</Fieldset>
