import { Page } from '@playwright/test';


//Sirve para validar si el campo es invalido
export async function campoEsInvalido(page: Page, selector: string) {
  return await page.locator(selector).evaluate((input: HTMLInputElement) => !input.checkValidity());
}

//Sirve para obtener el mensaje de validacion
export async function obtenerMensajeDeValidacion(page: Page, selector: string): Promise<string> {
  return await page.locator(selector).evaluate(
    (input: HTMLInputElement) => input.validationMessage
  );
}