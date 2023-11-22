export class Api {
    constructor({url}) {
        this._url = url;
        // this._headers = config.headers;
    }

    #onResponse(res) {
        return res.ok ? res.json() : res.json().then(errData => Promise.reject(errData))
    }

    getAllInfo() {
        return Promise.all([this.getUserInfo(), this.getInitialCards()])
    }
   
    getUserInfo() {
        const token = localStorage.getItem('jwt');

        return fetch(`${this._url}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(this.#onResponse)
    }

    getInitialCards() {
        const token = localStorage.getItem('jwt');

        return fetch(`${this._url}/cards`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(this.#onResponse)
    }

    editUserProfile(data) {
        const token = localStorage.getItem('jwt');

        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: data.name,
                about:  data.about
            }),
        })
            .then(this.#onResponse)
    }

    postNewCard(data) {
        const token = localStorage.getItem('jwt');

        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: data.title,
                link: data.link
            }),
        })
            .then(this.#onResponse)
    }

    deleteCard(cardId) {
        const token = localStorage.getItem('jwt');

        return fetch(`${this._url}/cards/${cardId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(this.#onResponse)
    }

    changeLike(cardId, isLiked) {
        const token = localStorage.getItem('jwt');

        return fetch(`${this._url}/cards/${cardId}/likes`, {
            method: isLiked ? 'DELETE' : 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(this.#onResponse)
    }

    changeAvatar(avatar) {
        const token = localStorage.getItem('jwt');

        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(avatar)
        })
        .then(this.#onResponse)
    }
}

const api = new Api({
    url: 'https://api.gertzog.nomoredomainsmonster.ru',
    // url: 'http://localhost:3001',
    headers: {
      "Content-Type": "application/json",
    }
});

export default api;