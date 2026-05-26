<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const r = assessment.data.reasonForVisit;
</script>

<Fieldset legend="Reason for Visit">
	<p class="hint">Please describe why you are visiting today</p>
	<Field label="Primary Reason for Visit" inputId="primaryReason"><TextAreaInput id="primaryReason" label="Primary Reason for Visit" placeholder="Please describe your main reason for visiting" bind:value={r.primaryReason} /></Field>

	<Field label="Urgency Level" required inputId="urgency"><Select id="urgency" label="Urgency Level" required bind:value={r.urgencyLevel}><option value="">-- Select --</option>{#each [
			{ value: 'routine', label: 'Routine' },
			{ value: 'urgent', label: 'Urgent' },
			{ value: 'emergency', label: 'Emergency' }
		] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>

	<Field label="Referring Provider" inputId="referrer"><TextInput id="referrer" label="Referring Provider" placeholder="If referred by another doctor" bind:value={r.referringProvider} /></Field>

	<Field label="How long have you had these symptoms?" inputId="symptomDuration"><TextInput id="symptomDuration" label="How long have you had these symptoms?" placeholder="e.g. 2 weeks, 3 months" bind:value={r.symptomDuration} /></Field>

	<Field label="Additional Details" inputId="additionalDetails"><TextAreaInput id="additionalDetails" label="Additional Details" placeholder="Any other information you'd like to share" bind:value={r.additionalDetails} /></Field>
</Fieldset>
