<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Test Details">
	<p class="hint">The performed audiology test and its reliability.</p>

	<Field label="Test type" inputId="testType" required>
		<Select id="testType" label="Test type" bind:value={d.testType} required>
			<option value="">Select…</option>
			<option value="pure-tone-audiometry">Pure-tone audiometry</option>
			<option value="tympanometry">Tympanometry</option>
			<option value="speech-audiometry">Speech audiometry</option>
			<option value="otoacoustic-emissions">Otoacoustic emissions</option>
			<option value="auditory-brainstem-response">Auditory brainstem response</option>
			<option value="newborn-hearing-screen">Newborn hearing screen</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field
		label="Test reliability"
		inputId="testReliability"
		description="Reliability / validity of the test result (e.g. patient cooperation, masking, conditions)."
	>
		<Select id="testReliability" label="Test reliability" bind:value={d.testReliability}>
			<option value="">Select…</option>
			<option value="good">Good</option>
			<option value="fair">Fair</option>
			<option value="poor">Poor</option>
		</Select>
	</Field>
</Fieldset>
