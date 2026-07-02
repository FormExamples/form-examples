<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'alcohol-use-disorders-identification-test-consumptions';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Alcohol Use Disorders Identification Test — Consumption
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">AUDIT-C brief alcohol screen</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A brief three-item alcohol screen for adults, completed as a single continuous wizard. The
			three consumption items — frequency of drinking, typical quantity in UK units, and frequency
			of heavy episodic drinking — each score 0 to 4 for a total of 0 to 12. The shared engine sums
			the score, derives the risk band, and flags a total of &ge; 5 as a positive screen that
			prompts the full 10-item AUDIT and a brief intervention. It is not a diagnostic test for
			alcohol dependence.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step AUDIT-C screen. One continuous single-page wizard that scores the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed AUDIT-C score and risk band, and filter by care
				setting and positive screen.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-base-content">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-base-content">Purpose</dt>
				<dd class="mt-1 text-base-content/70">
					Capture the three AUDIT-C consumption items and produce a graded report — score 0-12,
					risk band, and flagged issues — to support timely brief intervention and referral.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the additive scoring engine,
					and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the WHO AUDIT and its three-item AUDIT-C consumption subset (Bush et al., Arch
					Intern Med 1998) and UK NICE guidance. A screening prompt, not a diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
