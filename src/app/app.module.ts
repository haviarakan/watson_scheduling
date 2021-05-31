import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './/app-routing.module';
import { WattchargeComponent } from './wattcharge/wattcharge.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './core/auth.guard';
import { CoreModule } from './core/core.module';
import { WindowRef } from './WindowRef';
import * as firebase from "firebase";
import { ParticipantComponent } from './participant/participant.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';

import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select'
import {MatCheckboxModule} from '@angular/material/checkbox';
import { PaymentreportComponent } from './paymentreport/paymentreport.component';
import { EngageComponent } from './engage/engage.component';
import { CustomerComponent } from './customer/customer.component';
import { EtemplateComponent } from './etemplate/etemplate.component';
import { SalesleadComponent } from './saleslead/saleslead.component';
import { TagComponent } from './tag/tag.component';
import { TagCategoryComponent } from './tag-category/tag-category.component';
import { BigqueryComponent } from './bigquery/bigquery.component';
import { HttpClientModule } from '@angular/common/http';
import { JourneyLogComponent } from './journey-log/journey-log.component';
import { JourneySummaryComponent } from './journey-summary/journey-summary.component';
import { TokengeneratorComponent } from './tokengenerator/tokengenerator.component';
import { CometovenueComponent } from './cometovenue/cometovenue.component';
import { AtvenueComponent } from './atvenue/atvenue.component';
import { QueuedisplayComponent } from './queuedisplay/queuedisplay.component';
import { ConfirmationformComponent } from './confirmationform/confirmationform.component';
import { ThankyoupageComponent } from './thankyoupage/thankyoupage.component';
import { RoleassignComponent } from './roleassign/roleassign.component';
import { EmailComponent } from './email/email.component';
import { StagequeuemanagementComponent} from './stagequeuemanagement/stagequeuemanagement.component';
import { FormComponent } from './form/form.component';
import { FormTemplateComponent } from './form-template/form-template.component';
import { AdminformComponent } from './adminform/adminform.component';
import { AdminformslookComponent } from './adminformslook/adminformslook.component';
import { MilestoneComponent } from './milestone/milestone.component';
import { EmailfilterComponent } from './emailfilter/emailfilter.component';
import { LoginscreenComponent } from './loginscreen/loginscreen.component';
import { TesComponent } from './tes/tes.component';
import { TeslaComponent } from './tesla/tesla.component';
import { TeslaLogComponent } from './tesla-log/tesla-log.component';
import { from } from 'rxjs';
import { NgxEditorModule } from 'ngx-editor';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SaleInitiationComponent } from './sale-initiation/sale-initiation.component';
import { BillingverificationComponent } from './billingverification/billingverification.component';
import { NewSalesComponent } from './new-sales/new-sales.component';
import { SaleConfirmationComponent } from './sale-confirmation/sale-confirmation.component';
import { OnboardingscreenComponent } from './onboardingscreen/onboardingscreen.component';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {DatePipe} from '@angular/common';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import { AssigneventtypeComponent } from './assigneventtype/assigneventtype.component';
import {MatListModule} from '@angular/material/list';
import { EventAvailabiliyComponent } from './event-availabiliy/event-availabiliy.component';
import { EISSchedulingComponent } from './eis-scheduling/eis-scheduling.component';
import { AddEisComponent } from './eis-scheduling/add-eis/add-eis.component';
import { AddNeweisdialogComponent } from './eis-scheduling/add-neweisdialog/add-neweisdialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { AddProductComponent } from './eis-scheduling/add-product/add-product.component';
import { AddNewproductDialogComponent } from './eis-scheduling/add-newproduct-dialog/add-newproduct-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    WattchargeComponent,
    LoginComponent,
    ParticipantComponent,
    PaymentreportComponent,
    EngageComponent,
    CustomerComponent,
    EtemplateComponent,
    SalesleadComponent,
    TagComponent,
    TagCategoryComponent,
    BigqueryComponent,
    JourneyLogComponent,
    JourneySummaryComponent,
    TokengeneratorComponent,
    CometovenueComponent,
    AtvenueComponent,
    QueuedisplayComponent,
   ConfirmationformComponent,
    ThankyoupageComponent,
    RoleassignComponent,
    EmailComponent,
    StagequeuemanagementComponent,
    FormComponent,
    FormTemplateComponent,
   
    AdminformComponent,
    AdminformslookComponent,
    MilestoneComponent,
    EmailfilterComponent,
    LoginscreenComponent,
    TesComponent,
    TeslaComponent,
    TeslaLogComponent,
    SaleInitiationComponent,
    BillingverificationComponent,
    NewSalesComponent,
    SaleConfirmationComponent,
    OnboardingscreenComponent,
    AssigneventtypeComponent,
    EventAvailabiliyComponent,
    EISSchedulingComponent,
    AddEisComponent,
    AddNeweisdialogComponent,
    AddProductComponent,
    AddNewproductDialogComponent
    
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'Wastson-Admin'),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    FormsModule, AppRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    CoreModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatDatepickerModule,
    AngularFireStorageModule,
    NgxEditorModule,  
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatCardModule,
    MatPaginatorModule,
    MatListModule,
    MatDialogModule,
    MatIconModule,
   NgMultiSelectDropDownModule.forRoot()
  
  //   NgxSlackModule.initializeApp('https://app.slack.com/client/T1E57BR8F/DDK4C86CU'),
   ],
  providers: [AuthGuard, WindowRef,DatePipe],
  bootstrap: [AppComponent],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA 
  ]
})
export class AppModule { }
