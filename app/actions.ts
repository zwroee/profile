"use server"
import path from "path"
import { promises as fsPromises } from "fs"

const DATA_FILE = path.join(process.cwd(), "data", "viewCount.json")

// Ensure the data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fsPromises.access(dataDir)
  } catch (error) {
    // Directory doesn't exist, create it
    await fsPromises.mkdir(dataDir, { recursive: true })
  }
}

// Initialize the view count file if it doesn't exist
async function initViewCountFile() {
  try {
    await fsPromises.access(DATA_FILE)
  } catch (error) {
    // File doesn't exist, create it with initial count of 0
    await fsPromises.writeFile(DATA_FILE, JSON.stringify({ count: 0 }), "utf8")
  }
}

// Get the current view count
export async function getViewCount(): Promise<number> {
  await ensureDataDirectory()
  await initViewCountFile()

  try {
    const data = await fsPromises.readFile(DATA_FILE, "utf8")
    const viewData = JSON.parse(data)
    return viewData.count || 0
  } catch (error) {
    console.error("Error reading view count:", error)
    return 0
  }
}

// Increment the view count
export async function incrementViewCount(): Promise<number> {
  await ensureDataDirectory()
  await initViewCountFile()

  try {
    const currentCount = await getViewCount()
    const newCount = currentCount + 1

    await fsPromises.writeFile(DATA_FILE, JSON.stringify({ count: newCount }), "utf8")

    return newCount
  } catch (error) {
    console.error("Error incrementing view count:", error)
    return await getViewCount()
  }
}
