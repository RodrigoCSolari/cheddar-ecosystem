export async function isAllowed(accountId: string) {
  const response = await fetch(
    `localhost:3001/api/maze/isAllowed?accountId=${accountId}`
  );
  console.log('r: ', response);
  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function getSeedId(accountId: string) {
  const data = {
    accountId,
  };
  const response = await fetch('localhost:3001/api/maze/getSeedId', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
