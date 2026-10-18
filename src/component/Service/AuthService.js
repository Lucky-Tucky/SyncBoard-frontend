class TokenClass {
    #token;
    static #tokenService;

    constructor() {
        try {
            this.#token = localStorage.getItem("syncboard_token") || null;
        } catch {
            this.#token = null;
        }
    }

    setToken(token) {
        this.#token = token;
        try {
            if (token) {
                localStorage.setItem("syncboard_token", token);
            } else {
                localStorage.removeItem("syncboard_token");
            }
        } catch (e) {
            console.error("Storage error:", e);
        }
    }

    getToken() {
        if (!this.#token) {
            try {
                this.#token = localStorage.getItem("syncboard_token") || null;
            } catch {
                this.#token = null;
            }
        }
        return this.#token;
    }

    clearToken() {
        this.#token = null;
        try {
            localStorage.removeItem("syncboard_token");
        } catch (e) {
            console.error("Storage error:", e);
        }
    }

    static getInstance() {
        if (!TokenClass.#tokenService) {
            TokenClass.#tokenService = new TokenClass();
        }
        return TokenClass.#tokenService;
    }
}

export default TokenClass.getInstance();