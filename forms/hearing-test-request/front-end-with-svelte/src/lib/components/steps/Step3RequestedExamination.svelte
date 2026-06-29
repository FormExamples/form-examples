<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.request;
</script>

<Fieldset legend="3. Requested Examination">
	<p class="hint">The requested test, the affected side, the primary indication, and the specific clinical question.</p>

	<Field label="Requested test type" inputId="testType" required>
		<Select id="testType" label="Requested test type" bind:value={d.testType} required>
			<option value="">Select…</option>
			<option value="pure-tone-audiometry">Pure-tone audiometry</option>
			<option value="tympanometry">Tympanometry</option>
			<option value="speech-audiometry">Speech audiometry</option>
			<option value="otoacoustic-emissions">Otoacoustic emissions</option>
			<option value="auditory-brainstem-response">Auditory brainstem response</option>
			<option value="newborn-hearing-screen">Newborn hearing screen</option>
			<option value="hearing-aid-assessment">Hearing-aid assessment</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Laterality" inputId="laterality" description="Unilateral findings can be a red flag.">
		<Select id="laterality" label="Laterality" bind:value={d.laterality}>
			<option value="">Select…</option>
			<option value="left">Left</option>
			<option value="right">Right</option>
			<option value="bilateral">Bilateral</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.primaryIndication} required>
			<option value="">Select…</option>
			<option value="hearing-loss">Hearing loss</option>
			<option value="tinnitus">Tinnitus</option>
			<option value="vertigo">Vertigo</option>
			<option value="ear-discharge">Ear discharge</option>
			<option value="suspected-otosclerosis">Suspected otosclerosis</option>
			<option value="occupational-noise">Occupational noise exposure</option>
			<option value="ototoxic-monitoring">Ototoxic monitoring</option>
			<option value="developmental-delay-child">Developmental delay (child)</option>
			<option value="hearing-aid-review">Hearing-aid review</option>
			<option value="sudden-hearing-loss">Sudden hearing loss</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="The specific question the audiology team is asked to answer…"
			bind:value={d.clinicalQuestion}
		/>
	</Field>
</Fieldset>
