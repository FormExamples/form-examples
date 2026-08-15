<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const p = assessment.data.professionals;
</script>

<Fieldset legend="Step 3 of 9 — Assessing professionals">
	<p class="hint">The AMHP and the medical practitioners providing recommendations.</p>

	<Field label="AMHP name" inputId="professionals-amhpName">
		<TextInput
			id="professionals-amhpName"
			label="AMHP name"
			placeholder="Approved Mental Health Professional"
			bind:value={p.amhpName}
		/>
	</Field>

	<Field label="AMHP approval confirmed?" inputId="professionals-amhpApproved">
		<Select id="professionals-amhpApproved" label="AMHP approval confirmed?" bind:value={p.amhpApproved}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Doctor 1 — name" inputId="professionals-doctor1Name">
		<TextInput
			id="professionals-doctor1Name"
			label="Doctor 1 — name"
			placeholder="First medical practitioner"
			bind:value={p.doctor1Name}
		/>
	</Field>

	<Field label="Doctor 1 — GMC number" inputId="professionals-doctor1GmcNumber">
		<TextInput
			id="professionals-doctor1GmcNumber"
			label="Doctor 1 — GMC number"
			placeholder="e.g. 7654321"
			bind:value={p.doctor1GmcNumber}
		/>
	</Field>

	<Field label="Doctor 1 — Section 12 approved?" inputId="professionals-doctor1Section12Approved">
		<Select
			id="professionals-doctor1Section12Approved"
			label="Doctor 1 — Section 12 approved?"
			bind:value={p.doctor1Section12Approved}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Doctor 1 — examined at" inputId="professionals-doctor1ExaminedAt">
		<TextInput
			id="professionals-doctor1ExaminedAt"
			label="Doctor 1 — examined at"
			type="datetime-local"
			class="date-input"
			bind:value={p.doctor1ExaminedAt}
		/>
	</Field>

	<Field
		label="Doctor 2 — name"
		description="Required for Section 2 and Section 3; may be absent for s4 / s5 / s136."
		inputId="professionals-doctor2Name"
	>
		<TextInput
			id="professionals-doctor2Name"
			label="Doctor 2 — name"
			placeholder="Second medical practitioner"
			bind:value={p.doctor2Name}
		/>
	</Field>

	<Field label="Doctor 2 — GMC number" inputId="professionals-doctor2GmcNumber">
		<TextInput
			id="professionals-doctor2GmcNumber"
			label="Doctor 2 — GMC number"
			placeholder="e.g. 1234567"
			bind:value={p.doctor2GmcNumber}
		/>
	</Field>

	<Field label="Doctor 2 — Section 12 approved?" inputId="professionals-doctor2Section12Approved">
		<Select
			id="professionals-doctor2Section12Approved"
			label="Doctor 2 — Section 12 approved?"
			bind:value={p.doctor2Section12Approved}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field
		label="Doctor 2 — examined at"
		description="For s2 / s3 the two examinations must be within 5 days of each other."
		inputId="professionals-doctor2ExaminedAt"
	>
		<TextInput
			id="professionals-doctor2ExaminedAt"
			label="Doctor 2 — examined at"
			type="datetime-local"
			class="date-input"
			bind:value={p.doctor2ExaminedAt}
		/>
	</Field>

	<Field
		label="Prior acquaintance with the patient?"
		description="The Code of Practice recommends at least one doctor be previously acquainted, where practicable."
		inputId="professionals-priorAcquaintance"
	>
		<Select
			id="professionals-priorAcquaintance"
			label="Prior acquaintance with the patient?"
			bind:value={p.priorAcquaintance}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
