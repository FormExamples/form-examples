<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { assessmentStore } from '#lib/stores/assessment.svelte.js';

	const d = assessmentStore.data;
</script>

<Fieldset legend="16. Readiness Summary and Sign-off">
	<p class="hint">The computed band is advisory. A clinician must record an explicit gate decision and sign.</p>

	<p class="hint">A computed band of “Defer surgery” has exactly two safe resolutions: move the date so the window exists, or record an explicit accept-unoptimised-risk decision. Choosing neither, and proceeding as if the patient were optimised, is the hazard this form exists to prevent.</p>
	<Field label="Override readiness band" inputId="signoff-overrideReadiness">
		<Select id="signoff-overrideReadiness" label="Override readiness band" bind:value={d.signoff.overrideReadiness}>
			<option value="">— Select —</option>
			{#each OPTIONS.readiness as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Override reason" inputId="signoff-overrideReason" description="Mandatory when the override differs from the computed band. Safety flags are never suppressed.">
		<TextInput id="signoff-overrideReason" label="Override reason" bind:value={d.signoff.overrideReason} />
	</Field>
	<Field label="Gate decision" inputId="signoff-gateDecision" required>
		<Select id="signoff-gateDecision" label="Gate decision" bind:value={d.signoff.gateDecision} required>
			<option value="">— Select —</option>
			{#each OPTIONS.gateDecision as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Additional notes" inputId="signoff-additionalNotes">
		<TextAreaInput id="signoff-additionalNotes" label="Additional notes" rows={3} bind:value={d.signoff.additionalNotes} />
	</Field>
	<Field label="Signed by" inputId="signoff-signedByName" description="The responsible clinician must sign before the report is final." required>
		<TextInput id="signoff-signedByName" label="Signed by" bind:value={d.signoff.signedByName} required />
	</Field>
</Fieldset>
