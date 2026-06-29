<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the authorization form and the
	// clinician dashboard. The collection routes
	// (`/medical-records-release-permissions` and `/medical-records-release-permissions/new`)
	// hold the actual functionality.
	const plural = 'medical-records-release-permissions';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Medical Records Release Permission
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Authorise release of medical records</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Complete this form as a single continuous wizard to authorise the release of your medical
			records to a specified recipient: patient information, authorised recipient, records to
			release, purpose, authorisation period, restrictions, patient rights, and signature and
			consent. The shared engine validates the form for completeness, grades it Complete through
			Incomplete, and flags issues such as missing consent, expired authorisation, and sensitive
			records for review.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new form</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step authorisation form. One continuous single-page wizard that validates
				completeness as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse submitted authorisations with their computed completeness status and flag counts, and
				filter by completeness and purpose.
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
					Capture a structured records-release authorisation and produce a graded summary —
					completeness status, validation status, and flagged issues — to support secure, compliant
					release of medical records.
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
					Handled securely and in compliance with UK data protection law; sensitive record
					categories (HIV, mental health, substance abuse, genetic, STI) are flagged for explicit
					consent.
				</dd>
			</div>
		</dl>
	</section>
</main>
