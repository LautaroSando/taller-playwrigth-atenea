import { test , expect } from '@playwright/test';
import { LoginPage } from "../pages/loginPage";
import { DashboardPage } from '../pages/dashboardPage';
import { RegisterPage } from '../pages/resgisterPage';
import TestUsersData from "../data/testUsers.json";
import TestUrlData from "../data/testUrl.json";

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let registerPage: RegisterPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  registerPage = new RegisterPage(page);
  await loginPage.visitarPaginaLogin();
  
});

test('TC-01: Validar que el usuario se loguee correctamente', async ({ page }) => {
    await loginPage.completarYHacerClickBotonLogin(TestUsersData.usuarioRegistrado);
    await expect(page).toHaveURL(TestUrlData.urlDashboard.url);
    await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
    await expect(dashboardPage.dashboardTitle).toHaveText('Tablero Principal');
    
});

test('TC-02: Intento de Login con Credenciales Inválidas', async ({ page }) => {
    await loginPage.completarYHacerClickBotonLogin(TestUsersData.usuarioNoRegistrado);
    await expect(page).toHaveURL(TestUrlData.urlLogin.url);
    await expect(page.getByText('Invalid credentials')).toBeVisible();
    
});

test('TC-02.2: Intento de Login con Campos Vacíos', async ({ page }) => {
    await loginPage.completarYHacerClickBotonLogin({email:'',contraseña:''});
    await expect(page).toHaveURL(TestUrlData.urlLogin.url);
    expect (await loginPage.esEmailInvalido()).toBe(true);
    expect (await loginPage.esPasswordInvalido()).toBe(true);  
})

test('TC-02.3: Intento de Login con Email sin Contraseña', async ({ page }) => {
    await loginPage.completarYHacerClickBotonLogin({email:TestUsersData.usuarioRegistrado.email,contraseña:''});
    expect(await loginPage.esPasswordInvalido()).toBe(true);
    expect(await loginPage.obtenerMensajeValidacionCampo(loginPage.passwordInput))
    await expect(page).toHaveURL(TestUrlData.urlLogin.url);  
});

test('TC-02.4: Intento de Login con Formato de Email Incorrecto', async ({ page }) => {
    await loginPage.completarYHacerClickBotonLogin({email:'emailinvalido',contraseña:TestUsersData.usuarioRegistrado.contraseña});
    await expect(page).toHaveURL(TestUrlData.urlLogin.url);  
});

test('TC-03.1: Vericación del Enlace de Registro', async ({ page }) => {
    await loginPage.redireccionarARegistro();
    await expect(page).toHaveURL(TestUrlData.urlRegistro.url);
    await expect(registerPage.title).toHaveText('Registrarse');
    
});

test('TC-03.2: Cierre de Sesión y Protección de Rutas', async ({ page }) => {
    await loginPage.completarYHacerClickBotonLogin(TestUsersData.usuarioRegistrado);
    await expect(page).toHaveURL(TestUrlData.urlDashboard.url);
    await loginPage.cerrarSesion();
    await expect(page.getByText('Sesión cerrada correctamente')).toBeVisible();
    await expect(page).toHaveURL(TestUrlData.urlLogin.url);
    await dashboardPage.visitarPaginaDashboard();
    await expect(page).toHaveURL(TestUrlData.urlLogin.url);    
});