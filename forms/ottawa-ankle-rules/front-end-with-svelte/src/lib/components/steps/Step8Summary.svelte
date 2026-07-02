<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateOttawaDecision } from '$lib/engine/ottawa-ankle-grader';
	import { decisionLabel, decisionColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	const n = assessment.data.note;
	const decision = $derived(calculateOttawaDecision(assessment.data));
</script>

<Fieldset legend="Step 8 of 8 — Summary and decision">
	<p class="hint">
		The two live imaging decisions and a free-text clinical note. The decisions are independent —
		ankle only, foot only, both, or neither is valid. Submit to generate the full report.
	</p>

	<Field label="Live imaging decisions">
		<span class="inline-flex flex-wrap items-center gap-3">
			<Badge
				label={`Ankle: ${decisionLabel(decision.ankleXrayIndicated)}`}
				colorClass={decisionColor(decision.ankleXrayIndicated)}
			/>
			<Badge
				label={`Foot: ${decisionLabel(decision.footXrayIndicated)}`}
				colorClass={decisionColor(decision.footXrayIndicated)}
			/>
		</span>
	</Field>

	<Field label="Unable to bear weight">
		<span class="text-base-content">{decision.unableToBearWeight ? 'Yes' : 'No'}</span>
	</Field>

	<Field label="Clinical note" inputId="note-clinicalNotes">
		<TextAreaInput
			id="note-clinicalNotes"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any imaging or safety-net advice actioned."
			bind:value={n.clinicalNotes}
		/>
	</Field>
</Fieldset>
