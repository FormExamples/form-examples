<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.safety;
	const anyContraindication = $derived(
		d.recentMiOrEyeAbdominalSurgery || d.haemoptysis || d.suspectedActiveTuberculosis
	);
</script>

<Fieldset legend="6. Safety Screen">
	<p class="hint">
		Forced-expiration and infection-control contraindications downgrade the safety band and may defer
		the test.
	</p>

	<Field label="Contraindications" inputId="contraindications">
		<CheckboxGroup label="Contraindications">
			<label>
				<CheckboxInput
					label="Recent MI or recent eye / thoracic / abdominal surgery"
					bind:checked={d.recentMiOrEyeAbdominalSurgery}
				/> Recent MI or recent eye / thoracic / abdominal surgery
			</label>
			<label>
				<CheckboxInput label="Haemoptysis of unknown origin" bind:checked={d.haemoptysis} />
				Haemoptysis of unknown origin
			</label>
		</CheckboxGroup>
	</Field>

	<Field label="Infection control" inputId="infectionControl">
		<CheckboxGroup label="Infection control">
			<label>
				<CheckboxInput
					label="Recent / active respiratory infection"
					bind:checked={d.recentRespiratoryInfection}
				/> Recent / active respiratory infection
			</label>
			<label>
				<CheckboxInput
					label="Suspected active tuberculosis"
					bind:checked={d.suspectedActiveTuberculosis}
				/> Suspected active tuberculosis
			</label>
		</CheckboxGroup>
	</Field>

	{#if anyContraindication}
		<Alert type="warning" heading="Contraindication selected">
			<p>
				A forced-expiration or infection-control contraindication is present. The request will be
				graded as contraindicated and deferred / redirected pending clinician vetting.
			</p>
		</Alert>
	{/if}
</Fieldset>
