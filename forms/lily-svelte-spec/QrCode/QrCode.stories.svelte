<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import QrCode from './QrCode.svelte';

  const { Story } = defineMeta({
    title: 'Headless/QrCode',
    component: QrCode,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Qr Code'}}
>
  <span>QR data</span>
</Story>
