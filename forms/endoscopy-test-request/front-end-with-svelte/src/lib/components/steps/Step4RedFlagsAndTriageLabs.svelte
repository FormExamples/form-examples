<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.redFlags;
</script>

<Fieldset legend="4. Red Flags and Triage Labs">
	<p class="hint">ALARM red-flag symptoms and the triage laboratory results (FIT, haemoglobin, ferritin).</p>

	<Field label="ALARM red flags">
		<CheckboxGroup label="ALARM red flags">
			<label><CheckboxInput label="Dysphagia" bind:checked={d.redFlagDysphagia} /> Dysphagia</label>
			<label><CheckboxInput label="Unexplained weight loss" bind:checked={d.redFlagWeightLoss} /> Unexplained weight loss</label>
			<label><CheckboxInput label="Anaemia" bind:checked={d.redFlagAnaemia} /> Anaemia</label>
			<label><CheckboxInput label="GI bleeding" bind:checked={d.redFlagGiBleeding} /> GI bleeding (haematemesis / melaena / rectal)</label>
			<label><CheckboxInput label="Abdominal / epigastric mass" bind:checked={d.redFlagAbdominalMass} /> Abdominal / epigastric mass</label>
			<label><CheckboxInput label="Age 55 or over" bind:checked={d.redFlagAgeOver55} /> Age 55 or over</label>
		</CheckboxGroup>
	</Field>

	<Field label="FIT result" inputId="fitResultUgG" description="Faecal immunochemical test, µg Hb/g (NICE DG56).">
		<NumberInput id="fitResultUgG" label="FIT result" min={0} max={1000} step={1} bind:value={d.fitResultUgG} />
	</Field>

	<Field label="Haemoglobin" inputId="haemoglobinGL" description="g/L.">
		<NumberInput id="haemoglobinGL" label="Haemoglobin" min={20} max={250} step={1} bind:value={d.haemoglobinGL} />
	</Field>

	<Field label="Ferritin" inputId="ferritinUgL" description="µg/L.">
		<NumberInput id="ferritinUgL" label="Ferritin" min={0} max={2000} step={1} bind:value={d.ferritinUgL} />
	</Field>
</Fieldset>
