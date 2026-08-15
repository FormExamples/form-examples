<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS } from '$lib/config/options';
	import { LOCS_III_SEVERITY_LABELS, SURGICAL_CANDIDACY_LABELS } from '$lib/engine/grader';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const d = evaluationStore.data;
	const result = $derived(evaluationStore.result);
</script>

<Fieldset legend="15. Summary &amp; Sign-off">
	<p class="hint">
		The engine computes a LOCS III severity band per eye and a surgical-candidacy recommendation.
		The clinician may override the final recommendation below with a mandatory reason; safety flags
		are never suppressed by an override.
	</p>

	<Field label="Computed LOCS III severity — right" inputId="summary-computedSeverityRight">
		<input id="summary-computedSeverityRight" class="text-input" type="text" readonly
			value={LOCS_III_SEVERITY_LABELS[result.locsIIISeverityRight] ?? '—'} />
	</Field>
	<Field label="Computed LOCS III severity — left" inputId="summary-computedSeverityLeft">
		<input id="summary-computedSeverityLeft" class="text-input" type="text" readonly
			value={LOCS_III_SEVERITY_LABELS[result.locsIIISeverityLeft] ?? '—'} />
	</Field>
	<Field label="Computed surgical candidacy" inputId="summary-computedSurgicalCandidacy">
		<input id="summary-computedSurgicalCandidacy" class="text-input" type="text" readonly
			value={SURGICAL_CANDIDACY_LABELS[result.computedSurgicalCandidacy] ?? '—'} />
	</Field>

	<Field label="Override final surgical candidacy" inputId="summary-overrideSurgicalCandidacy" description="Leave blank to accept the computed recommendation.">
		<Select id="summary-overrideSurgicalCandidacy" label="Override final surgical candidacy" bind:value={d.summary.overrideSurgicalCandidacy}>
			<option value="">— Use computed recommendation —</option>
			{#each OPTIONS.surgicalCandidacy as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Override reason" inputId="summary-overrideReason" description="Required when the final recommendation differs from the computed one.">
		<TextAreaInput id="summary-overrideReason" label="Override reason" rows={2} bind:value={d.summary.overrideReason} />
	</Field>
	<Field label="Clinician notes" inputId="summary-clinicianNotes">
		<TextAreaInput id="summary-clinicianNotes" label="Clinician notes" rows={3} bind:value={d.summary.clinicianNotes} />
	</Field>
	<Field label="Signed by" inputId="summary-signedByName" required>
		<TextInput id="summary-signedByName" label="Signed by" bind:value={d.summary.signedByName} required />
	</Field>
</Fieldset>
