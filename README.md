# Too Many Men

Too Many Men is an iOS, Android and web application for beer league hockey teams.

This repository is the [React Native Expo](https://expo.dev) frontend which consumes the [Ruby on Rails](https://rubyonrails.org) JSON API [whose source is here](https://github.com/pachun/too-many-men-api) and [is hosted here](https://too-many-men-api-8dcb4a385e6b.herokuapp.com).

### Features

[Pivotal Tracker](https://www.pivotaltracker.com/n/projects/2689515)

### Install

```
yarn install
```

### Run

[Install](#Install)

```
yarn start
```

### Test

[Install](#Install)

```
yarn test --collectCoverage
```

### Coverage Reports

[Test](#Test)

```
open coverage/lcov-report/index.html
```

### Preview Build (iOS & Android)

Optional `--platform ios|android` flag.

```
eas build --profile preview
```

### iOS Preview Update

```
eas update --branch preview --auto
```
