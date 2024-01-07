

const sleep = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms))
};

export async function runTest(testFn: () => Promise<void>) {
  await sleep(100) 
  await testFn()
  await sleep(100) 
}
