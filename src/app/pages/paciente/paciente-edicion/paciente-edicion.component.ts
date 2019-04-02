import { Paciente } from './../../../_model/paciente';
import { PacienteService } from './../../../_service/paciente.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-paciente-edicion',
  templateUrl: './paciente-edicion.component.html',
  styleUrls: ['./paciente-edicion.component.css']
})
export class PacienteEdicionComponent implements OnInit {

  id: number;
  form: FormGroup;
  edicion: boolean = false;
  paciente: Paciente;


  constructor(private route: ActivatedRoute, private router: Router, private pacienteService: PacienteService) { 
    this.form = new FormGroup({
      'codigo' : new FormControl(0),
      'nombre' : new FormControl(''),
      'apellido' : new FormControl(''),
      'edad' : new FormControl('')
    });
  }

  ngOnInit() {
    this.paciente = new Paciente();
    this.route.params.subscribe( (params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  initForm(){
    if(this.edicion){
      //cargar la data del servicio en el form
      console.log("Entro111");
      this.pacienteService.listarPacientePorId(this.id).subscribe(data => {
        console.log("Entro2222");
        this.form = new FormGroup({
        
          'codigo' : new FormControl(data.codigo),
          'nombre' : new FormControl(data.nombre),
          'apellido' : new FormControl(data.apellido),
          'edad' : new FormControl(data.edad)
        });
      });
    }
  }

  operar(){
    console.log("Entro");
    this.paciente.codigo = this.form.value['codigo'];
    this.paciente.nombre = this.form.value['nombre'];
    this.paciente.apellido = this.form.value['apellido'];
    this.paciente.edad = this.form.value['edad']

    if(this.edicion){
      //actualizar
      console.log("Entro");
      this.pacienteService.modificar(this.paciente).subscribe(data => {
        this.pacienteService.listar().subscribe(pacientes => {
          this.pacienteService.pacienteCambio.next(pacientes);
          this.pacienteService.mensajeCambio.next('Se modificó');
        });
      });
    }else{
      //registrar
      this.pacienteService.registrar(this.paciente).subscribe(data => {
        this.pacienteService.listar().subscribe(pacientes => {
          this.pacienteService.pacienteCambio.next(pacientes);
          this.pacienteService.mensajeCambio.next('Se registró');
        });
      });
    }

    this.router.navigate(['paciente']);
  }

}
