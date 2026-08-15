<script lang="ts">
	import { meeting } from '#lib/stores/meeting.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import type { ActionItem, OutputItem, OutcomeItem } from '#lib/engine/types.js';

	const d = meeting.data.results;

	function addAction() {
		d.actionItems = [
			...d.actionItems,
			{ title: '', ownerName: '', dueDate: '', priority: '', status: 'open' } satisfies ActionItem
		];
	}
	function removeAction(i: number) {
		d.actionItems = d.actionItems.filter((_, idx) => idx !== i);
	}
	function addOutput() {
		d.outputs = [
			...d.outputs,
			{ title: '', kind: '', url: '', ownerName: '' } satisfies OutputItem
		];
	}
	function removeOutput(i: number) {
		d.outputs = d.outputs.filter((_, idx) => idx !== i);
	}
	function addOutcome() {
		d.outcomes = [
			...d.outcomes,
			{ title: '', category: '', impact: '', description: '' } satisfies OutcomeItem
		];
	}
	function removeOutcome(i: number) {
		d.outcomes = d.outcomes.filter((_, idx) => idx !== i);
	}
</script>

<Fieldset legend="Action items">
	<p class="hint">Tasks assigned to a named owner with a due date and status.</p>
	<div class="space-y-3">
		{#each d.actionItems as a, i (i)}
			<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
				<span class="mt-2 text-sm font-semibold text-base-content/60">{i + 1}</span>
				<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
					<input class="text-input" type="text" placeholder="Title" aria-label="Action title" bind:value={a.title} />
					<input class="text-input" type="text" placeholder="Owner" aria-label="Action owner" bind:value={a.ownerName} />
					<input class="date-input" type="date" aria-label="Action due date" bind:value={a.dueDate} />
					<select class="select" aria-label="Action priority" bind:value={a.priority}>
						<option value="">Priority…</option>
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
						<option value="urgent">Urgent</option>
					</select>
					<select class="select sm:col-span-2" aria-label="Action status" bind:value={a.status}>
						<option value="open">Open</option>
						<option value="in-progress">In progress</option>
						<option value="blocked">Blocked</option>
						<option value="done">Done</option>
						<option value="cancelled">Cancelled</option>
					</select>
				</div>
				<button type="button" class="mt-1 text-error" onclick={() => removeAction(i)} aria-label="Remove action item">&times;</button>
			</div>
		{/each}
		<button type="button" onclick={addAction} class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary">+ Add action item</button>
	</div>
</Fieldset>

<Fieldset legend="Outputs">
	<p class="hint">Tangible deliverables produced — documents, decisions, data, recordings.</p>
	<div class="space-y-3">
		{#each d.outputs as o, i (i)}
			<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
				<span class="mt-2 text-sm font-semibold text-base-content/60">{i + 1}</span>
				<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
					<input class="text-input" type="text" placeholder="Title" aria-label="Output title" bind:value={o.title} />
					<select class="select" aria-label="Output kind" bind:value={o.kind}>
						<option value="">Kind…</option>
						<option value="document">Document</option>
						<option value="decision">Decision</option>
						<option value="data">Data</option>
						<option value="recording">Recording</option>
						<option value="minutes">Minutes</option>
						<option value="slides">Slides</option>
						<option value="agreement">Agreement</option>
						<option value="other">Other</option>
					</select>
					<input class="text-input" type="url" placeholder="URL" aria-label="Output URL" bind:value={o.url} />
					<input class="text-input" type="text" placeholder="Owner" aria-label="Output owner" bind:value={o.ownerName} />
				</div>
				<button type="button" class="mt-1 text-error" onclick={() => removeOutput(i)} aria-label="Remove output">&times;</button>
			</div>
		{/each}
		<button type="button" onclick={addOutput} class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary">+ Add output</button>
	</div>
</Fieldset>

<Fieldset legend="Outcomes">
	<p class="hint">The impact or change resulting from the meeting.</p>
	<div class="space-y-3">
		{#each d.outcomes as oc, i (i)}
			<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
				<span class="mt-2 text-sm font-semibold text-base-content/60">{i + 1}</span>
				<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
					<input class="text-input" type="text" placeholder="Title" aria-label="Outcome title" bind:value={oc.title} />
					<select class="select" aria-label="Outcome category" bind:value={oc.category}>
						<option value="">Category…</option>
						<option value="goal-reached">Goal reached</option>
						<option value="risk-identified">Risk identified</option>
						<option value="risk-mitigated">Risk mitigated</option>
						<option value="alignment-achieved">Alignment achieved</option>
						<option value="decision">Decision</option>
						<option value="blocker-cleared">Blocker cleared</option>
						<option value="blocker-raised">Blocker raised</option>
						<option value="commitment">Commitment</option>
						<option value="no-outcome">No outcome</option>
						<option value="other">Other</option>
					</select>
					<select class="select" aria-label="Outcome impact" bind:value={oc.impact}>
						<option value="">Impact…</option>
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
						<option value="strategic">Strategic</option>
					</select>
					<input class="text-input sm:col-span-2" type="text" placeholder="Description" aria-label="Outcome description" bind:value={oc.description} />
				</div>
				<button type="button" class="mt-1 text-error" onclick={() => removeOutcome(i)} aria-label="Remove outcome">&times;</button>
			</div>
		{/each}
		<button type="button" onclick={addOutcome} class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary">+ Add outcome</button>
	</div>
</Fieldset>
