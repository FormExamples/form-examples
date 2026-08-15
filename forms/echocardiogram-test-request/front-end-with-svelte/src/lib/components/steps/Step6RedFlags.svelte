<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.redFlags;
</script>

<Fieldset legend="6. Red Flags">
	<p class="hint">
		Acute red flags auto-escalate the urgency tier and set clinical priority to high, regardless of
		the other axes.
	</p>

	<Field label="Acute red flags">
		<CheckboxGroup label="Acute red flags">
			<label
				><CheckboxInput label="Suspected infective endocarditis" bind:checked={d.suspectedEndocarditis} />
				Suspected infective endocarditis</label
			>
			<label
				><CheckboxInput label="Severe symptomatic valve disease" bind:checked={d.severeSymptomaticValve} />
				Severe symptomatic valve disease</label
			>
			<label
				><CheckboxInput label="Acute heart failure" bind:checked={d.acuteHeartFailure} />
				Acute heart failure</label
			>
		</CheckboxGroup>
	</Field>

	{#if d.suspectedEndocarditis || d.acuteHeartFailure}
		<Alert type="error" heading="Emergency triage">
			<p>
				This red flag auto-escalates triage to emergency / inpatient echo. Discuss with cardiology
				now; do not wait for a routine clinic.
			</p>
		</Alert>
	{:else if d.severeSymptomaticValve}
		<Alert type="warning" heading="Urgent triage">
			<p>Severe symptomatic valve disease auto-escalates triage to urgent.</p>
		</Alert>
	{/if}
</Fieldset>
