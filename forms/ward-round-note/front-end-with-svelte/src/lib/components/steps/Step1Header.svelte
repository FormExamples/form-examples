<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const h = assessment.data.header;
</script>

<Fieldset legend="Step 1 of 11 — Review header">
	<p class="hint">
		Who is documenting, their grade, and when the review took place. Required component: name,
		grade, and date/time.
	</p>

	<Field label="Reviewing clinician name" required inputId="header-clinicianName">
		<TextInput
			id="header-clinicianName"
			label="Reviewing clinician name"
			placeholder="e.g. Dr A. Okafor"
			required
			bind:value={h.clinicianName}
		/>
	</Field>

	<Field label="Clinician grade" required inputId="header-clinicianGrade">
		<Select id="header-clinicianGrade" label="Clinician grade" required bind:value={h.clinicianGrade}>
			<option value="">— Select —</option>
			<option value="fy1">Foundation Year 1 (FY1)</option>
			<option value="fy2">Foundation Year 2 (FY2)</option>
			<option value="core-trainee">Core trainee</option>
			<option value="specialty-registrar">Specialty registrar</option>
			<option value="acp">Advanced clinical practitioner (ACP)</option>
			<option value="physician-associate">Physician associate</option>
			<option value="consultant">Consultant</option>
		</Select>
	</Field>

	<Field label="Date and time of review" required inputId="header-reviewedAt">
		<TextInput
			id="header-reviewedAt"
			label="Date and time of review"
			type="datetime-local"
			class="date-input"
			required
			bind:value={h.reviewedAt}
		/>
	</Field>

	<Field label="Ward / location" inputId="header-ward">
		<TextInput
			id="header-ward"
			label="Ward / location"
			placeholder="e.g. Ward 12B, Acute Medical Unit"
			bind:value={h.ward}
		/>
	</Field>
</Fieldset>
