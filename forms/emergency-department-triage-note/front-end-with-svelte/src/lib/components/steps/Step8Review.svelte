<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { triage } from '#lib/engine/ed-triage-grader.js';
	import { priorityLevelColor, targetLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';

	const n = assessment.data.note;
	const result = $derived(triage(assessment.data));
</script>

<Fieldset legend="Step 8 of 8 — Triage note and sign-off">
	<p class="hint">
		Live Manchester Triage System priority level and a free-text triage note. Submit to generate the
		full report.
	</p>

	<Field label="Live triage priority">
		<span class="inline-flex flex-wrap items-center gap-3">
			<Badge
				label={`Priority ${result.priorityLevel} — ${result.priorityName}`}
				colorClass={priorityLevelColor(result.priorityLevel)}
			/>
			<span class="text-sm text-base-content/80">{targetLabel(result.priorityLevel)}</span>
			<span class="text-sm text-base-content/60">Supporting NEWS2 {result.news2Total}</span>
		</span>
	</Field>

	{#if !result.complete}
		<p class="hint">
			Some observations are not yet recorded — missing vital signs never lower the category, but the
			supporting NEWS2 aggregate may understate risk.
		</p>
	{/if}

	<Field label="Triage note" inputId="note-clinicalNotes">
		<TextAreaInput
			id="note-clinicalNotes"
			label="Triage note"
			rows={4}
			placeholder="Free-text triage note: context, decisions, and any escalation already actioned."
			bind:value={n.clinicalNotes}
		/>
	</Field>
</Fieldset>
