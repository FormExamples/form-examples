<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the certificate form and the issuer
	// dashboard. The collection routes (`/united-kingdom-maternity-certificates-mat-b1`
	// and `/united-kingdom-maternity-certificates-mat-b1/new`) hold the actual
	// functionality.
	const plural = 'united-kingdom-maternity-certificates-mat-b1';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">UK Maternity Certificate</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">MAT B1 maternity certificate</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			The DWP MAT B1 certificate is issued by doctors and registered midwives so a pregnant
			patient can claim Statutory Maternity Pay (SMP), Maternity Allowance (MA), and the Sure
			Start Maternity Grant (SSMG). Capture the patient identification, either Part A
			(pre-confinement) or Part B (post-confinement) — they are mutually exclusive — and the
			issuer details, as one continuous single-page wizard. The shared rules engine validates
			completeness, checks the issuing-window and credential rules, and flags issues for review.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/united-kingdom-maternity-certificate-mat-b1/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Issue a new certificate</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step MAT B1 form. One continuous single-page wizard that validates the
				certificate as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/united-kingdom-maternity-certificate-mat-b1/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Issuer dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse issued certificates with their validation status, certificate part, issuer type,
				and flag count, and filter by status and certificate part.
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
					Capture a structured MAT B1 certificate and produce a validated result — completeness
					status, the active Part A / Part B and doctor / midwife branch, and flagged issues — to
					support correct issuance and DWP acceptance.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the validation rules engine,
					and the flag rules. The same engine validates both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Follows the DWP MAT B1 guidance for health professionals: issue only when satisfied of
					pregnancy, not more than 20 weeks before the expected week of confinement (EWC), in ink,
					on an officially numbered form.
				</dd>
			</div>
		</dl>
	</section>
</main>
