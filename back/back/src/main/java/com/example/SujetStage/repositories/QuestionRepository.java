package com.example.SujetStage.repositories;

import com.example.SujetStage.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findByIdFormulaire(int idFormulaire);
}