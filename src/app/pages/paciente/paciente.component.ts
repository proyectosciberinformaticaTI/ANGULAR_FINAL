import { Paciente } from './../../_model/paciente';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { PacienteService } from '../../_service/paciente.service';
import { DialogoComponentComponent } from './dialogo-component/dialogo-component.component';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {

  dataSource: MatTableDataSource<Paciente>
  displayedColumns = ['CODIGO', 'NOMBRE', 'APELLIDO', 'EDAD',"ACCIONES"];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private pacienteService: PacienteService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {

    this.pacienteService.pacienteCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.pacienteService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'Aviso', { duration: 2000 });
    });

    this.pacienteService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
 
 
  }
   openDialog(paciente :Paciente){
    let med = paciente != null ? paciente : new Paciente();
    this.dialog.open(DialogoComponentComponent, {
      width: '250px',
      disableClose: true,
      data: med
    })
   }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  eliminar(idPaciente: number){
    this.pacienteService.eliminar(idPaciente).subscribe(data => {
      this.pacienteService.listar().subscribe(data => {
        this.pacienteService.pacienteCambio.next(data);
        this.pacienteService.mensajeCambio.next('Se eliminó');
      });      
    });
  }

}
