<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data;
</script>

<Fieldset legend="5. Requested Examination">
	<p class="hint">
		Scan type, indication, and the specific clinical question — the highest-value fields.
	</p>

	<Field label="Requested scan type" inputId="requestedScanType" required>
		<Select
			id="requestedScanType"
			label="Requested scan type"
			bind:value={d.request.requestedScanType}
			required
		>
			<option value="">Select…</option>
			<option value="viability">Viability</option>
			<option value="dating">Dating</option>
			<option value="nuchal-translucency">Nuchal translucency / combined</option>
			<option value="anomaly">Anomaly (anatomy)</option>
			<option value="growth">Growth / wellbeing</option>
			<option value="doppler">Doppler surveillance</option>
			<option value="presentation">Presentation</option>
			<option value="cervical-length">Cervical length</option>
			<option value="placental-location">Placental location</option>
			<option value="liquor-volume">Liquor volume</option>
			<option value="reassurance">Reassurance</option>
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
			<option value="dating">Dating</option>
			<option value="viability">Viability</option>
			<option value="exclude-ectopic">Exclude ectopic</option>
			<option value="bleeding">Bleeding</option>
			<option value="pain">Pain</option>
			<option value="aneuploidy-screening">Aneuploidy screening</option>
			<option value="anomaly-screening">Anomaly screening</option>
			<option value="suspected-anomaly">Suspected anomaly</option>
			<option value="growth-restriction">Growth restriction</option>
			<option value="large-for-dates">Large for dates</option>
			<option value="reduced-fetal-movements">Reduced fetal movements</option>
			<option value="multiple-pregnancy">Multiple pregnancy</option>
			<option value="placental-location">Placental location</option>
			<option value="liquor-assessment">Liquor assessment</option>
			<option value="presentation">Presentation</option>
			<option value="cervical-assessment">Cervical assessment</option>
			<option value="antepartum-haemorrhage">Antepartum haemorrhage</option>
			<option value="maternal-condition">Maternal condition</option>
			<option value="doppler-surveillance">Doppler surveillance</option>
			<option value="follow-up">Follow-up</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" inputId="clinicalQuestion" required>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={2}
			placeholder="e.g. Confirm intrauterine location and viability."
			bind:value={d.request.clinicalQuestion}
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput
			id="relevantHistory"
			label="Relevant history"
			rows={2}
			bind:value={d.request.relevantHistory}
		/>
	</Field>

	<Field label="Previous scan finding" inputId="previousScanFinding">
		<TextInput
			id="previousScanFinding"
			label="Previous scan finding"
			bind:value={d.request.previousScanFinding}
		/>
	</Field>

	<Field label="Previous scan date" inputId="previousScanDate">
		<DateInput
			id="previousScanDate"
			label="Previous scan date"
			bind:value={d.request.previousScanDate}
		/>
	</Field>
</Fieldset>
