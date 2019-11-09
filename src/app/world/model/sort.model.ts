
export enum SortDirection {
    ASC = 'ASC' ,
    DESC = 'DESC'
}

export class Sort {
  direction:          string;
  property:           string;
  ignoreCase:         boolean;
  ascending:          boolean;
  descending:         boolean;
}
