<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 6 — Assessment context">
	<p class="hint">Who administered the EPDS, when, where, and the perinatal stage.</p>

	<Field label="Administering clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Administering clinician name"
			placeholder="e.g. HV J. Ahmed"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="midwife">Midwife</option>
			<option value="health-visitor">Health visitor</option>
			<option value="gp">General practitioner</option>
			<option value="perinatal-mh">Perinatal mental-health practitioner</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Care setting" required inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" required bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="maternity">Maternity service</option>
			<option value="community">Community / health visiting</option>
			<option value="general-practice">General practice</option>
			<option value="perinatal-mh">Perinatal mental-health service</option>
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

	<Field label="Perinatal stage" required inputId="context-perinatalStage">
		<Select
			id="context-perinatalStage"
			label="Perinatal stage"
			required
			bind:value={c.perinatalStage}
		>
			<option value="">— Select —</option>
			<option value="antenatal">Antenatal (during pregnancy)</option>
			<option value="postnatal">Postnatal (after birth)</option>
		</Select>
	</Field>

	<Field
		label="Perinatal week"
		description="Gestational week (antenatal) or weeks since birth (postnatal)."
		inputId="context-perinatalWeek"
	>
		<NumberInput
			id="context-perinatalWeek"
			label="Perinatal week"
			min={0}
			max={60}
			step={1}
			bind:value={c.perinatalWeek}
		/>
	</Field>
</Fieldset>
