import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DxPieChartModule } from 'devextreme-angular';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { AppComponent } from './app.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ExpenseItemComponent } from './expense-list/expense-item/expense-item.component';
import { HeaderComponent } from './header/header.component';
import { AuthComponent } from './auth/auth.component';
import { SummaryComponent } from './summary/summary.component';
import { UserComponent } from './user/user.component';
import { UserService } from './shared/user.service';
import { FooterComponent } from './footer/footer.component';
import { RouteService } from './shared/route.service';
import { PieChartComponent } from './shared/pie-chart/pie-chart.component';
import { ExcelService } from './shared/excel.service';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';


@NgModule({
  declarations: [
    AppComponent,
    ExpenseListComponent,
    ExpenseItemComponent,
    HeaderComponent,
    AuthComponent,
    SummaryComponent,
    UserComponent,
    FooterComponent,
    PieChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    DxPieChartModule,
    AngularFireModule.initializeApp(environment.firebase, 'expense-tracker'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA],
  providers: [UserService, RouteService, ExcelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
