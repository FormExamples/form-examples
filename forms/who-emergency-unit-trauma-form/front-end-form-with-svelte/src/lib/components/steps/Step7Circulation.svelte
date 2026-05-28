<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.circulation;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const pelvisOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'not-indicated', label: 'Not indicated' }
	];
</script>

<Fieldset
	title="Circulation (C)"
	description="Primary survey — skin, perfusion, pulses, JVD, pelvis stability, bleeding control, vascular access, fluids and blood."
>
	<Checkbox label="Normal (no abnormal findings)" name="circulationNormal" bind:checked={c.normal} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Skin</h3>
	<Checkbox label="Warm" name="skinWarm" bind:checked={c.skinWarm} />
	<Checkbox label="Dry" name="skinDry" bind:checked={c.skinDry} />
	<Checkbox label="Cool" name="skinCool" bind:checked={c.skinCool} />
	<Checkbox label="Moist" name="skinMoist" bind:checked={c.skinMoist} />
	<Checkbox label="Pale" name="skinPale" bind:checked={c.skinPale} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Capillary refill</h3>
	<Checkbox label="< 3 sec" name="capillaryRefillUnder3" bind:checked={c.capillaryRefillUnder3} />
	<NumberInput
		label="Capillary refill"
		name="capillaryRefillSeconds"
		bind:value={c.capillaryRefillSeconds}
		unit="sec"
		min={0}
		step={0.5}
	/>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Pulses</h3>
	<Checkbox label="Weak" name="pulsesWeak" bind:checked={c.pulsesWeak} />
	<Checkbox label="Asymmetric" name="pulsesAsymmetric" bind:checked={c.pulsesAsymmetric} />

	<RadioGroup label="JVD?" name="jvd" options={yesNo} bind:value={c.jvd} />
	<RadioGroup label="Unstable pelvis?" name="unstablePelvis" options={yesNo} bind:value={c.unstablePelvis} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Bleeding controlled</h3>
	<Checkbox label="Direct pressure" name="bleedingControlDirectPressure" bind:checked={c.bleedingControlDirectPressure} />
	<Checkbox label="Bandage" name="bleedingControlBandage" bind:checked={c.bleedingControlBandage} />
	<Checkbox label="Tourniquet" name="bleedingControlTourniquet" bind:checked={c.bleedingControlTourniquet} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Vascular access — Line 1</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="IV — Location" name="accessIvLocation" bind:value={c.accessIvLocation} />
		<TextInput label="IV — Size" name="accessIvSize" bind:value={c.accessIvSize} />
		<TextInput label="Central — Location" name="accessCentralLocation" bind:value={c.accessCentralLocation} />
		<TextInput label="Central — Size" name="accessCentralSize" bind:value={c.accessCentralSize} />
		<TextInput label="IO — Location" name="accessIoLocation" bind:value={c.accessIoLocation} />
		<TextInput label="IO — Size" name="accessIoSize" bind:value={c.accessIoSize} />
	</div>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Vascular access — Line 2</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Line 2 — Location" name="accessLine2Location" bind:value={c.accessLine2Location} />
		<TextInput label="Line 2 — Size" name="accessLine2Size" bind:value={c.accessLine2Size} />
	</div>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">IV fluids</h3>
	<NumberInput label="IVF" name="ivfMls" bind:value={c.ivfMls} unit="mL" min={0} step={10} />
	<Checkbox label="NS (normal saline)" name="ivfNs" bind:checked={c.ivfNs} />
	<Checkbox label="LR (lactated Ringer's)" name="ivfLr" bind:checked={c.ivfLr} />
	<TextInput label="Other fluid" name="ivfOther" bind:value={c.ivfOther} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Blood</h3>
	<Checkbox label="Blood ordered" name="bloodOrdered" bind:checked={c.bloodOrdered} />
	<Checkbox label="Blood given" name="bloodGiven" bind:checked={c.bloodGiven} />
	<TextInput label="Blood — Type / Amount" name="bloodTypeAmount" bind:value={c.bloodTypeAmount} />

	<RadioGroup
		label="Pelvis stabilized"
		name="pelvisStabilized"
		options={pelvisOptions}
		bind:value={c.pelvisStabilized}
	/>

	<TextAreaInput label="Notes" name="circulationNotes" bind:value={c.notes} rows={2} />
</Fieldset>
