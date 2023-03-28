declare global {
	interface Window {
		PIXI: any;
		app: PIXI.Application<PIXI.ICanvas>;
	}
}
