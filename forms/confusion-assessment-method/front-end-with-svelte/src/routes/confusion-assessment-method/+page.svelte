<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'confusion-assessment-methods';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Confusion Assessment Method
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">CAM bedside delirium screen</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A bedside delirium screening instrument, completed as a single continuous wizard. It records
			four observational features — acute onset and fluctuating course, inattention, disorganised
			thinking, and altered level of consciousness — and applies the validated CAM diagnostic
			algorithm <strong>1 AND 2 AND (3 OR 4)</strong> to classify delirium as present or absent.
			This is a status / classification form: there is no numeric score. A CAM-ICU mode adapts the
			same features for ventilated and non-verbal patients, and records an unable-to-assess result
			for an unrousable patient.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/confusion-assessment-method/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step CAM screen. One continuous single-page wizard that classifies the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/confusion-assessment-method/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed delirium classification and positive features,
				and filter by CAM variant and classification.
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
					Capture the four CAM features and produce a graded report — a present / absent /
					unable-to-assess classification, the positive-feature set, and flagged issues — to support
					timely delirium recognition and management.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the boolean classification
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Inouye et al. (Ann Intern Med 1990), the CAM-ICU validation (Ely et al., JAMA
					2001), and NICE CG103. A screening prompt, not a diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
