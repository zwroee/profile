import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

// Path to our view data file
const dataFilePath = path.join(process.cwd(), "data", "views.json")

// Ensure the data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch (error) {
    // Directory doesn't exist, create it
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Initialize the view data file if it doesn't exist
async function initViewDataFile() {
  try {
    await fs.access(dataFilePath)
  } catch (error) {
    // File doesn't exist, create it with initial data
    await fs.writeFile(dataFilePath, JSON.stringify({ totalViews: 0, uniqueIPs: [] }), "utf8")
  }
}

// Read the current view data
async function getViewData() {
  await ensureDataDirectory()
  await initViewDataFile()

  const data = await fs.readFile(dataFilePath, "utf8")
  return JSON.parse(data)
}

// Write updated view data
async function updateViewData(data: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")
}

export async function GET(request: NextRequest) {
  try {
    // Get the visitor's IP address
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    console.log("Visitor IP:", ip)

    // Get current view data
    const viewData = await getViewData()

    // Always increment the view count for testing
    viewData.totalViews++

    // Check if this IP has been recorded before
    if (!viewData.uniqueIPs.includes(ip)) {
      viewData.uniqueIPs.push(ip)
    }

    await updateViewData(viewData)

    return NextResponse.json({
      views: viewData.totalViews,
      uniqueVisitors: viewData.uniqueIPs.length,
      success: true,
    })
  } catch (error) {
    console.error("Error processing view count:", error)
    return NextResponse.json(
      {
        error: "Failed to process view count",
        success: false,
      },
      { status: 500 },
    )
  }
}

// Add a POST endpoint to manually increment the counter
export async function POST() {
  try {
    const viewData = await getViewData()
    viewData.totalViews++
    await updateViewData(viewData)

    return NextResponse.json({
      views: viewData.totalViews,
      success: true,
    })
  } catch (error) {
    console.error("Error incrementing view count:", error)
    return NextResponse.json(
      {
        error: "Failed to increment view count",
        success: false,
      },
      { status: 500 },
    )
  }
}
