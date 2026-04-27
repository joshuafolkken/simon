import { test, expect } from '@playwright/test';

test('game scene renders immediately with canvas', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="game-scene"]')).toBeVisible();
	await expect(page.locator('[data-testid="game-scene"] canvas')).toBeVisible();
});

test('crosshair is hidden before pointer lock is acquired', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByTestId('crosshair')).toHaveCount(0);
});

test('crosshair is visible after pointer lock is simulated', async ({ page }) => {
	await page.goto('/');

	await page.evaluate(() => {
		Object.defineProperty(document, 'pointerLockElement', {
			get: () => document.body,
			configurable: true
		});
		document.dispatchEvent(new Event('pointerlockchange'));
	});

	await expect(page.getByTestId('crosshair')).toBeVisible();
});

test('CLICK TO PLAY hint is visible before pointer lock', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('.click-hint')).toBeVisible();
});

test('CLICK TO PLAY hint disappears when pointer lock is simulated', async ({ page }) => {
	await page.goto('/');

	await page.evaluate(() => {
		Object.defineProperty(document, 'pointerLockElement', {
			get: () => document.body,
			configurable: true
		});
		document.dispatchEvent(new Event('pointerlockchange'));
	});

	await expect(page.locator('.click-hint')).toHaveCount(0);
});

test('pointer lock is requested on canvas element', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('canvas')).toBeVisible();

	const lock_target = await page.evaluate(
		() =>
			new Promise<string>((resolve) => {
				const canvas = document.querySelector('canvas');
				if (!canvas) {
					resolve('no-canvas');
					return;
				}
				const orig = canvas.requestPointerLock.bind(canvas);
				canvas.requestPointerLock = function () {
					resolve('canvas');
					return orig();
				};
				document.querySelector<HTMLElement>('[data-testid="game-scene"]')?.click();
			})
	);

	expect(lock_target).toBe('canvas');
});
