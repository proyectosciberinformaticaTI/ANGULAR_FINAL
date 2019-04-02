import { Component, OnInit, Inject } from '@angular/core';
import { Paciente } from 'src/app/_model/paciente';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-dialogo-component',
  templateUrl: './dialogo-component.component.html',
  styleUrls: ['./dialogo-component.component.css']
})
export class DialogoComponentComponent implements OnInit {
  paciente: Paciente;

  constructor(private dialogRef: MatDialogRef<DialogoComponentComponent>, @Inject(MAT_DIALOG_DATA) public data: Paciente, private medicoService: PacienteService) { }

  ngOnInit() {
    //this.medico = this.data;
    
    this.paciente = new Paciente();
    this.paciente.codigo = this.data.codigo;
    this.paciente.nombre = this.data.nombre;
    this.paciente.apellido = this.data.apellido;
    this.paciente.edad = this.data.edad;
  }

  cancelar() {
    this.dialogRef.close();
  }

  operar() {

    if (this.paciente != null && this.paciente.codigo > 0) {
      this.medicoService.modificar(this.paciente).subscribe(data => {
        this.medicoService.listar().subscribe(medicos => {
          this.medicoService.pacienteCambio.next(medicos);
          this.medicoService.mensajeCambio.next("Se modifico");
        });
      });
    } else {
      this.medicoService.registrar(this.paciente).subscribe(data => {        
          this.medicoService.listar().subscribe(medicos => {
            this.medicoService.pacienteCambio.next(medicos);
            this.medicoService.mensajeCambio.next("Se registro");
          });        
      });
    }
    this.dialogRef.close();
  }

}
