package com.example.SujetStage.repositories;

import com.example.SujetStage.entities.LienEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LienEvaluationRepository extends JpaRepository<LienEvaluation, Long> {
    Optional<LienEvaluation> findByToken(String token);
    java.util.List<LienEvaluation> findByIdFormulaire(int idFormulaire);
}


