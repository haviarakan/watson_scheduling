import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WattchargeComponent } from './wattcharge/wattcharge.component';
import { LoginComponent } from './login/login.component';
import { ParticipantComponent } from './participant/participant.component';
import { PaymentreportComponent } from './paymentreport/paymentreport.component';
import { EngageComponent } from './engage/engage.component';
import { CustomerComponent } from './customer/customer.component';
import { EtemplateComponent } from './etemplate/etemplate.component';
import { AuthGuard } from './core/auth.guard';
import { SalesleadComponent } from './saleslead/saleslead.component';
import { TagComponent } from './tag/tag.component';
import { TagCategoryComponent } from './tag-category/tag-category.component';
import { BigqueryComponent } from './bigquery/bigquery.component';
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
import { SaleInitiationComponent } from './sale-initiation/sale-initiation.component';
import { BillingverificationComponent } from './billingverification/billingverification.component';
import { NewSalesComponent } from './new-sales/new-sales.component';
import{OnboardingscreenComponent} from './onboardingscreen/onboardingscreen.component';
import { SaleConfirmationComponent } from './sale-confirmation/sale-confirmation.component';
import { AssigneventtypeComponent } from './assigneventtype/assigneventtype.component';
import { EventAvailabiliyComponent } from './event-availabiliy/event-availabiliy.component';
import { EISSchedulingComponent } from './eis-scheduling/eis-scheduling.component';
import { AddEisComponent } from './eis-scheduling/add-eis/add-eis.component';
import { AddProductComponent } from './eis-scheduling/add-product/add-product.component';



const routes: Routes = [
// { path: '', redirectTo: '/wattcharge', pathMatch: 'full' },
  { path: 'wattcharge', component: WattchargeComponent, canActivate: [AuthGuard]  },
  { path: 'login', component: LoginComponent },
  { path: 'participant/:id', component: ParticipantComponent, canActivate: [AuthGuard] },
  { path: 'paymentreport', component: PaymentreportComponent, canActivate: [AuthGuard] },
  { path: 'engage', component: EngageComponent, canActivate: [AuthGuard] },
  { path: 'customer', component: CustomerComponent, canActivate: [AuthGuard] },
  { path: 'etemplate', component: EtemplateComponent, canActivate: [AuthGuard] },
  { path: 'saleslead', component: SalesleadComponent, canActivate:[AuthGuard]},
  { path: 'tag', component: TagComponent, canActivate:[AuthGuard]},
  { path: 'tag-category', component: TagCategoryComponent, canActivate:[AuthGuard]},
  { path: 'bigquery', component: BigqueryComponent, canActivate:[AuthGuard]},
  { path: 'journey-log',component:JourneyLogComponent,canActivate:[AuthGuard]},
  { path: 'Journey/:participant.id',component:JourneySummaryComponent,canActivate:[AuthGuard]},
  { path: 'tokengenerator',component:TokengeneratorComponent},
  { path: 'cometovenue',component:CometovenueComponent,canActivate:[AuthGuard]},
  { path: 'atvenue',component:AtvenueComponent,canActivate:[AuthGuard]},
  { path: 'queuedisplay',component:QueuedisplayComponent,canActivate:[AuthGuard]},
  {path:'confirmationform',component:ConfirmationformComponent},
  {path:'thankyoupage/:email',component:ThankyoupageComponent},
  {path:'roleassign',component:RoleassignComponent,canActivate:[AuthGuard]},
  {path:'email',component:EmailComponent },
  {path:'stagequeuemanagement',component:StagequeuemanagementComponent,canActivate: [AuthGuard]},
  {path: 'adminform', component: AdminformComponent, canActivate: [AuthGuard] },
  {path: 'Formtemplate/:form.id',component:FormTemplateComponent,canActivate:[AuthGuard]},
  {path:'Formdetails/:form.id',component:AdminformslookComponent,canActivate:[AuthGuard]},
  {path: 'form/:form.name', component:FormComponent, canActivate: [AuthGuard] },
  {path:'milestone',component:MilestoneComponent,canActivate:[AuthGuard]},
  {path:'emailfilter',component:EmailfilterComponent,canActivate:[AuthGuard]},
  {path:'webinarlive',component:LoginscreenComponent},
  {path:'test',component:TesComponent},
  { path: 'tesla-log',component:TeslaLogComponent,canActivate:[AuthGuard]},
  { path: 'tesla/:participant.id',component:TeslaComponent,canActivate:[AuthGuard]},
  {path:'sale_initiation',component:SaleInitiationComponent,canActivate:[AuthGuard]},
  {path:'billingverification',component:BillingverificationComponent},
  { path:'new_sales',component:NewSalesComponent,canActivate:[AuthGuard]},
  { path: "onboarding_screen", component: OnboardingscreenComponent,canActivate:[AuthGuard]},
  {path:"sale_confirmationform/:id",component:SaleConfirmationComponent,canActivate:[AuthGuard]},
  {path:"assign_eventtype",component:AssigneventtypeComponent,canActivate:[AuthGuard]},
  {path:"event_availability",component:EventAvailabiliyComponent,canActivate:[AuthGuard]},
  {path:"eis_scheduling",component:EISSchedulingComponent,canActivate:[AuthGuard]},
  {path:"add_eis",component:AddEisComponent,canActivate:[AuthGuard]},
  {path:"add_product",component:AddProductComponent,canActivate:[AuthGuard]},
];






@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
