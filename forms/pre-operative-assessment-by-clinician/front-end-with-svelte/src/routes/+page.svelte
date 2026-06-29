<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the clinician assessment wizard and the
	// review dashboard. The collection routes
	// (`/pre-operative-assessments-by-clinician` and `…/new`) hold the actual
	// functionality.
	const plural = 'pre-operative-assessments-by-clinician';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Pre-operative Assessment by Clinician
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Clinician pre-operative assessment</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A clinician-driven pre-operative evaluation completed as a single continuous wizard across 16
			body-system sections: clinician and patient identification, planned procedure, vitals, airway,
			cardiovascular, respiratory, neurological, renal/hepatic, haematology, endocrine,
			gastrointestinal, musculoskeletal, medications and allergies, functional capacity, anaesthesia
			plan, and sign-off. The shared engine computes the ASA Physical Status grade plus Mallampati,
			RCRI, STOP-BANG, and Clinical Frailty Scale, derives a composite perioperative risk, and raises
			safety flags for the anaesthetist.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step clinician wizard. One continuous single-page form that computes the ASA
				grade and composite risk as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician review dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed ASA grade, RCRI, STOP-BANG, frailty, composite
				risk, and flag count, and filter by composite risk and ASA grade.
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
					Capture structured objective findings across 16 body systems and produce a graded report —
					computed and final ASA grade, Mallampati / RCRI / STOP-BANG / CFS scores, composite risk,
					and safety flags — to support anaesthetic review and sign-off.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the max-grade ASA engine, the
					adjunct scores, and the flag rules. The same pure engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Uses the ASA Physical Status Classification, Mallampati airway score, Revised Cardiac Risk
					Index (Lee 1999), STOP-BANG (Chung 2008), and Clinical Frailty Scale (Rockwood 2005),
					aligned with CPOC and NICE NG45 guidance.
				</dd>
			</div>
		</dl>
	</section>
</main>
