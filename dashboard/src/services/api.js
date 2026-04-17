const API_URL = "http://localhost:3000/v1";
const API_KEY = "ak_test_123456"; // use your real key if different

export async function fetchStates() {
  const res = await fetch(`${API_URL}/states`, {
    headers: {
      "x-api-key": API_KEY,
    },
  });

  return res.json();
}