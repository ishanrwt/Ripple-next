// Health check service for Node.js/Express backend

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy'
  backend: 'connected' | 'disconnected'
  timestamp: string
  responseTime?: number
}

export const checkBackendHealth = async (): Promise<HealthCheckResponse> => {
  const D1_URL = process.env.NEXT_PUBLIC_D1_API_URL || 'https://ai-engine-1.onrender.com'
  const D2_URL = process.env.NEXT_PUBLIC_D2_API_URL || 'http://31.220.72.148:3001'
  
  console.log('=== HEALTH CHECK DEBUG ===')
  console.log('D1 URL:', D1_URL)
  console.log('D2 URL:', D2_URL)
  console.log('==========================')
  
  const startTime = Date.now()
  
  try {
    // Check both D1 and D2 services
    const [d1Response, d2Response] = await Promise.allSettled([
      fetch(`${D1_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000)
      }),
      fetch(`${D2_URL}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000)
      })
    ])
    
    const responseTime = Date.now() - startTime
    const d1Healthy = d1Response.status === 'fulfilled' && d1Response.value.ok
    const d2Healthy = d2Response.status === 'fulfilled' && d2Response.value.ok
    
    console.log('D1 Health:', d1Healthy)
    console.log('D2 Health:', d2Healthy)
    
    if (d1Healthy && d2Healthy) {
      return {
        status: 'healthy',
        backend: 'connected',
        timestamp: new Date().toISOString(),
        responseTime
      }
    } else {
      return {
        status: 'unhealthy',
        backend: 'connected',
        timestamp: new Date().toISOString(),
        responseTime
      }
    }
  } catch (error) {
    console.error('Backend health check failed:', error)
    return {
      status: 'unhealthy',
      backend: 'disconnected',
      timestamp: new Date().toISOString()
    }
  }
}

export const testBackendConnection = async (): Promise<boolean> => {
  try {
    const health = await checkBackendHealth()
    return health.status === 'healthy'
  } catch (error) {
    console.error('Backend connection test failed:', error)
    return false
  }
}
