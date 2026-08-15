<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.clinical;
</script>

<Fieldset legend="4. Clinical Context">
	<p class="hint">
		Indication, clinical details, and ingestion timing — the highest-value fields. A deliberate
		overdose or a symptomatic patient escalates triage to stat.
	</p>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.primaryIndication} required>
			<option value="">— Select —</option>
			<option value="suspected-overdose">Suspected overdose</option>
			<option value="deliberate-self-harm">Deliberate self-harm</option>
			<option value="therapeutic-drug-monitoring">Therapeutic drug monitoring</option>
			<option value="suspected-poisoning">Suspected poisoning</option>
			<option value="substance-misuse-screen">Substance-misuse screen</option>
			<option value="occupational-screen">Occupational screen</option>
			<option value="forensic">Forensic</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Clinical details" inputId="clinicalDetails" required>
		<TextAreaInput
			id="clinicalDetails"
			label="Clinical details"
			rows={3}
			placeholder="e.g. Witnessed ingestion of 30 paracetamol tablets 3 h ago; nausea, no other symptoms."
			bind:value={d.clinicalDetails}
		/>
	</Field>

	<Field label="Suspected agent / named drug" inputId="suspectedAgent">
		<TextInput
			id="suspectedAgent"
			label="Suspected agent / named drug"
			placeholder="e.g. paracetamol, lithium"
			bind:value={d.suspectedAgent}
		/>
	</Field>

	<Field label="Time since ingestion (hours)" inputId="timeSinceIngestionHours">
		<NumberInput
			id="timeSinceIngestionHours"
			label="Time since ingestion in hours"
			min={0}
			max={720}
			step={0.5}
			bind:value={d.timeSinceIngestionHours}
		/>
	</Field>

	<Field label="Escalation flags">
		<CheckboxGroup label="Escalation flags">
			<label>
				<CheckboxInput id="deliberateOverdose" label="Deliberate overdose" bind:checked={d.deliberateOverdose} />
				<span>Deliberate overdose</span>
			</label>
			<label>
				<CheckboxInput id="symptomatic" label="Patient currently symptomatic" bind:checked={d.symptomatic} />
				<span>Patient currently symptomatic</span>
			</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
