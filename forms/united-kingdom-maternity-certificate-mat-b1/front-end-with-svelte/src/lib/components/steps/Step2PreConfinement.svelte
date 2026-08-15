<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';

	const data = assessment.data;
	const pre = data.preConfinement;
</script>

<Fieldset legend="Part A — Pre-Confinement Certificate">
	<p class="hint">
		Complete Part A only when the certificate is being issued before the birth.
		Part A and Part B are mutually exclusive.
	</p>

	<Field label="Certificate type" required>
		<RadioGroup label="Certificate type">
			<label>
				<input type="radio" class="radio-input" name="certificateType" value="pre" bind:group={data.certificateType} />
				Part A — Pre-confinement (pregnancy ongoing)
			</label>
			<label>
				<input type="radio" class="radio-input" name="certificateType" value="post" bind:group={data.certificateType} />
				Part B — Post-confinement (baby has been born)
			</label>
		</RadioGroup>
	</Field>

	{#if data.certificateType === 'pre'}
		<Alert type="info">
			<p>
				DWP guidance: a MAT B1 must not be issued more than 20 weeks before
				the expected date of confinement (EWC).
			</p>
		</Alert>

		<Field label="Expected date of confinement (EWC)" required inputId="ewc">
			<DateInput id="ewc" label="Expected date of confinement (EWC)" required bind:value={pre.expectedDateOfConfinement} />
		</Field>

		<Field label="Examination date" required inputId="examinationDate">
			<DateInput id="examinationDate" label="Examination date" required bind:value={pre.examinationDate} />
		</Field>
	{:else if data.certificateType === 'post'}
		<p class="hint">Part B (post-confinement) selected — complete Step 3 instead.</p>
	{:else}
		<p class="hint">Select a certificate type above to continue.</p>
	{/if}
</Fieldset>
