<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const a = assessment.data.admission;
</script>

<Fieldset legend="Step 3 of 5 — Admission findings">
	<p class="hint">Findings on admission and the planned care for this labour.</p>

	<Field label="Membranes on admission" inputId="admission-membranesOnAdmission">
		<Select
			id="admission-membranesOnAdmission"
			label="Membranes on admission"
			bind:value={a.membranesOnAdmission}
		>
			<option value="">— Select —</option>
			<option value="intact">Intact</option>
			<option value="ruptured">Ruptured</option>
		</Select>
	</Field>

	<Field label="Risk factors" inputId="admission-riskFactors">
		<TextAreaInput
			id="admission-riskFactors"
			label="Risk factors"
			rows={3}
			placeholder="e.g. post-dates, previous caesarean, hypertension"
			bind:value={a.riskFactors}
		/>
	</Field>

	<Field label="Planned care" inputId="admission-plannedCare">
		<TextAreaInput
			id="admission-plannedCare"
			label="Planned care"
			rows={3}
			placeholder="e.g. continuous monitoring, mobilisation, review at next examination"
			bind:value={a.plannedCare}
		/>
	</Field>
</Fieldset>
