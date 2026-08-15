<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const r = request.data.request;
</script>

<Fieldset legend="3. Requested Study">
	<p class="hint">Study type, indication, and the specific clinical question — the highest-value fields.</p>

	<Field label="Requested study type" inputId="studyType" required>
		<Select id="studyType" label="Requested study type" bind:value={r.studyType} required>
			<option value="">Select…</option>
			<option value="home-sleep-apnoea-test">Home sleep apnoea test (HSAT)</option>
			<option value="polysomnography">Polysomnography (PSG)</option>
			<option value="overnight-oximetry">Overnight oximetry</option>
			<option value="multiple-sleep-latency-test">Multiple sleep latency test (MSLT)</option>
			<option value="actigraphy">Actigraphy</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={r.primaryIndication} required>
			<option value="">Select…</option>
			<option value="suspected-osa">Suspected OSA</option>
			<option value="snoring">Snoring</option>
			<option value="daytime-sleepiness">Daytime sleepiness</option>
			<option value="suspected-narcolepsy">Suspected narcolepsy</option>
			<option value="insomnia">Insomnia</option>
			<option value="restless-legs">Restless legs</option>
			<option value="copd-overlap">COPD overlap</option>
			<option value="pre-bariatric">Pre-bariatric</option>
			<option value="driver-assessment">Driver assessment</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={2}
			placeholder="e.g. Confirm or exclude obstructive sleep apnoea."
			bind:value={r.clinicalQuestion}
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput
			id="relevantHistory"
			label="Relevant history"
			rows={2}
			placeholder="Relevant sleep, respiratory, and neurological history…"
			bind:value={r.relevantHistory}
		/>
	</Field>
</Fieldset>
