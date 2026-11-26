// Adapted from TWENDE technical reference, 26 November 2026. UI only.
export type ModuleSpec = {id:string;title:string;columns:string[];filters:string[];sections:{title:string;fields:string[]}[];actions:string[];note:string;approval:boolean};
export const adminModules: ModuleSpec[] = [
  {
    "id": "rides",
    "title": "Corridas",
    "columns": [
      "Código",
      "Passageiro",
      "Motorista",
      "Tipo de corrida",
      "Estado",
      "Estado do pagamento",
      "Valor total (MT)",
      "Criado em"
    ],
    "filters": [
      "Estado:pendente,à procura,aceite,chegou,iniciada,concluída,cancelada,expirada",
      "Estado do pagamento:pendente,pago,falhou,reembolsado",
      "Criado desde@date",
      "Criado até@date"
    ],
    "sections": [],
    "actions": [
      "Consultar",
      "Atribuir motorista"
    ],
    "note": "A atribuição manual deve registar operador, data e motivo.",
    "approval": false
  },
  {
    "id": "cities",
    "title": "Cidades",
    "columns": [
      "Nome",
      "Província",
      "Estado",
      "Zonas"
    ],
    "filters": [
      "Estado:Activo,Inactivo"
    ],
    "sections": [
      {
        "title": "Informações básicas",
        "fields": [
          "Nome*",
          "Província",
          "País*",
          "Latitude*@number",
          "Longitude*@number",
          "Estado*:Activo,Inactivo"
        ]
      },
      {
        "title": "Horário de serviço",
        "fields": [
          "Início do serviço*@time",
          "Fim do serviço*@time"
        ]
      },
      {
        "title": "Tarifa nocturna",
        "fields": [
          "Multiplicador nocturno*@number",
          "Início nocturno*@time",
          "Fim nocturno*@time"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Editar",
      "Gerir zonas",
      "Eliminar"
    ],
    "note": "Horários e multiplicadores são propostas locais; preço negociado continua previsto.",
    "approval": false
  },
  {
    "id": "zones",
    "title": "Zonas",
    "columns": [
      "Cidade",
      "Nome",
      "Estado",
      "Sobretaxa actual",
      "Horários semanais",
      "Motoristas activos"
    ],
    "filters": [
      "Cidade",
      "Estado:Activo,Inactivo"
    ],
    "sections": [
      {
        "title": "Informações da zona",
        "fields": [
          "Cidade*",
          "Nome*",
          "Descrição@textarea",
          "Estado*:Activo,Inactivo"
        ]
      },
      {
        "title": "Limites",
        "fields": [
          "Polígono no mapa@unavailable"
        ]
      },
      {
        "title": "Sobretaxas",
        "fields": [
          "Horários semanais@unavailable",
          "Eventos e feriados@unavailable"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Consultar",
      "Editar"
    ],
    "note": "Desenho de polígonos e regras de sobretaxa exigem mapas e aprovação.",
    "approval": false
  },
  {
    "id": "plans",
    "title": "Planos de subscrição",
    "columns": [
      "Nome",
      "Preço (MT)",
      "Duração",
      "Subscrições",
      "Estado"
    ],
    "filters": [
      "Duração",
      "Estado:Activo,Inactivo"
    ],
    "sections": [
      {
        "title": "Detalhes do plano",
        "fields": [
          "Nome*",
          "Preço (MT)*@number",
          "Duração*",
          "Descrição@textarea",
          "Ordem@number",
          "Estado:Activo,Inactivo"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Editar",
      "Eliminar"
    ],
    "note": "Modelo comercial por aprovar.",
    "approval": true
  },
  {
    "id": "subscriptions",
    "title": "Subscrições de motoristas",
    "columns": [
      "Motorista",
      "Plano",
      "Preço (MT)",
      "Método de pagamento",
      "Início",
      "Fim",
      "Estado"
    ],
    "filters": [
      "Actualmente activo:Sim,Não",
      "Estado",
      "Plano",
      "Método de pagamento"
    ],
    "sections": [
      {
        "title": "Atribuição gratuita",
        "fields": [
          "Motorista*",
          "Plano*"
        ]
      }
    ],
    "actions": [
      "Atribuir plano"
    ],
    "note": "Modelo comercial por aprovar.",
    "approval": true
  },
  {
    "id": "types",
    "title": "Tipos de corrida",
    "columns": [
      "Ícone app",
      "Ícone mapa",
      "Nome",
      "Código",
      "Estado",
      "Preço base (MT)",
      "Preço/km (MT)",
      "Comissão (%)"
    ],
    "filters": [
      "Estado:Activo,Inactivo"
    ],
    "sections": [
      {
        "title": "Informação geral",
        "fields": [
          "Nome*",
          "Código*",
          "Capacidade*@number",
          "Descrição@textarea",
          "Cidades disponíveis*",
          "Estado:Activo,Inactivo",
          "Ícone app@unavailable",
          "Ícone mapa@unavailable"
        ]
      },
      {
        "title": "Preço padrão",
        "fields": [
          "Distância base (km)*@number",
          "Preço base (MT)*@number",
          "Preço/km (MT)*@number",
          "Preço/minuto (MT)*@number",
          "Tarifa mínima (MT)*@number",
          "Espera/minuto (MT)*@number",
          "Espera gratuita (min)*@number",
          "Comissão (%)*@number"
        ]
      },
      {
        "title": "Preço por cidade",
        "fields": [
          "Cidade",
          "Preço local:Sim,Não",
          "Tarifário local@unavailable"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Editar",
      "Eliminar"
    ],
    "note": "Tarifas de referência não substituem a negociação aprovada.",
    "approval": false
  },
  {
    "id": "settings",
    "title": "Políticas de cancelamento",
    "columns": [
      "Nome",
      "Cidade",
      "Tipo de corrida",
      "Janela gratuita (s)",
      "Taxa fixa (MT)",
      "Taxa (%)",
      "Estado"
    ],
    "filters": [
      "Estado:Activo,Inactivo",
      "Permite cancelamento:Sim,Não"
    ],
    "sections": [
      {
        "title": "Informação",
        "fields": [
          "Nome*",
          "Descrição@textarea",
          "Cidade",
          "Tipo de corrida*"
        ]
      },
      {
        "title": "Janela",
        "fields": [
          "Janela gratuita (s)*@number"
        ]
      },
      {
        "title": "Taxas",
        "fields": [
          "Taxa fixa (MT)@number"
        ]
      },
      {
        "title": "Estado",
        "fields": [
          "Estado:Activo,Inactivo"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Eliminar"
    ],
    "note": "As regras iniciais aprovadas continuam disponíveis abaixo.",
    "approval": false
  },
  {
    "id": "drivers",
    "title": "Motoristas",
    "columns": [
      "Fotografia",
      "Nome",
      "Telefone",
      "Matrícula",
      "Estado",
      "Verificado",
      "Disponível",
      "Documentos"
    ],
    "filters": [
      "Estado:Activo,Bloqueado",
      "Verificado:Sim,Não",
      "Disponível:Sim,Não",
      "Ano do veículo"
    ],
    "sections": [],
    "actions": [
      "Consultar",
      "Editar",
      "Bloquear",
      "Activar"
    ],
    "note": "Perfil, veículo, verificação e desempenho; documentos protegidos.",
    "approval": false
  },
  {
    "id": "customers",
    "title": "Passageiros",
    "columns": [
      "Fotografia",
      "Nome",
      "E-mail",
      "Telefone",
      "Estado",
      "Verificado"
    ],
    "filters": [
      "Estado:Activo,Bloqueado",
      "Online:Sim,Não",
      "Verificado:Sim,Não",
      "Registado desde@date",
      "Registado até@date"
    ],
    "sections": [],
    "actions": [
      "Consultar",
      "Editar",
      "Bloquear"
    ],
    "note": "Perfil, actividade, referências, corridas e carteira.",
    "approval": false
  },
  {
    "id": "tracking",
    "title": "Rastreamento de motoristas",
    "columns": [
      "Motorista",
      "Veículo",
      "Última localização",
      "Disponibilidade"
    ],
    "filters": [],
    "sections": [],
    "actions": [
      "Mapa",
      "Satélite"
    ],
    "note": "GPS e mapas ainda não ligados.",
    "approval": false
  },
  {
    "id": "cash",
    "title": "Pontos de cobrança",
    "columns": [
      "Cidade",
      "Ponto",
      "Endereço",
      "Responsável",
      "Telefone",
      "Estado"
    ],
    "filters": [
      "Cidade",
      "Estado:Activo,Inactivo"
    ],
    "sections": [
      {
        "title": "Informações",
        "fields": [
          "Cidade*",
          "Ponto*",
          "Responsável",
          "Telefone",
          "E-mail@email",
          "Endereço*"
        ]
      },
      {
        "title": "Local e horários",
        "fields": [
          "Latitude*@number",
          "Longitude*@number",
          "Localização no mapa@unavailable",
          "Dia*",
          "Abertura*@time",
          "Fecho*@time",
          "Encerrado:Sim,Não"
        ]
      },
      {
        "title": "Estado",
        "fields": [
          "Estado:Activo,Inactivo"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Editar",
      "Eliminar"
    ],
    "note": "Modelo de cobrança presencial por aprovar.",
    "approval": true
  },
  {
    "id": "documents",
    "title": "Documentação",
    "columns": [
      "ID",
      "Nome",
      "Tipo",
      "Estado",
      "Ordem"
    ],
    "filters": [
      "Tipo",
      "Estado:Activo,Inactivo"
    ],
    "sections": [
      {
        "title": "Requisito",
        "fields": [
          "Nome*",
          "Tipo*",
          "Ordem@number",
          "Descrição@textarea",
          "Estado:Activo,Inactivo",
          "Novo requisito:Sim,Não"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Editar",
      "Eliminar"
    ],
    "note": "Os dez requisitos aprovados continuam obrigatórios.",
    "approval": false
  },
  {
    "id": "incentives",
    "title": "Incentivos",
    "columns": [
      "Título",
      "Tipo",
      "Recompensa (MT)",
      "Estado",
      "Início",
      "Fim",
      "Activo"
    ],
    "filters": [
      "Estado",
      "Tipo",
      "Activo:Sim,Não"
    ],
    "sections": [
      {
        "title": "Informação",
        "fields": [
          "Motorista",
          "Título*",
          "Descrição*@textarea",
          "Tipo*",
          "Recompensa (MT)*@number"
        ]
      },
      {
        "title": "Vigência",
        "fields": [
          "Início*@datetime-local",
          "Fim*@datetime-local"
        ]
      },
      {
        "title": "Configuração",
        "fields": [
          "Estado*",
          "Activo:Sim,Não"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Consultar",
      "Editar",
      "Eliminar"
    ],
    "note": "Critérios e incentivos por aprovar.",
    "approval": true
  },
  {
    "id": "withdrawals",
    "title": "Pedidos de levantamento",
    "columns": [
      "Motorista",
      "Montante (MT)",
      "Estado",
      "Pedido em"
    ],
    "filters": [
      "Estado"
    ],
    "sections": [],
    "actions": [
      "Consultar",
      "Processar"
    ],
    "note": "Sem levantamentos activos; processamento futuro com auditoria.",
    "approval": true
  },
  {
    "id": "driverTickets",
    "title": "Ocorrências de motoristas",
    "columns": [
      "Ticket",
      "Utilizador",
      "Assunto",
      "Categoria",
      "Estado",
      "Prioridade",
      "Responsável",
      "Última resposta"
    ],
    "filters": [
      "Estado",
      "Prioridade",
      "Categoria",
      "Responsável",
      "Requer atenção:Sim,Não",
      "Sem responsável:Sim,Não",
      "Desde@date",
      "Até@date"
    ],
    "sections": [],
    "actions": [
      "Consultar"
    ],
    "note": "Suporte e prioridade; sem dados reais.",
    "approval": false
  },
  {
    "id": "notifications",
    "title": "Enviar notificações",
    "columns": [],
    "filters": [],
    "sections": [
      {
        "title": "Notificação para passageiros",
        "fields": [
          "Todos os passageiros:Sim,Não",
          "Passageiros seleccionados",
          "Título*",
          "Mensagem*@textarea"
        ]
      },
      {
        "title": "Notificação para motoristas",
        "fields": [
          "Todos os motoristas:Sim,Não",
          "Motoristas seleccionados",
          "Título motorista*",
          "Mensagem motorista*@textarea"
        ]
      }
    ],
    "actions": [
      "Enviar notificação"
    ],
    "note": "Nenhuma notificação será enviada a partir desta pré-visualização.",
    "approval": false
  },
  {
    "id": "promos",
    "title": "Códigos promocionais",
    "columns": [
      "Código",
      "Tipo",
      "Valor",
      "Montante mínimo (MT)",
      "Desconto máximo (MT)",
      "Limite total",
      "Utilizações",
      "Limite por pessoa",
      "Estado",
      "Início",
      "Expiração"
    ],
    "filters": [
      "Tipo",
      "Estado",
      "Desde@date",
      "Até@date"
    ],
    "sections": [
      {
        "title": "Informação",
        "fields": [
          "Código*",
          "Tipo*",
          "Valor*@number",
          "Descrição*@textarea"
        ]
      },
      {
        "title": "Validade",
        "fields": [
          "Início*@datetime-local",
          "Expiração*@datetime-local",
          "Estado*"
        ]
      },
      {
        "title": "Limites",
        "fields": [
          "Montante mínimo (MT)@number",
          "Limite total@number",
          "Limite por pessoa@number"
        ]
      },
      {
        "title": "Aplicabilidade",
        "fields": [
          "Público*:Novos,Existentes,Todos",
          "Cidades*",
          "Tipos de corrida*"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Editar",
      "Duplicar",
      "Eliminar"
    ],
    "note": "Promoções por aprovar.",
    "approval": true
  },
  {
    "id": "referrals",
    "title": "Bónus por indicação",
    "columns": [
      "Quem indicou",
      "Indicado",
      "Tipo",
      "Montante (MT)",
      "Estado"
    ],
    "filters": [
      "Tipo",
      "Estado:Pendente,Creditado,Expirado"
    ],
    "sections": [
      {
        "title": "Indicação",
        "fields": [
          "Quem indicou*",
          "Indicado*",
          "Tipo*",
          "Montante (MT)*@number"
        ]
      },
      {
        "title": "Estado",
        "fields": [
          "Estado*:Pendente,Creditado,Expirado",
          "Expiração*@datetime-local"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Editar"
    ],
    "note": "Recompensas por aprovar.",
    "approval": true
  },
  {
    "id": "referralNetwork",
    "title": "Rede de indicações",
    "columns": [
      "Nome",
      "E-mail",
      "Telefone",
      "Tipo de utilizador",
      "Código",
      "Indicado por",
      "Total de indicações"
    ],
    "filters": [
      "Tipo de utilizador",
      "Tem indicações:Sim,Não",
      "Foi indicado:Sim,Não",
      "Desde@date",
      "Até@date"
    ],
    "sections": [],
    "actions": [
      "Consultar"
    ],
    "note": "Rede de referências; política por aprovar.",
    "approval": true
  },
  {
    "id": "taxes",
    "title": "Regras fiscais por cidade",
    "columns": [
      "Cidade",
      "Nome do imposto",
      "Taxa (%)",
      "Estado"
    ],
    "filters": [
      "Cidade",
      "Estado:Activo,Inactivo"
    ],
    "sections": [
      {
        "title": "Configuração fiscal",
        "fields": [
          "Cidades*",
          "Nome do imposto*",
          "Taxa (%)*@number",
          "Descrição@textarea",
          "Estado:Activo,Inactivo"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Editar",
      "Eliminar"
    ],
    "note": "Não aplicar impostos sem validação fiscal e jurídica.",
    "approval": true
  },
  {
    "id": "commissions",
    "title": "Comissões",
    "columns": [
      "Corrida",
      "Motorista",
      "Serviço",
      "Tarifa (MT)",
      "Comissão (MT)",
      "Imposto (MT)",
      "Dívida (MT)",
      "Ganhos (MT)",
      "Criado em"
    ],
    "filters": [
      "Motorista",
      "Tipo de corrida",
      "Desde@date",
      "Até@date"
    ],
    "sections": [],
    "actions": [
      "Consultar"
    ],
    "note": "Comissão inicial de 10%; histórico da taxa aplicada deve ser preservado.",
    "approval": false
  },
  {
    "id": "invoices",
    "title": "Facturas",
    "columns": [
      "Factura",
      "Passageiro",
      "Motorista",
      "Data",
      "Total (MT)",
      "Ganhos (MT)",
      "Comissão (MT)",
      "Método de pagamento",
      "Estado do pagamento"
    ],
    "filters": [
      "Método de pagamento",
      "Estado do pagamento",
      "Desde@date",
      "Até@date"
    ],
    "sections": [],
    "actions": [
      "Consultar",
      "Imprimir",
      "Exportar"
    ],
    "note": "Facturação pendente de integração e validação fiscal.",
    "approval": false
  },
  {
    "id": "transactions",
    "title": "Transacções",
    "columns": [
      "ID",
      "Utilizador",
      "Corrida",
      "Tipo",
      "Montante (MT)",
      "Saldo (MT)",
      "Descrição",
      "Estado",
      "Método de pagamento",
      "Criado em"
    ],
    "filters": [
      "Utilizador",
      "Tipo",
      "Estado",
      "Método de pagamento",
      "Desde@date",
      "Até@date"
    ],
    "sections": [],
    "actions": [
      "Consultar"
    ],
    "note": "Movimentos financeiros não podem ser eliminados ou editados directamente.",
    "approval": false
  },
  {
    "id": "wallet",
    "title": "Carteiras",
    "columns": [
      "Utilizador",
      "Tipo",
      "Saldo (MT)",
      "Créditos (MT)",
      "Débitos (MT)",
      "Estado",
      "Última transacção"
    ],
    "filters": [
      "Estado",
      "Tipo",
      "Tem saldo:Sim,Não",
      "Sem movimentos:Sim,Não"
    ],
    "sections": [],
    "actions": [
      "Consultar",
      "Ver movimentos"
    ],
    "note": "Carteira pré-paga aprovada; ajustes auditados no servidor.",
    "approval": false
  },
  {
    "id": "walletTransactions",
    "title": "Movimentos de carteira",
    "columns": [
      "ID",
      "Utilizador",
      "Carteira",
      "Tipo",
      "Montante (MT)",
      "Saldo após (MT)",
      "Descrição",
      "Estado",
      "Criado em"
    ],
    "filters": [
      "Carteira",
      "Tipo",
      "Estado",
      "Montante mínimo@number",
      "Montante máximo@number",
      "Desde@date",
      "Até@date"
    ],
    "sections": [],
    "actions": [
      "Consultar",
      "Solicitar reversão"
    ],
    "note": "Razão contabilística imutável; reversões futuras por lançamento compensatório.",
    "approval": false
  },
  {
    "id": "refundSettings",
    "title": "Configuração de reembolsos",
    "columns": [],
    "filters": [],
    "sections": [
      {
        "title": "Processamento",
        "fields": [
          "Prazo de reembolso (horas)*@number"
        ]
      }
    ],
    "actions": [
      "Guardar configurações",
      "Repor"
    ],
    "note": "Prazo e regras por aprovar.",
    "approval": true
  },
  {
    "id": "refunds",
    "title": "Pedidos de reembolso",
    "columns": [
      "Corrida",
      "Passageiro",
      "Motivo",
      "Pedido (MT)",
      "Aprovado (MT)",
      "Estado",
      "Origem"
    ],
    "filters": [
      "Estado",
      "Origem"
    ],
    "sections": [],
    "actions": [
      "Consultar",
      "Processar"
    ],
    "note": "Reembolsos requerem autorização e trilho de auditoria.",
    "approval": true
  },
  {
    "id": "messages",
    "title": "Conversas de suporte",
    "columns": [
      "Corrida",
      "Passageiro",
      "Administrador",
      "Última mensagem",
      "Mensagens",
      "Reembolso",
      "Prioridade",
      "Estado",
      "Data"
    ],
    "filters": [
      "Remetente",
      "Estado",
      "Prioridade",
      "Administrador",
      "Corrida",
      "Não lidas:Sim,Não",
      "Hoje:Sim,Não"
    ],
    "sections": [
      {
        "title": "Detalhes",
        "fields": [
          "Passageiro*",
          "Administrador",
          "Remetente*",
          "Mensagem*@textarea",
          "Tipo de mensagem*",
          "Assunto",
          "Prioridade*",
          "Estado*",
          "Lida:Sim,Não"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Consultar",
      "Chat",
      "Atribuir",
      "Fechar"
    ],
    "note": "Não envia mensagens reais.",
    "approval": false
  },
  {
    "id": "about",
    "title": "Sobre nós",
    "columns": [],
    "filters": [],
    "sections": [
      {
        "title": "Conteúdo",
        "fields": [
          "Idioma",
          "Texto institucional@textarea"
        ]
      }
    ],
    "actions": [
      "Guardar"
    ],
    "note": "Conteúdo a rever antes de publicação.",
    "approval": false
  },
  {
    "id": "privacy",
    "title": "Política de privacidade",
    "columns": [],
    "filters": [],
    "sections": [
      {
        "title": "Conteúdo jurídico",
        "fields": [
          "Idioma",
          "Política de privacidade@textarea"
        ]
      }
    ],
    "actions": [
      "Guardar"
    ],
    "note": "Revisão jurídica necessária; editor formatado ainda por implementar.",
    "approval": false
  },
  {
    "id": "terms",
    "title": "Termos e condições",
    "columns": [],
    "filters": [],
    "sections": [
      {
        "title": "Conteúdo jurídico",
        "fields": [
          "Idioma",
          "Termos e condições@textarea"
        ]
      }
    ],
    "actions": [
      "Guardar"
    ],
    "note": "Revisão jurídica necessária; editor formatado ainda por implementar.",
    "approval": false
  },
  {
    "id": "contact",
    "title": "Contactos",
    "columns": [
      "E-mail",
      "Telefone",
      "Endereço",
      "Estado"
    ],
    "filters": [
      "Estado:Activo,Inactivo"
    ],
    "sections": [
      {
        "title": "Informação de contacto",
        "fields": [
          "Introdução@textarea",
          "E-mail@email",
          "Telefone",
          "Endereço",
          "Horário",
          "Mensagem de suporte@textarea",
          "Estado:Activo,Inactivo"
        ]
      }
    ],
    "actions": [
      "Guardar"
    ],
    "note": "Publicação ainda não ligada.",
    "approval": false
  },
  {
    "id": "banners",
    "title": "Imagens de banners",
    "columns": [
      "Imagem",
      "Cidades",
      "Título",
      "Posição",
      "Ordem",
      "Estado",
      "Tamanho"
    ],
    "filters": [
      "Cidade",
      "Posição",
      "Estado:Activo,Inactivo"
    ],
    "sections": [
      {
        "title": "Detalhes",
        "fields": [
          "Cidades*",
          "Imagem@unavailable",
          "Título",
          "Descrição@textarea",
          "Posição*",
          "Ordem@number",
          "Estado:Activo,Inactivo"
        ]
      },
      {
        "title": "Ligação",
        "fields": [
          "URL@url",
          "Texto da ligação"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Consultar",
      "Editar",
      "Reordenar",
      "Eliminar"
    ],
    "note": "Carregamento de imagens ainda não integrado.",
    "approval": false
  },
  {
    "id": "faq",
    "title": "Perguntas frequentes",
    "columns": [
      "Título",
      "Chave",
      "Público",
      "Ícone",
      "Perguntas",
      "Ordem",
      "Estado"
    ],
    "filters": [
      "Público",
      "Estado:Activo,Inactivo"
    ],
    "sections": [
      {
        "title": "Categoria",
        "fields": [
          "Título*",
          "Chave*",
          "Descrição@textarea",
          "Ícone",
          "Público*",
          "Ordem@number",
          "Estado:Activo,Inactivo"
        ]
      },
      {
        "title": "Perguntas",
        "fields": [
          "Pergunta",
          "Resposta@textarea"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Editar",
      "Eliminar"
    ],
    "note": "Editor de múltiplas perguntas ainda pendente.",
    "approval": false
  },
  {
    "id": "appSettings",
    "title": "Configurações da aplicação",
    "columns": [],
    "filters": [],
    "sections": [
      {
        "title": "Geral",
        "fields": [
          "Nome da aplicação",
          "E-mail de suporte@email",
          "Telefone de suporte",
          "Manutenção:Sim,Não"
        ]
      },
      {
        "title": "Autenticação",
        "fields": [
          "Telemóvel:Sim,Não",
          "E-mail:Sim,Não",
          "Google:Sim,Não",
          "Apple:Sim,Não"
        ]
      },
      {
        "title": "Versões",
        "fields": [
          "Versão Android",
          "Actualização Android obrigatória:Sim,Não",
          "Versão iOS",
          "Actualização iOS obrigatória:Sim,Não"
        ]
      },
      {
        "title": "Partilha",
        "fields": [
          "Link Android@url",
          "Link iOS@url"
        ]
      },
      {
        "title": "Cores",
        "fields": [
          "Cor do painel@color",
          "Cor da aplicação@color"
        ]
      }
    ],
    "actions": [
      "Guardar"
    ],
    "note": "Configurações apenas demonstrativas.",
    "approval": false
  },
  {
    "id": "payments",
    "title": "Métodos de pagamento",
    "columns": [],
    "filters": [],
    "sections": [
      {
        "title": "Pagamentos",
        "fields": [
          "Numerário:Sim,Não",
          "Fornecedor",
          "Ambiente:Sandbox,Produção",
          "Moeda",
          "Configuração segura@unavailable"
        ]
      }
    ],
    "actions": [
      "Guardar",
      "Repor"
    ],
    "note": "Provedores por aprovar. Não introduzir chaves ou credenciais.",
    "approval": true
  },
  {
    "id": "referralSettings",
    "title": "Valores de indicação",
    "columns": [],
    "filters": [],
    "sections": [
      {
        "title": "Recompensas",
        "fields": [
          "Motorista que indica (MT)*@number",
          "Motorista indicado (MT)*@number",
          "Passageiro que indica (MT)*@number",
          "Passageiro indicado (MT)*@number",
          "Desconto amigo (%)*@number"
        ]
      }
    ],
    "actions": [
      "Guardar",
      "Repor"
    ],
    "note": "Valores por aprovar.",
    "approval": true
  },
  {
    "id": "currency",
    "title": "Moeda",
    "columns": [],
    "filters": [],
    "sections": [
      {
        "title": "Moeda",
        "fields": [
          "Código*",
          "Símbolo*",
          "Nome*"
        ]
      }
    ],
    "actions": [
      "Guardar"
    ],
    "note": "Moeda aprovada: MZN / MT. Não é alterada pela demonstração.",
    "approval": false
  },
  {
    "id": "firebase",
    "title": "Notificações e OTP",
    "columns": [],
    "filters": [],
    "sections": [
      {
        "title": "Autenticação e notificações",
        "fields": [
          "Fornecedor OTP",
          "Notificações activas:Sim,Não",
          "Configuração segura@unavailable"
        ]
      }
    ],
    "actions": [
      "Guardar"
    ],
    "note": "Fornecedor ainda não seleccionado; não introduzir credenciais.",
    "approval": true
  },
  {
    "id": "languages",
    "title": "Idiomas",
    "columns": [
      "ID",
      "Imagem",
      "Nome",
      "Nome em inglês",
      "Código",
      "País",
      "RTL",
      "Estado",
      "Padrão"
    ],
    "filters": [
      "Estado",
      "RTL:Sim,Não"
    ],
    "sections": [
      {
        "title": "Idioma",
        "fields": [
          "Nome*",
          "Nome em inglês*",
          "Código*",
          "País",
          "RTL:Sim,Não",
          "Estado:Activo,Inactivo",
          "Padrão:Sim,Não",
          "Ordem@number"
        ]
      },
      {
        "title": "Traduções",
        "fields": [
          "Ficheiro app@unavailable",
          "Ficheiro painel@unavailable"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Editar",
      "Editar JSON app",
      "Editar JSON painel",
      "Eliminar"
    ],
    "note": "Português de Moçambique como idioma inicial.",
    "approval": false
  },
  {
    "id": "integrations",
    "title": "Integrações",
    "columns": [],
    "filters": [],
    "sections": [
      {
        "title": "Tempo real",
        "fields": [
          "Fornecedor",
          "Configuração segura@unavailable"
        ]
      },
      {
        "title": "Mapas",
        "fields": [
          "Fornecedor de mapas",
          "Mapas activos:Sim,Não"
        ]
      },
      {
        "title": "E-mail",
        "fields": [
          "Fornecedor SMTP",
          "Remetente@email",
          "Nome do remetente",
          "Segredos SMTP@unavailable"
        ]
      }
    ],
    "actions": [
      "Guardar"
    ],
    "note": "Integrações e segredos configurados apenas no servidor.",
    "approval": false
  },
  {
    "id": "subscriptionSettings",
    "title": "Configuração de subscrições",
    "columns": [],
    "filters": [],
    "sections": [
      {
        "title": "Subscrições",
        "fields": [
          "Activar:Sim,Não",
          "Métodos de pagamento",
          "Lembrete de expiração*"
        ]
      }
    ],
    "actions": [
      "Guardar"
    ],
    "note": "Modelo por aprovar.",
    "approval": true
  },
  {
    "id": "radius",
    "title": "Raio de procura de motoristas",
    "columns": [],
    "filters": [],
    "sections": [
      {
        "title": "Rondas de pesquisa",
        "fields": [
          "Ronda 1 (km)*@number",
          "Ronda 2 (km)*@number",
          "Ronda 3 (km)*@number",
          "Activo:Sim,Não"
        ]
      }
    ],
    "actions": [
      "Guardar"
    ],
    "note": "Raios a aprovar; atribuição híbrida preservada.",
    "approval": false
  },
  {
    "id": "admins",
    "title": "Administradores",
    "columns": [
      "Avatar",
      "Nome",
      "E-mail",
      "Telefone",
      "Função",
      "Estado"
    ],
    "filters": [
      "Função",
      "Estado",
      "Online:Sim,Não"
    ],
    "sections": [
      {
        "title": "Conta administrativa",
        "fields": [
          "Nome*",
          "E-mail*@email",
          "Telefone*",
          "Função*",
          "Palavra-passe@unavailable",
          "Estado:Activo,Inactivo"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Consultar",
      "Editar"
    ],
    "note": "Não cria administradores reais; convite seguro e validação no servidor pendentes.",
    "approval": false
  },
  {
    "id": "roles",
    "title": "Funções",
    "columns": [
      "Nome",
      "Permissões"
    ],
    "filters": [],
    "sections": [
      {
        "title": "Função",
        "fields": [
          "Nome*"
        ]
      },
      {
        "title": "Permissões",
        "fields": [
          "Consultar:Sim,Não",
          "Criar:Sim,Não",
          "Editar:Sim,Não",
          "Eliminar:Sim,Não",
          "Todas:Sim,Não"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Editar",
      "Eliminar"
    ],
    "note": "Matriz por recurso ainda por implementar; não altera permissões.",
    "approval": false
  },
  {
    "id": "permissions",
    "title": "Permissões",
    "columns": [
      "Nome",
      "Funções"
    ],
    "filters": [],
    "sections": [
      {
        "title": "Permissão",
        "fields": [
          "Nome*",
          "Funções"
        ]
      }
    ],
    "actions": [
      "Criar",
      "Editar",
      "Eliminar"
    ],
    "note": "Permissões reais exclusivamente no servidor.",
    "approval": false
  },
  {
    "id": "updates",
    "title": "Actualizações do sistema",
    "columns": [],
    "filters": [],
    "sections": [
      {
        "title": "Versão",
        "fields": [
          "Versão instalada@unavailable"
        ]
      }
    ],
    "actions": [
      "Consultar"
    ],
    "note": "A TWENDE usa GitHub; não utiliza código de compra do eTaxi.",
    "approval": false
  },
  {
    "id": "tickets",
    "title": "Tickets de suporte",
    "columns": [
      "Ticket",
      "Utilizador",
      "Assunto",
      "Categoria",
      "Estado",
      "Prioridade",
      "Responsável",
      "Última resposta"
    ],
    "filters": [
      "Estado",
      "Prioridade",
      "Categoria",
      "Responsável",
      "Requer atenção:Sim,Não",
      "Sem responsável:Sim,Não",
      "Desde@date",
      "Até@date"
    ],
    "sections": [],
    "actions": [
      "Consultar"
    ],
    "note": "Módulo adicional de suporte.",
    "approval": false
  },
  {
    "id": "appeals",
    "title": "Contestações",
    "columns": [
      "Contestação",
      "Motivo",
      "Data",
      "Estado"
    ],
    "filters": [
      "Estado"
    ],
    "sections": [],
    "actions": [
      "Consultar"
    ],
    "note": "Direito de contestação aprovado.",
    "approval": false
  },
  {
    "id": "audit",
    "title": "Auditoria",
    "columns": [
      "Acção",
      "Responsável",
      "Entidade",
      "Data"
    ],
    "filters": [
      "Responsável",
      "Desde@date",
      "Até@date"
    ],
    "sections": [],
    "actions": [
      "Consultar"
    ],
    "note": "Auditoria administrativa protegida.",
    "approval": false
  }
];
