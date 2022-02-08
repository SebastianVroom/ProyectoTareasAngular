import { Component, OnInit } from '@angular/core';
import { AsyncSubject } from 'rxjs';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  nuevaTarea= {desc:'',prio:''}
  lista = [] as any
  busqueda=''
  displayType = 0
  constructor() {}

  ngOnInit(): void {
    if(localStorage['listaTareas']){//Carga lista de storage
      this.lista = JSON.parse(localStorage['listaTareas'])
    }
    setInterval(()=>{this.actuaMin()},30000)//periodicamente actualiza contadores
    this.actuaMin()
  }

  addTarea(){//Añadir una tarea del input a la lista
    if (this.nuevaTarea.desc != '' && this.nuevaTarea.prio != '')
    this.lista.push({desc: this.nuevaTarea.desc, prio: this.nuevaTarea.prio,minCread:0,fecha:Date.now(),checked:false})
    this.GuardarALocal()
  }

  actuaMin(){//actualiza contadores de minutos de las tareas
    this.lista.map((el:any)=>{el.minCread = Math.floor((Date.now() - el.fecha)/60000)})
    this.GuardarALocal()
  }

  listaDisp(){//procesamiento (ordenar por prioridad, mostrar solo un tipo) de la lista antes de mostrarla
    let resul = this.lista.sort(this.sortKey)
    resul = (this.displayType == 0)?resul:(this.displayType == 1)?resul.filter((el: any)=>{return el.checked}):resul.filter((el: any)=>{return !el.checked})
    return (this.busqueda != '')?resul.filter((el:any)=>{return el.desc.includes(this.busqueda)}):resul
  }

  borrarTarea(index: number){//borra tarea de la lista y guarda cambios
    this.lista.splice(index,1)
    this.GuardarALocal()
  }

  checkToggle(index: number){//Cambia el estado de la tarea entre completado y no
    this.lista[index].checked = (this.lista[index].checked)?false:true
    this.GuardarALocal()
  }

  ajustDisp(val : number){//Ajusta las variable que indica las tareas visibles
    this.displayType = val
  }

  ajustPrio(val:string,index:number){//Ajusta la prioridad de una tarea
    this.lista[index].prio = val
  }

  sortKey(a:any,b:any){//ordena las lista por prioridad
    let prioa = (a.prio == 'Alta')?3:(a.prio == 'Media')?2:1
    let priob = (b.prio == 'Alta')?3:(b.prio == 'Media')?2:1
    return priob - prioa
  }

  borrarCompletadas(){//Borra todas las tareas completadas
    this.lista = this.lista.filter(function(el:any){return (el.checked)?false:true})
    this.GuardarALocal()
  }

  GuardarALocal(){//Guarda la lista a local storage
    localStorage.setItem("listaTareas",JSON.stringify(this.lista))
  }

  tareasCompletadas(){//Cuenta las tareas completadas para el contador
    return this.lista.reduce(function(acu:number, el:any){
      return(el.checked)?acu + 1: acu
    },0)
  }

}
