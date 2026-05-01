<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const c = assessment.data.circulation;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<SectionCard
	title="Circulation (C)"
	description="Primary survey: circulation assessment and interventions."
>
	<Checkbox label="Normal (NML)" name="circulationNormal" bind:checked={c.normal} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Skin</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox label="Warm" name="skinWarm" bind:checked={c.skinWarm} />
		<Checkbox label="Dry" name="skinDry" bind:checked={c.skinDry} />
		<Checkbox label="Pale" name="skinPale" bind:checked={c.skinPale} />
		<Checkbox label="Cyanotic" name="skinCyanotic" bind:checked={c.skinCyanotic} />
		<Checkbox label="Moist" name="skinMoist" bind:checked={c.skinMoist} />
		<Checkbox label="Cool" name="skinCool" bind:checked={c.skinCool} />
	</div>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Capillary refill</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox
			label="< 3 sec"
			name="capillaryRefillUnder3"
			bind:checked={c.capillaryRefillUnder3}
		/>
		<Checkbox
			label="≥ 3 sec"
			name="capillaryRefill3OrMore"
			bind:checked={c.capillaryRefill3OrMore}
		/>
	</div>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Pulses</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox label="Weak" name="pulsesWeak" bind:checked={c.pulsesWeak} />
		<Checkbox label="Asymmetric" name="pulsesAsymmetric" bind:checked={c.pulsesAsymmetric} />
	</div>

	<RadioGroup label="JVD" name="jvd" options={yesNo} bind:value={c.jvd} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Bleeding</h3>
	<TextInput
		label="Active bleeding site"
		name="activeBleedingSite"
		bind:value={c.activeBleedingSite}
	/>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox
			label="Bandage"
			name="bleedingControlledBandage"
			bind:checked={c.bleedingControlledBandage}
		/>
		<Checkbox
			label="Tourniquet"
			name="bleedingControlledTourniquet"
			bind:checked={c.bleedingControlledTourniquet}
		/>
		<Checkbox
			label="Direct pressure"
			name="bleedingControlledDirectPressure"
			bind:checked={c.bleedingControlledDirectPressure}
		/>
	</div>
	<TextInput
		label="Bleeding control time (24h)"
		name="bleedingControlTime"
		type="time"
		bind:value={c.bleedingControlTime}
	/>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Vascular access</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="IV site" name="accessIvSite" bind:value={c.accessIvSite} />
		<TextInput label="IV size" name="accessIvSize" bind:value={c.accessIvSize} />
		<TextInput label="IO site" name="accessIoSite" bind:value={c.accessIoSite} />
		<TextInput label="IO size" name="accessIoSize" bind:value={c.accessIoSize} />
	</div>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">IV fluids</h3>
	<NumberInput label="Volume" name="ivfMls" bind:value={c.ivfMls} unit="ml" min={0} max={5000} />
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox label="NS (Normal saline)" name="ivfNs" bind:checked={c.ivfNs} />
		<Checkbox label="LR (Lactated Ringer's)" name="ivfLr" bind:checked={c.ivfLr} />
	</div>
	<TextInput label="Other fluid" name="ivfOther" bind:value={c.ivfOther} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Stabilisation</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox label="Pelvis stabilised" name="pelvisStabilized" bind:checked={c.pelvisStabilized} />
		<Checkbox
			label="Femur fracture stabilised"
			name="femurFractureStabilized"
			bind:checked={c.femurFractureStabilized}
		/>
	</div>

	<TextArea label="Notes" name="circulationNotes" bind:value={c.notes} rows={2} />
</SectionCard>
