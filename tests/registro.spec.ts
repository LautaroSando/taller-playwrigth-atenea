import { test, expect } from '@playwright/test';

test('TC-1 verificacion de elementos visuales en la pagina de registro', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect (page.locator('input[name="firstName"]')).toBeVisible();
  await expect (page.locator('input[name="lastName"]')).toBeVisible();
  await expect (page.locator('input[name="email"]')).toBeVisible();
  await expect (page.locator('input[name="password"]')).toBeVisible();
  await expect(page.getByTestId('boton-registrarse')).toBeVisible();
});

test('TC-2 Verificar boton de registro esta inhabilitado por defecto', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByTestId('boton-registrarse')).toBeDisabled();
});

test('TC-3 Verificar boton de registro se habilita al completar los campos obligatorios', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await  page.locator(('input[name="firstName"]')).fill('manolo');
  await  page.locator(('input[name="lastName"]')).fill('perez');
  await  page.locator(('input[name="email"]')).fill('manolo@perez.com');
  await  page.locator(('input[name="password"]')).fill('manolo');
  await expect (page.getByTestId('boton-registrarse')).toBeEnabled();
});

test('TC-4 Verificar redireccionamiento a página de inicio de sesión al hacer clic en el botón de registro', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByTestId('boton-login-header-signup').click();
  await expect(page).toHaveURL('http://localhost:3000/login');
});

test('TC-5 Verificar Registro exitoso con datos válidos', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('lauta');
  await page.locator('input[name="lastName"]').fill('sando');
  await page.locator('input[name="email"]').fill('lauta'+Date.now().toString()+'@email.com'); //le agrega la fecha today para no repetir el mail
  await page.locator('input[name="password"]').fill('123456');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Registro exitoso')).toBeVisible();
});

test('TC-6 Verificar que un usuario no pueda registrarse con un correo electrónico ya existente', async ({ page }) => {
  const email = 'juantorres' + Date.now().toString() + '@email.com';
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Juan');
  await page.locator('input[name="lastName"]').fill('Torres');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill('123456');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Registro exitoso')).toBeVisible();
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Juan');
  await page.locator('input[name="lastName"]').fill('Torres');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill('123456');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Email already in use')).toBeVisible();
  await expect(page.getByText('Registro exitoso')).not.toBeVisible();
});