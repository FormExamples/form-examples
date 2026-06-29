<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import DeviceEntry from '$lib/components/ui/DeviceEntry.svelte';

	const d = assessment.data;
</script>

<Fieldset legend="Medical Devices / Implants">
	<p class="hint">Implanted devices and assistive medical equipment. Optional but relevant for imaging and surgery.</p>
	<DeviceEntry bind:devices={d.medicalDevices} />
</Fieldset>
