package com.example.SujetStage.services;

import com.example.SujetStage.entities.ReponseQuestion;
import com.example.SujetStage.repositories.ReponseQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReponseQuestionService {
    @Autowired
    private ReponseQuestionRepository reponseQuestionRepository;

    public ReponseQuestion addReponseQuestion(ReponseQuestion rq) {
        return reponseQuestionRepository.save(rq);
    }

    public List<ReponseQuestion> getAllReponsesQuestion() {
        return reponseQuestionRepository.findAll();
    }

    public Optional<ReponseQuestion> getReponseQuestionById(int id) {
        return reponseQuestionRepository.findById(id);
    }

    public List<ReponseQuestion> getReponsesByQuestionId(int idQuestion) {
        return reponseQuestionRepository.findByIdQuestion(idQuestion);
    }

    public List<ReponseQuestion> getReponsesByReponseFormulaireId(Integer idReponseFormulaire) {
        return reponseQuestionRepository.findByIdReponseFormulaire(idReponseFormulaire);
    }

    public ReponseQuestion updateReponseQuestion(ReponseQuestion rq) {
        return reponseQuestionRepository.save(rq);
    }

    public void deleteReponseQuestion(int id) {
        reponseQuestionRepository.deleteById(id);
    }
} 