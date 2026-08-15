<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 10 — Check context">
	<p class="hint">Who carried out the check, when, and how the person was invited.</p>

	<Field label="Clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Clinician name"
			placeholder="e.g. Sister J. Okafor"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="gp">GP</option>
			<option value="practice-nurse">Practice nurse</option>
			<option value="healthcare-assistant">Healthcare assistant</option>
			<option value="ld-team">Community LD-team clinician</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date of check" required inputId="context-checkedOn">
		<DateInput id="context-checkedOn" label="Date of check" required bind:value={c.checkedOn} />
	</Field>

	<Field label="GP practice" required inputId="context-practiceName">
		<TextInput
			id="context-practiceName"
			label="GP practice"
			placeholder="e.g. Meadow Lane Surgery"
			required
			bind:value={c.practiceName}
		/>
	</Field>

	<Field label="Easy-read invitation sent?" inputId="context-easyReadInvitationSent">
		<Select
			id="context-easyReadInvitationSent"
			label="Easy-read invitation sent?"
			bind:value={c.easyReadInvitationSent}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field
		label="Pre-check questionnaire completed beforehand?"
		inputId="context-preCheckDone"
	>
		<Select
			id="context-preCheckDone"
			label="Pre-check questionnaire completed beforehand?"
			bind:value={c.preCheckDone}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
