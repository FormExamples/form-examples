<script lang="ts">
	import { meeting } from '$lib/stores/meeting.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import type { AgendaItem } from '$lib/engine/types';

	const d = meeting.data;

	function add() {
		d.agenda = [
			...d.agenda,
			{ title: '', durationMinutes: null, presenter: '', notes: '', status: '' } satisfies AgendaItem
		];
	}
	function remove(i: number) {
		d.agenda = d.agenda.filter((_, idx) => idx !== i);
	}
</script>

<Fieldset legend="Agenda">
	<p class="hint">An ordered list of agenda items — title, duration, presenter, and notes.</p>

	<div class="space-y-3">
		{#each d.agenda as item, i (i)}
			<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
				<span class="mt-2 text-sm font-semibold text-base-content/60">{i + 1}</span>
				<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
					<input class="text-input" type="text" placeholder="Title" aria-label="Agenda title" bind:value={item.title} />
					<input class="number-input" type="number" min="0" max="1440" placeholder="Duration (min)" aria-label="Agenda duration minutes" bind:value={item.durationMinutes} />
					<input class="text-input" type="text" placeholder="Presenter" aria-label="Agenda presenter" bind:value={item.presenter} />
					<select class="select" aria-label="Agenda status" bind:value={item.status}>
						<option value="">Status…</option>
						<option value="planned">Planned</option>
						<option value="discussed">Discussed</option>
						<option value="skipped">Skipped</option>
						<option value="deferred">Deferred</option>
					</select>
					<input class="text-input sm:col-span-2" type="text" placeholder="Notes" aria-label="Agenda notes" bind:value={item.notes} />
				</div>
				<button type="button" class="mt-1 text-error" onclick={() => remove(i)} aria-label="Remove agenda item">&times;</button>
			</div>
		{/each}

		<button
			type="button"
			onclick={add}
			class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
		>
			+ Add agenda item
		</button>
	</div>
</Fieldset>
