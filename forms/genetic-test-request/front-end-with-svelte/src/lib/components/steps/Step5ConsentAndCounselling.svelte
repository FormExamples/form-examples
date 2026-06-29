<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { request } from '$lib/stores/request.svelte';
	import { isPredictiveTest } from '$lib/engine/utils';

	const d = request.data;

	const predictive = $derived(
		isPredictiveTest(d.request.testType, d.request.primaryIndication)
	);
	const blocking = $derived(
		predictive && (!d.consent.consentObtained || !d.consent.geneticCounsellingOffered)
	);
</script>

<Fieldset legend="5. Consent and Counselling">
	<p class="hint">
		Informed consent (Record of Discussion) and pre-test genetic counselling. Both are mandatory for
		predictive / presymptomatic testing.
	</p>

	<Field label="Consent and counselling">
		<CheckboxGroup label="Consent and counselling">
			<label>
				<CheckboxInput
					label="Informed consent obtained (Record of Discussion)"
					bind:checked={d.consent.consentObtained}
				/> Informed consent obtained (Record of Discussion)
			</label>
			<label>
				<CheckboxInput
					label="Pre-test genetic counselling offered / provided"
					bind:checked={d.consent.geneticCounsellingOffered}
				/> Pre-test genetic counselling offered / provided
			</label>
		</CheckboxGroup>
	</Field>

	{#if blocking}
		<Alert type="error" heading="Predictive testing — consent and counselling mandatory">
			<p>
				Predictive / presymptomatic testing requires both documented informed consent and pre-test
				genetic counselling. Until both are recorded, the consent axis is <strong>not-met</strong>
				and the request will be rejected.
			</p>
		</Alert>
	{:else if !d.consent.consentObtained || !d.consent.geneticCounsellingOffered}
		<Alert type="warning" heading="Consent or counselling not yet documented">
			<p>
				Missing informed consent or pre-test counselling sets the consent axis to caution; the
				vetting desk will query the referrer.
			</p>
		</Alert>
	{/if}
</Fieldset>
