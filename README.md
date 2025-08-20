# Video Frame Detective - Hackathon Candidate Problem-Solving Quiz

<div align="center">

![Video Frame Detective](src/assets/hero-surveillance.jpg)

**Hackathon Candidate Problem-Solving Quiz**

[🌐 Live Demo](https://hackathon-candidate-problem-solving.vercel.app/)

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Algorithms](#-algorithms)
- [Quick Start](#-quick-start)
- [Technologies](#-technologies)

## 🌟 Overview

Video Frame Detective is an advanced web application that solves the problem of **detecting missing frames in intelligent surveillance systems**. The application provides three different algorithms for analyzing and displaying missing frames in a unique, visual, and interactive way.

## 🎯 Problem Statement

In intelligent surveillance systems, cameras send video frames as a series of sequentially numbered images (1, 2, 3, ...). Due to network issues or device delays, some frames may not be received. This application analyzes the received frame numbers and detects missing frames.

## ✨ Features

- **Three Advanced Algorithms** for different use cases
- **Interactive Visual Interface** for frame analysis
- **Real-time Processing** with optimized performance
- **Responsive Design** for all devices
- **Modern UI/UX** with intuitive controls

## 🔧 Algorithms

### 1. Detecting Missing Video Frames

**Simple Algorithm for Missing Frame Detection**

- Suitable for normal usage
- Time Complexity: O(n)
- Best for basic frame analysis

```typescript
function findMissingFrames(frames: number[]): number[] {
  if (!Array.isArray(frames) || frames.length === 0) {
    return []
  }

  const missingFrames: number[] = []
  let expectedFrame: number = 1

  for (const currentFrame of frames) {
    if (currentFrame > expectedFrame) {
      for (let j = expectedFrame; j < currentFrame; j++) {
        missingFrames.push(j)
      }
    }
    expectedFrame = currentFrame + 1
  }

  return missingFrames
}

// Example Usage
const frames1: number[] = [1, 2, 3, 5, 6]
console.log(`Input: [${frames1}]`)
console.log(`Missing frames: [${findMissingFrames(frames1)}]`)
// Output: Missing frames: [4]

const frames2: number[] = [3, 4, 7, 8, 10]
console.log(`Input: [${frames2}]`)
console.log(`Missing frames: [${findMissingFrames(frames2)}]`)
// Output: Missing frames: [1, 2, 5, 6, 9]

const frames3: number[] = [1, 2, 3, 4, 5]
console.log(`Input: [${frames3}]`)
console.log(`Missing frames: [${findMissingFrames(frames3)}]`)
// Output: Missing frames: []

const frames4: number[] = [1, 5, 6, 7]
console.log(`Input: [${frames4}]`)
console.log(`Missing frames: [${findMissingFrames(frames4)}]`)
// Output: Missing frames: [2, 3, 4]

const frames5: number[] = []
console.log(`Input: [${frames5}]`)
console.log(`Missing frames: [${findMissingFrames(frames5)}]`)
// Output: Missing frames: []
```

### 2. Missing Frame Ranges Analysis

**Advanced Algorithm for Range Analysis**

- Analyzes missing ranges
- Identifies longest missing range
- Calculates total missing frames
- Time Complexity: O(n log n)
- Best for detailed frame analysis

```typescript
function findMissingFrames(frames: number[]): {
  missingRanges: [number, number][]
  longestMissingRange: [number, number] | null
  totalMissingFrames: number
} {
  if (!Array.isArray(frames) || frames.length === 0) {
    return {
      missingRanges: [],
      longestMissingRange: null,
      totalMissingFrames: 0,
    }
  }

  const maxFrame = Math.max(...frames)
  const missingRanges: [number, number][] = []
  let longestMissingRange: [number, number] | null = null
  let totalMissingFrames: number = 0
  let expectedFrame: number = 1

  for (const currentFrame of frames) {
    if (currentFrame > expectedFrame) {
      const start = expectedFrame
      const end = currentFrame - 1
      const length = end - start + 1

      missingRanges.push([start, end])
      totalMissingFrames += length

      if (!longestMissingRange || length > longestMissingRange[1] - longestMissingRange[0] + 1) {
        longestMissingRange = [start, end]
      }
    }
    expectedFrame = currentFrame + 1
  }

  if (maxFrame > expectedFrame - 1) {
    const start = expectedFrame
    const end = maxFrame
    const length = end - start + 1

    missingRanges.push([start, end])
    totalMissingFrames += length

    if (!longestMissingRange || length > longestMissingRange[1] - longestMissingRange[0] + 1) {
      longestMissingRange = [start, end]
    }
  }

  return {
    missingRanges,
    longestMissingRange,
    totalMissingFrames,
  }
}

// Example Usage
const frames2: number[] = [1, 2, 5, 8, 9, 15]
const result2 = findMissingFrames(frames2)
console.log(`Input: [${frames2}]`)
console.log('Missing Ranges:', result2.missingRanges)
console.log('Longest Missing Range:', result2.longestMissingRange)
console.log('Total Missing Frames:', result2.totalMissingFrames)
```

### 3. Find Missing Ranges (No Sort)

**Hash Set Advanced Algorithm**

- No need to sort data
- Optimized performance for high-performance applications
- Time Complexity: O(n)
- Best for real-time processing

```typescript
function findMissingFrameData(frames: number[]): {
  gaps: [number, number][]
  longest_gap: [number, number] | null
  missing_count: number
} {
  if (!frames || frames.length === 0) {
    return {
      gaps: [],
      longest_gap: null,
      missing_count: 0,
    }
  }

  const frameSet: Set<number> = new Set(frames)
  const maxFrame: number = Math.max(...frames)

  const gaps: [number, number][] = []
  let longestGap: [number, number] | null = null
  let missingCount: number = 0

  let currentGapStart: number | null = null

  for (let i = 1; i <= maxFrame; i++) {
    if (!frameSet.has(i)) {
      missingCount++
      if (currentGapStart === null) {
        currentGapStart = i
      }
    } else {
      if (currentGapStart !== null) {
        const gap: [number, number] = [currentGapStart, i - 1]
        gaps.push(gap)
        if (!longestGap || gap[1] - gap[0] + 1 > longestGap[1] - longestGap[0] + 1) {
          longestGap = gap
        }
        currentGapStart = null
      }
    }
  }

  if (currentGapStart !== null) {
    const gap: [number, number] = [currentGapStart, maxFrame]
    gaps.push(gap)
    if (!longestGap || gap[1] - gap[0] + 1 > longestGap[1] - longestGap[0] + 1) {
      longestGap = gap
    }
  }

  return {
    gaps,
    longest_gap: longestGap,
    missing_count: missingCount,
  }
}

// Example Usage
const frames1_ts: number[] = [1, 2, 3, 5, 6, 10, 11, 16]
const result1_ts = findMissingFrameData(frames1_ts)
console.log(`Input: [${frames1_ts}]`)
console.log(result1_ts)

const frames2_ts: number[] = [8, 5, 1, 2, 9]
const result2_ts = findMissingFrameData(frames2_ts)
console.log(`Input: [${frames2_ts}]`)
console.log(result2_ts)

const frames3_ts: number[] = [1, 100]
const result3_ts = findMissingFrameData(frames3_ts)
console.log(`Input: [${frames3_ts}]`)
console.log(result3_ts)

const frames4_ts: number[] = [1, 2, 3]
const result4_ts = findMissingFrameData(frames4_ts)
console.log(`Input: [${frames4_ts}]`)
console.log(result4_ts)
```

## 🚀 Quick Start

### Prerequisites

- Node.js (Version 18 or later)
- npm, yarn, or pnpm

### Installation & Setup

```bash
# 1. Clone the project
git clone <YOUR_GIT_URL>
cd video-frame-detective

# 2. Install dependencies
npm install

# 3. Run local development server
npm run dev

# 4. Open browser at
# http://localhost:8080
```

## 🛠️ Technologies

- **React 18** - Frontend library
- **TypeScript** - Typed programming language
- **Tailwind CSS** - Styling framework
- **Vite** - Fast build tool
- **Lucide React** - Icon library
- **Radix UI** - UI components
- **React Query** - Server state management

## 📱 Live Demo

Visit the live application: [🌐 Video Frame Detective](https://hackathon-candidate-problem-solving.vercel.app/)

---

<div align="center">

**Built with ❤️ for Hackathon Candidates**

</div>
