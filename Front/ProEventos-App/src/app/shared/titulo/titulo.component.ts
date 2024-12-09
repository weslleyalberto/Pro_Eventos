import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.scss']
})
export class TituloComponent implements OnInit {
   @Input() titulo!:string ;
   @Input() iconClass:string = 'fa fa-user' ;
   @Input() subtitulo:string  = "Desde 2024";
   @Input() botaoListar:boolean = false;
  constructor() { }

  ngOnInit() {
  }
   

}
