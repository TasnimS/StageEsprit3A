package com.example.SujetStage.services;

import com.example.SujetStage.entities.ReponseFormulaire;
import com.example.SujetStage.repositories.ReponseFormulaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReponseFormulaireService {
    @Autowired
    private ReponseFormulaireRepository reponseFormulaireRepository;

    public ReponseFormulaire addReponseFormulaire(ReponseFormulaire rf) {
        return reponseFormulaireRepository.save(rf);
    }

    public List<ReponseFormulaire> getAllReponsesFormulaire() {
        return reponseFormulaireRepository.findAll();
    }

    public Optional<ReponseFormulaire> getReponseFormulaireById(int id) {
        return reponseFormulaireRepository.findById(id);
    }

    public List<ReponseFormulaire> getReponsesByFormulaireId(int idFormulaire) {
        return reponseFormulaireRepository.findByIdFormulaire(idFormulaire);
    }

    public List<ReponseFormulaire> getReponsesByUtilisateurId(int idUtilisateur) {
        return reponseFormulaireRepository.findByIdUtilisateur(idUtilisateur);
    }

    public ReponseFormulaire updateReponseFormulaire(ReponseFormulaire rf) {
        return reponseFormulaireRepository.save(rf);
    }

    public void deleteReponseFormulaire(int id) {
        reponseFormulaireRepository.deleteById(id);
    }
} 