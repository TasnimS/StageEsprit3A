package com.example.SujetStage.repositories;

import com.example.SujetStage.entities.ReponseQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReponseQuestionRepository extends JpaRepository<ReponseQuestion, Integer> {
    List<ReponseQuestion> findByIdQuestion(int idQuestion);
    List<ReponseQuestion> findByIdReponseFormulaire(Integer idReponseFormulaire);
} 