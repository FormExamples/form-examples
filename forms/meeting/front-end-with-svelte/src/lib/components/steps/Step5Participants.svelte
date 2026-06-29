<script lang="ts">
	import { meeting } from '$lib/stores/meeting.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import type { Participant } from '$lib/engine/types';

	const d = meeting.data;

	function add() {
		d.participants = [
			...d.participants,
			{ name: '', email: '', role: '', responseStatus: '', attendanceStatus: '' } satisfies Participant
		];
	}
	function remove(i: number) {
		d.participants = d.participants.filter((_, idx) => idx !== i);
	}
</script>

<Fieldset legend="Participants">
	<p class="hint">Named attendees with their role, response, and attendance status.</p>

	<div class="space-y-3">
		{#each d.participants as p, i (i)}
			<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
				<span class="mt-2 text-sm font-semibold text-base-content/60">{i + 1}</span>
				<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
					<input class="text-input" type="text" placeholder="Name" aria-label="Participant name" bind:value={p.name} />
					<input class="text-input" type="email" placeholder="Email" aria-label="Participant email" bind:value={p.email} />
					<select class="select" aria-label="Participant role" bind:value={p.role}>
						<option value="">Role…</option>
						<option value="organizer">Organizer</option>
						<option value="chair">Chair</option>
						<option value="required">Required</option>
						<option value="optional">Optional</option>
						<option value="observer">Observer</option>
						<option value="presenter">Presenter</option>
						<option value="note-taker">Note-taker</option>
					</select>
					<select class="select" aria-label="Participant response" bind:value={p.responseStatus}>
						<option value="">Response…</option>
						<option value="no-response">No response</option>
						<option value="accepted">Accepted</option>
						<option value="declined">Declined</option>
						<option value="tentative">Tentative</option>
						<option value="delegated">Delegated</option>
					</select>
					<select class="select sm:col-span-2" aria-label="Participant attendance" bind:value={p.attendanceStatus}>
						<option value="">Attendance…</option>
						<option value="present">Present</option>
						<option value="late">Late</option>
						<option value="absent">Absent</option>
						<option value="partial">Partial</option>
						<option value="remote">Remote</option>
						<option value="unknown">Unknown</option>
					</select>
				</div>
				<button type="button" class="mt-1 text-error" onclick={() => remove(i)} aria-label="Remove participant">&times;</button>
			</div>
		{/each}

		<button
			type="button"
			onclick={add}
			class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
		>
			+ Add participant
		</button>
	</div>
</Fieldset>
