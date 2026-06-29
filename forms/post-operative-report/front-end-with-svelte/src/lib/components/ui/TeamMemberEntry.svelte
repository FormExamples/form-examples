<script lang="ts">
	import type { TeamMember } from '$lib/engine/types';

	let {
		members = $bindable<TeamMember[]>([])
	}: {
		members: TeamMember[];
	} = $props();

	function addMember() {
		members = [...members, { name: '', role: '', grade: '' }];
	}

	function removeMember(index: number) {
		members = members.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each members as member, i}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
				<input
					type="text"
					placeholder="Name"
					bind:value={member.name}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Role"
					bind:value={member.role}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Grade"
					bind:value={member.grade}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			<button
				type="button"
				onclick={() => removeMember(i)}
				class="mt-1 text-error hover:text-error"
				aria-label="Remove team member"
			>
				&times;
			</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={addMember}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add team member
	</button>
</div>
