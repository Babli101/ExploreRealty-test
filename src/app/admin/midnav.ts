import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
    selector: 'app-midnav',
    standalone: true,
    imports: [CommonModule,RouterLink],
    templateUrl: './midnav.html',
    styleUrls: ['./midnav.scss']
})
export class Midnav {

}
