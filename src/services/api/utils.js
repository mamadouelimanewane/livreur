function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

export async function resolveMock(data, delay = 250) {
  await new Promise(resolve => setTimeout(resolve, delay))
  return clone(data)
}
