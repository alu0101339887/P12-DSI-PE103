/**
 * Tipo de mensaje de respuesta que contentrá el resultado de la ejecución.
 * @typedef {Object} response
 * @property {boolean} success - Indica si la ejecución fue exitosa.
 * @property {string} msg - Mensaje de respuesta.
 * @property {string} err - Mensaje de error.
 */
export type response = {
  success: boolean;
  err?: string;
  msg?: string;
}