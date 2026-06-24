<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Sensitivities & Resistance">
	<p class="hint">Antibiotic susceptibilities, key resistance markers, and specialised tests.</p>

	<Field label="Antibiotic sensitivities" inputId="antibioticSensitivities">
		<TextAreaInput
			id="antibioticSensitivities"
			label="Antibiotic sensitivities"
			rows={4}
			placeholder="Susceptibility results per agent (sensitive / resistant)…"
			bind:value={d.antibioticSensitivities}
		/>
	</Field>

	<Field label="Resistance markers">
		<CheckboxGroup label="Resistance markers">
			<label><CheckboxInput label="MRSA" bind:checked={d.resistanceMrsa} /> MRSA</label>
			<label><CheckboxInput label="ESBL" bind:checked={d.resistanceEsbl} /> ESBL</label>
			<label><CheckboxInput label="CPE" bind:checked={d.resistanceCpe} /> CPE</label>
		</CheckboxGroup>
	</Field>

	<Field label="C. difficile toxin" inputId="cDifficileToxin">
		<Select id="cDifficileToxin" label="C. difficile toxin" bind:value={d.cDifficileToxin}>
			<option value="">Select…</option>
			<option value="positive">Positive</option>
			<option value="negative">Negative</option>
			<option value="not-tested">Not tested</option>
		</Select>
	</Field>

	<Field label="Acid-fast bacilli (AFB / TB)" inputId="acidFastBacilli">
		<Select id="acidFastBacilli" label="Acid-fast bacilli (AFB / TB)" bind:value={d.acidFastBacilli}>
			<option value="">Select…</option>
			<option value="positive">Positive</option>
			<option value="negative">Negative</option>
			<option value="not-tested">Not tested</option>
		</Select>
	</Field>

	<Field label="PCR / molecular result" inputId="pcrResult">
		<TextAreaInput
			id="pcrResult"
			label="PCR / molecular result"
			rows={3}
			placeholder="Molecular / PCR test result narrative…"
			bind:value={d.pcrResult}
		/>
	</Field>

	{#if d.resistanceCpe}
		<Alert type="error" heading="CPE selected">
			<p>
				A carbapenemase-producing Enterobacterales (CPE) isolate auto-escalates the follow-up
				urgency to a critical alert. Ensure the result is communicated and IPC is notified on
				sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
