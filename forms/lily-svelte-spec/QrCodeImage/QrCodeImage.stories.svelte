<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import QrCodeImage from './QrCodeImage.svelte';

  const { Story } = defineMeta({
    title: 'Headless/QrCodeImage',
    component: QrCodeImage,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Qr Code'}}
>
  <span>QR data</span>
</Story>
