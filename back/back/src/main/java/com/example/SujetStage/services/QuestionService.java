package com.example.SujetStage.services;

import com.example.SujetStage.entities.Question;
import com.example.SujetStage.repositories.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {
    @Autowired
    private QuestionRepository questionRepository;

    public Question addQuestion(Question q) {
        return questionRepository.save(q);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Optional<Question> getQuestionById(int id) {
        return questionRepository.findById(id);
    }

    public List<Question> getQuestionsByFormulaireId(int idFormulaire) {
        return questionRepository.findByIdFormulaire(idFormulaire);
    }

    public Question updateQuestion(Question q) {
        return questionRepository.save(q);
    }

    public void deleteQuestion(int id) {
        questionRepository.deleteById(id);
    }
}