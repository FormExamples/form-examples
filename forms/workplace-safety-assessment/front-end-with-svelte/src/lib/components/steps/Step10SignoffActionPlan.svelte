<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import YesNoNA from '#lib/components/ui/YesNoNA.svelte';
	import type { ActionPlanItem } from '#lib/engine/types.js';

	const d = assessment.data.signoffActionPlan;

	function addActionItem() {
		const item: ActionPlanItem = { description: '', owner: '', dueDate: '', priority: '' };
		d.actionItems = [...d.actionItems, item];
	}

	function removeActionItem(index: number) {
		d.actionItems = d.actionItems.filter((_, i) => i !== index);
	}
</script>

<Fieldset legend="Sign-off & Action Plan">
	<p class="hint">Record corrective actions, summarise the audit, and sign off.</p>

	<div class="action-list">
		{#each d.actionItems as item, index (index)}
			<div class="action-item">
				<div class="action-grid">
					<Field label="Description" inputId={`action-${index}-description`} class="action-desc">
						<TextAreaInput
							id={`action-${index}-description`}
							label="Action description"
							rows={2}
							placeholder="What corrective action is required?"
							bind:value={item.description}
						/>
					</Field>
					<Field label="Owner" inputId={`action-${index}-owner`}>
						<TextInput id={`action-${index}-owner`} label="Owner" placeholder="Named individual or role" bind:value={item.owner} />
					</Field>
					<Field label="Due date" inputId={`action-${index}-dueDate`}>
						<DateInput id={`action-${index}-dueDate`} label="Due date" bind:value={item.dueDate} />
					</Field>
					<Field label="Priority" inputId={`action-${index}-priority`}>
						<Select id={`action-${index}-priority`} label="Priority" bind:value={item.priority}>
							<option value="">— Priority —</option>
							<option value="critical">Critical — immediate</option>
							<option value="major">Major — within 30 days</option>
							<option value="minor">Minor — within 90 days</option>
						</Select>
					</Field>
				</div>
				<div class="action-actions">
					<Button data-variant="danger" onclick={() => removeActionItem(index)} label="Remove action item">Remove</Button>
				</div>
			</div>
		{/each}
	</div>

	<Button data-variant="secondary" onclick={addActionItem}>Add action item</Button>

	<Field label="Overall summary" inputId="overallSummary">
		<TextAreaInput id="overallSummary" label="Overall summary" rows={3} placeholder="Headline conclusions and priorities for the site." bind:value={d.overallSummary} />
	</Field>

	<div class="field-grid">
		<Field label="Auditor signature" inputId="auditorSignature">
			<TextInput id="auditorSignature" label="Auditor signature" bind:value={d.auditorSignature} />
		</Field>
		<Field label="Sign-off date" inputId="signoffDate">
			<DateInput id="signoffDate" label="Sign-off date" bind:value={d.signoffDate} />
		</Field>
	</div>

	<YesNoNA id="debriefDelivered" label="Findings have been debriefed with the site manager." bind:value={d.debriefDelivered} />
</Fieldset>

<style>
	.action-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	.action-item {
		border: 1px solid var(--color-base-300, #d1d5db);
		border-radius: 0.5rem;
		padding: 1rem;
	}
	.action-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.action-grid :global(.action-desc) {
		grid-column: 1 / -1;
	}
	.action-actions {
		margin-top: 0.75rem;
		display: flex;
		justify-content: flex-end;
	}
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.action-grid,
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
