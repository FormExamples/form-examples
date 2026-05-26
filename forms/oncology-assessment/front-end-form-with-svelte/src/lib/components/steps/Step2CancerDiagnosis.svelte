<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import HistologySelect from '$lib/components/ui/HistologySelect.svelte';

	const c = assessment.data.cancerDiagnosis;
</script>

<Fieldset legend="Cancer Diagnosis">
	<p class="hint">Cancer type, staging, and diagnosis details.</p>

	<Field label="Cancer Type" required inputId="cancerType">
		<Select id="cancerType" label="Cancer Type" required bind:value={c.cancerType}>
			<option value="">-- Select --</option>
			<option value="breast">Breast</option>
			<option value="lung">Lung</option>
			<option value="colorectal">Colorectal</option>
			<option value="prostate">Prostate</option>
			<option value="melanoma">Melanoma</option>
			<option value="lymphoma">Lymphoma</option>
			<option value="leukaemia">Leukaemia</option>
			<option value="pancreatic">Pancreatic</option>
			<option value="ovarian">Ovarian</option>
			<option value="bladder">Bladder</option>
			<option value="renal">Renal</option>
			<option value="hepatocellular">Hepatocellular</option>
			<option value="gastric">Gastric</option>
			<option value="oesophageal">Oesophageal</option>
			<option value="head-and-neck">Head and Neck</option>
			<option value="brain">Brain</option>
			<option value="sarcoma">Sarcoma</option>
			<option value="thyroid">Thyroid</option>
			<option value="cervical">Cervical</option>
			<option value="endometrial">Endometrial</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	{#if c.cancerType === 'other'}
		<Field label="Specify Cancer Type" required inputId="cancerTypeOther">
			<TextInput id="cancerTypeOther" label="Specify Cancer Type" required bind:value={c.cancerTypeOther} />
		</Field>
	{/if}

	<Field label="Primary Site" inputId="primarySite">
		<TextInput id="primarySite" label="Primary Site" placeholder="e.g., Left breast, Right upper lobe" bind:value={c.primarySite} />
	</Field>

	<Field label="Histology" inputId="histology">
		<HistologySelect id="histology" bind:value={c.histology} />
	</Field>

	{#if c.histology === 'other'}
		<Field label="Specify Histology" required inputId="histologyOther">
			<TextInput id="histologyOther" label="Specify Histology" required bind:value={c.histologyOther} />
		</Field>
	{/if}

	<div class="field-grid field-grid-3">
		<Field label="T Stage (Tumour)" inputId="stageT">
			<Select id="stageT" label="T Stage" bind:value={c.stageT}>
				<option value="">-- Select --</option>
				<option value="0">T0</option><option value="1">T1</option><option value="2">T2</option><option value="3">T3</option><option value="4">T4</option><option value="X">TX</option>
			</Select>
		</Field>
		<Field label="N Stage (Nodes)" inputId="stageN">
			<Select id="stageN" label="N Stage" bind:value={c.stageN}>
				<option value="">-- Select --</option>
				<option value="0">N0</option><option value="1">N1</option><option value="2">N2</option><option value="3">N3</option><option value="X">NX</option>
			</Select>
		</Field>
		<Field label="M Stage (Metastasis)" inputId="stageM">
			<Select id="stageM" label="M Stage" bind:value={c.stageM}>
				<option value="">-- Select --</option>
				<option value="0">M0</option><option value="1">M1</option><option value="X">MX</option>
			</Select>
		</Field>
	</div>

	<Field label="Overall Stage" required inputId="overallStage">
		<Select id="overallStage" label="Overall Stage" required bind:value={c.overallStage}>
			<option value="">-- Select --</option>
			<option value="I">Stage I</option><option value="II">Stage II</option><option value="III">Stage III</option><option value="IV">Stage IV</option>
		</Select>
	</Field>

	<Field label="Tumour Grade" inputId="grade">
		<Select id="grade" label="Tumour Grade" bind:value={c.grade}>
			<option value="">-- Select --</option>
			<option value="1">Grade 1 - Well differentiated</option>
			<option value="2">Grade 2 - Moderately differentiated</option>
			<option value="3">Grade 3 - Poorly differentiated</option>
			<option value="4">Grade 4 - Undifferentiated</option>
			<option value="X">GX - Grade cannot be assessed</option>
		</Select>
	</Field>

	<Field label="Date of Diagnosis" required inputId="diagnosisDate">
		<DateInput id="diagnosisDate" label="Date of Diagnosis" required bind:value={c.dateOfDiagnosis} />
	</Field>
</Fieldset>

<style>
	.field-grid { display: grid; gap: 1rem; }
	.field-grid.field-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
	@media (max-width: 640px) { .field-grid.field-grid-3 { grid-template-columns: 1fr; } }
</style>
