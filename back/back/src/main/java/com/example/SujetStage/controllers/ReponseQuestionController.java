package com.example.SujetStage.controllers;

import com.example.SujetStage.entities.ReponseQuestion;
import com.example.SujetStage.services.ReponseQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reponses-question")
public class ReponseQuestionController {
    @Autowired
    private ReponseQuestionService reponseQuestionService;

    @PostMapping("/add")
    public ResponseEntity<ReponseQuestion> addReponseQuestion(@RequestBody ReponseQuestion rq) {
        return ResponseEntity.ok(reponseQuestionService.addReponseQuestion(rq));
    }

    @GetMapping
    public List<ReponseQuestion> getAllReponsesQuestion() {
        return reponseQuestionService.getAllReponsesQuestion();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReponseQuestion> getReponseQuestionById(@PathVariable int id) {
        return reponseQuestionService.getReponseQuestionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/question/{idQuestion}")
    public List<ReponseQuestion> getReponsesByQuestionId(@PathVariable int idQuestion) {
        return reponseQuestionService.getReponsesByQuestionId(idQuestion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReponseQuestion> updateReponseQuestion(@PathVariable int id, @RequestBody ReponseQuestion rq) {
        if (!reponseQuestionService.getReponseQuestionById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        rq.setId(id);
        return ResponseEntity.ok(reponseQuestionService.updateReponseQuestion(rq));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReponseQuestion(@PathVariable int id) {
        if (!reponseQuestionService.getReponseQuestionById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        reponseQuestionService.deleteReponseQuestion(id);
        return ResponseEntity.noContent().build();
    }
} 