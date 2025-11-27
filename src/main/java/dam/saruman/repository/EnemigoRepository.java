package dam.saruman.repository;

import dam.saruman.entity.Enemigo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnemigoRepository extends JpaRepository<Enemigo, Long> {

    List<Enemigo> findByName(String name);



}
