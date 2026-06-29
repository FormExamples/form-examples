<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.symptoms;
</script>

<Fieldset legend="5. Symptoms and Red Flags">
	<p class="hint">Acute red flags drive the triage axis and auto-escalate urgency.</p>

	<Field label="Symptoms present">
		<CheckboxGroup label="Symptoms present">
			<label><CheckboxInput label="Reduced vision" bind:checked={d.reducedVision} /> Reduced vision</label>
			<label><CheckboxInput label="Sudden visual loss" bind:checked={d.suddenLoss} /> Sudden visual loss</label>
			<label><CheckboxInput label="Flashes and/or floaters" bind:checked={d.flashesFloaters} /> Flashes and/or floaters</label>
			<label><CheckboxInput label="Eye pain" bind:checked={d.eyePain} /> Eye pain</label>
			<label><CheckboxInput label="Red eye" bind:checked={d.redEye} /> Red eye</label>
		</CheckboxGroup>
	</Field>

	{#if d.suddenLoss}
		<Alert type="error" heading="Sudden visual loss — emergency pathway">
			<p>
				Sudden visual loss auto-escalates triage to emergency. Arrange same-day emergency eye
				assessment; do not delay for routine booking.
			</p>
		</Alert>
	{:else if d.flashesFloaters || (d.eyePain && d.redEye)}
		<Alert type="error" heading="Red flag selected">
			<p>
				This red flag auto-escalates triage to emergency (retinal-detachment symptoms or acute
				painful red eye).
			</p>
		</Alert>
	{:else if d.redEye || d.reducedVision}
		<Alert type="warning" heading="Symptom escalation">
			<p>This symptom escalates triage to urgent.</p>
		</Alert>
	{/if}
</Fieldset>
