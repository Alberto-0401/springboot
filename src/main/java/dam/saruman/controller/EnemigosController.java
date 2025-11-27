package dam.saruman.controller;

import dam.saruman.entity.Enemigo;
import dam.saruman.service.EnemigoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EnemigosController {
    @Autowired
    private EnemigoService enemigoService;

    @GetMapping("/enemigo")
    public List<Enemigo> obtenerEnemigos(){
        return enemigoService.obtenerEnemigo();
    }

    @PostMapping("/enemigo")
    public Enemigo crearEnemigo(@RequestBody Enemigo enemigo){
        return enemigoService.guardar(enemigo);
    }

    @DeleteMapping("/enemigo/{id}")
    public void eliminarEnemigo(@PathVariable Long id){
        enemigoService.eliminar(id);
    }

    @PutMapping("/enemigo/{id}")
    public Enemigo actualizarEnemigo(@PathVariable Long id, @RequestBody Enemigo enemigo){
        enemigo.setId(id);
        return enemigoService.guardar(enemigo);
    }

}
