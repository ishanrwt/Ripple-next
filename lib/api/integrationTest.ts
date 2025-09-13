// Integration test for Node.js/Express backend
import { parseQuery, executeSQL, generateVisualization } from './botService'
import { fetchDistricts, fetchStateData, fetchGroundwaterTrends, fetchHeatmapData } from './dataApi'
import { checkBackendHealth } from './healthCheck'

export interface IntegrationTestResult {
  test: string
  status: 'pass' | 'fail' | 'skip'
  message: string
  duration: number
}

export const runIntegrationTests = async (): Promise<IntegrationTestResult[]> => {
  const results: IntegrationTestResult[] = []
  
  // Test 1: Backend Health Check
  const healthStart = Date.now()
  try {
    const health = await checkBackendHealth()
    results.push({
      test: 'Backend Health Check',
      status: health.status === 'healthy' ? 'pass' : 'fail',
      message: health.status === 'healthy' 
        ? `Backend is healthy (${health.responseTime}ms)`
        : `Backend is unhealthy: ${health.backend}`,
      duration: Date.now() - healthStart
    })
  } catch (error) {
    results.push({
      test: 'Backend Health Check',
      status: 'fail',
      message: `Health check failed: ${error}`,
      duration: Date.now() - healthStart
    })
  }

  // Test 2: Intent Parser (D1)
  const parseStart = Date.now()
  try {
    const parseResult = await parseQuery('Show me groundwater trends in Punjab', 'en')
    results.push({
      test: 'Intent Parser (D1)',
      status: 'pass',
      message: `Query parsed successfully: ${parseResult.intent}`,
      duration: Date.now() - parseStart
    })
  } catch (error) {
    results.push({
      test: 'Intent Parser (D1)',
      status: 'fail',
      message: `Parse query failed: ${error}`,
      duration: Date.now() - parseStart
    })
  }

  // Test 3: Database Executor (D2)
  const sqlStart = Date.now()
  try {
    const sqlResult = await executeSQL('SELECT * FROM groundwater_data LIMIT 5')
    results.push({
      test: 'Database Executor (D2)',
      status: 'pass',
      message: `SQL executed successfully: ${sqlResult.rowCount} rows returned`,
      duration: Date.now() - sqlStart
    })
  } catch (error) {
    results.push({
      test: 'Database Executor (D2)',
      status: 'fail',
      message: `SQL execution failed: ${error}`,
      duration: Date.now() - sqlStart
    })
  }

  // Test 4: Visualization Generator (D2)
  const vizStart = Date.now()
  try {
    const vizResult = await generateVisualization([
      { year: 2020, water_level: 15.2 },
      { year: 2021, water_level: 14.8 }
    ], 'chart')
    results.push({
      test: 'Visualization Generator (D2)',
      status: 'pass',
      message: `Visualization generated successfully: ${vizResult.type}`,
      duration: Date.now() - vizStart
    })
  } catch (error) {
    results.push({
      test: 'Visualization Generator (D2)',
      status: 'fail',
      message: `Visualization generation failed: ${error}`,
      duration: Date.now() - vizStart
    })
  }

  // Test 5: Data APIs
  const dataStart = Date.now()
  try {
    const districts = await fetchDistricts()
    results.push({
      test: 'Data APIs',
      status: 'pass',
      message: `Data APIs working: ${districts.length} districts loaded`,
      duration: Date.now() - dataStart
    })
  } catch (error) {
    results.push({
      test: 'Data APIs',
      status: 'fail',
      message: `Data APIs failed: ${error}`,
      duration: Date.now() - dataStart
    })
  }

  return results
}

export const getIntegrationStatus = (results: IntegrationTestResult[]): 'healthy' | 'degraded' | 'unhealthy' => {
  const passed = results.filter(r => r.status === 'pass').length
  const total = results.length
  
  if (passed === total) return 'healthy'
  if (passed >= total * 0.5) return 'degraded'
  return 'unhealthy'
}
