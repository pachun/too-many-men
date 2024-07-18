# Too Many Men

Too Many Men is an iOS, Android and web application for beer league hockey teams.

This repository is the [React Native Expo](https://expo.dev) frontend which consumes the [Ruby on Rails](https://rubyonrails.org) JSON API [whose source is here](https://github.com/pachun/too-many-men-api) and [is hosted here](https://too-many-men-api-8dcb4a385e6b.herokuapp.com).

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

---

### Builds & Deploys

Typically, to deploy, we only need to do `git push [remote] main` because [a github workflow automatically pushes out Over-The-Air (OTA) updates to production when all the automated checks succeed in GitHub Actions](https://github.com/pachun/too-many-men/commit/4d51aaa523dd00341eeb54ab1907532569a227d8).

_Quick note: [There is a web version of this app](https://wolfpackapp.netlify.app/) which the test suite does not cover (for reasons which we intend to document) that is also deployed whenever a new version of the main branch is pushed to GitHub. We don't have users that are dependent on the web app, but it'd be nice thing to do, if, before you push to main, you take a quick peek at the web app on your local machine to see if it looks like it's still working 😬 That sounds bullet proof ... right? 🤷_

[There is code in the app that checks (when the app is foregrounded) whether a new Over-The-Air (OTA) update has been deployed and asks the user if we can restart their app to apply it](https://github.com/pachun/too-many-men/blob/main/src/hooks/useOverTheAirUpdates.ts).

However, there will be times when you need to (1) create a new build of the app and (2) submit it to the app stores before sending any Over-The-Air (OTA) updates.

You'll need to create a new build of the app when you change any native code. For exmaple, if you add new native permissions, like requesting access to the user's camera or contacts, or requesting permission to send them push notifications, or adding a deep linking url scheme to the app, you'll need to create a new build and submit it to the stores before sending over the air updates to be applied atop those code changes. [There's more detail about how to know when a new build is required before sending additional OTA updates in Expo's docs, here](https://docs.expo.dev/eas-update/runtime-versions/).

You'll definitely need a new build if any of the following are true.

- You're changing any Java, Kotlin, Swift or Objective-C code
- You're adding a dependency whose docs instruct you to add a cocoapod
- You're editing the `app.json` file

### Creating New Builds (or "Binaries")

‼️ **Before creating a build with either of the commands below, increment one of the [semver](https://semver.org) version numbers in the `app.json` file in the `expo.version` key!** ‼️

Running `eas build` takes a lot of time (~10 minutes per build and possibly hours waiting in the build queue) and costs money. [App Store Connect](https://appstoreconnect.apple.com) and [the Google Play Developer Console](https://play.google.com/console/u/0/developers) (the places where builds are uploaded to then be used by either internal testers or to be distributed in the stores) won't permit uploading a build that has the same version number as another build which has already been uploaded. If you forget to bump the version number, you'll have to create another build, costing time and money.

It's not as bad as getting Covid, but it's not our favorite thing 🫠

#### Creating New Builds for Testers (for use with, for example, TestFlight)

First, bump the version number in `app.json`'s `expo.version` key.

```
eas build --profile preview
```

You can also pass an optional `--platform ios|android` flag.

#### Creating New Builds for Production (to be distributed on the iOS App and Google Play Stores)

First, bump the version number in `app.json`'s `expo.version` key.

```
eas build --profile production
```

You can also pass an optional `--platform ios|android` flag.

### Submitting New Builds to Apple or Google

First, create a new build (remembering to bump the version number in `app.json`). Then run the submit command.

```
eas submit
```

`eas submit` will walk you through the process of uploading your new build(s) to the applicable store(s).

### Deploying New Over-The-Air (OTA) Updates to Existing Builds

Over the air updates go out fast (generally, in less than a minute) after running the following command in your terminal. [Given the users consents, over the air updates get applied the very next time the user foregrounds (opens) the app](https://github.com/pachun/too-many-men/blob/main/src/hooks/useOverTheAirUpdates.ts). They don't require waiting for a build to complete (which can take minutes to hours) or waiting for a human at Google or Apple to review the changes (which can take days).

Over the air updates make working in the mobile ecosystem tolerable 🥳

#### Deploying OTA updates to Testers (for use with, for example, TestFlight)

These OTA updates (with `--branch preview`) will be applied to builds created by `eas build` which have the `--profile preview` flag set.

```
eas update --branch preview --auto
```

The `--auto` flag tells [eas](https://expo.dev/eas) to use the git commit message as the OTA update deploy's message (saved in the expo dashboard).

#### Deploying OTA updates to Production (to be applied to binaries on the iOS App and Google Play Stores)

```
eas update --branch production --auto
```

The `--auto` flag tells [eas](https://expo.dev/eas) to use the git commit message as the OTA update deploy's message (saved in the expo dashboard).
