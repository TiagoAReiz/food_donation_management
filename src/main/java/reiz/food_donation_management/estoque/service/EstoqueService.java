package reiz.food_donation_management.estoque.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reiz.food_donation_management.common.exception.NaoEncontradoException;
import reiz.food_donation_management.common.exception.NegocioException;
import reiz.food_donation_management.common.util.DataUtil;
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

    /** RN07: ordenado pela validade mais próxima (FEFO). */
    @Transactional(readOnly = true)
    public List<EstoqueItemResponse> listar() {
        return alimentoRepository.findEstoque(DataUtil.hoje()).stream().map(EstoqueItemResponse::of).toList();
    }

    @Transactional(readOnly = true)
    public List<EstoqueItemResponse> vencidos() {
        return alimentoRepository.findVencidos(DataUtil.hoje()).stream().map(EstoqueItemResponse::of).toList();
    }

    public EstoqueItemResponse ajustar(Integer alimentoId, BigDecimal qtdDisponivel) {
        Alimento alimento = loteDoEstoque(alimentoId);
        if (qtdDisponivel.compareTo(alimento.getQuantidade()) > 0) {
            throw new NegocioException("A quantidade disponível não pode ser maior que a quantidade recebida.");
        }
        alimento.setQtdDisponivel(qtdDisponivel);
        return EstoqueItemResponse.of(alimentoRepository.save(alimento));
    }

    /** Retirar vencido/estragado = zerar a quantidade disponível. */
    public EstoqueItemResponse retirar(Integer alimentoId, String motivo) {
        Alimento alimento = loteDoEstoque(alimentoId);
        alimento.setQtdDisponivel(BigDecimal.ZERO);
        log.info("Lote {} retirado do estoque. Motivo: {}", alimentoId, motivo);
        return EstoqueItemResponse.of(alimentoRepository.save(alimento));
    }

    private Alimento loteDoEstoque(Integer id) {
        Alimento alimento = alimentoRepository.findById(id).orElseThrow(NaoEncontradoException::new);
        if (alimento.getDoacao().getSituacao() != SituacaoDoacao.RECEBIDA) {
            throw new NegocioException("Este alimento não faz parte do estoque.");
        }
        return alimento;
    }
}
