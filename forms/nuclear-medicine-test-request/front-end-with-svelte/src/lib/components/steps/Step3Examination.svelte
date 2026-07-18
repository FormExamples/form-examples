<script lang="ts">
	import { request } from '$lib/stores/request.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = request.data.request;

	const scanTypeOptions = [
		{ value: 'bone-scan', label: 'Bone scan (Tc-99m MDP)' },
		{ value: 'myocardial-perfusion', label: 'Myocardial perfusion' },
		{ value: 'vq-lung-scan', label: 'V/Q lung scan' },
		{ value: 'thyroid-uptake', label: 'Thyroid uptake' },
		{ value: 'renal-dmsa', label: 'Renal DMSA' },
		{ value: 'renal-mag3', label: 'Renal MAG3' },
		{ value: 'gallium-octreotide', label: 'Gallium / octreotide' },
		{ value: 'white-cell-scan', label: 'White-cell scan' },
		{ value: 'sentinel-node', label: 'Sentinel-node' },
		{ value: 'other', label: 'Other' }
	];

	const indicationOptions = [
		{ value: 'suspected-bone-metastases', label: 'Suspected bone metastases' },
		{ value: 'cardiac-ischaemia', label: 'Cardiac ischaemia' },
		{ value: 'pulmonary-embolism', label: 'Pulmonary embolism' },
		{ value: 'thyroid-function', label: 'Thyroid function' },
		{ value: 'renal-function', label: 'Renal function' },
		{ value: 'infection-localisation', label: 'Infection localisation' },
		{ value: 'tumour-localisation', label: 'Tumour localisation' },
		{ value: 'sentinel-node-mapping', label: 'Sentinel-node mapping' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Requested examination">
	<p class="hint">Scan type, indication, and the specific clinical question — the highest-value fields.</p>

	<Field label="Requested scan type" required inputId="scanType">
		<Select id="scanType" label="Requested scan type" required bind:value={d.scanType}>
			<option value="">— Select —</option>
			{#each scanTypeOptions as o (o.value)}
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
