package dam.saruman.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "villanos")
public class Enemigo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column
    private String name;

    @Column
    private String partido;

    public Enemigo() {
    }

    public Enemigo(long id, String name, String partido) {
        this.id = id;
        this.name = name;
        this.partido = partido;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPartido() {
        return partido;
    }

    public void setPartido(String partido) {
        this.partido = partido;
    }
}
