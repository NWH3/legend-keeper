import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as d3 from 'd3';
import * as d3hexbin from 'd3-hexbin';
import { WorldListDto } from './model/world-list-dto.model';
import { WorldMapListDto } from './model/world-map-list-dto.model';
import { WorldSession } from './model/world-session.model';
import Symbaroum_Map_The_Ambrian_Struggle from "../../assets/Symbaroum_Map_The_Ambrian_Struggle.json";
import Symbaroum_Map_The_Ambrian_Struggle_Path from "../../assets/Symbaroum_Map_The_Ambrian_Struggle_Path.json";
import Symbaroum_Map_The_Wild_Elderfolk from "../../assets/Symbaroum_Map_The_Wild_Elderfolk.json";
import Symbaroum_World_Maps_The_Ambrian_Struggle from "../../assets/Symbaroum_World_Maps_The_Ambrian_Struggle.json";
import Symbaroum_World_Maps_The_Wild_Elderfolk from "../../assets/Symbaroum_World_Maps_The_Wild_Elderfolk.json";
import Symbaroum_World_Data_The_Ambrian_Struggle from "../../assets/Symbaroum_World_Data_The_Ambrian_Struggle.json";
import Symbaroum_World_Data_The_Wild_Elderfolk from "../../assets/Symbaroum_World_Data_The_Wild_Elderfolk.json";

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss']
})
export class WorldComponent implements OnInit {

  @ViewChild('drawer', {static: false}) drawer;
  @ViewChild('worldsDrawer', {static: false}) worldsDrawer;

  public world;
  public svg;
  public bins;
  public hexRadius;

  public worlds: any;
  public maps: any;

  public editMode;
  public editTextMode;
  public editColorMode;
  public colorEditDragMode;
  public showSessions;
  public showWorlds;
  public isEditing;
  public isLoading;

  public color;
  public textColor;
  public textSize;
  public editText;
  public mapWidth;
  public mapHeight;
  public brushWidth;

