<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 7 — Screening context">
	<p class="hint">Who is reporting, when, where, and the screening episode type.</p>

	<Field label="Reporting clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Reporting clinician name"
			placeholder="e.g. Dr A. Khan"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="mammographer">Mammographer</option>
			<option value="advanced-practitioner">Advanced-practitioner radiographer</option>
			<option value="breast-radiologist">Breast radiologist</option>
			<option value="screening-office">Screening office</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date and time reported" inputId="context-reportedAt">
		<TextInput
			id="context-reportedAt"
			label="Date and time reported"
			type="datetime-local"
			class="date-input"
			bind:value={c.reportedAt}
		/>
	</Field>

	<Field label="Screening unit" inputId="context-screeningUnit">
		<TextInput
			id="context-screeningUnit"
			label="Screening unit"
			placeholder="e.g. City static unit or Mobile unit 3"
			bind:value={c.screeningUnit}
		/>
	</Field>

	<Field label="Episode type" required inputId="context-episodeType">
		<Select id="context-episodeType" label="Episode type" required bind:value={c.episodeType}>
			<option value="">— Select —</option>
			<option value="routine-recall">Routine recall</option>
			<option value="very-first-call">Very first call</option>
			<option value="self-referral">Self-referral</option>
			<option value="higher-risk-surveillance">Higher-risk surveillance</option>
		</Select>
	</Field>
</Fieldset>
