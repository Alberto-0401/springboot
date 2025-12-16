package dam.saruman.controller;

import dam.saruman.entity.Enemigo;
import dam.saruman.service.EnemigoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/enemigo/buscar")
    public List<Enemigo> buscarPorNombre(@RequestParam String nombre){
        return enemigoService.buscarPorNombre(nombre);
    }

    @GetMapping("/enemigo/csv")
    public ResponseEntity<String> exportarCSV(){
        String csv = enemigoService.exportarCSV();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "enemigos.csv");
        return ResponseEntity.ok().headers(headers).body(csv);
    }

    @PostMapping("/enemigo")
    public Enemigo crearEnemigo(@Valid @RequestBody Enemigo enemigo){
        return enemigoService.guardar(enemigo);
    }

    @DeleteMapping("/enemigo/{id}")
    public void eliminarEnemigo(@PathVariable String id){
        enemigoService.eliminar(id);
    }

    @PutMapping("/enemigo/{id}")
    public Enemigo actualizarEnemigo(@PathVariable String id, @Valid @RequestBody Enemigo enemigo){
        enemigo.setId(id);
        return enemigoService.guardar(enemigo);
    }

}
