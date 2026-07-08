<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the screening record form and the
	// clinician dashboard.
	const plural = 'breast-screenings';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Breast Screening Record</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">NHS breast screening outcome record</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A documentation and result-classification record for a mammography breast screening encounter
			within the NHS Breast Screening Programme, completed as a single continuous wizard. It records
			eligibility, consent, mammogram views, the radiological reading outcome, and — where the woman
			is recalled — a five-point breast imaging classification, then derives the
			<strong>screening outcome and next action</strong>, validates completeness, and raises safety
			flags. This is a classification form: there is no numeric score, and it is not a diagnosis.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/breast-screening/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new record</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step screening record. One continuous single-page wizard that classifies
				the outcome as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/breast-screening/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse screening records with their computed reading outcome, imaging classification,
				screening outcome, and safety-flag counts, and filter by screening unit and outcome band.
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
					Capture the eligibility, mammogram, reading, and assessment fields and produce a
					classified report — an eligibility status, the screening outcome and next action, and
					flagged issues — to support timely screening decisions and referral.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the first-match classification
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from NHS Breast Screening Programme guidance and consolidated standards, the Royal
					College of Radiologists five-point breast imaging classification, and NICE NG101. A
					screening classification, not a diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
