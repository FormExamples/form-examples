<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.redFlags;
</script>

<Fieldset legend="5. Red Flags">
	<p class="hint">Acute red flags drive the urgency axis and escalate triage.</p>

	<Field label="Acute red flags">
		<CheckboxGroup label="Acute red flags">
			<label
				><CheckboxInput
					label="Suspected status epilepticus"
					bind:checked={d.suspectedStatusEpilepticus}
				/> Suspected status epilepticus</label
			>
			<label
				><CheckboxInput label="Recent seizure" bind:checked={d.recentSeizure} /> Recent seizure</label
			>
		</CheckboxGroup>
	</Field>

	{#if d.suspectedStatusEpilepticus}
		<Alert type="error" heading="Suspected status epilepticus — emergency pathway">
			<p>
				Suspected status epilepticus auto-escalates triage to emergency. Arrange an emergency EEG
				and escalate to the on-call neurology / neurophysiology team now; do not wait for a routine
				booking.
			</p>
		</Alert>
	{:else if d.recentSeizure}
		<Alert type="warning" heading="Recent seizure recorded">
			<p>
				A recent first seizure escalates triage to urgent via the first-seizure pathway, where an
				early EEG increases diagnostic yield.
			</p>
		</Alert>
	{/if}
</Fieldset>
