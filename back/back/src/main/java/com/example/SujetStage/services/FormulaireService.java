package com.example.SujetStage.services;

import com.example.SujetStage.entities.Formulaire;
import com.example.SujetStage.repositories.FormulaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FormulaireService {
    @Autowired
    private FormulaireRepository formulaireRepository;

    public Formulaire addFormulaire(Formulaire f) {
        return formulaireRepository.save(f);
    }

    public List<Formulaire> getAllFormulaires() {
        return formulaireRepository.findAll();
    }

    public Optional<Formulaire> getFormulaireById(int id) {
        return formulaireRepository.findById(id);
    }

    public Formulaire updateFormulaire(Formulaire f) {
        return formulaireRepository.save(f);
    }

    public void deleteFormulaire(int id) {
        formulaireRepository.deleteById(id);
    }
}