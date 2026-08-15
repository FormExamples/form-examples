<script lang="ts">
	import { request } from '#lib/stores/request.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = request.data.request;

	const bodyRegionOptions = [
		{ value: 'brain', label: 'Brain' },
		{ value: 'spine-cervical', label: 'Spine — cervical' },
		{ value: 'spine-thoracic', label: 'Spine — thoracic' },
		{ value: 'spine-lumbar', label: 'Spine — lumbar' },
		{ value: 'head-neck', label: 'Head & neck' },
		{ value: 'chest', label: 'Chest' },
		{ value: 'abdomen', label: 'Abdomen' },
		{ value: 'pelvis', label: 'Pelvis' },
		{ value: 'cardiac', label: 'Cardiac' },
		{ value: 'mr-angiogram', label: 'MR angiogram' },
		{ value: 'breast', label: 'Breast' },
		{ value: 'musculoskeletal-joint', label: 'Musculoskeletal joint' },
		{ value: 'whole-body', label: 'Whole body' },
		{ value: 'other', label: 'Other' }
	];

	const indicationOptions = [
		{ value: 'suspected-malignancy', label: 'Suspected malignancy' },
		{ value: 'cancer-staging', label: 'Cancer staging' },
		{ value: 'neurological-deficit', label: 'Neurological deficit' },
		{ value: 'suspected-ms', label: 'Suspected MS' },
		{ value: 'back-pain-radiculopathy', label: 'Back pain with radiculopathy' },
		{ value: 'joint-derangement', label: 'Joint derangement' },
		{ value: 'suspected-stroke', label: 'Suspected stroke' },
		{ value: 'epilepsy', label: 'Epilepsy' },
		{ value: 'dementia', label: 'Dementia' },
		{ value: 'pituitary', label: 'Pituitary' },
		{ value: 'cardiac-function', label: 'Cardiac function' },
		{ value: 'follow-up-surveillance', label: 'Follow-up / surveillance' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Requested examination">
	<p class="hint">Body region, indication, and the specific clinical question — the highest-value fields.</p>

	<Field label="Body region" required inputId="bodyRegion">
		<Select id="bodyRegion" label="Body region" required bind:value={d.bodyRegion}>
			<option value="">— Select —</option>
			{#each bodyRegionOptions as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Primary indication" required inputId="primaryIndication">
		<Select id="primaryIndication" label="Primary indication" required bind:value={d.primaryIndication}>
			<option value="">— Select —</option>
			{#each indicationOptions as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Specific clinical question" required inputId="clinicalQuestion">
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={2}
			required
			bind:value={d.clinicalQuestion}
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput id="relevantHistory" label="Relevant history" rows={2} bind:value={d.relevantHistory} />
	</Field>
</Fieldset>
