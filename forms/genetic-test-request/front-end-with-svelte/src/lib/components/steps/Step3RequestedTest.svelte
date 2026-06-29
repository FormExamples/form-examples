<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data;
</script>

<Fieldset legend="3. Requested Test">
	<p class="hint">
		The genomic test type, the primary clinical indication, and the specific clinical question.
	</p>

	<Field
		label="Requested test type"
		inputId="testType"
		required
		description="The genomic technology requested."
	>
		<Select id="testType" label="Requested test type" bind:value={d.request.testType} required>
			<option value="">Select…</option>
			<option value="diagnostic-single-gene">Diagnostic single gene</option>
			<option value="gene-panel">Gene panel</option>
			<option value="whole-exome">Whole exome</option>
			<option value="whole-genome">Whole genome</option>
			<option value="chromosomal-microarray">Chromosomal microarray</option>
			<option value="karyotype">Karyotype</option>
			<option value="predictive-presymptomatic">Predictive / presymptomatic</option>
			<option value="carrier-testing">Carrier testing</option>
			<option value="pharmacogenomic">Pharmacogenomic</option>
			<option value="prenatal">Prenatal</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field
		label="Primary indication"
		inputId="primaryIndication"
		required
		description="The clinical indication that maps to the NHS National Genomic Test Directory."
	>
		<Select
			id="primaryIndication"
			label="Primary indication"
			bind:value={d.request.primaryIndication}
			required
		>
			<option value="">Select…</option>
			<option value="suspected-genetic-disorder">Suspected genetic disorder</option>
			<option value="familial-cancer">Familial cancer</option>
			<option value="developmental-delay">Developmental delay</option>
			<option value="congenital-anomaly">Congenital anomaly</option>
			<option value="cardiomyopathy-arrhythmia">Cardiomyopathy / arrhythmia</option>
			<option value="neuromuscular">Neuromuscular</option>
			<option value="predictive-family-history">Predictive (family history)</option>
			<option value="carrier-screening">Carrier screening</option>
			<option value="prenatal-diagnosis">Prenatal diagnosis</option>
			<option value="pharmacogenomics">Pharmacogenomics</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="The specific question the genomic test is asked to answer…"
			bind:value={d.request.clinicalQuestion}
		/>
	</Field>

	<Field
		label="Requested-by date"
		inputId="requestedByDate"
		description="Date by which the result is needed, if time-sensitive."
	>
		<DateInput
			id="requestedByDate"
			label="Requested-by date"
			bind:value={d.request.requestedByDate}
		/>
	</Field>
</Fieldset>
