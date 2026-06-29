<script lang="ts">
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';
	import { MARKERS, countSelectedMarkers } from '$lib/engine/markers';

	const d = request.data.markers;
	const count = $derived(countSelectedMarkers(d));
</script>

<Fieldset legend="3. Requested Markers">
	<p class="hint">
		Select one or more serum tumour markers. Marker-to-indication fit drives the appropriateness
		axis.
	</p>

	<!-- Anchor target for the wizard's "select at least one marker" error. -->
	<div id="markers" class="field">
		<p class="hint" aria-live="polite">
			{count === 0
				? 'No markers selected yet — select at least one.'
				: `${count} marker${count === 1 ? '' : 's'} selected.`}
		</p>

		<div class="checkbox-group" role="group" aria-label="Requested serum tumour markers">
			{#each MARKERS as m (m.field)}
				<label class="flex items-start gap-2 rounded-md border border-base-300 p-3" for={`markers-${m.field}`}>
					<CheckboxInput
						id={`markers-${m.field}`}
						label={m.label}
						bind:checked={d[m.field]}
					/>
					<span class="flex flex-col">
						<span class="font-medium text-base-content">{m.label}</span>
						<span class="text-xs text-base-content/60">{m.use}</span>
					</span>
				</label>
			{/each}
		</div>
	</div>
</Fieldset>
