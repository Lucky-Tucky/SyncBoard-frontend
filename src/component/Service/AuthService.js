class TokenClass {
    #token;
    static #tokenService;
    setToken(token) {
        this.#token = token;
    }

    getToken() {
        return this.#token;
    }

    clearToken() {
        this.#token = null;
    }

    static getInstance() {
        if (!TokenClass.#tokenService) {
            TokenClass.#tokenService = new TokenClass();
        }
        return TokenClass.#tokenService;
    }
}

export default TokenClass.getInstance();