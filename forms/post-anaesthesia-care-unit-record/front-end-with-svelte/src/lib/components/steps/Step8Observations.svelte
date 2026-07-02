<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const o = assessment.data.observations;
</script>

<Fieldset legend="Step 8 of 10 — Airway, pain and PONV">
	<p class="hint">
		Airway status, pain score, post-operative nausea and vomiting, and drugs given in recovery.
	</p>

	<Field label="Airway status" inputId="observations-airwayStatus">
		<Select id="observations-airwayStatus" label="Airway status" bind:value={o.airwayStatus}>
			<option value="">— Select —</option>
			<option value="patent">Patent, self-maintained</option>
			<option value="oral-airway">Oral / nasal airway in situ</option>
			<option value="other">Other support</option>
		</Select>
	</Field>

	<Field
		label="Pain score (0-10)"
		description="Verbal / numeric rating scale 0-10. A score of 4 or more flags uncontrolled pain."
		inputId="observations-painScore"
	>
		<NumberInput
			id="observations-painScore"
			label="Pain score"
			min={0}
			max={10}
			step={1}
			bind:value={o.painScore}
		/>
	</Field>

	<Field label="PONV severity" inputId="observations-ponvSeverity">
		<Select id="observations-ponvSeverity" label="PONV severity" bind:value={o.ponvSeverity}>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
		</Select>
	</Field>

	<Field label="Analgesia given in PACU" inputId="observations-analgesiaGiven">
		<TextInput
			id="observations-analgesiaGiven"
			label="Analgesia given in PACU"
			placeholder="e.g. Morphine 5 mg IV, paracetamol 1 g IV"
			bind:value={o.analgesiaGiven}
		/>
	</Field>

	<Field label="Antiemetics given in PACU" inputId="observations-antiemeticsGiven">
		<TextInput
			id="observations-antiemeticsGiven"
			label="Antiemetics given in PACU"
			placeholder="e.g. Ondansetron 4 mg IV"
			bind:value={o.antiemeticsGiven}
		/>
	</Field>
</Fieldset>
