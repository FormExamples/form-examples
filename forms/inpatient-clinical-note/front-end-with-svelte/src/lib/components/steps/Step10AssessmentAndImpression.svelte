<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import * as options from '#lib/config/options.js';
	import { TOTAL_STEPS } from '#lib/config/steps.js';

	const s = assessment.data.assessment;
</script>

<Fieldset legend={`Step 10 of ${TOTAL_STEPS} — Assessment and impression`}>
	<p class="hint">
		Your clinical impression, and the deterioration markers that drive the acuity band. Required
		component: an impression.
	</p>

	<Field
		label="Clinical impression"
		description="Required. Its absence forces an Incomplete grade regardless of the rest."
		inputId="assessment-clinicalImpression"
	>
		<TextAreaInput
			id="assessment-clinicalImpression"
			label="Clinical impression"
			rows={4}
			placeholder="What you think is going on."
			bind:value={s.clinicalImpression}
		/>
	</Field>

	<Field label="Differential diagnosis" inputId="assessment-differentialDiagnosis">
		<TextAreaInput
			id="assessment-differentialDiagnosis"
			label="Differential diagnosis"
			rows={3}
			bind:value={s.differentialDiagnosis}
		/>
	</Field>

	<Field label="Response to treatment" inputId="assessment-responseToTreatment">
		<Select id="assessment-responseToTreatment" label="Response to treatment" bind:value={s.responseToTreatment}>
			<option value="">— Select —</option>
			{#each options.responseToTreatment as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field
		label="New oxygen requirement?"
		description="Yes raises the acuity band to Escalate."
		inputId="assessment-newOxygenRequirement"
	>
		<Select id="assessment-newOxygenRequirement" label="New oxygen requirement?" bind:value={s.newOxygenRequirement}>
			<option value="">— Select —</option>
			{#each options.yesNo as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field
		label="New confusion?"
		description="With an ACVPU below Alert, raises the acuity band to Escalate."
		inputId="assessment-newConfusion"
	>
		<Select id="assessment-newConfusion" label="New confusion?" bind:value={s.newConfusion}>
			<option value="">— Select —</option>
			{#each options.yesNo as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field
		label="Sepsis screen"
		description="A positive screen raises the acuity band to Escalate (NICE NG51)."
		inputId="assessment-sepsisScreen"
	>
		<Select id="assessment-sepsisScreen" label="Sepsis screen" bind:value={s.sepsisScreen}>
			<option value="">— Select —</option>
			{#each options.sepsisScreen as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field
		label="Arrest call"
		description="Anything other than none raises the acuity band to Critical."
		inputId="assessment-arrestCall"
	>
		<Select id="assessment-arrestCall" label="Arrest call" bind:value={s.arrestCall}>
			<option value="">— Select —</option>
			{#each options.arrestCall as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field
		label="Critical-care referral made?"
		description="Yes raises the acuity band to Critical."
		inputId="assessment-criticalCareReferral"
	>
		<Select id="assessment-criticalCareReferral" label="Critical-care referral made?" bind:value={s.criticalCareReferral}>
			<option value="">— Select —</option>
			{#each options.yesNo as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field
		label="New organ support"
		description="Anything other than none raises the acuity band to Critical."
		inputId="assessment-newOrganSupport"
	>
		<Select id="assessment-newOrganSupport" label="New organ support" bind:value={s.newOrganSupport}>
			<option value="">— Select —</option>
			{#each options.organSupport as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
