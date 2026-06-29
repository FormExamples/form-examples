<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';
	import { TESTS, countSelectedTests } from '$lib/engine/defaults';

	const t = request.data.tests;
	const count = $derived(countSelectedTests(t));
</script>

<Fieldset legend="3. Requested Tests">
	<p class="hint">Select one or more coagulation tests. At least one is required.</p>

	<Field label="Requested coagulation tests" required>
		<p class="hint" id="tests-count">
			{count === 0
				? 'No tests selected yet — select at least one.'
				: `${count} test${count === 1 ? '' : 's'} selected.`}
		</p>
		<CheckboxGroup label="Requested coagulation tests" id="tests">
			{#each TESTS as test (test.field)}
				<label>
					<CheckboxInput
						label={test.label}
						id={`tests-${test.field}`}
						bind:checked={t[test.field]}
					/>
					<span class="font-medium">{test.label}</span>
					<span class="block text-xs text-base-content/60">{test.hint}</span>
				</label>
			{/each}
		</CheckboxGroup>
	</Field>
</Fieldset>
