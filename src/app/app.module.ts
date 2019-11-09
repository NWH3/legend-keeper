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
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/interceptor/auth.interceptor';
import { SingleInputDialogComponent } from './single-input-dialog/single-input-dialog.component';
import { CreateWorldInputDialogComponent } from './create-world-input-dialog/create-world-input-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    WorldComponent,
    HeaderComponent,
    ProgressSpinnerComponent,
    SingleInputDialogComponent,
    CreateWorldInputDialogComponent
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
  entryComponents: [
    SingleInputDialogComponent,
    CreateWorldInputDialogComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
