function emailConfirmaco(url) {

    const agora = new Date();
    const dia = String(agora.getDate())
    const ano = String(agora.getFullYear())
    const mes = String(agora.getMonth() + 1)

    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril',
      'Maio', 'Junho', 'Julho', 'Agosto',
      'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]


    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recibo de Pagamento</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            max-width: 600px;
            margin: auto;
        }
        .header {
            text-align: center;
            padding: 10px 0;
            border-bottom: 2px solid #4CAF50;
        }
        .header h1 {
            color: #4CAF50;
            margin: 0;
        }
        .content {
            margin: 20px 0;
        }
        .receipt {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-top: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Recibo de Pagamento</h1>
        </div>
        <div class="content">
            <p>Obrigado pelo seu pagamento!</p>
            <div class="receipt">
                <p><strong>Data:</strong>  ${dia}/${ano}/${meses[mes]}</p>
                <p><strong>Método de Pagamento:</strong> Cartão de Crédito</p>
                <p><a href=${url}>Url de confirmaçao</a></p>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2024 Sua Empresa. Todos os direitos reservados.</p>
            <p><a href="https://www.suaempresa.com.br" style="color: #4CAF50;">Visite nosso site</a></p>
        </div>
    </div>
</body>
</html
`
}

module.exports = emailConfirmaco