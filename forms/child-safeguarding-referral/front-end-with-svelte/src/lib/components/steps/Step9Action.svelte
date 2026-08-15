<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateSafeguardingGrade } from '#lib/engine/child-safeguarding-grader.js';
	import { statusLabel, statusColor, urgencyLabel, urgencyColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const a = assessment.data.action;
	const grade = $derived(calculateSafeguardingGrade(assessment.data));
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 9 of 9 — Requested action and summary">
	<p class="hint">
		What you are asking children’s social care to do, the live status and urgency, and your
		declaration.
	</p>

	<Field label="Action requested of children’s social care" inputId="action-requestedAction">
		<TextAreaInput
			id="action-requestedAction"
			label="Action requested of children’s social care"
			rows={3}
			placeholder="e.g. Assessment under s17; strategy discussion; s47 enquiry."
			bind:value={a.requestedAction}
		/>
	</Field>

	<Field label="Live status and urgency">
		<span class="inline-flex flex-wrap items-center gap-3">
			<Badge label={statusLabel(grade.status)} colorClass={statusColor(grade.status)} />
			<Badge label={urgencyLabel(grade.urgency)} colorClass={urgencyColor(grade.urgency)} />
			<strong class="text-base text-base-content">{grade.completenessPercent}% complete</strong>
			<span class="text-sm text-base-content/70">
				{grade.satisfiedCount} of {grade.mandatoryCount} mandatory requirements met
			</span>
		</span>
	</Field>

	<Field
		label="I confirm the information in this referral is accurate to the best of my knowledge"
	>
		<RadioGroup label="I confirm the information in this referral is accurate to the best of my knowledge">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="action-referrerDeclaration"
						value={opt.value}
						bind:group={a.referrerDeclaration}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Free-text notes" inputId="action-notes">
		<TextAreaInput
			id="action-notes"
			label="Free-text notes"
			rows={3}
			placeholder="Anything else the duty team should know."
			bind:value={a.notes}
		/>
	</Field>
</Fieldset>
