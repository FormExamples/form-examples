<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';
	import { hasCriticalFinding } from '$lib/engine/utils';

	const d = resultStore.data;

	const critical = $derived(hasCriticalFinding(d));
</script>

<Fieldset legend="6. Critical-result Communication">
	<p class="hint">Record whether a critical or unexpected significant result was communicated to the referrer.</p>

	{#if critical && !d.criticalResultCommunicated}
		<Alert type="error" heading="Critical-result alert">
			<p>
				This report contains a critical finding (distant metastasis or progressive disease).
				Communicate the result directly to the referrer and record it below.
			</p>
		</Alert>
	{/if}

	<Field label="Critical-result communication">
		<CheckboxGroup label="Critical-result communication">
			<label>
				<CheckboxInput
					label="Critical / urgent result communicated to referrer"
					bind:checked={d.criticalResultCommunicated}
				/> Critical / urgent result communicated to referrer
			</label>
		</CheckboxGroup>
	</Field>

	<Field label="Reported to" inputId="reportedTo">
		<TextInput
			id="reportedTo"
			label="Reported to"
			placeholder="Who was informed, with date and time"
			bind:value={d.reportedTo}
		/>
	</Field>
</Fieldset>
