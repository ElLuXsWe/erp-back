const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: 'smtp.mailersend.net',
  port: 587,
  secure: false, // false para TLS en puerto 587
  auth: {
    user: 'MS_L7M2PG@test-xkjn41m5ypp4z781.mlsender.net',
    pass: 'mssp.xHgotVI.ynrw7gy03kjl2k8e.8SLFQDa'
  }
});
 

const enviarCodigoPorCorreo = async (destinatario, codigo) => {
  await transporter.sendMail({
    from: '"Sistema Proyectame" <MS_L7M2PG@test-xkjn41m5ypp4z781.mlsender.net>',
    to: destinatario,
    subject: 'Código de verificación',
    text: `Tu código de verificación es: ${codigo}`
  });
};

module.exports = { enviarCodigoPorCorreo };
