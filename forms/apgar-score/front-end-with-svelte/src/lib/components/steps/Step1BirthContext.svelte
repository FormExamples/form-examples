<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 4 — Birth context">
	<p class="hint">Who attended, when and where the birth took place, the gestation, and the mode of delivery.</p>

	<Field label="Attending clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Attending clinician name"
			placeholder="e.g. Midwife J. Okoro"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="midwife">Midwife</option>
			<option value="obstetrician">Obstetrician</option>
			<option value="neonatologist">Neonatologist</option>
			<option value="neonatal-nurse">Neonatal nurse</option>
			<option value="paediatrician">Paediatrician</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date and time of birth" inputId="context-bornAt">
		<TextInput
			id="context-bornAt"
			label="Date and time of birth"
			type="datetime-local"
			class="date-input"
			bind:value={c.bornAt}
		/>
	</Field>

	<Field label="Care setting" required inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" required bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="delivery-room">Delivery room</option>
			<option value="theatre">Obstetric theatre</option>
			<option value="birth-centre">Birth centre</option>
			<option value="home">Home birth</option>
			<option value="neonatal-unit">Neonatal unit</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field
		label="Gestational age at birth (weeks)"
		description="Completed weeks of gestation (e.g. 39.4)."
		inputId="context-gestationalAgeWeeks"
	>
		<NumberInput
			id="context-gestationalAgeWeeks"
			label="Gestational age at birth in weeks"
			min={20}
			max={45}
			step={0.1}
			bind:value={c.gestationalAgeWeeks}
		/>
	</Field>

	<Field label="Mode of delivery" inputId="context-modeOfDelivery">
		<Select id="context-modeOfDelivery" label="Mode of delivery" bind:value={c.modeOfDelivery}>
			<option value="">— Select —</option>
			<option value="vaginal">Vaginal</option>
			<option value="assisted">Assisted (forceps / ventouse)</option>
			<option value="caesarean">Caesarean</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
