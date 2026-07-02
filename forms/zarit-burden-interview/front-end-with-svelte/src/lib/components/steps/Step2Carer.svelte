<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.carer;
</script>

<Fieldset legend="Step 2 of 5 — Carer details">
	<p class="hint">The informal carer completing the questionnaire.</p>

	<Field label="Carer identifier" required inputId="carer-carerIdentifier">
		<TextInput
			id="carer-carerIdentifier"
			label="Carer identifier"
			placeholder="e.g. CAR-100482"
			required
			bind:value={c.carerIdentifier}
		/>
	</Field>

	<Field label="Relationship to the care recipient" inputId="carer-carerRelationship">
		<Select
			id="carer-carerRelationship"
			label="Relationship to the care recipient"
			bind:value={c.carerRelationship}
		>
			<option value="">— Select —</option>
			<option value="spouse-partner">Spouse / partner</option>
			<option value="adult-child">Adult child</option>
			<option value="other-relative">Other relative</option>
			<option value="friend">Friend</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Lives with the care recipient" inputId="carer-carerCoResident">
		<Select id="carer-carerCoResident" label="Lives with the care recipient" bind:value={c.carerCoResident}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field
		label="Hours of care per week"
		description="Approximate hours of care provided each week."
		inputId="carer-careHoursPerWeek"
	>
		<NumberInput
			id="carer-careHoursPerWeek"
			label="Hours of care per week"
			min={0}
			max={168}
			step={1}
			bind:value={c.careHoursPerWeek}
		/>
	</Field>
</Fieldset>
