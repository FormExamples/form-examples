<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the screening form and the clinician
	// dashboard.
	const plural = 'cervical-screenings';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Cervical Screening</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Cervical screening record</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured record of a cervical screening (smear) encounter under the UK NHS Cervical
			Screening Programme, using high-risk HPV (hrHPV) primary screening with reflex cytology on
			HPV-positive samples, completed as a single continuous wizard that documents eligibility,
			consent, sample adequacy, the primary hrHPV result, and reflex cytology, then classifies the
			<strong>result</strong> and the <strong>management outcome</strong> — routine recall, early
			repeat, colposcopy referral, or cease — and raises safety flags (a documentation and
			result-classification form, with no numeric score).
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/cervical-screening/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new screening</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step screening record. One continuous single-page wizard that classifies the
				result and management action on submit.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/cervical-screening/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse screened patients with their computed result class, management action, and safety
				flags, and filter by care setting and result class.
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
					Capture the screening encounter and produce a classified report — the result class, the
					recommended management action, and flagged issues — to support timely reporting and
					referral under the HPV-primary pathway.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the gated first-match
					classification engine, and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the NHS Cervical Screening Programme HPV primary screening pathway, NHSCSP
					colposcopy and programme-management guidance, and NICE NG12 suspected-cancer referral. A
					screening classification is not a diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
