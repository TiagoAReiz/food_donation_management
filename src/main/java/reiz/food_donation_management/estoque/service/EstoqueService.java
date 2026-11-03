package reiz.food_donation_management.estoque.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reiz.food_donation_management.common.exception.NaoEncontradoException;
import reiz.food_donation_management.common.exception.NegocioException;
import reiz.food_donation_management.common.util.DataUtil;
import reiz.food_donation_management.common.util.Quantidades;
import reiz.food_donation_management.doacao.entity.Alimento;
import reiz.food_donation_management.doacao.entity.SituacaoDoacao;
import reiz.food_donation_management.doacao.repository.AlimentoRepository;
import reiz.food_donation_management.estoque.dto.EstoqueItemResponse;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EstoqueService {

    private final AlimentoRepository alimentoRepository;

    /** Visão do administrador: todo o estoque físico, em ordem FEFO (RN07). */
    @Transactional(readOnly = true)
    public List<EstoqueItemResponse> listar() {
        return alimentoRepository.findEstoque(DataUtil.hoje()).stream().map(EstoqueItemResponse::of).toList();
    }

    /** Visão da entidade: só o que ainda está livre para pedir, em ordem FEFO (RN07). */
    @Transactional(readOnly = true)
    public List<EstoqueItemResponse> listarLivre() {
        return alimentoRepository.findEstoqueLivre(DataUtil.hoje()).stream().map(EstoqueItemResponse::of).toList();
    }

    @Transactional(readOnly = true)
    public List<EstoqueItemResponse> vencidos() {
        return alimentoRepository.findVencidos(DataUtil.hoje()).stream().map(EstoqueItemResponse::of).toList();
    }

    public EstoqueItemResponse ajustar(Integer alimentoId, BigDecimal qtdEmEstoque) {
        Alimento alimento = loteDoEstoqueParaAlterar(alimentoId);
        if (qtdEmEstoque.compareTo(alimento.getQuantidade()) > 0) {
            throw new NegocioException("A quantidade em estoque não pode ser maior que a quantidade recebida.");
        }
        if (qtdEmEstoque.compareTo(alimento.getQtdReservada()) < 0) {
            throw new NegocioException("Há " + Quantidades.texto(alimento.getQtdReservada()) + " "
                    + alimento.getUnidade().name().toLowerCase() + " de " + alimento.getNome()
                    + " reservados para pedidos aprovados. Recuse esses pedidos antes de baixar abaixo disso.");
        }
        alimento.setQtdDisponivel(qtdEmEstoque);
        return EstoqueItemResponse.of(alimentoRepository.save(alimento));
    }

    /**
     * Retirar vencido/estragado = zerar o lote, inclusive o que estava reservado.
     * Pedidos aprovados com esse lote não poderão ser entregues e devem ser recusados.
     */
    public EstoqueItemResponse retirar(Integer alimentoId, String motivo) {
        Alimento alimento = loteDoEstoqueParaAlterar(alimentoId);
        alimento.setQtdReservada(BigDecimal.ZERO);
        alimento.setQtdDisponivel(BigDecimal.ZERO);
        log.info("Lote {} retirado do estoque. Motivo: {}", alimentoId, motivo);
        return EstoqueItemResponse.of(alimentoRepository.save(alimento));
    }

    private Alimento loteDoEstoqueParaAlterar(Integer id) {
        Alimento alimento = alimentoRepository.findAllByIdForUpdate(List.of(id)).stream().findFirst()
                .orElseThrow(NaoEncontradoException::new);
        if (alimento.getDoacao().getSituacao() != SituacaoDoacao.RECEBIDA) {
            throw new NegocioException("Este alimento não faz parte do estoque.");
        }
        return alimento;
    }
}
