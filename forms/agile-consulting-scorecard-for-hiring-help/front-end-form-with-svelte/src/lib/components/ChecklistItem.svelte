<script lang="ts">
	import type { ChecklistItem as ChecklistItemType } from '$lib/engine/types';

	let {
		item = $bindable(),
		heading,
		prompt,
		name,
	}: { item: ChecklistItemType; heading: string; prompt: string; name: string } = $props();
</script>

<div class="mt-4">
	<h3 class="text-base font-semibold text-slate-800">{heading}</h3>
	<p class="text-sm text-slate-600 mt-1">{prompt}</p>

	<div class="flex flex-wrap gap-4 mt-2" role="radiogroup" aria-label={heading}>
		<label class="inline-flex items-center gap-1.5">
			<input
				type="radio"
				{name}
				checked={item.done === true}
				onchange={() => (item.done = true)}
			/>
			Yes
		</label>
		<label class="inline-flex items-center gap-1.5">
			<input
				type="radio"
				{name}
				checked={item.done === false}
				onchange={() => (item.done = false)}
			/>
			No
		</label>
		<label class="inline-flex items-center gap-1.5">
			<input
				type="radio"
				{name}
				checked={item.done === null}
				onchange={() => (item.done = null)}
			/>
			Unanswered
		</label>
	</div>

	<label class="block text-xs text-slate-500 mt-2">
		Evidence (optional)
		<textarea
			class="w-full mt-1 rounded border border-slate-300 p-1.5 text-sm"
			rows="2"
			bind:value={item.evidence}
		></textarea>
	</label>
</div>
