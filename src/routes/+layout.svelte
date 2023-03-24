<script lang="ts">
	import { initialize } from '@ionic/core';
	import { onMount } from 'svelte';

	onMount(() => {
		initialize({
			animated: true,
			mode: 'ios'
		});
	});
</script>

<ion-app>
	<slot />
</ion-app>
