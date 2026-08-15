<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import YesNoNA from '#lib/components/ui/YesNoNA.svelte';

	const d = assessment.data.fireSafety;
</script>

<Fieldset legend="Fire Safety & Emergency Egress">
	<p class="hint">Fire risk assessment, extinguishers, alarms, egress routes, lighting, fire doors.</p>

	<YesNoNA id="fireRiskAssessmentCurrent" label="Fire risk assessment is current and on file." bind:value={d.fireRiskAssessmentCurrent} />
	<YesNoNA id="fireExtinguishersServiced" label="Fire extinguishers have a current annual service record." bind:value={d.fireExtinguishersServiced} />
	<YesNoNA id="fireExtinguishersAccessible" label="Fire extinguishers are accessible and unobstructed." bind:value={d.fireExtinguishersAccessible} />
	<YesNoNA id="fireAlarmTestedWeekly" label="Fire alarm is tested weekly with records." bind:value={d.fireAlarmTestedWeekly} />
	<YesNoNA id="emergencyEgressClear" label="Emergency egress routes are clear and unobstructed." bind:value={d.emergencyEgressClear} />
	<YesNoNA id="emergencyLightingFunctional" label="Emergency lighting is functional." bind:value={d.emergencyLightingFunctional} />
	<YesNoNA id="fireDoorsHeldOpenIllegally" label="No fire doors held open illegally (e.g. by wedges)." bind:value={d.fireDoorsHeldOpenIllegally} />
	<YesNoNA id="assemblyPointSignposted" label="Assembly point is signposted and accessible." bind:value={d.assemblyPointSignposted} />

	<Field label="Observations" inputId="fireObservations">
		<TextAreaInput id="fireObservations" label="Observations" rows={3} placeholder="Alarm test log location, last drill date, etc.…" bind:value={d.observations} />
	</Field>
</Fieldset>
