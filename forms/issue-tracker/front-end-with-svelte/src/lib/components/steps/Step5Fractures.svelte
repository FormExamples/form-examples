<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const f = assessment.data.fx;
</script>

<Fieldset legend="Fractures">
	<p class="hint">What is broken — the structural failures inside the system.</p>

	<Field label="Broken components" inputId="fxBrokenComponents">
		<TextAreaInput id="fxBrokenComponents" label="Broken components" rows={3} bind:value={f.fxBrokenComponents} />
	</Field>

	<Field label="Failed services" inputId="fxFailedServices">
		<TextAreaInput id="fxFailedServices" label="Failed services" rows={3} bind:value={f.fxFailedServices} />
	</Field>

	<Field label="Stuck processes" inputId="fxStuckProcesses">
		<TextInput id="fxStuckProcesses" label="Stuck processes" bind:value={f.fxStuckProcesses} />
	</Field>

	<Field label="Hardware faults" inputId="fxHardwareFaults">
		<TextInput id="fxHardwareFaults" label="Hardware faults" bind:value={f.fxHardwareFaults} />
	</Field>

	<Field label="Data corruption" inputId="fxDataCorruption">
		<Select id="fxDataCorruption" label="Data corruption" bind:value={f.fxDataCorruption}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="suspected">Suspected</option>
			<option value="confirmed">Confirmed</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>
</Fieldset>
