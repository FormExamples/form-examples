<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the request form and the vetting
	// dashboard. The collection routes (`/cardiology-requests` and
	// `/cardiology-requests/new`) hold the actual functionality.
	const plural = 'cardiology-requests';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Cardiology Request</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Cardiology referral / consult request
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK NHS–aligned cardiology referral that a clinician completes to refer a patient into a
			cardiology service. It records the requested service, the reason for referral, the clinical
			question, presenting symptoms and functional class, acute red flags, investigations already
			performed, and triage details — then computes a four-axis vetting grade (referral
			appropriateness, safety / red-flag, request completeness, and triage priority) plus
			safety-critical flags to support the department's triage and booking decision.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/nuclear-medicine-test-request/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new referral</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step request form. One continuous single-page wizard that grades the
				referral as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/nuclear-medicine-test-request/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Vetting dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse incoming referrals with their computed four-axis grades, and filter by triage tier
				and recommendation.
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
					Capture why a patient should be seen by cardiology and how urgently, and produce a vetting
					report the cardiology team can triage from. This is the request half of the
					request/response pair.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the four-axis grading engine,
					and the safety-critical flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with NICE chest pain (CG95), chronic heart failure (NG106), transient loss of
					consciousness (CG109), and the NHS e-Referral advice-and-guidance / referral-vetting model.
				</dd>
			</div>
		</dl>
	</section>
</main>
