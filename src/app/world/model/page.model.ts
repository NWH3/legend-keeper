import { Sort } from './sort.model';

export class Page<T> {
  content:            T[];
  last:               boolean;
  totalPages:         number;
  totalElements:      number;
  size:               number;
  sort:               Sort;
  first:              boolean;
  numberOfElements:   number;
  pageable:           any;
}
