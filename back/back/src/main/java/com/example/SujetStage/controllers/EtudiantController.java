package com.example.SujetStage.controllers;

import com.example.SujetStage.entities.Etudiant;
import com.example.SujetStage.repositories.EtudiantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/etudiants")
public class EtudiantController {

    @Autowired
    private EtudiantRepository etudiantRepository;

    // Get all evaluators
    @GetMapping
    public ResponseEntity<List<Etudiant>> getAllEtudiants() {
        List<Etudiant> etudiants = etudiantRepository.findAll();
        return ResponseEntity.ok(etudiants);
    }

    // Get evaluator by ID
    @GetMapping("/{id}")
    public ResponseEntity<Etudiant> getEtudiantById(@PathVariable Long id) {
        return etudiantRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new evaluator
    @PostMapping
    public ResponseEntity<Etudiant> createEtudiant(@RequestBody Etudiant etudiant) {
        Etudiant savedEtudiant = etudiantRepository.save(etudiant);
        return ResponseEntity.ok(savedEtudiant);
    }

    // Update evaluator
    @PutMapping("/{id}")
    public ResponseEntity<Etudiant> updateEtudiant(@PathVariable Long id, @RequestBody Etudiant etudiant) {
        return etudiantRepository.findById(id)
                .map(existingEtudiant -> {
                    existingEtudiant.setNom(etudiant.getNom());
                    existingEtudiant.setEmail(etudiant.getEmail());
                    existingEtudiant.setIdClasse(etudiant.getIdClasse());
                    return ResponseEntity.ok(etudiantRepository.save(existingEtudiant));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete evaluator
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtudiant(@PathVariable Long id) {
        return etudiantRepository.findById(id)
                .map(etudiant -> {
                    etudiantRepository.delete(etudiant);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

