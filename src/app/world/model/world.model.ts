import { WorldMapListDto } from './world-map-list-dto.model'

export class World {
  id:          string;
  name:        string;
  era:         string;
  desc:        string;
  sessions:    any;
  maps:        WorldMapListDto[];
  dateCreated: string;
  dateUpdated: string;
}
