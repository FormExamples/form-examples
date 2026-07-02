<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DownloadButton from './DownloadButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DownloadButton',
    component: DownloadButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    href: '/files/brochure.pdf',
    label: 'Download brochure',
    fileSize: '2.4 MB',
    fileFormat: 'PDF',
    download: true,
  }}
/>
