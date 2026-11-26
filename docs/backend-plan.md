# TWENDE — Plano de dados e segurança
Em 26-11-2026, por decisão do proprietário, a base de dados passou a ser gerida directamente no Supabase ovchyktojhrbydigwmzq, com o Lovable apenas para visualização. A migração twende_initial_core_schema criou as 13 tabelas. A integração gerada foi preservada; os tipos gerados ainda precisam de sincronização.

## Modelo proposto
- profiles: user_id ligado a auth.users, nome e contactos; leitura e edição pelo titular.
- user_roles: permissões atribuídas exclusivamente por serviço autorizado; nunca por metadata editável pelo utilizador. Administração provisionada fora do registo público.
- driver_applications: estado pendente, aprovado, rejeitado, suspenso; aprovação administrativa após verificação dos dez requisitos aprovados.
- driver_documents: metadados e referências a storage privado, acesso pelo titular e revisores autorizados; telefone verificado via Auth.
- vehicles: carro ou motociclo, associado a motorista aprovado.
- rides e ride_offers: participantes, estado, proposta e contrapropostas, preço acordado, atribuição híbrida; transições validadas no servidor.
- wallets e wallet_entries: razão contabilística imutável, saldo calculado, cobrança atómica e idempotente da comissão. Sem escrita directa pelo cliente.
- platform_settings: comissão inicial 10%, janela gratuita 2 min, ausência 5 min, taxas ainda por definir; alteração administrativa auditada.
- cancellation_events e appeals: motivos, excepção de segurança, advertências e contestação.
- audit_events: trilho de operações administrativas; retenção e acesso restritos.

## Requisitos antes da activação
RLS em todas as tabelas expostas, grants mínimos explícitos, sem acesso anon a dados privados; políticas por titular e função atribuída no servidor; nenhum auto-aprovamento. Storage privado com políticas próprias. Montantes em unidades inteiras de centavos; validar estados e concorrência em transacções. Testar duas identidades distintas, tentativas de escalada, duplo débito e acesso a documentos. Confirmar domínio de redireccionamento, SMTP, telefone/SMS e gestão de sessões antes de abrir registos ao público. A interface de conta actual é experimental e não confere privilégios.
