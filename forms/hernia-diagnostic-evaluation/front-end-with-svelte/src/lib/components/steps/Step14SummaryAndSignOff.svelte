<script lang="ts">
	// Summary and sign-off: the live computed classification and urgency band,
	// every fired flag, the clinician override (with a mandatory reason when it
	// differs from the computed urgency), and the electronic signature. Safety
	// flags are computed independently of the override and are always shown —
	// see doc/safety-case-notes.md hazard H-01.
	import Alert from '#lib/components/ui/Alert.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Panel from '#lib/components/ui/Panel.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { URGENCY_LABELS, RECOMMENDATION_LABELS } from '#lib/engine/grader.js';
	import { titleCase } from '#lib/engine/utils.js';
	import { evaluationStore } from '#lib/stores/assessment.svelte.js';

	const d = evaluationStore.data;
	const result = $derived(evaluationStore.result);

	const URGENCY_ALERT_TYPE: Record<string, 'info' | 'success' | 'warning' | 'error'> = {
		routine: 'success',
		soon: 'info',
		urgent: 'warning',
		emergency: 'error',
		'': 'info'
	};

	const isOverridden = $derived(
		Boolean(d.summary.overrideUrgency) && d.summary.overrideUrgency !== result.computedUrgency
	);
</script>

<Fieldset legend="14. Summary and Sign-off">
	<p class="hint">Recomputed live as you complete the wizard.</p>

	<Panel label="Computed classification">
		<dl class="grid gap-2 sm:grid-cols-2">
			<div>
				<dt class="text-sm text-base-content/70">Hernia type</dt>
				<dd class="font-semibold">{titleCase(result.herniaType) || '—'}</dd>
			</div>
			<div>
				<dt class="text-sm text-base-content/70">EHS subtype</dt>
				<dd class="font-semibold">{titleCase(result.herniaSubtype) || '—'}</dd>
			</div>
			<div>
				<dt class="text-sm text-base-content/70">EHS classification</dt>
				<dd class="font-semibold">{result.ehsClassification || '—'}</dd>
			</div>
			<div>
				<dt class="text-sm text-base-content/70">EHS size grade</dt>
				<dd class="font-semibold">{result.ehsSizeGrade || '—'}</dd>
			</div>
			<div>
				<dt class="text-sm text-base-content/70">Reducibility status</dt>
				<dd class="font-semibold">{titleCase(result.reducibilityStatus) || '—'}</dd>
			</div>
			<div>
				<dt class="text-sm text-base-content/70">Recommendation</dt>
				<dd class="font-semibold">{RECOMMENDATION_LABELS[result.recommendation] ?? '—'}</dd>
			</div>
		</dl>
	</Panel>

	<Alert
		type={URGENCY_ALERT_TYPE[result.finalUrgency] ?? 'info'}
		heading={`Urgency band: ${URGENCY_LABELS[result.finalUrgency]}`}
		class="mt-4"
	>
		{#if result.anyRedFlag}
			At least one red flag is positive. Any positive red flag requires same-day clinical
			escalation regardless of what this software displays.
		{:else if result.finalUrgency === 'urgent'}
			The hernia is irreducible or incarcerated with no red flags currently present.
		{:else if result.finalUrgency === 'soon'}
			Reducible but symptomatic, or European Hernia Society size grade 3.
		{:else}
			Reducible and asymptomatic or mildly symptomatic, with a normal examination.
		{/if}
		{#if isOverridden}
			<br />Computed urgency was {URGENCY_LABELS[result.computedUrgency]}; the clinician recorded
			{URGENCY_LABELS[result.finalUrgency]}.
		{/if}
	</Alert>

	<h3 class="mt-4 text-sm font-semibold">Safety flags</h3>
	{#if result.flags.length === 0}
		<p class="mt-1 text-sm text-base-content/60">None raised.</p>
	{:else}
		<ul class="mt-2 space-y-2 text-sm">
			{#each result.flags as flag (flag.flagId)}
				<li class="rounded border border-base-300 p-2">
					<span class="font-semibold uppercase">{flag.priority}</span>
					<span class="ml-1 font-semibold">{titleCase(flag.category)}</span>
					<p class="mt-1">{flag.description}</p>
					<p class="mt-1 text-base-content/70">{flag.suggestedAction}</p>
				</li>
			{/each}
		</ul>
	{/if}

	<h3 class="mt-4 text-sm font-semibold">Fired rules</h3>
	{#if result.firedRules.length === 0}
		<p class="mt-1 text-sm text-base-content/60">No rules fired.</p>
	{:else}
		<ul class="mt-2 space-y-1 text-sm">
			{#each result.firedRules as fired (fired.ruleId + fired.description)}
				<li><span class="font-mono text-xs">{fired.ruleId}</span> — {fired.description}</li>
			{/each}
		</ul>
	{/if}

	<p class="hint mt-4">
		The override changes the urgency band only. Safety flags are computed independently and are
		always printed, so an override cannot hide a hazard.
	</p>
	<Field label="Override urgency" inputId="summary-overrideUrgency">
		<Select id="summary-overrideUrgency" label="Override urgency" bind:value={d.summary.overrideUrgency}>
			<option value="">— Select —</option>
			{#each OPTIONS.overrideUrgency as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field
		label="Override reason"
		inputId="summary-overrideReason"
		description="Mandatory when the override differs from the computed urgency."
		required={isOverridden}
	>
		<TextInput id="summary-overrideReason" label="Override reason" bind:value={d.summary.overrideReason} required={isOverridden} />
	</Field>
	<Field label="Additional notes" inputId="summary-additionalNotes">
		<TextAreaInput id="summary-additionalNotes" label="Additional notes" rows={3} bind:value={d.summary.additionalNotes} />
	</Field>
	<Field
		label="Signed by (examining clinician)"
		inputId="summary-signedByName"
		description="The examining clinician must sign before the report is final."
		required
	>
		<TextInput id="summary-signedByName" label="Signed by (examining clinician)" bind:value={d.summary.signedByName} required />
	</Field>
</Fieldset>
