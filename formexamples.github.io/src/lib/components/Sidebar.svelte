<script lang="ts">
  import { page } from '$app/state';
  import { navLinks } from '$lib/site';

  type Props = { open?: boolean; onClose?: () => void };
  let { open = false, onClose }: Props = $props();

  function isActive(href: string): boolean {
    const current = page.url.pathname;
    if (href === '/') return current === '/';
    return current.startsWith(href);
  }
</script>

<!-- Mobile backdrop -->
{#if open}
  <div
    class="fixed inset-0 top-14 z-20 bg-slate-900/40 md:hidden"
    role="presentation"
    aria-hidden="true"
    onclick={() => onClose?.()}
    onkeydown={(e) => e.key === 'Escape' && onClose?.()}
  ></div>
{/if}

<aside
  class="fixed left-0 top-14 z-20 h-[calc(100vh-3.5rem)] w-60 border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-950 md:sticky md:translate-x-0
    {open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}"
  aria-label="Section navigation"
>
  <nav class="p-4">
    <ul class="space-y-1">
      {#each navLinks as link}
        <li>
          <a
            href={link.href}
            class="block rounded-md px-3 py-2 text-sm hover:no-underline
              {isActive(link.href)
                ? 'bg-teal-50 font-medium text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}"
            onclick={() => onClose?.()}
          >
            {link.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</aside>
