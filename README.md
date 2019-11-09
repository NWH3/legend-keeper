## LegendKeeper

Application used to display, edit, save, and upload a D3 hex map along with game session tracking/notes for any wanted Table Top Role Playing Games (TTRPGs).

## Tech Stack

- Angular 8
- ngx-color-picker
- D3
- jwt-decode

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.12.

## Development Deployment

First install all dependencies with `npm install`
Then run `ng serve --host 0.0.0.0` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Docker Deployment

Run `docker build -t legend-keeper .` to build the docker image
Then run `docker run -p 80:80 --name=lk -d legend-keeper` to start the docker container with the running UI

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
Run `ng build --prod` for a production ready build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
