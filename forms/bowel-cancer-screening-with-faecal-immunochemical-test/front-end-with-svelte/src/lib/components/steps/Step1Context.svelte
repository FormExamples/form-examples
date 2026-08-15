<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 7 — Assessment context">
	<p class="hint">Who reviewed the result, when, and at which screening hub.</p>

	<Field label="Reviewing clinician / administrator" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Reviewing clinician / administrator"
			placeholder="e.g. Screening practitioner N. Okafor"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="screening-administrator">Screening administrator</option>
			<option value="screening-practitioner">Screening practitioner</option>
			<option value="gp">GP</option>
			<option value="ssp">Specialist screening practitioner (SSP)</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date and time reviewed" inputId="context-reviewedAt">
		<TextInput
			id="context-reviewedAt"
			label="Date and time reviewed"
			type="datetime-local"
			class="date-input"
			bind:value={c.reviewedAt}
		/>
	</Field>

	<Field label="Screening hub / centre" inputId="context-screeningHub">
		<TextInput
			id="context-screeningHub"
			label="Screening hub / centre"
			placeholder="e.g. Northern Hub"
			bind:value={c.screeningHub}
		/>
	</Field>
</Fieldset>
