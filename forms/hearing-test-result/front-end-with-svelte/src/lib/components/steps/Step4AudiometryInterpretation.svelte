<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Audiometry & Interpretation">
	<p class="hint">
		Per-ear pure-tone averages (dB HL), hearing-loss type and severity (BSA descriptors), and
		tympanogram type (Jerger).
	</p>

	<Field
		label="Pure-tone average — right ear (dB HL)"
		inputId="pureToneAverageRightDb"
		description="BSA mean threshold; no-response frequencies counted at 130 dB HL."
	>
		<NumberInput
			id="pureToneAverageRightDb"
			label="Pure-tone average — right ear (dB HL)"
			min={-10}
			max={130}
			step={0.1}
			bind:value={d.pureToneAverageRightDb}
		/>
	</Field>

	<Field
		label="Pure-tone average — left ear (dB HL)"
		inputId="pureToneAverageLeftDb"
		description="BSA mean threshold; no-response frequencies counted at 130 dB HL."
	>
		<NumberInput
			id="pureToneAverageLeftDb"
			label="Pure-tone average — left ear (dB HL)"
			min={-10}
			max={130}
			step={0.1}
			bind:value={d.pureToneAverageLeftDb}
		/>
	</Field>

	<Field label="Hearing-loss type — right ear" inputId="hearingLossTypeRight">
		<Select id="hearingLossTypeRight" label="Hearing-loss type — right ear" bind:value={d.hearingLossTypeRight}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="conductive">Conductive</option>
			<option value="sensorineural">Sensorineural</option>
			<option value="mixed">Mixed</option>
		</Select>
	</Field>

	<Field label="Hearing-loss type — left ear" inputId="hearingLossTypeLeft">
		<Select id="hearingLossTypeLeft" label="Hearing-loss type — left ear" bind:value={d.hearingLossTypeLeft}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="conductive">Conductive</option>
			<option value="sensorineural">Sensorineural</option>
			<option value="mixed">Mixed</option>
		</Select>
	</Field>

	<Field label="Hearing-loss severity — right ear" inputId="hearingLossSeverityRight">
		<Select id="hearingLossSeverityRight" label="Hearing-loss severity — right ear" bind:value={d.hearingLossSeverityRight}>
			<option value="">Select…</option>
			<option value="normal">Normal</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="moderately-severe">Moderately severe</option>
			<option value="severe">Severe</option>
			<option value="profound">Profound</option>
		</Select>
	</Field>

	<Field label="Hearing-loss severity — left ear" inputId="hearingLossSeverityLeft">
		<Select id="hearingLossSeverityLeft" label="Hearing-loss severity — left ear" bind:value={d.hearingLossSeverityLeft}>
			<option value="">Select…</option>
			<option value="normal">Normal</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="moderately-severe">Moderately severe</option>
			<option value="severe">Severe</option>
			<option value="profound">Profound</option>
		</Select>
	</Field>

	<Field label="Tympanogram — right ear (Jerger)" inputId="tympanometryTypeRight">
		<Select id="tympanometryTypeRight" label="Tympanogram — right ear (Jerger)" bind:value={d.tympanometryTypeRight}>
			<option value="">Select…</option>
			<option value="A">A</option>
			<option value="As">As</option>
			<option value="Ad">Ad</option>
			<option value="B">B</option>
			<option value="C">C</option>
		</Select>
	</Field>

	<Field label="Tympanogram — left ear (Jerger)" inputId="tympanometryTypeLeft">
		<Select id="tympanometryTypeLeft" label="Tympanogram — left ear (Jerger)" bind:value={d.tympanometryTypeLeft}>
			<option value="">Select…</option>
			<option value="A">A</option>
			<option value="As">As</option>
			<option value="Ad">Ad</option>
			<option value="B">B</option>
			<option value="C">C</option>
		</Select>
	</Field>
</Fieldset>
