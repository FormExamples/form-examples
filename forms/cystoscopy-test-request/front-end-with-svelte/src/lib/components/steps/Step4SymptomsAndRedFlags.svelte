<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { requestStore } from '$lib/stores/result.svelte';

	const s = requestStore.data.symptoms;
</script>

<Fieldset legend="4. Symptoms and Red Flags">
	<p class="hint">
		Red flags (visible haematuria, retention, active UTI) escalate the cancer-pathway urgency or
		defer the procedure.
	</p>

	<Field label="Symptoms present">
		<CheckboxGroup label="Symptoms present">
			<label><CheckboxInput label="Haematuria" bind:checked={s.symptomHaematuria} /> Haematuria (any)</label>
			<label><CheckboxInput label="Dysuria" bind:checked={s.symptomDysuria} /> Dysuria</label>
			<label><CheckboxInput label="Frequency" bind:checked={s.symptomFrequency} /> Frequency</label>
			<label><CheckboxInput label="Retention" bind:checked={s.symptomRetention} /> Urinary retention</label>
		</CheckboxGroup>
	</Field>

	<Field label="Red flags">
		<CheckboxGroup label="Red flags">
			<label><CheckboxInput label="Visible haematuria" bind:checked={s.visibleHaematuria} /> Visible (macroscopic) haematuria</label>
			<label><CheckboxInput label="Current UTI" bind:checked={s.currentUti} /> Active urinary tract infection</label>
		</CheckboxGroup>
	</Field>

	{#if s.visibleHaematuria}
		<Alert type="warning" heading="Visible haematuria">
			<p>
				Per BAUS, any episode of visible haematuria warrants urological assessment including
				cystoscopy. This escalates the request to the suspected-cancer pathway.
			</p>
		</Alert>
	{/if}

	{#if s.currentUti}
		<Alert type="error" heading="Active UTI — defer instrumentation">
			<p>
				An active UTI defers the cystoscopy: treat the infection first and reschedule once resolved
				to avoid urosepsis.
			</p>
		</Alert>
	{/if}
</Fieldset>
