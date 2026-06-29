<script lang="ts">
	import { request } from '$lib/stores/request.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = request.data.request;

	const testTypeOptions = [
		{ value: '24-hour-abpm', label: '24-hour ABPM' },
		{ value: 'home-blood-pressure-monitoring', label: 'Home blood pressure monitoring' },
		{ value: 'other', label: 'Other' }
	];
	const indicationOptions = [
		{ value: 'diagnose-hypertension', label: 'Diagnose hypertension' },
		{ value: 'white-coat-hypertension', label: 'Suspected white-coat hypertension' },
		{ value: 'masked-hypertension', label: 'Suspected masked hypertension' },
		{ value: 'resistant-hypertension', label: 'Resistant hypertension' },
		{ value: 'treatment-monitoring', label: 'Treatment monitoring' },
		{ value: 'hypotension-symptoms', label: 'Hypotension symptoms' },
		{ value: 'pregnancy-hypertension', label: 'Pregnancy hypertension' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Requested test">
	<p class="hint">
		Test type, indication, and the specific clinical question — the highest-value fields.
	</p>

	<Field label="Requested test type" required inputId="testType">
		<Select id="testType" label="Requested test type" required bind:value={d.testType}>
			<option value="">— Select —</option>
			{#each testTypeOptions as o (o.value)}
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
			placeholder="e.g. Confirm a new diagnosis of hypertension before starting treatment."
			bind:value={d.clinicalQuestion}
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput id="relevantHistory" label="Relevant history" rows={2} bind:value={d.relevantHistory} />
	</Field>
</Fieldset>
