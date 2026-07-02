<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateGrade } from '$lib/engine/anaesthetic-record-grader';
	import { statusLabel, statusColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	const s = assessment.data.signoff;
	const d = assessment.data;
	const grade = $derived(calculateGrade(assessment.data));
	const highFlags = $derived(grade.flaggedIssues.filter((f) => f.priority === 'high').length);
</script>

<Fieldset legend="Step 12 of 12 — Summary & sign-off">
	<p class="hint">
		Live completeness and safety flags, plus the anaesthetist signature. Submit to generate the full
		report.
	</p>

	<Field label="Completeness summary">
		<div class="flex flex-wrap items-center gap-3">
			<Badge label={statusLabel(grade.status)} colorClass={statusColor(grade.status)} />
			<strong class="text-base-content">{grade.completenessPercent}% complete</strong>
			<span class="text-base-content/70">
				{grade.criticalMissing} critical / {grade.noncriticalMissing} non-critical item(s) missing
			</span>
		</div>
		<div class="mt-2 text-sm text-base-content/70">
			{d.drugs.length} drug(s), {d.observations.length} observation(s), {d.events.length} event(s) —
			{grade.flaggedIssues.length} safety flag(s) ({highFlags} high)
		</div>
	</Field>

	<Field
		label="Anaesthetist signature"
		description="Type full name to sign — required to complete the record."
		required
		inputId="signoff-anaesthetistSignature"
	>
		<TextInput
			id="signoff-anaesthetistSignature"
			label="Anaesthetist signature"
			placeholder="Type full name to sign"
			required
			bind:value={s.anaesthetistSignature}
		/>
	</Field>

	<Field label="Signed at" inputId="signoff-signedAt">
		<TextInput id="signoff-signedAt" label="Signed at" type="datetime-local" class="date-input" bind:value={s.signedAt} />
	</Field>
</Fieldset>
