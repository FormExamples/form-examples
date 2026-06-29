<script lang="ts">
	let {
		symptoms = $bindable<string[]>([])
	}: {
		symptoms: string[];
	} = $props();

	function addSymptom() {
		symptoms = [...symptoms, ''];
	}

	function removeSymptom(index: number) {
		symptoms = symptoms.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each symptoms as _symptom, i (i)}
		<div class="flex items-center gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<input
				type="text"
				placeholder="e.g. Worsening shortness of breath"
				aria-label="Red-flag symptom"
				bind:value={symptoms[i]}
				class="flex-1 rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
			/>
			<button
				type="button"
				onclick={() => removeSymptom(i)}
				class="text-error hover:text-error"
				aria-label="Remove red-flag symptom"
			>
				&times;
			</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={addSymptom}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add red-flag symptom
	</button>
</div>
