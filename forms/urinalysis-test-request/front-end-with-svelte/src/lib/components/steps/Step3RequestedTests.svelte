<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { requestStore } from '$lib/stores/request.svelte';
	import { TESTS } from '$lib/engine/defaults';
	import { countSelectedTests } from '$lib/engine/utils';

	const d = requestStore.data.tests;
	const count = $derived(countSelectedTests(requestStore.data.tests));
</script>

<Fieldset legend="3. Requested Tests">
	<p class="hint">Tick every urine test to order. At least one is required.</p>

	<Field label="Requested tests" inputId="tests" required>
		<span id="tests" class="hint">
			{count === 0 ? 'No tests selected yet — select at least one.' : `${count} test${count === 1 ? '' : 's'} selected.`}
		</span>
		<CheckboxGroup label="Requested tests">
			{#each TESTS as t (t.field)}
				<label>
					<CheckboxInput label={t.label} bind:checked={d[t.field]} />
					{t.label}
					{#if t.tag}
						<span class="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">{t.tag}</span>
					{/if}
				</label>
			{/each}
		</CheckboxGroup>
	</Field>
</Fieldset>
