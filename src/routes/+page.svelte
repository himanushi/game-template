<script lang="ts">
	import * as PIXI from 'pixi.js';
	import { onMount } from 'svelte';
	import { apiKey } from '~/store/apiKey';
	import { prompt } from '~/store/prompt';

	window.PIXI = PIXI;

	let content: any;
	let width = window.innerWidth;
	let height = window.innerHeight;

	let app: PIXI.Application<PIXI.ICanvas> | undefined = undefined;
	let loading = false;
	type ResponseJson = {
		choices: { 0: { message: { content: string } } };
	};

	const send = async () => {
		loading = true;
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${$apiKey}`
			},
			method: 'POST',
			body: JSON.stringify({
				messages: [
					{
						role: 'user',
						content: `
JavaScript で実行する。pixi.js の v7 を使用している。 window.app に PIXI.Application が存在する。絶対に app は再代入せずにそのまま使用すること。
gsap は使用可能。画像は使用しないこと。図形以外のものを指定された場合は形が近い図形を使用すること。それぞれのオブジェクトは衝突判定が存在すること。
return は使用しないこと。絶対必ず JavaScript の eval で実行できるコードのみにすること。説明とコメントアウトは不要です。
${$prompt}。`
					}
				],
				model: 'gpt-3.5-turbo'
			})
		});
		const json: ResponseJson = await response.json();
		loading = false;
		const content = json.choices[0].message.content;
		// window.content = content;
		console.log(content);
		// const evalJson = JSON.parse(content.replaceAll('\n', ''))['eval'].replaceAll('\\', '');
		// console.log(evalJson);
		eval(content);
	};

	onMount(() => {
		app = new PIXI.Application({
			background: '#1099bb',
			width: width,
			height: height
		});
		window.app = app;
		content.appendChild(app.view as any);
	});
</script>

<ion-header>
	<ion-toolbar>
		<ion-item>
			<ion-input
				placeholder="OpenAI API Key"
				type="password"
				value={$apiKey}
				on:ionChange={(e) => {
					if (e.detail.value || e.detail.value === '') {
						apiKey.set(e.detail.value);
					}
				}}
			/>
		</ion-item>
	</ion-toolbar>
</ion-header>
<ion-content bind:this={content} scroll-y={false} />
<ion-footer>
	<ion-toolbar>
		<ion-item>
			{#if $apiKey !== ''}
				<ion-textarea
					rows={1}
					auto-grow={true}
					on:ionChange={(e) => {
						if (e.detail.value || e.detail.value === '') {
							prompt.set(e.detail.value);
						}
					}}
					value={$prompt}
					placeholder="Message"
				/>
				<ion-buttons slot="end">
					<ion-button on:click={send} disabled={loading}>
						<ion-icon slot="end" name="send" />
					</ion-button>
				</ion-buttons>
			{:else}
				<ion-textarea rows={1} disabled auto-grow={true} placeholder="You need an OpenAI API key" />
				<ion-buttons slot="end">
					<ion-button disabled>
						<ion-icon slot="end" name="send" />
					</ion-button>
				</ion-buttons>
			{/if}
		</ion-item>
	</ion-toolbar>
</ion-footer>
