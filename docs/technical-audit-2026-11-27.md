# Auditoria técnica inicial — 27/11/2026
Base: relatório técnico eTaxi, índice p.3, módulos 01–48; inventário do GitHub main e esquema Supabase. Não é certificação de produção.
## Verificação
- 33 tabelas públicas com RLS activo; bucket driver-private-documents privado, limite 10 MB.
- Teste SQL de identidade sintética não administrativa: RPC admin_dashboard recusado; zero linhas retornadas em staff_assignments, driver_documents, wallet_entries e audit_events. Não equivale a teste completo de isolamento com dados preenchidos ou contas reais.
- Advisor de segurança: leaked password protection desactivada. Advisor de performance: três tipos de alertas (foreign keys sem índice, índice não usado, múltiplas políticas permissivas). Revisão pendente.
- Sem execuções GitHub Actions antes da auditoria; clone local indisponível por DNS e Bun ausente. Compilação/testes não confirmados.
## Correcções
- Fronteira de sessão para passageiro/motorista: remonta componentes quando o UUID da sessão muda, descartando estados da conta anterior. RLS continua obrigatório.
- Autenticação: texto actualizado e limpeza de credenciais locais ao sair.
- Upload: erro não reutiliza silenciosamente ficheiro anterior; recuperação de upload órfão ainda pendente.
- Módulos não integrados: desactivados formulários de registos fictícios; descrição e campos previstos continuam consultáveis.
## Matriz do relatório (estado de integração, não teste de aceitação)
| Nº | Módulo | Estado / lacuna |
|---|---|---|
|01|Dashboard|Parcial: indicadores reais, métricas comerciais em falta|
|02|Bookings|Piloto: negociação manual, ciclo de viagem incompleto|
|03|Cities|Parcial: rascunhos, activação pendente|
|04|Zones|Parcial: vértices, mapa e activação pendentes|
|05|Subscription Plans|Pendente: aprovação comercial|
|06|Driver Subscriptions|Pendente|
|07|Ride Types|Parcial: tipos e tarifas inactivos|
|08|Cancellation Policies|Parcial: regras, sem cobrança|
|09|Drivers|Integrado por testar|
|10|Customers|Integrado por testar|
|11|Driver Tracking|Parcial: GPS pontual, sem mapa|
|12|Cash Collection Points|Pendente|
|13|Document Lists|Parcial: verificação, sem renovação|
|14|Driver Incentives|Rascunhos|
|15|Withdrawal Requests|Pendente|
|16|Driver Report Tickets|Integrado por testar|
|17|Send Notification|Rascunhos, sem envio|
|18|Promo Code|Rascunhos, sem aplicação|
|19|Referral Bonuses|Rascunhos|
|20|Referral Network|Pendente|
|21|City Tax Rules|Pendente: validação fiscal|
|22|Commissions|Piloto|
|23|Invoices|Pendente|
|24|Transactions|Piloto|
|25|Wallets|Piloto|
|26|Wallet Transactions|Piloto|
|27|Refund Settings|Rascunho|
|28|Refund Requests|Parcial: pedido sem liquidação|
|29|Support Chat|Integrado por testar, sem tempo real|
|30|About Us|Publicação disponível, por testar|
|31|Privacy Policy|Rascunho jurídico|
|32|Terms & Conditions|Rascunho jurídico|
|33|Contact Us|Publicação disponível, por testar|
|34|Banner Images|Rascunhos, sem upload|
|35|FAQs|Publicação disponível, por testar|
|36|App Settings|Rascunhos|
|37|Payment Methods|Piloto, fornecedores desligados|
|38|Referral Amount Settings|Rascunhos|
|39|Currency Settings|MZN fixo, consulta|
|40|Firebase Settings|Rascunhos, sem integração|
|41|Languages|Rascunhos, tradução incompleta|
|42|Integration Settings|Rascunhos|
|43|Subscription Settings|Rascunhos|
|44|Driver Search Radius|Rascunhos|
|45|Admin Users|Parcial: atribuição a contas existentes|
|46|Roles|Parcial: auditoria apenas delegada|
|47|Permissions|Parcial: matriz proposta|
|48|System Update|Pendente|
## Prioridades de lançamento
P0: compilação, testes de isolamento com contas distintas, acesso Auth e protecção de senhas, revisão de políticas de dados/documentos e correcções de fluxo.
P1: mapas/rotas, disponibilidade real, atribuição híbrida, ciclo de corrida, cancelamento, validação financeira e integração dos fornecedores; preços e regras aprovados.
P2: módulos restantes e UX, publicação e testes Android/iOS. Não activar operações reais antes de validação ponta a ponta.
