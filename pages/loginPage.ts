import {Page, Locator} from '@playwright/test';
import obtenerMensajeDeValidacion from '../utils/obtenerMensajeDeValidacion';

export class LoginPage{
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly registerButtonLogin: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.getByTestId('boton-login');
        this.registerButtonLogin = page.getByTestId('link-registrarse-login')
        this.logoutButton = page.getByTestId('boton-logout');
    }

    async visitarPaginaLogin() {
        await this.page.goto('http://localhost:3000/login');
        await this.page.waitForLoadState('networkidle'); //"Porque para firefox cada tanto falla esta linea consulta"
    }

    async completarFormularioLogin(usuario: {email: string, contraseña: string}) {
        await this.emailInput.fill(usuario.email);
        await this.passwordInput.fill(usuario.contraseña);
    }

    async hacerClickBotonLogin() {
        await this.loginButton.click();
    }

    async completarYHacerClickBotonLogin(usuario: {email: string, contraseña: string}) {
        await this.completarFormularioLogin(usuario);
        await this.hacerClickBotonLogin();
    }

    async redireccionarARegistro() {
        await this.registerButtonLogin.click();
    }

    async cerrarSesion() {
        await this.logoutButton.click();
    }

    async esEmailInvalido(): Promise<boolean> {
        return await this.emailInput.evaluate((input: HTMLInputElement) => !input.checkValidity());
    }

    async esPasswordInvalido(): Promise<boolean> {
        return await this.passwordInput.evaluate((input: HTMLInputElement) => !input.checkValidity());
    }

    async obtenerMensajeValidacionCampo(selector: string): Promise<string> {
        return await obtenerMensajeDeValidacion(this.page, selector);
    }
}