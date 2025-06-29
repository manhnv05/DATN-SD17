package com.example.datn.Repository;

import com.example.datn.Entity.DotGiamGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.Optional;

public interface DotGiamGiaRepository extends JpaRepository<DotGiamGia, Integer>, JpaSpecificationExecutor<DotGiamGia> {

    Optional<DotGiamGia> findFirstByMaDotGiamGiaStartingWithOrderByMaDotGiamGiaDesc(String prefix);

}