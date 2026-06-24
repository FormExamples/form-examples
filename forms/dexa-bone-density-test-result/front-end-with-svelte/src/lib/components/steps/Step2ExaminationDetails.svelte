<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Examination Details">
	<p class="hint">The performed DEXA examination region and diagnostic adequacy.</p>

	<Field label="Scan region" inputId="scanRegion" required>
		<Select id="scanRegion" label="Scan region" bind:value={d.scanRegion} required>
			<option value="">Select…</option>
			<option value="hip">Hip</option>
			<option value="spine">Spine</option>
			<option value="hip-and-spine">Hip and spine</option>
			<option value="forearm">Forearm</option>
			<option value="whole-body">Whole body</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Examination adequacy" inputId="examinationAdequacy">
		<Select id="examinationAdequacy" label="Examination adequacy" bind:value={d.examinationAdequacy}>
			<option value="">Select…</option>
			<option value="adequate">Adequate</option>
			<option value="limited">Limited</option>
			<option value="non-diagnostic">Non-diagnostic</option>
		</Select>
	</Field>
</Fieldset>
