<script lang="ts">
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import { formState } from '$stores/formState.svelte';

	const d = formState.data;
</script>

<Fieldset legend="10. Score &amp; sign-off" data-step="10">
	<Field label="Progress percent (0–100)" inputId="progressPercent">
		<NumberInput
			id="progressPercent"
			label="Progress percent (0–100)"
			min={0}
			max={100}
			bind:value={d.scores.progressPercent}
		/>
	</Field>

	<Field label="Confidence decile (1–10)" inputId="confidenceDecile">
		<NumberInput
			id="confidenceDecile"
			label="Confidence decile (1–10)"
			min={1}
			max={10}
			bind:value={d.scores.confidenceDecile}
		/>
	</Field>

	<Field label="Stretch tier" inputId="stretchTier">
		<select id="stretchTier" class="select" aria-label="Stretch tier" bind:value={d.scores.stretchTier}>
			<option value={null}>—</option>
			<option value={1}>1 — committed</option>
			<option value={2}>2 — aspirational</option>
			<option value={3}>3 — moonshot</option>
		</select>
	</Field>

	<Field label="Alignment grade (1–5)" inputId="alignmentGrade">
		<NumberInput
			id="alignmentGrade"
			label="Alignment grade (1–5)"
			min={1}
			max={5}
			bind:value={d.scores.alignmentGrade}
		/>
	</Field>

	<Field label="Impact tier (1–5)" inputId="impactTier">
		<NumberInput
			id="impactTier"
			label="Impact tier (1–5)"
			min={1}
			max={5}
			bind:value={d.scores.impactTier}
		/>
	</Field>

	<Field label="SMART quality (0–5)" inputId="smartQuality">
		<NumberInput
			id="smartQuality"
			label="SMART quality (0–5)"
			min={0}
			max={5}
			bind:value={d.scores.smartQuality}
		/>
	</Field>

	<Field label="Pace deviation % (-100..+100)" inputId="paceDeviationPercent">
		<NumberInput
			id="paceDeviationPercent"
			label="Pace deviation % (-100..+100)"
			min={-100}
			max={100}
			bind:value={d.scores.paceDeviationPercent}
		/>
	</Field>

	<Field label="Signed by" inputId="signedBy">
		<TextInput id="signedBy" label="Signed by" bind:value={d.signature.signed_by} />
	</Field>
</Fieldset>
