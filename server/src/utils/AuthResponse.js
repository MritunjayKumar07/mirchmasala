class AuthResponse {
  constructor(response) {
    this.response = response;
  }

  send(data) {
    this.response.setHeader("Content-Type", "application/json");
    this.response.status(200).send(JSON.stringify(data));
  }
}

export { AuthResponse };
