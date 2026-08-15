<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const r = assessment.data.recipient;
</script>

<Fieldset legend="Step 3 of 5 — Care recipient details">
	<p class="hint">The person being cared for. The ZBI does not assess their clinical condition.</p>

	<Field label="Recipient identifier" inputId="recipient-recipientIdentifier">
		<TextInput
			id="recipient-recipientIdentifier"
			label="Recipient identifier"
			placeholder="e.g. REC-100482"
			bind:value={r.recipientIdentifier}
		/>
	</Field>

	<Field label="Primary condition" inputId="recipient-recipientCondition">
		<Select
			id="recipient-recipientCondition"
			label="Primary condition"
			bind:value={r.recipientCondition}
		>
			<option value="">— Select —</option>
			<option value="dementia">Dementia</option>
			<option value="chronic-illness">Chronic illness</option>
			<option value="disability">Disability</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
