import { Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';

export const routes: Routes = [
    {path:'',component:ListComponent},
    {path:'view/:name',component:ViewComponent},
    {path:'**',component:ListComponent}
];
