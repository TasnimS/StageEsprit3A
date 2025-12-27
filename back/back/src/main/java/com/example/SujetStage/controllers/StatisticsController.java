package com.example.SujetStage.controllers;

import com.example.SujetStage.entities.ReponseFormulaire;
import com.example.SujetStage.entities.Formulaire;
import com.example.SujetStage.services.FormulaireService;
import com.example.SujetStage.services.ReponseFormulaireService;
import com.example.SujetStage.services.LienEvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "http://localhost:3000")
public class StatisticsController {

    @Autowired
    private FormulaireService formulaireService;

    @Autowired
    private ReponseFormulaireService reponseFormulaireService;

    @Autowired
    private LienEvaluationService lienEvaluationService;

    @GetMapping("/global")
    public ResponseEntity<Map<String, Object>> getGlobalStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        List<Formulaire> allForms = formulaireService.getAllFormulaires();
        List<ReponseFormulaire> allResponses = reponseFormulaireService.getAllReponsesFormulaire();
        
        // Total forms
        stats.put("totalForms", allForms.size());
        
        // Total responses
        stats.put("totalResponses", allResponses.size());
        
        // Average score across all responses
        if (!allResponses.isEmpty()) {
            double avgScore = allResponses.stream()
                .mapToDouble(ReponseFormulaire::getNoteGlobal)
                .average()
                .orElse(0.0);
            stats.put("averageScore", Math.round(avgScore * 100.0) / 100.0);
        } else {
            stats.put("averageScore", 0.0);
        }
        
        // Forms with responses count
        long formsWithResponses = allForms.stream()
            .filter(form -> !reponseFormulaireService.getReponsesByFormulaireId(form.getId()).isEmpty())
            .count();
        stats.put("formsWithResponses", formsWithResponses);
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/form/{formId}")
    public ResponseEntity<Map<String, Object>> getFormStatistics(@PathVariable int formId) {
        Map<String, Object> stats = new HashMap<>();
        
        Optional<Formulaire> formOpt = formulaireService.getFormulaireById(formId);
        if (formOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Formulaire form = formOpt.get();
            List<ReponseFormulaire> responses = reponseFormulaireService.getReponsesByFormulaireId(formId);
            List<String> links = lienEvaluationService.findByFormId(formId).stream()
                .map(l -> l.getToken())
                .collect(Collectors.toList());
        
        stats.put("formId", formId);
        stats.put("formTitle", form.getTitre() != null ? form.getTitre() : "");
        
        // Total responses
        stats.put("totalResponses", responses.size());
        
        // Total links sent
        stats.put("totalLinks", links.size());
        
        // Response rate (percentage)
        if (links.size() > 0) {
            double responseRate = (responses.size() * 100.0) / links.size();
            stats.put("responseRate", Math.round(responseRate * 100.0) / 100.0);
        } else {
            stats.put("responseRate", 0.0);
        }
        
        // Average score
        if (!responses.isEmpty()) {
            double avgScore = responses.stream()
                .mapToDouble(ReponseFormulaire::getNoteGlobal)
                .average()
                .orElse(0.0);
            stats.put("averageScore", Math.round(avgScore * 100.0) / 100.0);
            
            // Min and Max scores
            double minScore = responses.stream()
                .mapToDouble(ReponseFormulaire::getNoteGlobal)
                .min()
                .orElse(0.0);
            double maxScore = responses.stream()
                .mapToDouble(ReponseFormulaire::getNoteGlobal)
                .max()
                .orElse(0.0);
            stats.put("minScore", Math.round(minScore * 100.0) / 100.0);
            stats.put("maxScore", Math.round(maxScore * 100.0) / 100.0);
        } else {
            stats.put("averageScore", 0.0);
            stats.put("minScore", 0.0);
            stats.put("maxScore", 0.0);
        }
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/all-forms")
    public ResponseEntity<List<Map<String, Object>>> getAllFormsStatistics() {
        List<Formulaire> allForms = formulaireService.getAllFormulaires();
        List<Map<String, Object>> formsStats = new ArrayList<>();
        
        for (Formulaire form : allForms) {
            Map<String, Object> formStats = new HashMap<>();
            List<ReponseFormulaire> responses = reponseFormulaireService.getReponsesByFormulaireId(form.getId());
            List<String> links = lienEvaluationService.findByFormId(form.getId()).stream()
                .map(l -> l.getToken())
                .collect(Collectors.toList());
            
            formStats.put("formId", form.getId());
            formStats.put("formTitle", form.getTitre());
            formStats.put("totalResponses", responses.size());
            formStats.put("totalLinks", links.size());
            
            if (links.size() > 0) {
                double responseRate = (responses.size() * 100.0) / links.size();
                formStats.put("responseRate", Math.round(responseRate * 100.0) / 100.0);
            } else {
                formStats.put("responseRate", 0.0);
            }
            
            if (!responses.isEmpty()) {
                double avgScore = responses.stream()
                    .mapToDouble(ReponseFormulaire::getNoteGlobal)
                    .average()
                    .orElse(0.0);
                formStats.put("averageScore", Math.round(avgScore * 100.0) / 100.0);
            } else {
                formStats.put("averageScore", 0.0);
            }
            
            formsStats.add(formStats);
        }
        
        return ResponseEntity.ok(formsStats);
    }
}

