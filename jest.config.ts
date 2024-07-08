import type { Config } from "jest"
import * as fsPromises from "fs/promises"

const setupFilesAfterEnv = async (): Promise<string[]> => {
  const setupFilesAfterEnvPath = "./spec/specHelpers/jest/setupFilesAfterEnv/"
  return (await fsPromises.readdir(`${setupFilesAfterEnvPath}`)).map(
    fileName => `${setupFilesAfterEnvPath}/${fileName}`,
  )
}

const setupFiles = async (): Promise<string[]> => {
  const setupFilesPath = "./spec/specHelpers/jest/setupFiles/"
  return (await fsPromises.readdir(`${setupFilesPath}`)).map(
    fileName => `${setupFilesPath}/${fileName}`,
  )
}

const projectPresets = ["jest-expo/ios", "jest-expo/android"]
const projects = async (): Promise<
  { preset: string; setupFilesAfterEnv: string[]; setupFiles: string[] }[]
> => {
  return await Promise.all(
    projectPresets.map(async preset => ({
      preset,
      setupFilesAfterEnv: await setupFilesAfterEnv(),
      setupFiles: await setupFiles(),
    })),
  )
}

const transformIgnorePatterns = [
  "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
]

const collectCoverageFrom = ["./src/**", "!src/Config.ts", "!src/types/**"]

const minimumCoveragePercentage = 100
const coverageThreshold = {
  global: {
    lines: minimumCoveragePercentage,
    functions: minimumCoveragePercentage,
    branches: minimumCoveragePercentage,
    statements: minimumCoveragePercentage,
  },
}

export default async (): Promise<Config> => {
  return {
    projects: await projects(),
    transformIgnorePatterns,
    coverageProvider: "v8",
    collectCoverageFrom,
    coverageThreshold,
  }
}
