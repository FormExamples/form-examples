<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateParkland } from '$lib/engine/parkland-grader';
	import { statusColor, statusLabel, formatVolume, formatRate } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateParkland(assessment.data));
</script>

<Fieldset legend="Step 7 of 7 — Summary and plan">
	<p class="hint">
		Live resuscitation plan and a free-text clinical note. Submit to generate the full report. The
		Parkland volume is a starting estimate only — titrate to urine output.
	</p>

	<Field label="Plan status">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {statusColor(
				grade.status
			)}"
		>
			{statusLabel(grade.status)}
		</span>
	</Field>

	<Field label="Total 24 h volume">
		<strong class="text-lg text-base-content">{formatVolume(grade.total24hVolumeMl)}</strong>
	</Field>

	<Field label="First-phase rate (remaining window)">
		<strong class="text-base text-base-content">
			{#if grade.total24hVolumeMl !== null && grade.first8hRateMlPerHour === null}
				Overdue — give outstanding volume now
			{:else}
				{formatRate(grade.first8hRateMlPerHour)}
			{/if}
		</strong>
	</Field>

	<Field label="Second-phase rate (over 16 h)">
		<strong class="text-base text-base-content">{formatRate(grade.next16hRateMlPerHour)}</strong>
	</Field>

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any escalation already actioned."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
