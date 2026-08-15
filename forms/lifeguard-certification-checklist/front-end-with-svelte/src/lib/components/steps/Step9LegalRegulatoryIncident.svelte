<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TriStateField from '#lib/components/ui/TriStateField.svelte';

	const l = assessment.data.legalRegulatoryIncident;
</script>

<Fieldset legend="Legal, Regulatory & Incident Reporting">
	<p class="hint">Duty of care, operating procedures, and incident reporting knowledge.</p>

	<TriStateField label="Demonstrates understanding of duty of care and responsibilities" name="dutyOfCareUnderstood" bind:value={l.dutyOfCareUnderstood} />
	<TriStateField label="Knows venue Pool Safety Operating Procedures (PSOP / NOP / EAP)" name="pswpKnowledge" bind:value={l.pswpKnowledge} />
	<TriStateField label="Can correctly invoke the Emergency Action Plan (EAP)" name="eapInvocation" bind:value={l.eapInvocation} />
	<TriStateField label="Completes incident report accurately and contemporaneously" name="incidentReportCompleted" bind:value={l.incidentReportCompleted} />
	<TriStateField label="Demonstrates awareness of RIDDOR reportable events" name="riddorAwareness" bind:value={l.riddorAwareness} />
	<TriStateField label="Understands safeguarding obligations for children and adults at risk" name="safeguardingChildrenAdults" bind:value={l.safeguardingChildrenAdults} />
</Fieldset>
