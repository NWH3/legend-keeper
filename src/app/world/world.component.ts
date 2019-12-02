import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { SingleInputDialogComponent } from '../single-input-dialog/single-input-dialog.component';;
import * as d3 from 'd3';
import * as d3hexbin from 'd3-hexbin';
import Symbaroum_Map from '../../assets/Symbaroum_Map.json';
import Symbaroum_World_Data from '../../assets/Symbaroum_World_Data.json';
import { AuthService } from '../auth/service/auth.service';
import { WorldService } from './service/world.service';
import { PageRequest } from './model/page-request.model';
import { Page } from './model/page.model';
import { WorldListDto } from './model/world-list-dto.model';
import { CreateWorldMapRequest } from './model/create-world-map-request.model';
import { CreateWorldRequest } from './model/create-world-request.model';
import { UpdateWorldRequest } from './model/update-world-request.model';
import { CreateWorldSessionRequest } from './model/create-world-session-request.model';
import { UpdateWorldSessionRequest } from './model/update-world-session-request.model';
import { CreateWorldInputDialogComponent } from '../create-world-input-dialog/create-world-input-dialog.component';
import { WorldSession } from './model/world-session.model';

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
  public pageRequest: PageRequest;
  public page: Page<WorldListDto>;
  public maps: any;

  public editMode;
  public editTextMode;
  public editColorMode;
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

  constructor(public dialog: MatDialog, private worldService: WorldService, private authService: AuthService) { }

  ngOnInit() {
    this.pageRequest = new PageRequest();
    this.worlds = [];
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
    this.isEditing = false;
    this.pageRequest.page = 0;

    this.getAllWorlds(this.pageRequest, true);
  }

  getAllWorlds(pageRequest: PageRequest, loadWorldMap: boolean): void {
    this.isLoading = true;
    this.worldService.getAllWorlds(this.pageRequest).subscribe((res) => {
        this.isLoading = false;
        if (res && res.body) {
          this.page = res.body;
          this.worlds = res.body.content;
          if (loadWorldMap) {
            this.getWorld(this.worlds[0].id);
          }
        }
    },
    error => {
      this.isLoading = false;
      if (error.status === 401) {
        this.authService.deleteToken();
      } else {
        console.log('Unable to find worlds...');
      }
    });
  }

  getWorldMap(mapId: string) {
    this.isLoading = true;
    const worldMap = this.worldService.getWorldMapById(mapId).subscribe((res) => {
        this.isLoading = false;
        if (res && res.body) {
          this.bins = JSON.parse(res.body.map);
          this.loadHexagonMap();
        }
    },
    error => {
      this.isLoading = false;
      if (error.status === 401) {
        this.authService.deleteToken();
      } else {
        console.log('Unable to find world map...');
      }
    });
  }

  getWorld(id: string) {
    this.isLoading = true;
    const worldMap = this.worldService.getWorldById(id).subscribe((res) => {
        this.isLoading = false;
        if (res && res.body) {
          this.world = res.body;
          this.maps = this.world.maps;
          if (this.world.maps && this.world.maps.length > 0) {
            this.getWorldMap(this.world.maps[0].id);
          }
        }
    },
    error => {
      this.isLoading = false;
      if (error.status === 401) {
        this.authService.deleteToken();
      } else {
        console.log('Unable to find world...');
      }
    });
  }

  updateWorldSession(session: WorldSession) {
    this.isLoading = true;
    let updateWorldSession = new UpdateWorldSessionRequest;
    updateWorldSession.worldId = this.world.id;
    updateWorldSession.id = session.id;
    updateWorldSession.name = session.name;
    updateWorldSession.desc = session.desc;
    this.worldService.updateWorldSession(updateWorldSession).subscribe((res) => {
        this.isLoading = false;
        if (res && res.body) {
          this.world = res.body;
        }
    },
    error => {
      this.isLoading = false;
      if (error.status === 401) {
        this.authService.deleteToken();
      } else {
        console.log('Unable to update world session...');
      }
    });
  }

  createWorldSession(createWorldSessionRequest: CreateWorldSessionRequest) {
    this.isLoading = true;
    this.worldService.createWorldSession(createWorldSessionRequest).subscribe((res) => {
        this.isLoading = false;
        if (res && res.body) {
          this.world = res.body;
          this.maps = this.world.maps;
        }
    },
    error => {
      this.isLoading = false;
      if (error.status === 401) {
        this.authService.deleteToken();
      } else {
        console.log('Unable to create world session...');
      }
    });
  }

  deleteWorldSession(sessionId: string) {
    this.isLoading = true;
    this.worldService.deleteWorldSession(this.world.id, sessionId).subscribe((res) => {
        this.isLoading = false;
        if (res && res.body) {
          this.world = res.body;
        }
    },
    error => {
      this.isLoading = false;
      if (error.status === 401) {
        this.authService.deleteToken();
      } else {
        console.log('Unable to delete world...');
      }
    });
  }

  deleteWorldSessionConfirm(sessionId: string, sessionName: string) {
    const dialogRef = this.dialog.open(SingleInputDialogComponent, {
      width:  '50%',
      data: { name: sessionName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result == sessionName) {
        this.deleteWorldSession(sessionId);
      } else if (result && result != sessionName) {
        alert('Please type name exactly as spelled.')
      }
    });
  }

  createNewWorldSession(element) {
    const dialogRef = this.dialog.open(CreateWorldInputDialogComponent, {
      width: '50%',
      height: '30%',
      data: { name: '', desc: '' }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.name) {
        let request = new CreateWorldSessionRequest;
        request.name = data.name;
        request.desc = data.desc;
        request.worldId = this.world.id;
        this.createWorldSession(request);
      } else if (!data.isCancel) {
        alert('Name is required');
      }
    });
  }

  deleteWorld(worldId: string) {
    this.isLoading = true;
    this.worldService.deleteWorld(worldId).subscribe((res) => {
        this.isLoading = false;
        if (res && res.body) {
          this.getAllWorlds(this.pageRequest, false);
        }
    },
    error => {
      this.isLoading = false;
      if (error.status === 401) {
        this.authService.deleteToken();
      } else {
        console.log('Unable to delete world...');
      }
    });
  }

  deleteWorldConfirm(worldId: string, worldName: string) {
    const dialogRef = this.dialog.open(SingleInputDialogComponent, {
      width:  '50%',
      data: { name: worldName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result == worldName) {
        this.deleteWorld(worldId);
      } else if (result && result != worldName) {
        alert('Please type name exactly as spelled.')
      }
    });
  }

  updateWorld(world: WorldListDto) {
    this.isLoading = true;
    let updateWorld = new UpdateWorldRequest;
    updateWorld.id = world.id;
    updateWorld.name = world.name;
    updateWorld.desc = world.desc;
    updateWorld.era = world.era;
    this.worldService.updateWorld(updateWorld).subscribe((res) => {
        this.isLoading = false;
        if (res && res.body) {
          this.world = res.body;
        }
    },
    error => {
      this.isLoading = false;
      if (error.status === 401) {
        this.authService.deleteToken();
      } else {
        console.log('Unable to update world...');
      }
    });
  }

  createWorld(createWorldRequest: CreateWorldRequest) {
    this.isLoading = true;
    this.worldService.createWorld(createWorldRequest).subscribe((res) => {
        this.isLoading = false;
        if (res && res.body) {
          this.world = res.body;
          this.maps = this.world.maps;
          this.showWorlds = false;
          this.worldsDrawer.close();
          this.getAllWorlds(this.pageRequest, false);
          this.generateNewMap();
        }
    },
    error => {
      this.isLoading = false;
      if (error.status === 401) {
        this.authService.deleteToken();
      } else {
        console.log('Unable to create world...');
      }
    });
  }

  createNewWorld(element) {
    const dialogRef = this.dialog.open(CreateWorldInputDialogComponent, {
      width: '50%',
      height: '50%',
      data: { name: '', era: '', desc: '' }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.name && data.era) {
        let request = new CreateWorldRequest;
        request.name = data.name;
        request.era = data.era;
        request.desc = data.desc;
        this.createWorld(request);
      } else if (!data.isCancel) {
        alert('Name and era are required');
      }
    });
  }

  saveWorldMap(name: string) {
    this.isLoading = true;
    let request: CreateWorldMapRequest = new CreateWorldMapRequest();
    request.name = name;
    request.worldId = this.world.id;
    request.creator = this.authService.getUsername();

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

    request.mapData = JSON.stringify(binCopies);

    const worldMap = this.worldService.createWorldMap(request).subscribe((res) => {
        this.isLoading = false;
        if (res && res.body) {
          this.world = res.body;
          this.maps = this.world.maps;
        }
    },
    error => {
      this.isLoading = false;
      if (error.status === 401) {
        this.authService.deleteToken();
      } else {
        console.log('Unable to create world map...');
      }
    });
  }

  deleteWorldMapConfirm(mapId: string, mapName: string) {
    const dialogRef = this.dialog.open(SingleInputDialogComponent, {
      width:  '50%',
      data: { name: mapName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result == mapName) {
        this.deleteWorldMap(mapId);
      } else {
        alert('Please type name exactly as spelled.')
      }
    });
  }

  deleteWorldMap(mapId: string) {
    this.isLoading = true;
    this.worldService.deleteWorldMap(this.world.id, mapId).subscribe((res) => {
        this.isLoading = false;
        if (res && res.body) {
          this.world = res.body;
          this.maps = this.world.maps;
          if (this.world.maps && this.world.maps.length > 0) {
            this.getWorldMap(this.world.maps[0].id);
          }
        }
    },
    error => {
      this.isLoading = false;
      if (error.status === 401) {
        this.authService.deleteToken();
      } else {
        console.log('Unable to delete world map...');
      }
    });
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
      .append('svg:title');
      this.isLoading = false;
  }

  updateHexagonColor(node, d, i, self) {
    if (self.isEditing
        && self.editColorMode
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
      console.log(d.text.replace(self.specialChrRegex, '_').trim() + i + ' and ' + d.textSize);
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

  loadWorldMap(map: WorldListDto) {
    if (map && map.id) {
      this.showWorlds = false;
      this.worldsDrawer.close();
      this.svg.selectAll('*').remove();
      this.getWorldMap(map.id);
    }
  }

  loadWorld(map: WorldListDto) {
    if (map && map.id) {
      this.showWorlds = false;
      this.worldsDrawer.close();
      this.svg.selectAll('*').remove();
      this.getWorld(map.id);
    }
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
      self.svg.selectAll('*').remove();
      self.loadHexagonMap();
    };
    reader.readAsText(file);
  }

  downloadMap(element) {
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
  }

  updateText(element) {
    this.editText = (<HTMLInputElement>document.getElementById('edit-text')).value;
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

  moveNext(): void {
    if ((this.pageRequest.page + 1) < this.page.totalPages) {
      this.pageRequest.page = this.page.pageable.pageNumber + 1;
      this.getAllWorlds(this.pageRequest, false);
    }
  }

  moveBack(): void {
    if (this.pageRequest.page > 0) {
      this.pageRequest.page = this.page.pageable.pageNumber - 1;
      this.getAllWorlds(this.pageRequest, false);
    }
  }

  moveToStart(): void {
    this.pageRequest.page = 0;
    this.getAllWorlds(this.pageRequest, false);
  }

  moveToEnd(): void {
    this.pageRequest.page = this.page.totalPages - 1;
    this.getAllWorlds(this.pageRequest, false);
  }

  openMapNameDialog(): void {
    const dialogRef = this.dialog.open(SingleInputDialogComponent, {
      width:  '50%',
      data: { name: 'map name' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveWorldMap(result);
      }
    });
  }
}
