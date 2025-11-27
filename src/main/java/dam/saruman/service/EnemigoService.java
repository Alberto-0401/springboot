package dam.saruman.service;


import dam.saruman.entity.Enemigo;
import dam.saruman.repository.EnemigoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnemigoService {
    @Autowired
    private EnemigoRepository enemigoRepository;

    public List<Enemigo> obtenerEnemigo() {
        List<Enemigo> enemigos = enemigoRepository.findAll();

        if (enemigos.isEmpty()) {
            System.out.println("Estoy to triste");
        } else {
            System.out.println("Esto va to flama");
        }

        enemigos.forEach(enemigo -> {
            System.out.println();
        });
        return enemigos;
    }//Fin GET

    public Enemigo guardar(Enemigo enemigo){
        return enemigoRepository.save(enemigo);
    }//Fin POST

    public void eliminar(Long id){
        enemigoRepository.deleteById(id);
    }//Fin DELETE

}
