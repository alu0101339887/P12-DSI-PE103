import express from 'express';
import {spawn} from 'child_process';
import {response} from './Message';

/**
 * Inicializar la aplicación express
 */
const app = express();

/**
 * Obtener la ruta de la aplicación
 */
app.get('/execmd', (req, res) => {
  console.log(req.query);

  /**
   * Argumentos que se reciben en la petición
   */
  const cmd: string = req.query.cmd as string;
  const arg: string = req.query.args as string;
  const argsArr: string[] = arg.split(',');

  /**
   * Se ejectua el comando
   */
  const child = spawn(cmd, argsArr);

  /**
   * Se obtiene el resultado de la ejecución
   */
  const myPromise = new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (child.exitCode === 0) {
        resolve('This is a successful result\n');
      } else {
        reject(new Error('This is an error\n'));
      }
    }, 1000);
  });

  /**
   * Se muestra el resultado de la ejecución en la consola
   * dependiendo del resultado de la ejecución
   */
  myPromise.then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  });

  /**
   * Se crea un mensaje de respuesta a la ejecución por defecto
   */
  const message: response = {
    success: true,
    msg: '',
  };

  /**
   * Captura de la salida del comando.
   */
  child.stdout.on('data', (data) => {
    message.msg += data.toString();
  });

  /**
   * En caso de que haya un error en la ejecución del comando
   * se muestra el incluye en el mensaje de respuesta.
   */
  child.stderr.on('data', (data) => {
    message.success = false;
    if (message.err === undefined) {
      message.err = data.toString();
    } else {
      message.err += data.toString();
    }
  });

  /**
   * Obtiene la salida de error del comando ejecutado y
   * la muestra en la consola.
   */
  child.on('error', (err) => {
    console.log(`\terror: ${err}`);
    message.success = false;
    message.err = err.toString();
    message.msg = undefined;
  });

  /**
   * Obtiene el resultado de la ejecución del comando
   * ejecutado y lo muestra en la consola.
   */
  child.on('close', (code) => {
    console.log(`\tchild process exited with code ${code}`);
    res.send(message);
  });
});

/**
 * Se establece una ruta por defecto para la aplicación.
 */
app.get('*', (_, res) => {
  res.status(404).send();
});

/**
 * Escucha de la aplicación en el puerto 3000.
 */
app.listen(3000, () => {
  console.log('Server started on port 3000');
});