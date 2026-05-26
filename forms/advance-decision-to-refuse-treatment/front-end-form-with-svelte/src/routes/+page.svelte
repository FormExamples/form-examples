<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	function startAssessment() {
		assessment.reset();
		goto('/assessment');
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
	<div class="w-full max-w-lg text-center">
		<div class="mb-8">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
			>
				<svg
					class="h-8 w-8 text-primary"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
			</div>
			<h1 class="text-3xl font-bold text-gray-900">Advance Decision to Refuse Treatment</h1>
			<p class="mt-1 text-sm font-medium text-primary">(ADRT)</p>
			<p class="mt-3 text-gray-600">
				This is a legally binding document under the UK Mental Capacity Act 2005. An ADRT allows you
				to refuse specific medical treatments in advance, for a time when you may lack the mental
				capacity to make or communicate those decisions.
			</p>
		</div>

		<Panel label="What to expect" class="text-left">
			<h2 class="mb-3 font-semibold text-gray-900">What to expect</h2>
			<ul class="space-y-2 text-sm text-gray-600">
				<li class="flex items-start gap-2">
					<span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
					10 sections covering your personal details, treatment refusals, and legal requirements
				</li>
				<li class="flex items-start gap-2">
					<span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
					Takes approximately 20-30 minutes to complete carefully
				</li>
				<li class="flex items-start gap-2">
					<span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
					You can navigate back to change answers at any time
				</li>
				<li class="flex items-start gap-2">
					<span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
					A formal legal document will be generated for signing and witnessing
				</li>
			</ul>
		</Panel>

		<Alert type="error" heading="Important Legal Information">
			<ul class="mt-2 list-disc space-y-1 pl-5">
				<li>This is different from an advance statement (which records wishes and preferences)</li>
				<li>An ADRT is a <strong>legal refusal</strong> of specific treatments</li>
				<li>
					If it relates to life-sustaining treatment, it <strong>must</strong> be written, signed, and
					witnessed
				</li>
				<li>
					You should discuss your wishes with your GP, family, and any relevant healthcare
					professionals
				</li>
			</ul>
		</Alert>

		<div class="button-group justify-center">
			<Button data-variant="primary" onclick={startAssessment}>Begin ADRT</Button>
		</div>

		<p class="mt-4 text-xs text-gray-400">
			This tool generates a document for legal and clinical purposes. It must be reviewed, signed,
			and witnessed to become legally valid.
		</p>
	</div>
</div>
