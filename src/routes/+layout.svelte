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
	<ion-header>
		<ion-toolbar />
	</ion-header>
	<slot />
	<ion-footer>
		<ion-toolbar />
	</ion-footer>
</ion-app>
