package com.example.SujetStage.repositories;

import com.example.SujetStage.entities.ReponseFormulaire;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReponseFormulaireRepository extends JpaRepository<ReponseFormulaire, Integer> {
    List<ReponseFormulaire> findByIdFormulaire(int idFormulaire);
    List<ReponseFormulaire> findByIdUtilisateur(int idUtilisateur);
} 