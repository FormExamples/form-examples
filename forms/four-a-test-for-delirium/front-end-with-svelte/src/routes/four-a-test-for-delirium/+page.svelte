<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'four-a-test-for-deliriums';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			4AT — Rapid Delirium and Cognitive-Impairment Screen
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">4AT bedside delirium screen</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A rapid bedside screen for delirium and possible cognitive impairment, completed as a single
			continuous wizard, that the shared engine scores across four items to assign an interpretation
			band.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/four-a-test-for-delirium/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step 4AT screen. One continuous single-page wizard that scores the patient
				as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/four-a-test-for-delirium/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed 4AT total and interpretation band, and filter
				by setting and delirium flag.
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
					Capture the four 4AT items — alertness, the AMT4 abbreviated mental test, attention (months
					backwards), and acute change or fluctuating course — and produce a graded report: a total
					score of 0 to 12, an interpretation band (4 or more flags possible delirium, 1 to 3 flags
					possible cognitive impairment, and 0 means delirium is unlikely), and flagged issues — to
					support timely delirium recognition.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the sum-of-items scoring
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the 4 'A's Test (the4at.com), Bellelli et al. (Age and Ageing 2014), NICE
					CG103, and SIGN 157. A screening aid, not a diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
