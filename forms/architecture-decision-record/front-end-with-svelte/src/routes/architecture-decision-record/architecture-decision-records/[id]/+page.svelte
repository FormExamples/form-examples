<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '$lib/stores/adr.svelte';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAdrs } from '$lib/data/sample-reports';
	import { parseMarkdown } from '$lib/report/parse-markdown.js';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step01 from '$lib/components/steps/Step01Author.svelte';
	import Step02 from '$lib/components/steps/Step02Organization.svelte';
	import Step03 from '$lib/components/steps/Step03Issue.svelte';
	import Step04 from '$lib/components/steps/Step04Decision.svelte';
	import Step05 from '$lib/components/steps/Step05StatusGroup.svelte';
	import Step06 from '$lib/components/steps/Step06Assumptions.svelte';
	import Step07 from '$lib/components/steps/Step07Constraints.svelte';
	import Step08 from '$lib/components/steps/Step08Positions.svelte';
	import Step09 from '$lib/components/steps/Step09Argument.svelte';
	import Step10 from '$lib/components/steps/Step10Implications.svelte';
	import Step11 from '$lib/components/steps/Step11RelatedDecisions.svelte';
	import Step12 from '$lib/components/steps/Step12RelatedRequirements.svelte';
	import Step13 from '$lib/components/steps/Step13RelatedArtifacts.svelte';
	import Step14 from '$lib/components/steps/Step14RelatedPrinciples.svelte';
	import Step15 from '$lib/components/steps/Step15Notes.svelte';
	import Step16 from '$lib/components/steps/Step16Summary.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample (existing id) or a blank draft.
	$effect(() => {
		const seed = sampleAdrs.find((s) => s.id === id)?.data;
		if (store.id !== id) {
			store.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = store.data;
		const found: { id: string; message: string }[] = [];
		if (d.adr.title.trim() === '') {
			found.push({ id: 'adr-title', message: 'A title is required.' });
		}
		if (d.adr.decision.trim() === '') {
			found.push({ id: 'adr-decision', message: 'A decision statement is required.' });
		}
		if (d.author.name.trim() === '') {
			found.push({ id: 'author-name', message: 'An author name is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		store.evaluate();
		goto(`/architecture-decision-record/architecture-decision-records/${id}/report`);
	}

	function startOver() {
		const seed = sampleAdrs.find((s) => s.id === id)?.data;
		store.reset();
		store.loadForId(id, seed);
		errors = [];
	}

	async function onImport(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const text = await file.text();
		const parsed = parseMarkdown(text);
		if (!parsed.adr.title.trim()) {
			alert('Could not parse Markdown — no "# title" heading found.');
			input.value = '';
			return;
		}
		if (!confirm(`Replace the current draft with the contents of ${file.name}?`)) {
			input.value = '';
			return;
		}
		store.replace(parsed);
		input.value = '';
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New architecture decision record' : `Architecture decision record ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the sixteen sections of the Tyree &amp; Akerman template; completeness and flags are
		computed on submit, and the report renders a commit-ready Markdown ADR.
	</p>
	<Progress label="Record sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Record sections" current={TOTAL_STEPS}>
		{#each steps as step (step.number)}
			<StepListItem status="finished" label={step.title}>{step.shortTitle}</StepListItem>
		{/each}
	</StepList>

	{#if errors.length > 0}
		<ErrorSummary title="Please fix the following before submitting" class="mb-6">
			<ul>
				{#each errors as e (e.id)}
					<li><a href={`#${e.id}`}>{e.message}</a></li>
				{/each}
			</ul>
		</ErrorSummary>
	{/if}

	<Form label="Architecture decision record" onsubmit={submit}>
		<Step01 />
		<Step02 />
		<Step03 />
		<Step04 />
		<Step05 />
		<Step06 />
		<Step07 />
		<Step08 />
		<Step09 />
		<Step10 />
		<Step11 />
		<Step12 />
		<Step13 />
		<Step14 />
		<Step15 />
		<Step16 />

		<div class="button-group mt-6 flex flex-wrap items-center gap-3">
			<Button type="submit" data-variant="primary">Evaluate &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
			<label
				for="import-input"
				class="cursor-pointer rounded-md border border-base-300 bg-base-100 px-3 py-2 text-sm hover:bg-base-200"
			>
				Import .md
			</label>
			<input
				type="file"
				id="import-input"
				accept=".md,text/markdown,text/plain"
				class="hidden"
				onchange={onImport}
			/>
		</div>
	</Form>
</main>
