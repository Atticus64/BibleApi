
export async function runTest(testFn: () => Promise<void>) {
  await new Promise(resolve => setTimeout(resolve, 100)); // Wait after running the test
  await testFn();
  await new Promise(resolve => setTimeout(resolve, 100)); // Wait after running the test
}
