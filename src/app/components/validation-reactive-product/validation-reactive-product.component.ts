import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Producto } from 'src/app/models/producto';
import { Randoms } from 'src/app/funciones-utiles/aleatorios';

@Component({
  selector: 'app-validation-reactive-product',
  templateUrl: './validation-reactive-product.component.html',
  styleUrls: ['./validation-reactive-product.component.scss'],
})

export class ValidationReactiveProductComponent implements OnInit {
  @Input() button_label: string;
  @Input() product_test_INPUT !: Producto;
  @Output() product_validated_OUTPUT = new EventEmitter();
  options_quantity: string[];
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.options_quantity = Producto.getMedidadDefault();
  }

  ngOnInit() {
    if(this.product_test_INPUT === undefined){
      this.product_test_INPUT = new Producto();
    }
    this.form = this.fb.group({
      nombre: new FormControl(this.product_test_INPUT.nombre, [Validators.required, Validators.maxLength(32), Validators.pattern("^[A-Za-z]+[A-Za-z\ ]*[A-Za-z]+")]),
      cantidad: new FormControl(this.product_test_INPUT.cantidad, [Validators.required, Validators.min(1), Validators.max(99999999)]),
      medida: new FormControl(this.product_test_INPUT.medida, [Validators.required, Validators.maxLength(16), Validators.pattern("^[A-Za-z]+[A-Za-z\ ]*[A-Za-z]+")]),
      precio: new FormControl(this.product_test_INPUT.precio, [Validators.required, Validators.min(0), Validators.max(99999999)]),
    });
  }

  enviarFormulario() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    // display form values on success
    let product_update:Producto = new Producto();
    for (const propiedad in this.form.value) {
      product_update[propiedad] = this.form.value[propiedad];
    }
    product_update.precio_total = product_update.cantidad*product_update.precio;
    this.product_validated_OUTPUT.emit(product_update);
    this.limpiarFormulario();
//    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.form.value, null, 4));
  }

  generarEjemplo(){
    this.form = this.fb.group({
      nombre: [Randoms.getStr(7), [Validators.required, Validators.maxLength(32), Validators.pattern("^[A-Za-z]+[A-Za-z\ ]*[A-Za-z]+")]],
      cantidad: [Randoms.getInt(2), [Validators.required, Validators.min(1), Validators.max(99999999)]],
      medida: ["Piezas", [Validators.required, Validators.maxLength(16), Validators.pattern("^[A-Za-z]+[A-Za-z\ ]*[A-Za-z]+")]],
      precio: [Randoms.getInt(2), [Validators.required, Validators.min(0), Validators.max(99999999)]],
    });
  }
  
  limpiarFormulario() {
    this.form.reset();
  }
}
