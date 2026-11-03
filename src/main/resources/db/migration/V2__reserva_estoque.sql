-- Quantidade reservada por solicitações aprovadas e ainda não entregues.
-- Livre para novos pedidos = qtd_disponivel - qtd_reservada.
ALTER TABLE alimento ADD COLUMN qtd_reservada NUMERIC(10,2) NOT NULL DEFAULT 0;

ALTER TABLE alimento ADD CONSTRAINT ck_alimento_reservada
  CHECK (qtd_reservada >= 0 AND qtd_reservada <= qtd_disponivel);

-- Reserva o que já estava aprovado antes desta migração.
UPDATE alimento a
SET qtd_reservada = LEAST(a.qtd_disponivel, r.total)
FROM (
  SELECT i.alimento_id, SUM(i.quantidade) AS total
  FROM item_solicitacao i
  JOIN solicitacao s ON s.id = i.solicitacao_id
  WHERE s.situacao = 'APROVADA'
  GROUP BY i.alimento_id
) r
WHERE r.alimento_id = a.id;

DROP VIEW vw_estoque;

CREATE VIEW vw_estoque AS
SELECT a.id, a.nome, a.categoria,
       a.qtd_disponivel - a.qtd_reservada AS qtd_livre,
       a.qtd_reservada, a.qtd_disponivel, a.unidade, a.validade
FROM alimento a
JOIN doacao d ON d.id = a.doacao_id
WHERE d.situacao = 'RECEBIDA'
  AND a.qtd_disponivel > 0
  AND a.validade >= CURRENT_DATE
ORDER BY a.validade;
