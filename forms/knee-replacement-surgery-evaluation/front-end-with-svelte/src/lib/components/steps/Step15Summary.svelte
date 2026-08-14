<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import { OPTIONS } from '$lib/config/options';
	import { CANDIDACY_LABELS, OKS_CATEGORY_LABELS } from '$lib/engine/grader';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const d = evaluationStore.data;
	const result = $derived(evaluationStore.result);
</script>

<Fieldset legend="15. Summary and Sign-off">
	<p class="hint">
		The computed Oxford Knee Score, surgical candidacy, and safety flags, with the clinician
		override and electronic sign-off.
	</p>

	<Panel label="Computed result" class="mb-4">
		<h3 class="text-base font-semibold">Computed result</h3>
		<dl class="mt-2 space-y-2 text-sm">
			<div class="flex justify-between gap-4">
				<dt class="text-base-content/70">Oxford Knee Score</dt>
				<dd class="font-semibold">{result.oksTotal} / 48 — {OKS_CATEGORY_LABELS[result.computedOksCategory]}</dd>
			</div>
			<div class="flex justify-between gap-4">
				<dt class="text-base-content/70">Highest Kellgren-Lawrence grade</dt>
				<dd class="font-semibold">{result.maxKellgrenLawrenceGrade ?? '—'}</dd>
			</div>
			<div class="flex justify-between gap-4 border-t border-base-300 pt-2">
				<dt class="text-base-content/70">Computed candidacy</dt>
				<dd class="font-semibold">{CANDIDACY_LABELS[result.computedCandidacy]}</dd>
			</div>
			<div class="flex justify-between gap-4">
				<dt class="text-base-content/70">Final candidacy</dt>
				<dd class="font-semibold">{CANDIDACY_LABELS[result.finalCandidacy]}</dd>
			</div>
		</dl>

		<h3 class="mt-4 text-sm font-semibold">Safety flags</h3>
		{#if result.flags.length === 0}
			<p class="mt-1 text-sm text-base-content/60">None raised.</p>
		{:else}
			<ul class="mt-2 space-y-2 text-sm">
				{#each result.flags as flag (flag.flagId)}
					<li class="rounded border border-base-300 p-2">
						<span class="font-semibold uppercase">{flag.priority}</span>
						<span class="ml-1">{flag.description}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</Panel>

	<p class="hint">
		The override changes the candidacy recommendation only. Safety flags are computed
		independently and are always reported, so an override cannot hide a hazard.
	</p>
	<Field label="Override candidacy" inputId="summary-overrideCandidacy">
		<Select id="summary-overrideCandidacy" label="Override candidacy" bind:value={d.summary.overrideCandidacy}>
			<option value="">— Select —</option>
			{#each OPTIONS.candidacy as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Override reason" inputId="summary-overrideReason" description="Mandatory when the override differs from the computed candidacy.">
		<TextInput id="summary-overrideReason" label="Override reason" bind:value={d.summary.overrideReason} />
	</Field>
	<Field label="Clinician notes" inputId="summary-clinicianNotes">
		<TextAreaInput id="summary-clinicianNotes" label="Clinician notes" rows={3} bind:value={d.summary.clinicianNotes} />
	</Field>
	<Field label="Signed by" inputId="summary-signedByName" description="An orthopaedic surgeon or extended-scope physiotherapist must sign before the report is final." required>
		<TextInput id="summary-signedByName" label="Signed by" bind:value={d.summary.signedByName} required />
	</Field>
</Fieldset>
