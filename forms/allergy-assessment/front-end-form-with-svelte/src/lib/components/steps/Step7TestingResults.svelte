<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const t = assessment.data.testingResults;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	type TestKey =
		| 'skinPrickTestsDone'
		| 'specificIgEDone'
		| 'componentResolvedDiagnosticsDone'
		| 'challengeTestsDone'
		| 'patchTestsDone';

	const testRadios: { key: TestKey; label: string; name: string }[] = [
		{ key: 'skinPrickTestsDone', label: 'Skin prick tests done?', name: 'skinPrick' },
		{ key: 'specificIgEDone', label: 'Specific IgE levels done?', name: 'specificIgE' },
		{ key: 'componentResolvedDiagnosticsDone', label: 'Component-resolved diagnostics done?', name: 'crd' },
		{ key: 'challengeTestsDone', label: 'Challenge tests done?', name: 'challenge' },
		{ key: 'patchTestsDone', label: 'Patch tests done?', name: 'patch' }
	];

	function addTestResult() {
		t.testResults = [...t.testResults, { testType: '', allergen: '', result: '' }];
	}

	function removeTestResult(index: number) {
		t.testResults = t.testResults.filter((_, i) => i !== index);
	}
</script>

<Fieldset legend="Testing Results">
	<p class="hint">Skin prick tests, IgE levels, challenge tests, and patch tests.</p>

	{#each testRadios as r (r.key)}
		<Field label={r.label}>
			<RadioGroup label={r.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={r.name} value={opt.value} bind:group={t[r.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Test results">
		<div class="result-list">
			{#each t.testResults as result, i (i)}
				<div class="result-row">
					<div class="result-fields">
						<input
							type="text"
							class="text-input"
							placeholder="Test type"
							aria-label="Test type"
							bind:value={result.testType}
						/>
						<input
							type="text"
							class="text-input"
							placeholder="Allergen"
							aria-label="Allergen"
							bind:value={result.allergen}
						/>
						<input
							type="text"
							class="text-input"
							placeholder="Result"
							aria-label="Result"
							bind:value={result.result}
						/>
					</div>
					<button
						type="button"
						class="button"
						data-variant="danger"
						onclick={() => removeTestResult(i)}
						aria-label="Remove test result"
					>×</button>
				</div>
			{/each}

			<button type="button" class="button" onclick={addTestResult}>+ Add Test Result</button>
		</div>
	</Field>
</Fieldset>

<style>
	.result-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.result-row {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
	}
	.result-fields {
		flex: 1;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.5rem;
	}
	@media (max-width: 640px) {
		.result-fields { grid-template-columns: 1fr; }
	}
</style>
