<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 5 — Assessment context">
	<p class="hint">Who is assessing, when, where, and why.</p>

	<Field label="Assessing nurse name" required inputId="context-nurseName">
		<TextInput
			id="context-nurseName"
			label="Assessing nurse name"
			placeholder="e.g. RN A. Okafor"
			required
			bind:value={c.nurseName}
		/>
	</Field>

	<Field label="Nurse role" required inputId="context-nurseRole">
		<Select id="context-nurseRole" label="Nurse role" required bind:value={c.nurseRole}>
			<option value="">— Select —</option>
			<option value="registered-nurse">Registered nurse</option>
			<option value="healthcare-assistant">Healthcare assistant</option>
			<option value="tissue-viability">Tissue-viability specialist</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date and time of assessment" inputId="context-assessedAt">
		<TextInput
			id="context-assessedAt"
			label="Date and time of assessment"
			type="datetime-local"
			class="date-input"
			bind:value={c.assessedAt}
		/>
	</Field>

	<Field label="Care setting" required inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" required bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="acute-ward">Acute ward</option>
			<option value="community">Community</option>
			<option value="care-home">Care home</option>
			<option value="hospice">Hospice</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Reason for assessment" inputId="context-assessmentReason">
		<Select
			id="context-assessmentReason"
			label="Reason for assessment"
			bind:value={c.assessmentReason}
		>
			<option value="">— Select —</option>
			<option value="admission">Admission</option>
			<option value="routine">Routine reassessment</option>
			<option value="change-in-condition">Change in condition</option>
		</Select>
	</Field>
</Fieldset>
