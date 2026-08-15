<script lang="ts">
	import type { Device } from '#lib/engine/types.js';

	let {
		devices = $bindable<Device[]>([])
	}: {
		devices: Device[];
	} = $props();

	function add() {
		devices = [...devices, { description: '', udi: '', implantDate: '' }];
	}
	function remove(index: number) {
		devices = devices.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each devices as device, i (i)}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
				<input type="text" placeholder="Description" bind:value={device.description} class="text-input" />
				<input type="text" placeholder="UDI" bind:value={device.udi} class="text-input" />
				<input type="date" aria-label="Implant date" bind:value={device.implantDate} class="date-input" />
			</div>
			<button type="button" onclick={() => remove(i)} class="mt-1 text-error" aria-label="Remove device">&times;</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={add}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add device / implant
	</button>
</div>
