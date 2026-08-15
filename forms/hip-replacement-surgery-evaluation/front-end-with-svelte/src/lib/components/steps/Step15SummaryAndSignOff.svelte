<script lang="ts">
	// Summary and sign-off: renders the live computed result (OHS total and
	// category, computed candidacy), lets the clinician set a final candidacy
	// with a mandatory reason when it differs, and always shows every fired
	// safety flag — flags are never filtered by the override. See
	// doc/safety-case-notes.md.
	import Alert from '#lib/components/ui/Alert.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { CANDIDACY_LABELS, OHS_CATEGORY_LABELS } from '#lib/engine/grader.js';
	import { titleCase } from '#lib/engine/utils.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
	const result = $derived(evaluationStore.result);

	const overrideDiffers = $derived(
		Boolean(d.summary.overrideCandidacy) && d.summary.overrideCandidacy !== result.computedCandidacy
	);
</script>

<Fieldset legend="15. Summary and Sign-off">
	<p class="hint">The computed result, the final candidacy, and every safety flag — flags are never hidden by a clinician override.</p>

	<div class="mb-4 rounded-lg border border-base-300 bg-base-100 p-4 text-sm">
		<p><strong>Oxford Hip Score:</strong> {result.ohsTotal} / 48 — {OHS_CATEGORY_LABELS[result.ohsCategory] ?? 'not yet scored'}</p>
		<p class="mt-1"><strong>Body mass index:</strong> {result.bmi === null ? '—' : `${result.bmi} kg/m²`}</p>
		<p class="mt-1"><strong>Computed candidacy:</strong> {CANDIDACY_LABELS[result.computedCandidacy] ?? result.computedCandidacy}</p>
		<p class="mt-1"><strong>Final candidacy:</strong> {CANDIDACY_LABELS[result.finalCandidacy] ?? result.finalCandidacy}</p>
	</div>

	{#if overrideDiffers}
		<Alert type="warning" heading="Clinician override">
			The final candidacy differs from the computed candidacy. An override reason is required.
		</Alert>
	{/if}

	<h3 class="mt-4 text-sm font-semibold">Safety flags</h3>
	{#if result.flags.length === 0}
		<p class="mt-1 text-sm text-base-content/60">None raised.</p>
	{:else}
		<ul class="mt-2 space-y-2 text-sm">
			{#each result.flags as flag (flag.flagId)}
				<li class="rounded border border-base-300 p-2">
					<span class="font-semibold uppercase">{flag.priority}</span>
					<span class="ml-1">{titleCase(flag.category)} — {flag.description}</span>
					<p class="mt-1 text-base-content/70">{flag.suggestedAction}</p>
				</li>
			{/each}
		</ul>
	{/if}

	<Field label="Override candidacy" inputId="summary-overrideCandidacy" class="mt-4"
		description="Leave blank to accept the computed candidacy. When set and different from the computed value, a reason is required.">
		<Select id="summary-overrideCandidacy" label="Override candidacy" bind:value={d.summary.overrideCandidacy}>
			<option value="">— Accept computed candidacy —</option>
			{#each OPTIONS.overrideCandidacy as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Override reason" inputId="summary-overrideReason" required={overrideDiffers}>
		<TextInput id="summary-overrideReason" label="Override reason" bind:value={d.summary.overrideReason} required={overrideDiffers} />
	</Field>
	<Field label="Clinician notes" inputId="summary-clinicianNotes">
		<TextAreaInput id="summary-clinicianNotes" label="Clinician notes" rows={3} bind:value={d.summary.clinicianNotes} />
	</Field>
	<Field label="Additional notes" inputId="summary-additionalNotes">
		<TextAreaInput id="summary-additionalNotes" label="Additional notes" rows={2} bind:value={d.summary.additionalNotes} />
	</Field>
	<Field label="Signed by" inputId="summary-signedByName" description="The orthopaedic surgeon or extended-scope physiotherapist must sign before the report is final." required>
		<TextInput id="summary-signedByName" label="Signed by" bind:value={d.summary.signedByName} required />
	</Field>
</Fieldset>
