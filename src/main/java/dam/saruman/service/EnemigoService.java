package dam.saruman.service;


import dam.saruman.entity.Enemigo;
import dam.saruman.repository.EnemigoRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.StringWriter;
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
            System.out.println(enemigo);
        });
        return enemigos;
    } // Fin GET

    public List<Enemigo> buscarPorNombre(String nombre) {
        return enemigoRepository.findByName(nombre);
    }

    public String exportarCSV() {
        List<Enemigo> enemigos = enemigoRepository.findAll();
        StringWriter writer = new StringWriter();

        try {
            CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT
                    .withHeader("ID", "Nombre", "Partido"));

            for (Enemigo enemigo : enemigos) {
                csvPrinter.printRecord(
                    enemigo.getId(),
                    enemigo.getName(),
                    enemigo.getPartido()
                );
            }

            csvPrinter.flush();
            csvPrinter.close();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar CSV: " + e.getMessage());
        }

        return writer.toString();
    }

    public Enemigo guardar(Enemigo enemigo){
        return enemigoRepository.save(enemigo);
    } // Fin POST


    public void eliminar(String id){
        enemigoRepository.deleteById(id);
    } // Fin DELETE

}
