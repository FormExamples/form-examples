<script lang="ts">
	import type { FollowupAppointment } from '$lib/engine/types';

	let {
		appointments = $bindable<FollowupAppointment[]>([])
	}: {
		appointments: FollowupAppointment[];
	} = $props();

	function addAppointment() {
		appointments = [...appointments, { provider: '', date: '', location: '', purpose: '' }];
	}

	function removeAppointment(index: number) {
		appointments = appointments.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each appointments as appt, i (i)}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
				<input
					type="text"
					placeholder="Provider / clinic"
					aria-label="Provider or clinic"
					bind:value={appt.provider}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="date"
					aria-label="Appointment date"
					bind:value={appt.date}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Location"
					aria-label="Location"
					bind:value={appt.location}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Purpose"
					aria-label="Purpose"
					bind:value={appt.purpose}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			<button
				type="button"
				onclick={() => removeAppointment(i)}
				class="mt-1 text-error hover:text-error"
				aria-label="Remove appointment"
			>
				&times;
			</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={addAppointment}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add follow-up appointment
	</button>
</div>
