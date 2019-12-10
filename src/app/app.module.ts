import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { WorldComponent } from './world/world.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { HeaderComponent } from './header/header.component';
import { MatSidenavModule, MatFormFieldModule, MatExpansionModule, MatButtonModule,
   MatDialogModule, MatProgressSpinnerModule, MatInputModule, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    WorldComponent,
    HeaderComponent,
    ProgressSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ColorPickerModule,
    FormsModule,
    MatButtonModule,
    MatSidenavModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatIconModule
  ],
  entryComponents: [  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
