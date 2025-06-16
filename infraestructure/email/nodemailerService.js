const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'srproyectame@gmail.com',
    pass: 'poxm tnrd mfwj adib'
  }
});

const enviarCodigoPorCorreo = async (destinatario, codigo) => {
  await transporter.sendMail({
    from: '"Sistema Proyectame" <srproyectame@gmail.com>',
    to: destinatario,
    subject: 'Código de verificación',
    text: `Tu código de verificación es: ${codigo}`
  });
};

module.exports = { enviarCodigoPorCorreo };
