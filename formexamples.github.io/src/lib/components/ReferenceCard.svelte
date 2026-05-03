<script lang="ts">
  type Props = { title: string; href: string; description: string };
  let { title, href, description }: Props = $props();
</script>

<a
  {href}
  target="_blank"
  rel="noopener noreferrer"
  class="block rounded-lg border border-slate-200 p-5 no-underline transition hover:border-teal-500 hover:shadow-sm dark:border-slate-700 dark:hover:border-teal-500"
>
  <div class="font-semibold text-slate-900 dark:text-slate-100">{title}</div>
  <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
</a>
