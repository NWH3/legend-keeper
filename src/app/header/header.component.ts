import { Component, OnInit } from '@angular/core';
import Symbaroum_World_Data from "../../assets/Symbaroum_World_Data.json";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private world;

  private editMode;

  constructor() { }

  ngOnInit() {
    this.editMode = false;
    this.world = Symbaroum_World_Data;
  }

}
