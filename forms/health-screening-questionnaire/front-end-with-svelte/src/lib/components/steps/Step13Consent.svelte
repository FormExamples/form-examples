<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { YES_NO } from '$lib/config/options';
	import { questionnaireStore } from '$lib/stores/questionnaire.svelte';

	const d = questionnaireStore.data;
</script>

<Fieldset legend="13. Consent and Data">
	<Field label="Consent to screening" inputId="consent-consentToScreening" required>
		<Select id="consent-consentToScreening" label="Consent to screening" bind:value={d.consent.consentToScreening} required>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Information given is accurate to the best of my knowledge" inputId="consent-informationAccurateConfirmed">
		<Select id="consent-informationAccurateConfirmed" label="Information given is accurate to the best of my knowledge" bind:value={d.consent.informationAccurateConfirmed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Interpreter required" inputId="consent-interpreterRequired">
		<Select id="consent-interpreterRequired" label="Interpreter required" bind:value={d.consent.interpreterRequired}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
