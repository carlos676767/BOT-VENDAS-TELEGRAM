CREATE TABLE USER(
    NOME_USER VARCHAR(255) NOT NULL,
    ID  TEXT PRIMARY KEY  NOT NULL,
)



CREATE TABLE PRODUTO (
    ID_PRODUCT INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
    nome VARCHAR(255) NOT NULL,                             
    preco REAL NOT NULL 
    keys VARCHAR(255) NOT NULL                             
)

CREATE TABLE PEDIDOS(
    status TEXT CHECK(status IN ('Aguardando Pagamento', 'processando', 'Entregue')) NOT NULL,
    ID_USER TEXT NOT NULL,
    ID_PRODUCT INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    data DATE NOT NULL
    FOREIGN KEY(ID_USER) REFERENCES USER(ID) 
    FOREIGN KEY(ID_PRODUCT) REFERENCES PRODUTO(ID_PRODUCT)  
)


CREATE TABLE PAGAMENTOS (
    ID_PAGAMENTO INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
    ID_PRODUTO INTEGER NOT NULL,                              
    VALOR REAL NOT NULL,                                     
    ID_PEDIDO INTEGER,                                       
    FOREIGN KEY (ID_PEDIDO) REFERENCES PEDIDOS(ID_PEDIDO)  
    FOREIGN KEY (ID_PRODUTO) REFERENCES PRODUTO(ID_PRODUCT)  
);




CREATE TABLE INFORMACAO_PAGAMENTO(
    status_pagamento VARCHAR(255) NOT NULL,
    ID_DO_USUARIO VARCHAR(255) NOT NULL,
    FOREIGN KEY(ID_DO_USUARIO) REFERENCES USER(ID)
)


CREATE TABLE PAGAMENTOS_CARTAO(
    status_pagamento VARCHAR(255) NOT NULL,
    email_user VARCHAR(255) NOT NULL,
    recibo VARCHAR(255) NOT NULL,
    ID_DO_USUARIO VARCHAR(255) NOT NULL,
    ID_PRODUTOS VARCHAR(255) NOT NULL,
    FOREIGN KEY(ID_DO_USUARIO) REFERENCES USER(ID)
);


CREATE TABLE roles(
ID_ADM VARCHAR(255) NOT NULL

)