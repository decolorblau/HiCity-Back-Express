# HICITY - API REST

FULL STACK PROJECT

Esta aplicación full stack desarrollada en React Native y testeada en Jest. En back esta testeado más del 90% del codigo con test unitarios y de componentes. En front el porcentage actualmente esta en un 60%, pero se esta trabajando para llegar a más de un 80%, con test unitarios, test de componentes y snapshots.
L'applicación es una audioguía libre para todo el mundo, pensada para descubrir sitios nuevos, su cultura y su historia.
El objetivo de HiCity es conseguir crear una red extensa de puntos icónicos, culturas e historias por todo el mundo explicadas por los mismos lugareños. Por esta razón, es un proyecto editado de manera colaborativa. Todos los usuarios registrados pueden crear, editar y borrar su contenido, y todas las personas son bienvenidas a sumarse al proyecto.
Esta pensado en un formato mixto de texto y audio, para permitir ya no sólo, más comodidad en su uso, sino también que sea una app más accesible para muchas más personas.
Todo el proyecto está desarrollado bajo los principios básicos de SOLID y DRY, y para esto me he ayudado de herramientas como ESLint, SonarQube, Husky y workflows para GitHub Actions.
En versiones futuras el usuario dispondrá también de una parte privada en la que podrá crear carpetas dónde guardar y organizar sus puntos icónicos favoritos. Así tendrá la posibilidad de crearse sus propios tours turísticos por días o guardar los sitios que más le han gustado de una ciudad.
También se implementará un editor de contenido. Un buscador en el mapa y más idiomas, actualmente sólo está disponible en español.

\- Puedes encontrar el directorio frontend de esta aplicación aquí: https://github.com/decolorblau/HICITY-FRONT.git

\- Puedes encontrar el diseño de la versión completa de la aplicación aquí: https://www.figma.com/proto/6qkgdWj8tZqYa0vxDRw3MK/HiCity?page-id=0%3A1&node-id=29%3A1264&viewport=241%2C48%2C0.28&scaling=scale-down&starting-point-node-id=29%3A1264

## TECNOLOGIAS UTILIZADAS:

\- FRONTEND: React Native – Expo – Typescript – Redux – Jest – ESLint – SonarQube

\- BACKEND: Express – Typescript - MongoDB – Mongoose – Jest - Firebase – Bcrypt - JSON Web Token – PostMan – ESLint – SonarQube – Husky - Heroku

\- DISEÑO: Figma, Trello

## COMANDOS PARA LANZAR LA APLICACIÓN:

### DIRECTORIO BACKEND:

#### - Lanzar el servidor:

```
npm start
```

#### - Copilar Typescript:

```
npm run ts-compile
```

#### - Lanzar test unitarios:

```
npm test
```

#### - Lanzar test unitarios con coverage:

```
npm run test-cov
```

#### - Lanzar test de rutas:

```
npm run supertest
```

### DIRECTORIO FONTEND:

#### - Lanzar aplicación:

```
yarn start
```

#### - Lanzar test unitarios:

```
yarn test
```

#### - Lanzar test unitarios con coverage:

```
yarn test-cov
```
