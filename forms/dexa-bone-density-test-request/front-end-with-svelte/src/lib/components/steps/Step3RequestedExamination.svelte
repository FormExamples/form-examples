<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { requestStore } from '#lib/stores/result.svelte.js';

	const d = requestStore.data;
</script>

<Fieldset legend="3. Requested Examination">
	<p class="hint">The requested scan region, the primary indication, and the specific clinical question.</p>

	<Field label="Requested scan region" inputId="scanRegion" required>
		<Select id="scanRegion" label="Requested scan region" bind:value={d.request.scanRegion} required>
			<option value="">Select…</option>
			<option value="hip">Hip</option>
			<option value="spine">Spine</option>
			<option value="hip-and-spine">Hip and spine</option>
			<option value="forearm">Forearm</option>
			<option value="whole-body">Whole body</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select
			id="primaryIndication"
			label="Primary indication"
			bind:value={d.request.primaryIndication}
			required
		>
			<option value="">Select…</option>
			<option value="osteoporosis-screening">Osteoporosis screening</option>
			<option value="fragility-fracture">Fragility fracture</option>
			<option value="long-term-steroids">Long-term steroids</option>
			<option value="early-menopause">Early menopause</option>
			<option value="high-frax-risk">High FRAX risk</option>
			<option value="monitoring-treatment">Monitoring treatment</option>
			<option value="secondary-osteoporosis">Secondary osteoporosis</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="The specific question the DEXA scan is asked to answer…"
			bind:value={d.request.clinicalQuestion}
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput
			id="relevantHistory"
			label="Relevant history"
			rows={3}
			placeholder="Relevant clinical history and context for the request…"
			bind:value={d.request.relevantHistory}
		/>
	</Field>
</Fieldset>
