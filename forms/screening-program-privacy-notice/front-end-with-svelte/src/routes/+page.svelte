<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the acknowledgment form and the
	// clinician dashboard. The collection routes
	// (`/screening-program-privacy-notices` and `/…/new`) hold the actual
	// functionality.
	const plural = 'screening-program-privacy-notices';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Screening Program Privacy Notice
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Screening programme acknowledgment</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A short single-page wizard that presents the practice's screening-program privacy notice —
			how a patient's information is used across the NHS national screening programmes (cervical,
			breast, bowel, abdominal aortic aneurysm, diabetic eye, and antenatal and newborn screening) —
			and records the patient's acknowledgment and signature. The shared engine validates
			completeness, derives a Complete / Incomplete status, and flags any governance issues for the
			information-governance officer.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new acknowledgment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step form. One continuous single-page wizard that records the patient's
				acknowledgment of the screening program privacy notice.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recorded acknowledgments with their computed completeness and status, and filter by
				status and acknowledgment.
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
					Record a patient's acknowledgment of the screening-programme privacy notice and produce a
					completeness-graded summary — status, missing required fields, and flagged issues — for
					practice records.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the required-field validation
					engine, and the governance flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Covers the NHS national screening programmes, with legal bases under UK GDPR Article 6(1)(e)
					(task in the public interest) and Article 9(2)(h)/(i) (provision of health care and public
					interest in public health).
				</dd>
			</div>
		</dl>
	</section>
</main>
