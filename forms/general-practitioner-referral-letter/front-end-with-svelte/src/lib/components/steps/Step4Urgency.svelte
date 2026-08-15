<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const u = assessment.data.urgencyInfo;

	// Conditional visibility (mirrors spec §4): urgency reason for any non-routine
	// urgency; the suspected-cancer criterion and pathway for two-week-wait only.
	const showReason = $derived(u.urgency !== '' && u.urgency !== 'routine');
	const showCancer = $derived(u.urgency === 'two-week-wait');
</script>

<Fieldset legend="Step 4 of 9 — Urgency">
	<p class="hint">
		How urgently the referral must be seen. This drives the pathway and the mandatory information
		required.
	</p>

	<Field
		label="Urgency"
		description="Emergency means arrange same-day assessment / 999 now — do not send a routine letter."
		required
		inputId="urgencyInfo-urgency"
	>
		<Select id="urgencyInfo-urgency" label="Urgency" required bind:value={u.urgency}>
			<option value="">— Select —</option>
			<option value="routine">Routine</option>
			<option value="urgent">Urgent</option>
			<option value="two-week-wait">Two-week-wait (suspected cancer)</option>
			<option value="emergency">Emergency</option>
		</Select>
	</Field>

	{#if showReason}
		<Field
			label="Reason for urgency"
			description="Required for urgent and two-week-wait referrals."
			inputId="urgencyInfo-urgencyReason"
		>
			<TextAreaInput
				id="urgencyInfo-urgencyReason"
				label="Reason for urgency"
				rows={2}
				placeholder="Why this referral is urgent."
				bind:value={u.urgencyReason}
			/>
		</Field>
	{/if}

	{#if showCancer}
		<p class="hint">
			Because this is a two-week-wait referral, name the NICE NG12 criterion and the tumour-site
			pathway.
		</p>
		<Field
			label="Suspected-cancer criterion (NICE NG12)"
			inputId="urgencyInfo-suspectedCancerCriterion"
		>
			<TextInput
				id="urgencyInfo-suspectedCancerCriterion"
				label="Suspected-cancer criterion (NICE NG12)"
				placeholder="e.g. Iron-deficiency anaemia in a patient aged ≥ 60"
				bind:value={u.suspectedCancerCriterion}
			/>
		</Field>
		<Field
			label="Suspected-cancer pathway (tumour site)"
			inputId="urgencyInfo-suspectedCancerPathway"
		>
			<TextInput
				id="urgencyInfo-suspectedCancerPathway"
				label="Suspected-cancer pathway (tumour site)"
				placeholder="e.g. Lower gastrointestinal"
				bind:value={u.suspectedCancerPathway}
			/>
		</Field>
	{/if}
</Fieldset>
