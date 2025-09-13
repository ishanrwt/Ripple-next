#!/usr/bin/env node

/**
 * Test script to verify the Next.js migration
 * Run with: node scripts/test-migration.js
 */

const fs = require('fs')
const path = require('path')

console.log('🧪 Testing Next.js Migration...\n')

// Check if required files exist
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tsconfig.json',
  'tailwind.config.js',
  'app/layout.tsx',
  'app/page.tsx',
  'app/globals.css',
  'components/Message.tsx',
  'components/ChartComponent.tsx',
  'components/MapComponent.tsx',
  'lib/api/botService.ts',
  'lib/api/dataApi.ts'
]

let allFilesExist = true

console.log('📁 Checking required files:')
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`)
  } else {
    console.log(`  ❌ ${file} - MISSING`)
    allFilesExist = false
  }
})

// Check package.json for Next.js dependencies
console.log('\n📦 Checking dependencies:')
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const requiredDeps = ['next', 'react', 'react-dom', 'typescript']
const requiredDevDeps = ['@types/react', '@types/react-dom', '@types/node']

requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`  ✅ ${dep}: ${packageJson.dependencies[dep]}`)
  } else {
    console.log(`  ❌ ${dep} - MISSING from dependencies`)
    allFilesExist = false
  }
})

requiredDevDeps.forEach(dep => {
  if (packageJson.devDependencies[dep]) {
    console.log(`  ✅ ${dep}: ${packageJson.devDependencies[dep]}`)
  } else {
    console.log(`  ❌ ${dep} - MISSING from devDependencies`)
    allFilesExist = false
  }
})

// Check for TypeScript configuration
console.log('\n🔧 Checking TypeScript configuration:')
if (fs.existsSync('tsconfig.json')) {
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'))
  if (tsConfig.compilerOptions && tsConfig.compilerOptions.jsx === 'preserve') {
    console.log('  ✅ TypeScript configured for Next.js')
  } else {
    console.log('  ⚠️  TypeScript configuration may need adjustment')
  }
} else {
  console.log('  ❌ tsconfig.json missing')
  allFilesExist = false
}

// Check for environment configuration
console.log('\n🌍 Checking environment configuration:')
if (fs.existsSync('env.example')) {
  console.log('  ✅ Environment example file exists')
} else {
  console.log('  ⚠️  Environment example file missing')
}

// Summary
console.log('\n📊 Migration Test Summary:')
if (allFilesExist) {
  console.log('  🎉 All checks passed! Migration appears successful.')
  console.log('\n🚀 Next steps:')
  console.log('  1. Run: npm install')
  console.log('  2. Copy env.example to .env.local')
  console.log('  3. Update BACKEND_API_URL in .env.local')
  console.log('  4. Run: npm run dev')
} else {
  console.log('  ⚠️  Some issues found. Please review the missing files.')
}

console.log('\n✨ Migration test complete!')
