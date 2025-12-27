package com.example.SujetStage.controllers;

import com.example.SujetStage.entities.ReponseFormulaire;
import com.example.SujetStage.services.ReponseFormulaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reponses-formulaire")
public class ReponseFormulaireController {
    @Autowired
    private ReponseFormulaireService reponseFormulaireService;

    @PostMapping("/add")
    public ResponseEntity<ReponseFormulaire> addReponseFormulaire(@RequestBody ReponseFormulaire rf) {
        return ResponseEntity.ok(reponseFormulaireService.addReponseFormulaire(rf));
    }

    @GetMapping
    public List<ReponseFormulaire> getAllReponsesFormulaire() {
        return reponseFormulaireService.getAllReponsesFormulaire();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReponseFormulaire> getReponseFormulaireById(@PathVariable int id) {
        return reponseFormulaireService.getReponseFormulaireById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/formulaire/{idFormulaire}")
    public List<ReponseFormulaire> getReponsesByFormulaireId(@PathVariable int idFormulaire) {
        return reponseFormulaireService.getReponsesByFormulaireId(idFormulaire);
    }

    @GetMapping("/utilisateur/{idUtilisateur}")
    public List<ReponseFormulaire> getReponsesByUtilisateurId(@PathVariable int idUtilisateur) {
        return reponseFormulaireService.getReponsesByUtilisateurId(idUtilisateur);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReponseFormulaire> updateReponseFormulaire(@PathVariable int id, @RequestBody ReponseFormulaire rf) {
        if (!reponseFormulaireService.getReponseFormulaireById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        rf.setId(id);
        return ResponseEntity.ok(reponseFormulaireService.updateReponseFormulaire(rf));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReponseFormulaire(@PathVariable int id) {
        if (!reponseFormulaireService.getReponseFormulaireById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        reponseFormulaireService.deleteReponseFormulaire(id);
        return ResponseEntity.noContent().build();
    }
} 