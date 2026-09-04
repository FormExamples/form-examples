<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const i = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 5 — Patient identification">
	<p class="hint">
		Identifier, age band, diabetes type, and the previous screen. The previous screen result and
		date drive the low-risk extended-recall and overdue checks.
	</p>

	<Field label="Local patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Local patient identifier"
			placeholder="e.g. DESP-448120"
			required
			bind:value={i.patientIdentifier}
		/>
	</Field>

	<Field label="Age band" required inputId="identification-ageBand">
		<Select id="identification-ageBand" label="Age band" bind:value={i.ageBand}>
			<option value="">— Select —</option>
			<option value="under-12">Under 12 (outside programme)</option>
			<option value="12-17">12-17</option>
			<option value="18-64">18-64</option>
			<option value="65-plus">65 or over</option>
		</Select>
	</Field>

	<Field label="Diabetes type" inputId="identification-diabetesType">
		<Select id="identification-diabetesType" label="Diabetes type" bind:value={i.diabetesType}>
			<option value="">— Select —</option>
			<option value="type-1">Type 1</option>
			<option value="type-2">Type 2</option>
			<option value="other">Other</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Years since diagnosis" inputId="identification-yearsSinceDiagnosis">
		<NumberInput
			id="identification-yearsSinceDiagnosis"
			label="Years since diagnosis"
			min={0}
			max={100}
			step={1}
			bind:value={i.yearsSinceDiagnosis}
		/>
	</Field>

	<Field label="Previous screen date" inputId="identification-previousScreenDate">
		<TextInput
			id="identification-previousScreenDate"
			label="Previous screen date"
			type="date"
			class="date-input"
			bind:value={i.previousScreenDate}
		/>
	</Field>

	<Field label="Previous screen result" inputId="identification-previousScreenResult">
		<Select
			id="identification-previousScreenResult"
			label="Previous screen result"
			bind:value={i.previousScreenResult}
		>
			<option value="">— Select —</option>
			<option value="r0m0">R0/M0 (no retinopathy)</option>
			<option value="background">Background (R1)</option>
			<option value="referable">Referable disease</option>
			<option value="none">No previous screen</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>
</Fieldset>
