package dam.saruman.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller // Marca esta clase como un controlador MVC de Spring (devuelve vistas, no datos JSON)
public class HomeController {

    @RequestMapping("/")
    public String index(){
        // Retorna el nombre de la vista (archivo HTML) ubicada en resources/static o resources/templates
        return "index.html";
    }
}
