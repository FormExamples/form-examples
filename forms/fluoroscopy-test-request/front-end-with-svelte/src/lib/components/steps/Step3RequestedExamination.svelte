<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.request;
</script>

<Fieldset legend="3. Requested Examination">
	<p class="hint">The requested study, the primary indication, and the specific clinical question.</p>

	<Field label="Requested study type" inputId="studyType" required>
		<Select id="studyType" label="Requested study type" bind:value={d.studyType} required>
			<option value="">Select…</option>
			<option value="barium-swallow">Barium swallow</option>
			<option value="barium-meal">Barium meal</option>
			<option value="barium-follow-through">Barium follow-through</option>
			<option value="barium-enema">Barium enema</option>
			<option value="water-soluble-contrast-swallow">Water-soluble contrast swallow</option>
			<option value="defecating-proctogram">Defecating proctogram</option>
			<option value="hysterosalpingogram">Hysterosalpingogram</option>
			<option value="micturating-cystourethrogram">Micturating cystourethrogram</option>
			<option value="arthrogram">Arthrogram</option>
			<option value="fluoroscopy-guided-procedure">Fluoroscopy-guided procedure</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Primary clinical indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary clinical indication" bind:value={d.primaryIndication} required>
			<option value="">Select…</option>
			<option value="dysphagia">Dysphagia</option>
			<option value="reflux">Reflux</option>
			<option value="suspected-obstruction">Suspected obstruction</option>
			<option value="suspected-perforation">Suspected perforation</option>
			<option value="constipation">Constipation</option>
			<option value="infertility-tubal-patency">Infertility / tubal patency</option>
			<option value="vesicoureteric-reflux">Vesicoureteric reflux</option>
			<option value="joint-assessment">Joint assessment</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="The specific question the study should answer…"
			bind:value={d.clinicalQuestion}
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput
			id="relevantHistory"
			label="Relevant history"
			rows={3}
			placeholder="Relevant clinical history and context for the request…"
			bind:value={d.relevantHistory}
		/>
	</Field>
</Fieldset>
