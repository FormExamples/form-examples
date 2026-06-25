<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Study Details">
	<p class="hint">The performed study type and its diagnostic adequacy.</p>

	<Field label="Study type" inputId="studyType" required>
		<Select id="studyType" label="Study type" bind:value={d.studyType} required>
			<option value="">Select…</option>
			<option value="home-sleep-apnoea-test">Home sleep apnoea test</option>
			<option value="polysomnography">Polysomnography</option>
			<option value="overnight-oximetry">Overnight oximetry</option>
			<option value="multiple-sleep-latency-test">Multiple sleep latency test</option>
			<option value="actigraphy">Actigraphy</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Study adequacy" inputId="studyAdequacy">
		<Select id="studyAdequacy" label="Study adequacy" bind:value={d.studyAdequacy}>
			<option value="">Select…</option>
			<option value="adequate">Adequate</option>
			<option value="limited">Limited</option>
			<option value="failed">Failed</option>
		</Select>
	</Field>
</Fieldset>
