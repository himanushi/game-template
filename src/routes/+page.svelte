<script lang="ts">
	import * as PIXI from 'pixi.js';
	import { onMount } from 'svelte';
	import { apiKey } from '~/store/apiKey';

	let content: any;
	let width = window.innerWidth;
	let height = window.innerHeight;

	let app: PIXI.Application<PIXI.ICanvas> | undefined = undefined;
	let loading = false;
	type ResponseJson = {
		choices: { 0: { message: { content: string } } };
	};

	let message = '';
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
JavaScript で実行する。pixi.js の v7 を使用している。
global に app が存在する。app は代入せずにそのまま使用すること。gsap は使用可能。画像は使用しないこと。
図形以外のものを指定された場合は形が近い図形を使用すること。それぞれのオブジェクトはぶつかるようにすること。
${message}。絶対必ず {"eval":"javascript を string で入力"} のJSONフォーマットでのみを返すこと。コードのみ提供して説明不要。`
					}
				],
				model: 'gpt-3.5-turbo'
			})
		});
		const json: ResponseJson = await response.json();
		loading = false;
		console.log(json.choices[0].message.content);
		const evalJson = JSON.parse(
			json.choices[0].message.content.replaceAll('\n', '').replaceAll('\n', '')
		)['eval'];
		console.log(evalJson);
		eval(evalJson);
	};

	onMount(() => {
		app = new PIXI.Application({
			background: '#1099bb',
			width: width,
			height: height
		});
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
					value={message}
					on:ionChange={(e) => {
						if (e.detail.value || e.detail.value === '') {
							message = e.detail.value;
						}
					}}
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
