<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import StepNavigation from '$lib/components/StepNavigation.svelte';
	import Step1Organization from '$lib/steps/Step1Organization.svelte';
	import Step2Manifesto from '$lib/steps/Step2Manifesto.svelte';
	import Step3PrinciplesA from '$lib/steps/Step3PrinciplesA.svelte';
	import Step4PrinciplesB from '$lib/steps/Step4PrinciplesB.svelte';
	import Step5PrinciplesC from '$lib/steps/Step5PrinciplesC.svelte';
	import Step6ScoreAndSignoff from '$lib/steps/Step6ScoreAndSignoff.svelte';
</script>

<main class="max-w-3xl mx-auto px-4 py-6">
	<header>
		<h1 class="text-2xl font-bold text-slate-800">Agile Consulting Scorecard for Hiring Help</h1>
		<p class="text-sm text-slate-600 mt-1">
			Sixteen yes/no checkpoints from the Agile Manifesto and Principles. Score yourself and
			see whether you are ready to hire agile consulting help.
		</p>
	</header>

	<ProgressBar />

	<div class="bg-white rounded-lg border border-slate-300 p-5 mt-3">
		{#if assessment.currentStep === 1}
			<Step1Organization />
		{:else if assessment.currentStep === 2}
			<Step2Manifesto />
		{:else if assessment.currentStep === 3}
			<Step3PrinciplesA />
		{:else if assessment.currentStep === 4}
			<Step4PrinciplesB />
		{:else if assessment.currentStep === 5}
			<Step5PrinciplesC />
		{:else if assessment.currentStep === 6}
			<Step6ScoreAndSignoff />
		{/if}

		<StepNavigation />
	</div>

	<div class="mt-4 flex gap-2 flex-wrap">
		<button
			type="button"
			class="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-sm"
			onclick={() => assessment.reset()}
		>
			Reset
		</button>
		<a
			href="/report"
			class="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-sm"
		>
			View report →
		</a>
		<a
			href="/diff"
			class="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-sm"
		>
			Compare with prior snapshot →
		</a>
	</div>
</main>
