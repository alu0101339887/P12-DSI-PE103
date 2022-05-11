import express from 'express';
import {spawn} from 'child_process';
import {response} from './messages';

/**
 * Inicialización de la aplicación express.
 */
const app = express();

/**
 * Ruta de ejecución de la aplicación.
 */
app.get('/execmd', (req, res) => {
  console.log(req.query);

  /**
   * Recepción de los parámetros de la solicitud.
   */
  const cmd: string = req.query.cmd as string;
  const arg: string = req.query.args as string;
  const argsArr: string[] = arg.split(',');

  /**
   * Ejecución del comando.
   */
  const child = spawn(cmd, argsArr);

  /**
   * Mensaje de respuesta.
   */
  const message: response = {
    success: true,
    output: '',
  };

  /**
   * Captura de la salida del comando.
   */
  child.stdout.on('data', (data) => {
    message.output += data.toString();
  });

  child.stderr.on('data', (data) => {
    message.success = false;
    if (message.err === undefined) {
      message.err = data.toString();
    } else {
      message.err += data.toString();
    }
  });

  /**
   * Captura de la salida de error del comando.
   */
  child.on('error', (err) => {
    console.log(`\terror: ${err}`);
    message.success = false;
    message.err = err.toString();
    message.output = undefined;
  });

  /**
   * Captura de la salida del comando.
   */
  child.on('close', (code) => {
    console.log(`\tchild process exited with code ${code}`);
    res.send(message);
  });
});

/**
 * Ruta por defecto de la aplicación.
 */
app.get('*', (req, res) => {
  res.status(404).send();
});

/**
 * Escucha de la aplicación en el puerto 3000.
 */
app.listen(3000, () => {
  console.log('Server started on port 3000');
});