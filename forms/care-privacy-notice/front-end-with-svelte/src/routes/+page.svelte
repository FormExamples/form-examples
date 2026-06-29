<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the privacy notice form and the
	// clinician dashboard. The collection routes (`/care-privacy-notices` and
	// `/care-privacy-notices/new`) hold the actual functionality.
	const plural = 'care-privacy-notices';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Care Privacy Notice</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Privacy notice acknowledgment</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A read-and-acknowledge privacy notice based on the BMA GDPR template for GP practices,
			completed as a single continuous wizard: practice configuration, the privacy notice itself,
			and the patient's acknowledgment and signature. The shared engine validates completeness,
			derives a Complete / Incomplete status, and flags issues for the practice.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new acknowledgment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step form. One continuous single-page wizard that validates the
				acknowledgment as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse acknowledgments with their computed completeness and status, and filter by status
				and practice.
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
					Capture a patient's informed acknowledgment of how their GP practice uses and shares
					their information for medical research, service planning, and quality-of-care audit, and
					produce a validated record.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the completeness validation
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Based on the BMA / NHS England UK GDPR privacy notice template for GP practices,
					covering medical research, service planning, and national clinical audit.
				</dd>
			</div>
		</dl>
	</section>
</main>
