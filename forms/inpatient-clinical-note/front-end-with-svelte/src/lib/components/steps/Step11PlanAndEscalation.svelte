<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import RowCard from '$lib/components/ui/RowCard.svelte';
	import * as options from '$lib/config/options';
	import { TOTAL_STEPS } from '$lib/config/steps';
	import { emptyJobRow } from '$lib/engine/types';

	const s = assessment.data.planning;

	function add() {
		s.jobs.push(emptyJobRow());
	}

	function remove(index: number) {
		s.jobs.splice(index, 1);
	}
</script>

<Fieldset legend={`Step 11 of ${TOTAL_STEPS} — Plan, jobs and escalation`}>
	<p class="hint">
		What happens next, and the limits of treatment. Required components: a plan (narrative or at
		least one job), and an escalation status with a ceiling of care.
	</p>

	<Field
		label="Management plan"
		description="A plan or at least one job below documents this component."
		inputId="planning-plan"
	>
		<TextAreaInput
			id="planning-plan"
			label="Management plan"
			rows={4}
			placeholder="e.g. Continue IV co-amoxiclav, day 3 of 5. Repeat bloods in the morning."
			bind:value={s.plan}
		/>
	</Field>

	<p class="label">Jobs ({s.jobs.length})</p>
	{#if s.jobs.length === 0}
		<p class="hint">No jobs added yet.</p>
	{/if}

	{#each s.jobs as row, i (i)}
		<RowCard title="Job" index={i} onRemove={() => remove(i)}>
			<Field label="Job" inputId={`planning-jobs-${i}-job`}>
				<TextInput
					id={`planning-jobs-${i}-job`}
					label="Job"
					placeholder="e.g. Chase the blood-culture result"
					bind:value={row.job}
				/>
			</Field>

			<Field label="Category" inputId={`planning-jobs-${i}-category`}>
				<Select id={`planning-jobs-${i}-category`} label="Category" bind:value={row.category}>
					<option value="">— Select —</option>
					{#each options.jobCategory as o (o.value)}
						<option value={o.value}>{o.label}</option>
					{/each}
				</Select>
			</Field>

			<Field label="Owner" inputId={`planning-jobs-${i}-owner`}>
				<TextInput
					id={`planning-jobs-${i}-owner`}
					label="Owner"
					placeholder="Person or team responsible"
					bind:value={row.owner}
				/>
			</Field>

			<Field label="Priority" inputId={`planning-jobs-${i}-priority`}>
				<Select id={`planning-jobs-${i}-priority`} label="Priority" bind:value={row.priority}>
					<option value="">— Select —</option>
					{#each options.priority as o (o.value)}
						<option value={o.value}>{o.label}</option>
					{/each}
				</Select>
			</Field>

			<Field label="Due by" inputId={`planning-jobs-${i}-dueAt`}>
				<TextInput
					id={`planning-jobs-${i}-dueAt`}
					label="Due by"
					type="datetime-local"
					class="date-input"
					bind:value={row.dueAt}
				/>
			</Field>

			<Field label="Status" inputId={`planning-jobs-${i}-status`}>
				<Select id={`planning-jobs-${i}-status`} label="Status" bind:value={row.status}>
					<option value="">— Select —</option>
					{#each options.jobStatus as o (o.value)}
						<option value={o.value}>{o.label}</option>
					{/each}
				</Select>
			</Field>
		</RowCard>
	{/each}

	<Button data-variant="secondary" onclick={add}>Add a job</Button>

	<Field label="Escalation status" inputId="planning-escalationStatus">
		<Select id="planning-escalationStatus" label="Escalation status" bind:value={s.escalationStatus}>
			<option value="">— Select —</option>
			{#each options.escalationStatus as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field
		label="Escalation action taken"
		description="Leaving this blank at an Escalate or Critical acuity band raises a high-priority flag."
		inputId="planning-escalationAction"
	>
		<TextAreaInput
			id="planning-escalationAction"
			label="Escalation action taken"
			rows={2}
			placeholder="e.g. Discussed with the medical registrar at 14:20."
			bind:value={s.escalationAction}
		/>
	</Field>

	<Field
		label="Ceiling of care"
		description="Required alongside the escalation status to document this component."
		inputId="planning-ceilingOfCare"
	>
		<Select id="planning-ceilingOfCare" label="Ceiling of care" bind:value={s.ceilingOfCare}>
			<option value="">— Select —</option>
			{#each options.ceilingOfCare as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="ReSPECT plan" inputId="planning-respectStatus">
		<Select id="planning-respectStatus" label="ReSPECT plan" bind:value={s.respectStatus}>
			<option value="">— Select —</option>
			{#each options.respectStatus as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Resuscitation status" inputId="planning-dnacprStatus">
		<Select id="planning-dnacprStatus" label="Resuscitation status" bind:value={s.dnacprStatus}>
			<option value="">— Select —</option>
			{#each options.dnacprStatus as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Senior review needed?" inputId="planning-seniorReviewNeeded">
		<Select id="planning-seniorReviewNeeded" label="Senior review needed?" bind:value={s.seniorReviewNeeded}>
			<option value="">— Select —</option>
			{#each options.yesNo as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Senior reviewer" inputId="planning-seniorReviewBy">
		<TextInput
			id="planning-seniorReviewBy"
			label="Senior reviewer"
			placeholder="Name and grade of the senior who reviewed"
			bind:value={s.seniorReviewBy}
		/>
	</Field>

	<Field label="Estimated discharge date" inputId="planning-estimatedDischargeDate">
		<DateInput
			id="planning-estimatedDischargeDate"
			label="Estimated discharge date"
			bind:value={s.estimatedDischargeDate}
		/>
	</Field>

	<Field label="Discharge-planning notes" inputId="planning-dischargePlanningNotes">
		<TextAreaInput
			id="planning-dischargePlanningNotes"
			label="Discharge-planning notes"
			rows={3}
			placeholder="Destination, package of care, equipment, and outstanding blockers."
			bind:value={s.dischargePlanningNotes}
		/>
	</Field>
</Fieldset>
