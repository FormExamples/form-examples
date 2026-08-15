<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { YES_NO } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="12. Biometry">
	<p class="hint">Surgical planning measurements. If a surgical referral is recommended but biometry was not performed, a low-priority safety flag fires.</p>

	<Field label="Biometry performed" inputId="biometry-biometryPerformed">
		<Select id="biometry-biometryPerformed" label="Biometry performed" bind:value={d.biometry.biometryPerformed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Axial length — right (mm)" inputId="biometry-axialLengthRightMm">
		<NumberInput id="biometry-axialLengthRightMm" label="Axial length — right (mm)" min={15} max={40} step="0.01" bind:value={d.biometry.axialLengthRightMm} />
	</Field>
	<Field label="Axial length — left (mm)" inputId="biometry-axialLengthLeftMm">
		<NumberInput id="biometry-axialLengthLeftMm" label="Axial length — left (mm)" min={15} max={40} step="0.01" bind:value={d.biometry.axialLengthLeftMm} />
	</Field>
	<Field label="Keratometry K1 — right" inputId="biometry-keratometryK1Right">
		<NumberInput id="biometry-keratometryK1Right" label="Keratometry K1 — right" min={30} max={60} step="0.01" bind:value={d.biometry.keratometryK1Right} />
	</Field>
	<Field label="Keratometry K1 — left" inputId="biometry-keratometryK1Left">
		<NumberInput id="biometry-keratometryK1Left" label="Keratometry K1 — left" min={30} max={60} step="0.01" bind:value={d.biometry.keratometryK1Left} />
	</Field>
	<Field label="Keratometry K2 — right" inputId="biometry-keratometryK2Right">
		<NumberInput id="biometry-keratometryK2Right" label="Keratometry K2 — right" min={30} max={60} step="0.01" bind:value={d.biometry.keratometryK2Right} />
	</Field>
	<Field label="Keratometry K2 — left" inputId="biometry-keratometryK2Left">
		<NumberInput id="biometry-keratometryK2Left" label="Keratometry K2 — left" min={30} max={60} step="0.01" bind:value={d.biometry.keratometryK2Left} />
	</Field>
	<Field label="OCT performed" inputId="biometry-octPerformed">
		<Select id="biometry-octPerformed" label="OCT performed" bind:value={d.biometry.octPerformed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="OCT findings" inputId="biometry-octFindings">
		<TextAreaInput id="biometry-octFindings" label="OCT findings" rows={2} bind:value={d.biometry.octFindings} />
	</Field>
	<Field label="Calculated IOL power — right" inputId="biometry-calculatedIolPowerRight">
		<NumberInput id="biometry-calculatedIolPowerRight" label="Calculated IOL power — right" min={0} max={40} step="0.25" bind:value={d.biometry.calculatedIolPowerRight} />
	</Field>
	<Field label="Calculated IOL power — left" inputId="biometry-calculatedIolPowerLeft">
		<NumberInput id="biometry-calculatedIolPowerLeft" label="Calculated IOL power — left" min={0} max={40} step="0.25" bind:value={d.biometry.calculatedIolPowerLeft} />
	</Field>
</Fieldset>
