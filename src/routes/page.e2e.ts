import { readFileSync } from 'node:fs';
import { test, expect, type Page } from '@playwright/test';

const { version } = JSON.parse(
	readFileSync(new URL('../../package.json', import.meta.url).pathname, 'utf-8')
) as { version: string };

const LOADING_OVERLAY_TIMEOUT_MS = 8000;
const FULLSCREEN_NOT_CALLED_WAIT_MS = 200;
const TOUCH_PRIMARY_QUERY = '(hover: none) and (pointer: coarse)';

async function stub_touch_primary(page: Page, is_touch: boolean): Promise<void> {
	await page.addInitScript(
		([query, matches]) => {
			const original = globalThis.matchMedia.bind(globalThis);
			globalThis.matchMedia = function patched(input: string): MediaQueryList {
				if (input === query) {
					return {
						matches: matches as boolean,
						media: input,
						onchange: null,
						addEventListener() {},
						removeEventListener() {},
						addListener() {},
						removeListener() {},
						dispatchEvent() {
							return false;
						}
					} as MediaQueryList;
				}
				return original(input);
			};
		},
		[TOUCH_PRIMARY_QUERY, is_touch] as const
	);
}

test('game scene renders immediately with canvas', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="game-scene"]')).toBeVisible();
	await expect(page.locator('[data-testid="game-scene"] canvas')).toBeVisible();
});

test('loading overlay is visible immediately on page load', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="loading-overlay"]')).toBeVisible();
});

test('loading overlay displays the logo svg', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="loading-overlay"] svg.logo')).toBeVisible();
});

test('loading overlay displays Joshua Folkken below the logo', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="loading-overlay"] .brand')).toHaveText('Joshua Folkken');
});

test('loading overlay displays game title below the brand', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="loading-overlay"] .game-title')).toHaveText('SIMON');
});

test('loading overlay displays game version below the brand', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="loading-overlay"] .game-version')).toHaveText(
		`v${version}`
	);
});

test('loading overlay reaches 100% progress once the scene is ready', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="loading-overlay"] .progress')).toHaveText('100%', {
		timeout: LOADING_OVERLAY_TIMEOUT_MS
	});
});

test('loading overlay shows ready text once the scene is ready', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="loading-overlay"] .status')).toHaveText('READY', {
		timeout: LOADING_OVERLAY_TIMEOUT_MS
	});
});

test('loading overlay disappears once the scene is ready', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="loading-overlay"]')).toBeHidden({
		timeout: LOADING_OVERLAY_TIMEOUT_MS
	});
	await expect(page.locator('[data-testid="game-scene"]')).toBeVisible();
});

test('CLICK TO PLAY hint is visible before the user clicks', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('.click-hint')).toBeVisible();
});

test('CLICK TO PLAY hint disappears after the game scene is clicked', async ({ page }) => {
	await page.goto('/');
	await page.locator('[data-testid="game-scene"]').click();
	await expect(page.locator('.click-hint')).toHaveCount(0);
});

test('first click on the game scene does not toggle cyber mode while CLICK TO PLAY is shown', async ({
	page
}) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="game-scene"]')).toBeVisible();
	await expect(page.locator('.click-hint')).toBeVisible();
	await expect(page.locator('[data-testid="cyber-glow"]')).toBeVisible();
	await page.locator('[data-testid="game-scene"]').click();
	await expect(page.locator('.click-hint')).toHaveCount(0);
	await expect(page.locator('[data-testid="cyber-glow"]')).toBeVisible();
});

test('fullscreen is requested on touch-primary devices when CLICK TO PLAY is clicked', async ({
	page
}) => {
	await stub_touch_primary(page, true);
	await page.goto('/');
	await expect(page.locator('[data-testid="game-scene"]')).toBeVisible();

	const fullscreen_target = await page.evaluate(
		() =>
			new Promise<string>((resolve) => {
				const scene = document.querySelector<HTMLElement>('[data-testid="game-scene"]');
				if (!scene) {
					resolve('no-scene');
					return;
				}
				scene.requestFullscreen = function (): Promise<void> {
					resolve('game-scene');
					return Promise.resolve();
				};
				scene.click();
			})
	);

	expect(fullscreen_target).toBe('game-scene');
});

test('fullscreen is NOT requested on desktop devices when CLICK TO PLAY is clicked', async ({
	page
}) => {
	await stub_touch_primary(page, false);
	await page.goto('/');
	await expect(page.locator('[data-testid="game-scene"]')).toBeVisible();

	const was_called = await page.evaluate(
		(wait_ms) =>
			new Promise<boolean>((resolve) => {
				const scene = document.querySelector<HTMLElement>('[data-testid="game-scene"]');
				if (!scene) {
					resolve(false);
					return;
				}
				let called = false;
				scene.requestFullscreen = function (): Promise<void> {
					called = true;
					return Promise.resolve();
				};
				scene.click();
				setTimeout(() => resolve(called), wait_ms);
			}),
		FULLSCREEN_NOT_CALLED_WAIT_MS
	);

	expect(was_called).toBe(false);
	await expect(page.locator('.click-hint')).toHaveCount(0);
});

test('pseudo-fullscreen class is applied when native API is unavailable on touch devices', async ({
	page
}) => {
	await stub_touch_primary(page, true);
	await page.goto('/');
	await expect(page.locator('[data-testid="game-scene"]')).toBeVisible();

	await page.evaluate(() => {
		const scene = document.querySelector<HTMLElement>('[data-testid="game-scene"]');
		if (!scene) return;
		Object.defineProperty(scene, 'requestFullscreen', { value: undefined, configurable: true });
		Object.defineProperty(scene, 'webkitRequestFullscreen', {
			value: undefined,
			configurable: true
		});
		scene.click();
	});

	await expect(page.locator('[data-testid="game-scene"]')).toHaveClass(/pseudo-fullscreen/);
});
