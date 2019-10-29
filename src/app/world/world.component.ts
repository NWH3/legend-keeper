import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import * as d3hexbin from "d3-hexbin";
import Symbaroum_Map from "../../assets/Symbaroum_Map.json";
import Symbaroum_World_Data from "../../assets/Symbaroum_World_Data.json";

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss']
})
export class WorldComponent implements OnInit {

  private world;
  private svg;
  private bins;
  private hexRadius;

  private editMode;
  private editTextMode;
  private editColorMode;
  private showSessions;
  private isEditing;
  private isLoading;

  private color;
  private textColor;
  private textSize;
  private editText;
  private mapWidth;
  private mapHeight;
  private brushWidth;

  private specialChrRegex = /['"^&*#$@!\s]/g;

  constructor() { }

  ngOnInit() {
    this.isLoading = false;
    this.world = Symbaroum_World_Data;
    this.textSize = 20;
    this.hexRadius = 14;
    this.textColor = '#000';
    this.brushWidth = 1;
    this.mapWidth = 100;
    this.mapHeight = 100;
    this.editText = '';
    this.editMode = false;
    this.showSessions = false;
    this.editTextMode = false;
    this.editColorMode = false;
    this.isEditing = false;
    this.bins = Symbaroum_Map;
    this.loadHexagonMap();
  }

  loadHexagonMap() {
    this.isLoading = true;
    var hexbin = d3hexbin.hexbin();
    var self = this;
    this.svg = d3.select("svg")
      .attr('pointer-events', 'all')
      .call(d3.zoom().scaleExtent([0.05, 20]).on("zoom", function () {
        if (!self.isEditing) {
          self.svg.transition()
                 .duration('5')
                 .attr("transform", d3.event.transform);
        }
      }))
      .append("g")
      .attr("transform","translate(0,0)");

    hexbin = hexbin.radius(this.hexRadius);
    var paths = d3.select("g").selectAll("path");

    this.svg.append("g")
      .attr("class", "hexagon")
      .selectAll("path")
      .data(this.bins)
      .enter().append("path")
      .attr("d", hexbin.hexagon())
      .attr("transform", function(d) {
        if (d != undefined && d != null) {
          return "translate(" + d.x + "," + d.y + ")";
        } else {
          return "translate(0,0)";
        }
      })
      .style("fill", function(d, i) {
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
          return "rgb(88, 133, 82)";
        }
      })
      .attr("stroke-width", 2)
      .attr("stroke", "black")
      .on('mouseover', function (d, i) {
        d3.select(this).transition()
               .duration('5')
               .attr('opacity', '.85');

        if (self.editColorMode) {
          self.updateHexagonColor(this, d, i, self);
        }
      })
      .on('mouseout', function (d) {
        d3.select(this).transition()
             .duration('5')
             .attr('opacity', '1');
      })
      .on('click', function(d, i) {
        if (self.editColorMode) {
          self.isEditing = !self.isEditing;
          self.updateHexagonColor(this, d, i, self);
        }

        if (self.editTextMode) {
          self.updateHexagonText(d, i, self);
        }
      })
      .append("svg:title");
      this.isLoading = false;
  }

  updateHexagonColor(node, d, i, self) {
    if (self.isEditing
        && self.editColorMode
        && self.color
        && self.color.trim() != '' ) {
       d3.select(node).style("fill", self.color);
       d.color = self.color;
       for (var j = 1; j < self.brushWidth; j++) {
         if (node.parentElement.childNodes.length > (i + j)) {
          var pathRight = node.parentElement.childNodes[i + j];
          pathRight.color = self.color;
          d3.select(pathRight).style("fill", self.color);
          self.bins[i + j].color = self.color;
         }
         if (node.parentElement.childNodes.length > (i - j)) {
          var pathLeft = node.parentElement.childNodes[i - j];
          pathLeft.color = self.color;
          d3.select(pathLeft).style("fill", self.color);
          self.bins[i - j].color = self.color;
         }
       }
    }
  }

  updateHexagonText(d, i, self) {
    if (d.text) {
      console.log(d.text.replace(self.specialChrRegex, '_').trim() + i);
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
      console.log(d.text.replace(self.specialChrRegex, '_').trim() + i + " and " + d.textSize);
      self.svg.append('text')
        .text(d.text)
        .attr('x', d.x)
        .attr('y', d.y)
        .attr('id', d.text.replace(self.specialChrRegex, '_').trim() + i)
        .attr('font-size', self.textSize)
        .attr('fill', d.textColor);
    }
  }

  generateNewMap(element) {
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
    this.svg.selectAll("g").remove();
    this.svg.selectAll("text").remove();
    this.loadHexagonMap();
  }

  uploadMap(fileName) {
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
      self.svg.selectAll("*").remove();
      self.loadHexagonMap();
    };
    reader.readAsText(file);
  }

  saveMap(element) {
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
    dom.setAttribute("href", url);
    dom.setAttribute("download", "WorldMap.json");

    if (document.createEvent) {
      var event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      dom.dispatchEvent(event);
    } else {
      dom.click();
    }
  }

  updateText(element) {
    this.editText = (<HTMLInputElement>document.getElementById('edit-text')).value;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    const editOptionsContinaer = document.getElementById("world-map-color-picker-container");
    if (editOptionsContinaer.style.display === "none") {
      editOptionsContinaer.style.display = "block";
    } else {
      editOptionsContinaer.style.display = "none";
      if (this.isEditing) {
         this.isEditing = !this.isEditing;
      }
    }
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
