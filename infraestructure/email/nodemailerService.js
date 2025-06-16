const nodemailer = require('nodemailer');


  let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // false para TLS con STARTTLS en puerto 587
  auth: {
    user: 'gggggsaucedo@gmail.com', // tu correo Gmail
    pass: 'uadtyprvblykqfvn'         // tu contraseña de aplicación SIN espacios
  }
});


const enviarCodigoPorCorreo = async (destinatario, codigo) => {
  await transporter.sendMail({
    from: '"Sistema Proyectame" <gggggsaucedo@gmail.com>',
    to: destinatario,
    subject: 'Código de verificación',
    text: `Tu código de verificación es: ${codigo}`
  });
};

module.exports = { enviarCodigoPorCorreo };
