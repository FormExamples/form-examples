<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const e = assessment.data.eligibility;
</script>

<Fieldset legend="Step 3 of 7 — Eligibility and consent">
	<p class="hint">
		Prior screening history and consent from the person with parental responsibility. Record a reason
		where screening for any condition was declined.
	</p>

	<Field label="Previously screened" inputId="eligibility-previouslyScreened">
		<Select
			id="eligibility-previouslyScreened"
			label="Previously screened"
			bind:value={e.previouslyScreened}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Consent given" required inputId="eligibility-consentGiven">
		<Select id="eligibility-consentGiven" label="Consent given" required bind:value={e.consentGiven}>
			<option value="">— Select —</option>
			<option value="yes">Yes — all conditions</option>
			<option value="partial">Partial — some conditions declined</option>
			<option value="no">No — screening declined</option>
		</Select>
	</Field>

	<Field label="Decline reason" inputId="eligibility-declineReason">
		<TextAreaInput
			id="eligibility-declineReason"
			label="Decline reason"
			rows={3}
			placeholder="Where any condition is declined, record the reason and that the decline is informed."
			bind:value={e.declineReason}
		/>
	</Field>
</Fieldset>
