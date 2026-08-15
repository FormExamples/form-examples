<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';
	import { ASSAYS } from '#lib/engine/defaults.js';
	import { countSelectedAssays } from '#lib/engine/utils.js';

	const assays = request.data.assays;
	const count = $derived(countSelectedAssays(assays));
</script>

<Fieldset legend="3. Requested Assays">
	<p class="hint">
		Tick every assay to order. At least one is required. Timing-critical assays (paracetamol) depend
		on accurate ingestion timing.
	</p>

	<Field label="Requested assays" inputId="assays" required>
		<p class="hint" id="assays-count">
			{count === 0
				? 'No assays selected yet — select at least one.'
				: `${count} assay${count === 1 ? '' : 's'} selected.`}
		</p>
		<CheckboxGroup label="Requested assays">
			{#each ASSAYS as a (a.field)}
				<label>
					<CheckboxInput
						id={`assay-${a.field}`}
						label={a.label}
						bind:checked={assays[a.field]}
					/>
					<span>
						{a.label}
						{#if a.critical}
							<span class="text-xs font-semibold text-warning">timing-critical</span>
						{/if}
						{#if a.note}
							<span class="text-xs text-base-content/60">— {a.note}</span>
						{/if}
					</span>
				</label>
			{/each}
		</CheckboxGroup>
	</Field>
</Fieldset>