  private specialChrRegex = /[''^&*#$@!\s]/g;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.worlds = [
      {
        "id": "1",
        "name": "Symbaroum - The Ambrian Struggle",
        "era": "year 21 of Korinthia",
        "desc": "The adventures of Garibald, Greg, Jay, Purah, Ripley, and Vento in Symbaroum."
      },
      {
        "id": "2",
        "name": "Symbaroum - The Wild Elderfolk",
        "era": "year 21 of Korinthia",
        "desc": "The adventures of Grumpy, Hassson, and Ragoro in Symbaroum."
      }
    ];
    this.isLoading = false;
    this.textSize = 20;
    this.hexRadius = 14;
    this.textColor = '#000';
    this.brushWidth = 1;
    this.mapWidth = 100;
    this.mapHeight = 100;
    this.editText = '';
    this.editMode = false;
    this.showSessions = false;
    this.showWorlds = false;
    this.editTextMode = false;
    this.editColorMode = false;
    this.colorEditDragMode = false;
    this.isEditing = false;
    this.bins = Symbaroum_Map_The_Ambrian_Struggle;
    this.world = Symbaroum_World_Data_The_Ambrian_Struggle;
    this.maps = Symbaroum_World_Maps_The_Ambrian_Struggle;
    this.loadHexagonMap();
  }

  loadHexagonMap() {
    this.isLoading = true;
    var hexbin = d3hexbin.hexbin();
    var self = this;
    this.svg = d3.select('svg')
      .attr('pointer-events', 'all')
      .call(d3.zoom().scaleExtent([0.05, 20]).on('zoom', function () {
        if (!self.isEditing) {
          self.svg.transition()
                 .duration('5')
                 .attr('transform', d3.event.transform);
        }
      }))
      .append('g')
      .attr('transform','translate(0,0)');

    hexbin = hexbin.radius(this.hexRadius);
    var paths = d3.select('g').selectAll('path');

    this.svg.append('g')
      .attr('class', 'hexagon')
      .selectAll('path')
      .data(this.bins)
      .enter().append('path')
      .attr('d', hexbin.hexagon())
      .attr('transform', function(d) {
        if (d != undefined && d != null) {
          return 'translate(' + d.x + ',' + d.y + ')';
        } else {
          return 'translate(0,0)';
        }
      })
      .style('fill', function(d, i) {
        if (d.text && d.textSize) {
          self.svg.append('text')
            .text(d.text)
            .attr('x', d.x)
            .attr('y', d.y)
            .attr('id', d.text.replace(self.specialChrRegex, '_').trim() + i)
            .attr('font-size', d.textSize)
            .attr('fill', d.textColor);
        }
        if (d != undefined && d.color) {
          return d.color;
        } else {
          return 'rgb(88, 133, 82)';
        }
      })
      .attr('stroke-width', 2)
      .attr('stroke', 'black')
      .on('mouseover', function (d, i) {
        d3.select(this).transition()
               .duration('5')
               .attr('opacity', '.85');

        if (self.isEditing) {
          self.updateHexagonColor(this, d, i, self);
        }
      })
      .on('mouseout', function (d) {
        d3.select(this).transition()
             .duration('5')
             .attr('opacity', '1');
      })
      .on('click', function(d, i) {
        if (self.colorEditDragMode) {
          self.isEditing = !self.isEditing;
        }

        if (self.editColorMode) {
          self.updateHexagonColor(this, d, i, self);
        }

        if (self.editTextMode) {
          self.updateHexagonText(d, i, self);
        }
      })
      .append('svg:title');
      this.isLoading = false;
  }

  updateHexagonColor(node, d, i, self) {
    if (self.editColorMode
        && self.color
        && self.color.trim() != '' ) {
       d3.select(node).style('fill', self.color);
       d.color = self.color;
       for (var j = 1; j < self.brushWidth; j++) {
         if (node.parentElement.childNodes.length > (i + j)) {
          var pathRight = node.parentElement.childNodes[i + j];
          pathRight.color = self.color;
          d3.select(pathRight).style('fill', self.color);
          self.bins[i + j].color = self.color;
         }
         if (node.parentElement.childNodes.length > (i - j)) {
          var pathLeft = node.parentElement.childNodes[i - j];
          pathLeft.color = self.color;
          d3.select(pathLeft).style('fill', self.color);
          self.bins[i - j].color = self.color;
         }
       }
    }
  }

  updateHexagonText(d, i, self) {
    if (d.text) {
      self.svg.select('#' + d.text.replace(self.specialChrRegex, '_').trim() + i)
        .attr('x', d.x)
        .attr('y', d.y)
        .remove('text');
      d.text = null;
      d.textSize = null;
      d.textColor = null;
    }
    if (self.editText && self.editText.trim() != '' ) {
      d.text = self.editText;
      d.textSize = self.textSize;
      d.textColor = self.textColor;
      self.svg.append('text')
        .text(d.text)
        .attr('x', d.x)
        .attr('y', d.y)
        .attr('id', d.text.replace(self.specialChrRegex, '_').trim() + i)
        .attr('font-size', self.textSize)
        .attr('fill', d.textColor);
    }
  }

  generateNewMap() {
    this.isLoading = true;
    var hexbin = d3hexbin.hexbin();
    var points = [];
    // Map size of 100 X 100 by default, symbaroum map is 299 X 450
    for (var i = 0; i < this.mapHeight; i++) {
        for (var j = 0; j < this.mapWidth; j++) {
            points.push([this.hexRadius * j * 1, this.hexRadius * i * 1]);
        }
    }
    hexbin = hexbin.radius(this.hexRadius);
    this.bins = hexbin(points);
    // for (var i = 0; i < this.bins.length; i++) {
    //   this.bins[i].color = Symbaroum_Map[i].color;
    //   this.bins[i].text = Symbaroum_Map[i].text;
    //   this.bins[i].textSize = Symbaroum_Map[i].textSize;
    //   this.bins[i].textColor = Symbaroum_Map[i].textColor;
    // }
    this.svg.selectAll('*').remove();
    this.loadHexagonMap();
  }

  loadWorld(map: WorldListDto) {
    this.isLoading = true;
    if (map && map.id) {
      this.showWorlds = false;
      let self = this;
      this.worldsDrawer.close().then(r => {
        self.svg.selectAll('*').remove();

        if (map.id == "1") {
          self.bins = Symbaroum_Map_The_Ambrian_Struggle;
          self.world = Symbaroum_World_Data_The_Ambrian_Struggle;
          self.maps = Symbaroum_World_Maps_The_Ambrian_Struggle;
        } else if (map.id == "2") {
          self.bins = Symbaroum_Map_The_Wild_Elderfolk;
          self.world = Symbaroum_World_Data_The_Wild_Elderfolk;
          self.maps = Symbaroum_World_Maps_The_Wild_Elderfolk;
        }

        this.loadHexagonMap();
        this.isLoading = false;
      });

    }
  }

  loadWorldMap(worldMap: WorldMapListDto) {
    this.isLoading = true;
    if (worldMap && worldMap.id) {
      this.showWorlds = false;
      let self = this;
      this.worldsDrawer.close().then(r => {
        self.svg.selectAll('*').remove();

        if (worldMap.id == "Symbaroum_Map_The_Ambrian_Struggle") {
          self.bins = Symbaroum_Map_The_Ambrian_Struggle;
        } else if (worldMap.id == "Symbaroum_Map_The_Wild_Elderfolk") {
          self.bins = Symbaroum_Map_The_Wild_Elderfolk;
        } else if (worldMap.id == "Symbaroum_Map_The_Ambrian_Struggle_Path") {
          self.bins = Symbaroum_Map_The_Ambrian_Struggle_Path;
        }
        self.loadHexagonMap();
        self.isLoading = false;
      });

    }
  }

  uploadMap(fileName) {
    this.isLoading = true;
    var file = (<HTMLInputElement>document.getElementById('load-map')).files[0];
    if (!file) {
      console.log('No file found...')
      return;
    }
    var self = this;
    var reader = new FileReader();
    reader.onload = function(e) {
      var contents = reader.result;
      self.bins = JSON.parse((<string>contents));
      self.svg.selectAll('*').remove();
      self.loadHexagonMap();
    };
    reader.readAsText(file);
    this.isLoading = false;
  }

  downloadMap(element) {
    this.isLoading = true;
    // Copy over the bins to a new array for saving
    var binCopies = new Array<any>();
    for (let i = 0; i < this.bins.length; i++) {;
      binCopies[i] = {};
      binCopies[i].x = this.bins[i].x;
      binCopies[i].y = this.bins[i].y;
      binCopies[i][0] = this.bins[i][0];
      binCopies[i].color = this.bins[i].color;
      binCopies[i].text = this.bins[i].text;
      binCopies[i].textSize = this.bins[i].textSize;
      binCopies[i].textColor = this.bins[i].textColor;
    }

    const url= URL.createObjectURL(new Blob([JSON.stringify(binCopies)]));
    var dom = document.createElement('a');
    dom.setAttribute('href', url);
    dom.setAttribute('download', 'WorldMap.json');

    if (document.createEvent) {
      var event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      dom.dispatchEvent(event);
    } else {
      dom.click();
    }
    this.isLoading = false;
  }

  updateText(element) {
    this.editText = (<HTMLInputElement>document.getElementById('edit-text')).value;
  }

  toggleColorEditDragMode() {
    this.colorEditDragMode = !this.colorEditDragMode;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    const editOptionsContinaer = document.getElementById('world-map-color-picker-container');
    if (editOptionsContinaer.style.display === 'none') {
      editOptionsContinaer.style.display = 'block';
    } else {
      editOptionsContinaer.style.display = 'none';
      if (this.isEditing) {
         this.isEditing = !this.isEditing;
      }
    }
  }

  toggleWorldsMode() {
    this.showWorlds = !this.showWorlds;
    this.showSessions = false;
    this.drawer.close();
  }

  toggleSessionsMode() {
    this.showSessions = !this.showSessions;
    this.showWorlds = false;
    this.worldsDrawer.close();
  }

  toggleEditTextMode() {
    this.editTextMode = !this.editTextMode;
    this.editColorMode = false;
    if (this.isEditing) {
       this.isEditing = !this.isEditing;
    }
  }

  toggleEditColorMode() {
    this.editColorMode = !this.editColorMode;
    this.editTextMode = false;
    if (this.isEditing) {
       this.isEditing = !this.isEditing;
    }
  }
}
