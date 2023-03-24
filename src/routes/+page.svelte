<script lang="ts">
	import * as PIXI from 'pixi.js';
	import { onMount } from 'svelte';

	let content: any;
	let width = window.innerWidth;
	let height = window.innerHeight;
	onMount(() => {
		const app = new PIXI.Application({
			background: '#1099bb',
			width: width,
			height: height
		});
		content.appendChild(app.view as any);

		const card = PIXI.Sprite.from('/card.png');
		card.x = app.screen.width / 2;
		card.y = app.screen.height / 2;
		card.anchor.set(0.5);
		app.stage.addChild(card);
		app.ticker.add(() => {
			// just for fun, let's rotate mr rabbit a little
			card.rotation += 0.001;
		});
	});
</script>

<ion-content bind:this={content} scroll-y={false} />
