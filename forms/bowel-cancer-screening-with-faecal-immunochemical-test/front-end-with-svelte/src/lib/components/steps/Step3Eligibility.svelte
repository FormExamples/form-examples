<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const e = assessment.data.eligibility;
</script>

<Fieldset legend="Step 3 of 7 — Eligibility and invitation">
	<p class="hint">Eligibility for the programme, the recall interval, and the invitation history.</p>

	<Field label="Within age range / eligibility" inputId="eligibility-withinAgeRange">
		<Select
			id="eligibility-withinAgeRange"
			label="Within age range / eligibility"
			bind:value={e.withinAgeRange}
		>
			<option value="">— Select —</option>
			<option value="eligible">Eligible (within age range)</option>
			<option value="over-age-self-request">Over age — self-request</option>
			<option value="not-eligible">Not eligible</option>
		</Select>
	</Field>

	<Field label="Recall interval" inputId="eligibility-recallInterval">
		<Select id="eligibility-recallInterval" label="Recall interval" bind:value={e.recallInterval}>
			<option value="">— Select —</option>
			<option value="two-yearly">Two-yearly</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Invitation date (kit issued)" inputId="eligibility-invitationDate">
		<TextInput
			id="eligibility-invitationDate"
			label="Invitation date (kit issued)"
			type="date"
			class="date-input"
			bind:value={e.invitationDate}
		/>
	</Field>

	<Field label="Previous screening outcome" inputId="eligibility-previousOutcome">
		<Select
			id="eligibility-previousOutcome"
			label="Previous screening outcome"
			bind:value={e.previousOutcome}
		>
			<option value="">— Select —</option>
			<option value="first-invitation">First invitation</option>
			<option value="prior-negative">Prior negative</option>
			<option value="prior-positive">Prior positive</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>
</Fieldset>
