import { NgModule, ModuleWithProviders } from '@angular/core';
import {
  MatButtonModule, MatCardModule, MatIconModule, MatListModule, MatToolbarModule,
  MatFormFieldModule, MatInputModule, MatDividerModule, MatMenuModule, MatTableModule, MatAutocompleteModule, MatDialogModule, MatSortModule
} from '@angular/material';


const MATERIAL_MODULES: any[] = [
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatListModule,
  MatDividerModule,
  MatInputModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatMenuModule,
  MatTableModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatSortModule
];

@NgModule({
  imports: [
    MATERIAL_MODULES
  ],
  exports: [
    MATERIAL_MODULES
  ]
})
export class MaterialModule {
}
