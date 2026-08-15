<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const p = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 5 — Infant identification">
	<p class="hint">
		Identifier, sex, time of birth, and gestational age (which selects the treatment-threshold
		curve).
	</p>

	<Field label="Infant identifier" required inputId="identification-infantIdentifier">
		<TextInput
			id="identification-infantIdentifier"
			label="Infant identifier"
			placeholder="e.g. NN-100482 or hospital MRN"
			required
			bind:value={p.infantIdentifier}
		/>
	</Field>

	<Field label="Sex" required inputId="identification-sex">
		<Select id="identification-sex" label="Sex" required bind:value={p.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field
		label="Date and time of birth"
		description="Used with the assessment time to derive age in hours, if not entered directly."
		inputId="identification-bornAt"
	>
		<TextInput
			id="identification-bornAt"
			label="Date and time of birth"
			type="datetime-local"
			class="date-input"
			bind:value={p.bornAt}
		/>
	</Field>

	<Field
		label="Gestational age at birth (weeks)"
		description="Completed weeks. Thresholds are set lower for lower gestation; the nomogram is validated for ≥ 35 weeks."
		required
		inputId="identification-gestationalAgeWeeks"
	>
		<NumberInput
			id="identification-gestationalAgeWeeks"
			label="Gestational age at birth"
			min={22}
			max={44}
			step={0.1}
			required
			bind:value={p.gestationalAgeWeeks}
		/>
	</Field>
</Fieldset>
